import { FlowImplementation } from './flow-implementation';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { FlowDefinitionTypeEnum } from '../enums';

export class NonInteractiveFlowImplementation<
  C extends FlowContext = FlowContext
> extends FlowImplementation<C> {
  getImplementationType() {
    return FlowDefinitionTypeEnum.NonInteractive;
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
