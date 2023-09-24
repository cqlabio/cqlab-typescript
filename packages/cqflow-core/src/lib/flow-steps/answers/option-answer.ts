import { AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface IOptionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.SingleOption;
  selectedId: string | null;
}
