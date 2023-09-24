import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IEndNode } from '../flow-definition/flow-definition';

export interface EndStep extends BaseStep<IEndNode> {
  stepType: ImplementationNodeTypeEnum.End;
}
