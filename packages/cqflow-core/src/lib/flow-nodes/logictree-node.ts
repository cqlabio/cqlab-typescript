import { BooleanNode } from './abstract/boolean-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { BaseNode } from './abstract/base-node';
import { Logic } from './logic';
import { FlowContext } from '../flow-context/flow-context';

// interface ILogicTreeNode extends IBaseBooleanNode {
//   nodeType: NodeTypeEnum.LogicTree;

//   logicTree?: ILogic | null;
// }

export class LogicTreeNode<C extends FlowContext> extends BooleanNode<C> {
  nodeType = ImplementationNodeTypeEnum.LogicTree;
  // implements ILogicTreeNode
  // nodeType: NodeTypeEnum.LogicTree = NodeTypeEnum.LogicTree;

  logicTree?: Logic;

  // getLogicTree(): Logic | null {
  //   return this.logicTree || null;
  // }

  // setLogicTree(logic: Logic) {
  //   this.logicTree = logic;
  // }
}
