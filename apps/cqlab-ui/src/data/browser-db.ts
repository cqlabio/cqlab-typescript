import { IFlowDefinition } from '@cqlab/cqflow-core';

// CustomContext
// Without CustomContext

// OneShot
// Stateful, User Feedback
//    take certain nodes

// CustomFormNode
// Could be provided into React component for form
// export interface IFlow {

// }

const DB_NAME = 'cqflow-db';
const FLOW_TABLE = 'flows';

let _db: IDBDatabase;

function getDB(callback: (db: IDBDatabase | null, err: Error | null) => void) {
  if (_db) {
    callback(_db, null);
    return;
  }

  const request = window.indexedDB.open(DB_NAME, 1);

  request.onsuccess = (event) => {
    _db = request.result;
    callback(_db, null);
  };

  request.onerror = (event: any) => {
    callback(null, new Error('CQFLOW Error: ' + event.target.result));
  };

  // triggers if the client had no database
  request.onupgradeneeded = (event: any) => {
    const newDb = event.target.result as IDBDatabase;

    console.log('CQFlow: Creating Flow Table');
    const objectStore = newDb.createObjectStore(FLOW_TABLE, { keyPath: 'id' });
  };
}

export const createFlowWithId = (flow: IFlowDefinition) => {
  getDB((db, err) => {
    if (!db) {
      return;
    }
    const transaction = db.transaction([FLOW_TABLE], 'readwrite');
    const objectStore = transaction.objectStore(FLOW_TABLE);
    objectStore.add(flow);
  });
};

export const getAllFlows = (
  callback: (flows: IFlowDefinition[] | null, err: Error | null) => void
) => {
  getDB((db, err) => {
    if (!db) {
      return callback(null, err);
    }
    db.transaction(FLOW_TABLE).objectStore(FLOW_TABLE).getAll().onsuccess = (
      event: any
    ) => {
      callback(event.target?.result as IFlowDefinition[], null);
    };
  });
};

export const getFlowById = (
  id: string,
  callback: (flows: IFlowDefinition | null, err: Error | null) => void
) => {
  getAllFlows((flows, err) => {
    if (!flows) {
      return callback(null, err);
    }
    const flow = flows.find((f) => f.id === id);
    callback(flow || null, null);
  });
};

export const updateFlowById = (
  flow: IFlowDefinition,
  callback: (err: Error | null) => void
) => {
  getDB((db, err) => {
    if (!db) {
      return;
    }

    db
      .transaction(FLOW_TABLE, 'readwrite')
      .objectStore(FLOW_TABLE)
      .put(flow).onsuccess = (event: any) => {
      callback(null);
    };
  });
};
