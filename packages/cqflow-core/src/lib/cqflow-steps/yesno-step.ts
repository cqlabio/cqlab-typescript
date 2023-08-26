import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IYesNoAnswer } from './answers/yes-no-answer';

export interface YesNoStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.YesNo;
  answer: IYesNoAnswer | null;
}
