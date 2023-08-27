import { FlowContext } from '../../flow-context/flow-context';
import { BooleanNode } from '../abstract/boolean-node';
import { ImplementationNodeTypeEnum } from '../../enums';

export class TrueFalseLeaf<C extends FlowContext> extends BooleanNode<C> {
  nodeType = ImplementationNodeTypeEnum.TrueFalseLeaf;
  // implements IYesNoNode
  // nodeType: NodeTypeEnum.YesNo = NodeTypeEnum.YesNo;
}

// export class LogicReference  {
//   // logicType: LogicEnum.Reference = LogicEnum.Reference;
//   // referenceId?: string;
// }
