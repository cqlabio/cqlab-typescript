import { z } from 'zod';
import { MockPatientIdEnum } from '../mock-patients/index';
import {
  Library,
  MockData,
  Define,
  Documentation,
  FhirLibrary,
  ReturnType,
} from '@cqlab/cqdefine';
import { quantitySchema } from './common';
import { ExampleCodings, ExampleCodingsEnum } from '../vocabulary/codings';
import { codingInCodeableConcept, sortObservations } from './utils/utils';

const makeMockDataItem = (id: MockPatientIdEnum) => ({ id: id, label: id });

const bloodPressurePanel = z
  .object({
    systolic: quantitySchema,
    diastolic: quantitySchema,
  })
  .nullable();

export type BloodPressurePanel = z.infer<typeof bloodPressurePanel>;

@Library('Hypertension Library')
@MockData([
  makeMockDataItem(MockPatientIdEnum.hypertension_crisis),
  makeMockDataItem(MockPatientIdEnum.hypertension_stage_2),
])
export class HypertensionLibrary extends FhirLibrary {
  @Define('Get Blood Pressure Panel')
  @Documentation('Gets both Systolic and Diastolic Blood Pressure Readings')
  @ReturnType(bloodPressurePanel)
  async getBloodPressurePanel(): Promise<BloodPressurePanel> {
    const panelCode = ExampleCodings[ExampleCodingsEnum.blood_pressure_panel];
    const systolicCode =
      ExampleCodings[ExampleCodingsEnum.systolic_blood_pressure];
    const diastolicCode =
      ExampleCodings[ExampleCodingsEnum.diastolic_blood_pressure];

    const observations = await this.retriever.getObservationsByCode(panelCode);
    if (observations.length === 0) {
      return null;
    }

    const mostRecentObservation =
      sortObservations(observations)[observations.length - 1];

    const systolicReading = mostRecentObservation.component?.find((c) => {
      return codingInCodeableConcept(systolicCode, c.code);
    });
    const diastolicReading = mostRecentObservation.component?.find((c) => {
      return codingInCodeableConcept(diastolicCode, c.code);
    });

    if (!systolicReading?.valueQuantity || !diastolicReading?.valueQuantity) {
      return null;
    }

    return {
      systolic: {
        value: systolicReading.valueQuantity.value as number,
        unit: systolicReading.valueQuantity.unit as string,
      },
      diastolic: {
        value: diastolicReading.valueQuantity.value as number,
        unit: diastolicReading.valueQuantity.unit as string,
      },
    };
  }
}
