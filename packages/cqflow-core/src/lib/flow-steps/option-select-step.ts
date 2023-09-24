import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IMultiOptionAnswer } from './answers/multi-option-answer';
import {
  IOptionSelectNode,
  IOptionSelectNodeOption,
} from '../flow-definition/flow-definition';

export interface OptionSelectStep extends BaseStep<IOptionSelectNode> {
  stepType: ImplementationNodeTypeEnum.OptionSelect;
  options: IOptionSelectNodeOption[];
  answer?: IMultiOptionAnswer | null;
  min: number;
  max: number | null;
}
