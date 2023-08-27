import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { IIndexAnswer } from './answers';
import { INextMultiOption } from '../flow-definition/next';

export interface BranchChoiceStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.BranchChoice;
  options: INextMultiOption[];
  answer: IIndexAnswer | null;
}
