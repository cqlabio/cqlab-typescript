import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface StartStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Start;
  initialData?: any;
}
