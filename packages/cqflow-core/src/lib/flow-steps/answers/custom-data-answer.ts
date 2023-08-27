import { TernaryEnum, AnswerTypeEnum } from '../../enums';
import { IBaseAnswer } from './base-answer';

export interface ICustomDataAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.CustomData;
  value: any;
}
