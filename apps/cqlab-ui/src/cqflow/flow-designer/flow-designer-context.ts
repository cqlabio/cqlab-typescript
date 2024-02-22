import { createContext } from 'react';
import { IFlowImplementation, IFlowDefinition } from '@cqlab/cqflow-core';
import { DoNodeUpdates } from '../../data/utils';
import { IValidationNodeDefinition } from '../../data/do-validation';

type ThemeContextType = {
  flowDefinition: IFlowDefinition;
  flowImplementation: IFlowImplementation | null;
  validationResults: IValidationNodeDefinition[];
  doNodeUpdates: DoNodeUpdates;
  undoFlowDefOperation: () => void;
  redoFlowDefOperation: () => void;
};

export const FlowDesignerContext = createContext<ThemeContextType>({
  flowDefinition: {} as IFlowDefinition,
  flowImplementation: null,
  validationResults: [],
  doNodeUpdates: () => console.log('doNodeUpdates not implemented'),
  undoFlowDefOperation: () =>
    console.log('undoFlowDefOperation not implemented'),
  redoFlowDefOperation: () =>
    console.log('redoFlowDefOperation not implemented'),
});
