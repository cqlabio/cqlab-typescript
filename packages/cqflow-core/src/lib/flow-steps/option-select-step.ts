import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IMultiOptionAnswer } from './answers/multi-option-answer';

export interface OptionSelectStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.OptionSelect;
  answer?: IMultiOptionAnswer | null;
}
