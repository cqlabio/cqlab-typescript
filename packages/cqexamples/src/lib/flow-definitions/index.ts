import { IFlowDefinition } from '@cqlab/cqflow-core';
import docsBreastCancerScreening from './docs-breast-cancer-screening.json';
import whoImmunizationBcg from './who-immunization-bcg.json';
import whoImmunizationHepatitisB from './who-immunization-hepatitis-b.json';

export const seedFlowDefinitions: IFlowDefinition[] = [
  docsBreastCancerScreening as IFlowDefinition,
  whoImmunizationHepatitisB as IFlowDefinition,
  whoImmunizationBcg as IFlowDefinition,
];
