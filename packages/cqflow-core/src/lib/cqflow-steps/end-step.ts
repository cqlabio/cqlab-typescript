import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface EndStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.End;
}
