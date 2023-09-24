import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IStartNode } from '../flow-definition/flow-definition';

export interface StartStep extends BaseStep<IStartNode> {
  stepType: ImplementationNodeTypeEnum.Start;
  initialData?: any;
}
