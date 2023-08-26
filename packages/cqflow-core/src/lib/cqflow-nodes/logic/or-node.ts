import { LogicEnum } from '../../enums';
import { LogicTreeItem } from '../logic';

// export interface IOr {
//   logicType: LogicEnum.Or;
//   children: ILogicTreeItem[];
// }

export class OrLogic {
  logicType: LogicEnum.Or = LogicEnum.Or;

  children: LogicTreeItem[] = [];
}
