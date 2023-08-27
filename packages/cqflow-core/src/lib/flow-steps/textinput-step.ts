import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { ITextAnswer } from './answers/text-answer';

export interface TextInputStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.TextInput;
  answer: ITextAnswer | null;
}
