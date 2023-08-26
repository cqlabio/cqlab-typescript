import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum, TernaryEnum } from '../enums';
import { IYesNoAnswer } from './answers/yes-no-answer';

export interface ExecStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.Exec;
  evaluation: TernaryEnum;
  answer: IYesNoAnswer | null;
  supplementalData?: any;
}
