import { ImplementationNodeTypeEnum } from '../../enums';
// import { CQFlow } from '../../cqflow/cqflow';
// import { v4 as uuidv4 } from 'uuid';
// import { Exclude } from 'class-transformer';
import { FlowContext } from '../../cqflow-context/cqflow-context';
import { IFlowDefinitionNode } from '../../cqflow-definition/cqflow-definition';

export abstract class BaseNode<C extends FlowContext<any, any>> {
  abstract nodeType: ImplementationNodeTypeEnum;

  // declare c: C

  private label?: string;
  private defintion?: IFlowDefinitionNode;

  constructor(data?: IFlowDefinitionNode) {
    if (data) {
      this.label = data.label;
      this.defintion = data;
    }
  }

  loadDefinition(data: IFlowDefinitionNode) {
    this.defintion = data;
    this.label = data.label;
  }

  getDefinition(): IFlowDefinitionNode | null {
    return this.defintion || null;
  }

  getDefinitionId(): string | null {
    return this.defintion?.id || null;
  }

  setLabel(label: string) {
    this.label = label;
  }

  getLabel(context: C) {
    if (!context) {
      throw new Error('Context is required');
    }
    return this.label;
  }
}
