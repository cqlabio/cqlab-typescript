import { InteractiveFlowContext } from '../cqflow-context/interactive-flow-context';
import { FlowImplementation } from './flow-implementation';
import { FlowDefinitionTypeEnum } from '../enums';

export class InteractiveFlowImplementation<
  C extends InteractiveFlowContext = InteractiveFlowContext
> extends FlowImplementation<C> {
  getImplementationType() {
    return FlowDefinitionTypeEnum.Interactive;
  }
  // Set start node once it is generated
  // generateStartNode(): StartNode {
  //   const startNode = new StartNode(this);
  //   return startNode;
  // }
  // generateExecNode(): ExecNode<C> {
  //   return new ExecNode<C>(this);
  // }
  // generateEndNode(): EndNode {
  //   return new EndNode(this);
  // }
}
