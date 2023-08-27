import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface EmitDataStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.EmitData;
  contextData: any[];
}
