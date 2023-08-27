import { TernaryEnum, AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface IYesNoAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.YesNo;
  value: TernaryEnum;
}
