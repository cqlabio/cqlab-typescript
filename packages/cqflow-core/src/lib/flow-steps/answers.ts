import { AnswerTypeEnum, TernaryEnum } from '../enums';

interface IBaseAnswer {
  answerType: AnswerTypeEnum;
}

export interface IYesNoAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.YesNo;
  value: TernaryEnum;
}

export interface IOptionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.SingleOption;
  selectedId: string | null;
}

export interface ICustomDataAnswer<T = any> extends IBaseAnswer {
  answerType: AnswerTypeEnum.CustomData;
  value: T;
}

export interface IMultiOptionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.MultiOption;
  selectedIds: string[];
}

export interface ITextAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Text;
  value: string | null;
}

export interface INumberAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Number;
  value: number | null;
}

export interface IActionAnswer extends IBaseAnswer {
  answerType: AnswerTypeEnum.Action;
  submitted: boolean;
}

export type IFlowStepAnswer =
  | IYesNoAnswer
  | IActionAnswer
  | IOptionAnswer
  | ICustomDataAnswer
  | ITextAnswer
  | INumberAnswer
  | IMultiOptionAnswer;
