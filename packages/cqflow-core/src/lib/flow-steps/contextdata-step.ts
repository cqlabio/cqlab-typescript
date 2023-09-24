import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IEmitDataNode } from '../flow-definition/flow-definition';

export interface EmitDataStep extends BaseStep<IEmitDataNode> {
  stepType: ImplementationNodeTypeEnum.EmitData;
  contextData: any[];
}
