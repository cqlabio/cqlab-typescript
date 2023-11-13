import { ImplementationNodeTypeEnum } from '../../enums';
// import { CQFlow } from '../../cqflow/cqflow';
// import { v4 as uuidv4 } from 'uuid';
// import { Exclude } from 'class-transformer';
import { FlowContext } from '../../flow-context/flow-context';
import { IFlowDefinitionNode } from '../../flow-definition';

export abstract class BaseNode<
  C extends FlowContext = FlowContext,
  D extends IFlowDefinitionNode = IFlowDefinitionNode
> {
  abstract nodeType: ImplementationNodeTypeEnum;

  // declare c: C

  private label: string;
  definition: D;

  constructor(data: D) {
    this.label = data.label || '';
    this.definition = data;
  }

  // loadDefinition(data: IFlowDefinitionNode) {
  //   this.definition = data;
  //   this.label = data.label;
  // }

  getDefinition(): D {
    return this.definition;
  }

  getDefinitionId(): string {
    return this.definition.id;
  }

  setLabel(label: string) {
    this.label = label;
  }

  async getLabel(context: C) {
    if (!context) {
      throw new Error('Context is required');
    }
    return this.label;
  }
}
