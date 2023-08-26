import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface ContextDataStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.EmitData;
  contextData: any[];
}
