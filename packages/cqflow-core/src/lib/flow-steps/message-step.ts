import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';

export interface MessageStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Message;
}
