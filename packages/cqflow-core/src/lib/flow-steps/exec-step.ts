import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum, TernaryEnum } from '../enums';
import { IYesNoAnswer } from './answers/yes-no-answer';
import { ITrueFalseNode } from '../flow-definition/flow-definition';

export interface ExecStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Exec;
  nodeDefinition: ITrueFalseNode;
  evaluation: TernaryEnum;
  answer?: IYesNoAnswer | null;
  supplementalData?: any;
}
