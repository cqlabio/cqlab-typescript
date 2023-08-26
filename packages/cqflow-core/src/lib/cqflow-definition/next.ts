import { NextTypeEnum } from '../enums';
export interface INextUnary {
  type: NextTypeEnum.Unary;
  id?: string;
}

export interface INextBinary {
  type: NextTypeEnum.Binary;
  trueId?: string;
  falseId?: string;
}

export interface INextMultiOption {
  label?: string;
  id?: string;
}
export interface INextMulti {
  type: NextTypeEnum.Multi;
  options: INextMultiOption[];
}

export type INext = INextUnary | INextBinary | INextMulti;
