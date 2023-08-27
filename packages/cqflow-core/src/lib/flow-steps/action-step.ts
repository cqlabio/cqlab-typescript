import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum, ActionStatusEnum } from '../enums';

export interface ActionStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Action;

  actionStatus: ActionStatusEnum;
}
