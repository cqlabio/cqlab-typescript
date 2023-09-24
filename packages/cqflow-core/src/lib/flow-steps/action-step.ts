import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum, ActionStatusEnum } from '../enums';
import { IActionNode } from '../flow-definition/flow-definition';

export interface ActionStep extends BaseStep<IActionNode> {
  stepType: ImplementationNodeTypeEnum.Action;

  actionStatus: ActionStatusEnum;
}
