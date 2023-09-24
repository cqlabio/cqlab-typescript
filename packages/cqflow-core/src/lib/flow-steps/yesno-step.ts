import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IYesNoAnswer } from './answers/yes-no-answer';
import { ITrueFalseNode } from '../flow-definition/flow-definition';

export interface YesNoStep extends BaseStep<ITrueFalseNode> {
  stepType: ImplementationNodeTypeEnum.YesNo;
  answer: IYesNoAnswer | null;
}
