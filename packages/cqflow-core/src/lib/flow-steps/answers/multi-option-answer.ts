import { AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface IMultiOptionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.MultiOption;
  selectedIds: string[];
}
