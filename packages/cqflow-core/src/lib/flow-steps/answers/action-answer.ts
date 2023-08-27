import { AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface IActionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Action;
  submitted: boolean;
}
