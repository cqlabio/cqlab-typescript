import { MockPatientIdEnum } from '../../mock-patients';
import { ParameterizedRetrieveLibrary } from '../docs-parameterized-retrieve';
import { MockFhirBundleRetriever } from '../../flows/common/MockFhirBundleRetriever';
import { TernaryEnum } from '@cqlab/cqflow-core';
import { libraryContainer } from '../index';

describe('DocsParameterizedRetrieve', () => {
  it('should get calculate high blood pressure', async () => {
    // Patient has score of 220
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.high_cholesterol,
    });

    const parameterizedLib = new ParameterizedRetrieveLibrary(retriever);

    const cholesterolReading = await parameterizedLib.getCholesterolReading();
    expect(cholesterolReading?.value).toEqual(220);

    const paramResult1 = await parameterizedLib.isCholesterolAboveThreshold(
      210
    );
    expect(paramResult1).toEqual(TernaryEnum.TRUE);

    const paramResult2 = await parameterizedLib.isCholesterolAboveThreshold(
      230
    );
    expect(paramResult2).toEqual(TernaryEnum.FALSE);

    const highResult = await parameterizedLib.isCholesterolReadingAbove200();
    expect(highResult).toEqual(TernaryEnum.TRUE);
  });

  it('should work using the library container', async () => {
    const retriever = new MockFhirBundleRetriever({
      bundleId: MockPatientIdEnum.high_cholesterol,
    });

    const logicFunc = libraryContainer.getLogic(
      'ParameterizedRetrieveLibrary',
      'isCholesterolAboveThreshold',
      retriever
    );

    const paramResult1 = await logicFunc.execute(210);
    expect(paramResult1).toEqual(TernaryEnum.TRUE);
  });
});
