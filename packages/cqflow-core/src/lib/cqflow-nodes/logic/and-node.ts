import { LogicEnum } from '../../enums';
import { LogicTreeItem } from '../logic';

export class AndLogic {
  logicType: LogicEnum.And = LogicEnum.And;

  children: LogicTreeItem[] = [];
}
