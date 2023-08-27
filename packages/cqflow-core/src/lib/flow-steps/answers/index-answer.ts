import { TernaryEnum, AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface IIndexAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Index;
  value: number | null;
}
