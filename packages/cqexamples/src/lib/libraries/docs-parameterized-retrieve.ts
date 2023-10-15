import { z } from 'zod';
import dayjs from 'dayjs';
import { TernaryEnum } from '@cqlab/cqflow-core';
import {
  Library,
  Define,
  Documentation,
  ReturnType,
  MockData,
  FhirLibrary,
  Params,
} from '@cqlab/cqdefine';
import { MockPatientIdEnum } from '../mock-patients';
import { ExampleCodings, ExampleCodingsEnum } from '../vocabulary/codings';
import { sortObservations } from './utils/utils';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

// Declare a schema using zod to document and validate a return type
const cholesterolThreshold = z.number().int().positive().min(0);
type CholesterolThreshold = z.infer<typeof cholesterolThreshold>;

@Library('Parameterized Retrieve')
@MockData([
  makeMockDataItem(MockPatientIdEnum.empty_data),
  makeMockDataItem(MockPatientIdEnum.high_cholesterol),
])
export class ParameterizedRetrieveLibrary extends FhirLibrary {
  // The @Params decorator allows us to parameterize a function so that
  // it can be re-used in flexible ways. Either it can be used by other
  // functions in a library, or exposed directly to calling code / or APIs
  // We use Zod to validate and auto-document the API with JSON Schema
  @Define('Is cholesterol reading above threshold')
  @Params(cholesterolThreshold)
  @Documentation(
    'Provide a threshold to see if patient has cholesterol above that. Allows a "high threshold" to be configurable.'
  )
  async isCholesterolAboveThreshold(
    threshold: CholesterolThreshold
  ): Promise<TernaryEnum> {
    const cholesterolCode =
      ExampleCodings[ExampleCodingsEnum.cholesterol_ratio];

    const observations = await this.retriever.getObservationsByCode(
      cholesterolCode
    );

    if (observations.length === 0) {
      return TernaryEnum.UNKNOWN;
    }

    const mostRecentObservation =
      sortObservations(observations)[observations.length - 1];

    if (!mostRecentObservation.valueQuantity?.value) {
      return TernaryEnum.UNKNOWN;
    }

    return mostRecentObservation.valueQuantity.value > threshold
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }

  @Define('Is cholesterol reading above 200 mg/dL')
  @Documentation('Checks to see if the cholesterol reading is above 200 mg/dL')
  async isCholesterolReadingAbove200(): Promise<TernaryEnum> {
    return this.isCholesterolAboveThreshold(200);
  }
}
