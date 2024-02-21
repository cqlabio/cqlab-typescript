import { IFlowDefinition } from '@cqlab/cqflow-core';
import docsBreastCancerScreening from './docs-breast-cancer-screening.json';
import whoImmunizationBcg from './who-immunization-bcg.json';
import whoImmunizationHepatitisB from './who-immunization-hepatitis-b.json';
import whoImmunizationRotavirus from './who-immunization-rotavirus.json';
import whoImmunizationRubella from './who-immunization-rubella.json';
import idsaCapClinicalPathway from './idsa-cap-clinical-pathway.json';
import priorAuthNurtec from './prior-auth-nurtec.json';

export const seedFlowDefinitions: IFlowDefinition[] = [
  docsBreastCancerScreening as IFlowDefinition,
  whoImmunizationHepatitisB as IFlowDefinition,
  whoImmunizationBcg as IFlowDefinition,
  whoImmunizationRotavirus as IFlowDefinition,
  whoImmunizationRubella as IFlowDefinition,
  idsaCapClinicalPathway as IFlowDefinition,
  priorAuthNurtec as IFlowDefinition,
];
