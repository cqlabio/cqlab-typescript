import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { INarrativeNode } from '../flow-definition/flow-definition';

export interface NarrativeStep extends BaseStep<INarrativeNode> {
  stepType: ImplementationNodeTypeEnum.Narrative;
  narrative: string;
}
