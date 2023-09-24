import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { ITextAnswer } from './answers/text-answer';
import { IInputDataNode } from '../flow-definition/flow-definition';

export interface TextInputStep extends BaseStep<IInputDataNode> {
  stepType: ImplementationNodeTypeEnum.TextInput;
  answer: ITextAnswer | null;
}
