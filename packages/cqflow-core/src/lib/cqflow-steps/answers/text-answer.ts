import { TernaryEnum, AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface ITextAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Text;
  value: string | null;
}
