import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IOptionAnswer } from './answers';
import {
  IBranchNode,
  INextMultiOption,
} from '../flow-definition/flow-definition';

export interface BranchChoiceStep extends BaseStep<IBranchNode> {
  stepType: ImplementationNodeTypeEnum.BranchChoice;
  options: INextMultiOption[];
  answer: IOptionAnswer | null;
}
