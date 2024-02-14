import {
  DefinitionNodeTypeEnum,
  IFlowDefinitionNode,
  NextTypeEnum,
  LogicEnum,
  INarrativeNode,
  IEmitDataNode,
  ITrueFalseNode,
  IEndNode,
  IStartNode,
  IActionNode,
  IBranchNode,
  ILogicTreeNode,
  ISubFlowNode,
  IFormFieldNode,
  FieldTypeEnum,
  ICustomFormNode,
  IMultiOption,
  IMultiOptionNode,
  INoteNode,
} from '@cqlab/cqflow-core';
import { customAlphabet } from 'nanoid';
import {
  NODE_DEFAULT_HEIGHT,
  NODE_DEFAULT_WIDTH,
} from '@cqlab/ui-flow-diagram';

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 8);

export function getCustomNanoId(nodeType: string) {
  return nodeType.toLowerCase() + '_' + nanoid();
}

export const newNodeTemplates: Record<
  DefinitionNodeTypeEnum,
  () => IFlowDefinitionNode
> = {
  [DefinitionNodeTypeEnum.Start]: (): IStartNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.Start);
    return {
      nodeType: DefinitionNodeTypeEnum.Start,
      id: id,
      bindId: id,
      label: 'Start',
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: 60,
        height: 60,
      },
    };
  },

  [DefinitionNodeTypeEnum.End]: (): IEndNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.End);
    return {
      nodeType: DefinitionNodeTypeEnum.End,
      label: 'End',
      id: id,
      bindId: id,
      position: {
        x: 0,
        y: 0,
        width: 60,
        height: 60,
      },
    };
  },

  [DefinitionNodeTypeEnum.Note]: (): INoteNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.Note);
    return {
      nodeType: DefinitionNodeTypeEnum.Note,
      label: '',
      id: id,
      bindId: id,
      contents: '',
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  // [NodeTypeEnum.YesNo]: () => {
  //   const id = getCustomNanoId(NodeTypeEnum.YesNo);
  //   return {
  //     nodeType: NodeTypeEnum.YesNo,
  //     id: id,
  //     bindId: id,
  //     label: '',
  //     next: {
  //       type: NextTypeEnum.Binary,
  //     },
  //     position: {
  //       x: 0,
  //       y: 0,
  //       width: NODE_DEFAULT_WIDTH,
  //       height: NODE_DEFAULT_HEIGHT,
  //     }
  //   };
  // },

  [DefinitionNodeTypeEnum.TrueFalse]: (): ITrueFalseNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.TrueFalse);
    return {
      nodeType: DefinitionNodeTypeEnum.TrueFalse,
      id: id,
      bindId: id,
      label: '',
      next: {
        type: NextTypeEnum.Binary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH - 50,
        height: NODE_DEFAULT_WIDTH - 50,
      },
    };
  },

  [DefinitionNodeTypeEnum.MultiOption]: (): IMultiOptionNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.MultiOption);
    return {
      nodeType: DefinitionNodeTypeEnum.MultiOption,
      id: id,
      bindId: id,
      label: '',
      options: [],
      min: 0,
      max: null,
      next: {
        type: NextTypeEnum.Binary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH - 50,
        height: NODE_DEFAULT_WIDTH - 50,
      },
    };
  },

  [DefinitionNodeTypeEnum.EmitData]: (): IEmitDataNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.EmitData);
    return {
      nodeType: DefinitionNodeTypeEnum.EmitData,
      id: id,
      bindId: id,
      label: '',
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.Narrative]: (): INarrativeNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.Narrative);
    return {
      nodeType: DefinitionNodeTypeEnum.Narrative,
      id: id,
      bindId: id,
      label: '',
      narrative: '',
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.CustomForm]: (): ICustomFormNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.CustomForm);
    return {
      nodeType: DefinitionNodeTypeEnum.CustomForm,
      id: id,
      bindId: id,
      label: '',
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.FormField]: (): IFormFieldNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.FormField);
    return {
      nodeType: DefinitionNodeTypeEnum.FormField,
      fieldType: FieldTypeEnum.Text,
      id: id,
      bindId: id,
      label: '',
      field: {
        fieldType: FieldTypeEnum.Text,
      },
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.Action]: (): IActionNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.Action);
    return {
      nodeType: DefinitionNodeTypeEnum.Action,
      id: id,
      bindId: id,
      label: '',
      actions: [],
      min: 1,
      max: null,
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.Branch]: (): IBranchNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.Branch);
    return {
      nodeType: DefinitionNodeTypeEnum.Branch,
      id: id,
      bindId: id,
      label: '',
      next: {
        type: NextTypeEnum.Multi,
        options: [],
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.LogicTree]: (): ILogicTreeNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.LogicTree);
    return {
      nodeType: DefinitionNodeTypeEnum.LogicTree,
      id: id,
      bindId: id,
      label: '',
      logicTree: {
        logicType: LogicEnum.And,
        children: [],
      },
      next: {
        type: NextTypeEnum.Binary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  [DefinitionNodeTypeEnum.SubFlow]: (): ISubFlowNode => {
    const id = getCustomNanoId(DefinitionNodeTypeEnum.SubFlow);
    return {
      nodeType: DefinitionNodeTypeEnum.SubFlow,
      id: id,
      bindId: id,
      label: '',
      subFlowId: '',
      next: {
        type: NextTypeEnum.Unary,
      },
      position: {
        x: 0,
        y: 0,
        width: NODE_DEFAULT_WIDTH,
        height: NODE_DEFAULT_HEIGHT,
      },
    };
  },

  // [NodeTypeEnum.Message]: () => {
  //   const id = getCustomNanoId(NodeTypeEnum.Message);
  //   return {
  //     nodeType: NodeTypeEnum.Message,
  //     id: id,
  //     bindId: id,
  //     label: '',
  //     next: {
  //       type: NextTypeEnum.Unary,
  //     },
  //     position: {
  //       x: 0,
  //       y: 0,
  //       width: NODE_DEFAULT_WIDTH,
  //       height: NODE_DEFAULT_HEIGHT,
  //     }
  //   };
  // },
};
