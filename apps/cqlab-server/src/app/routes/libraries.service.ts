import { Injectable } from '@nestjs/common';

import { libraryContainer, MockFhirBundleRetriever } from '@cqlab/cqexamples';
// import { MockFhirBundleRetriever } from 'packages/cqexamples/src/lib/flows/common/MockFhirBundleRetriever';

// import { FhirBundleRetriever } from '@cqlab/cqdefine';

@Injectable()
export class LibraryService {
  getLogicLibraryRegistry() {
    return libraryContainer.getRegistry();
  }

  async executeLogic(body: {
    className: string;
    classFunctionName: string;
    mockDataId: string;
    parameters?: any;
  }) {
    const retriever = new MockFhirBundleRetriever({
      bundleId: body.mockDataId,
    });

    const logicFunc = libraryContainer.getLogic(
      body.className,
      body.classFunctionName,
      retriever
    );

    const val = await logicFunc.execute(body.parameters);

    return {
      value: val || null,
    };
  }
}
