import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface NarrativeStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Narrative;
  narrative: string;
}
