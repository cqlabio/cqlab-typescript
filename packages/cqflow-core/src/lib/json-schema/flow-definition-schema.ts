export const flowDefinitionSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    id: { type: 'string' },
    bindId: { type: 'string' },
    type: { $ref: '#/definitions/FlowDefinitionTypeEnum' },
    nodes: {
      additionalProperties: {
        $ref: '#/definitions/FlowNode',
      },
    },
  },
  required: ['id', 'nodes', 'type'],
  definitions: {
    FlowDefinitionTypeEnum: {
      enum: ['OneShot', 'Questionnaire'],
    },
    NodeTypeEnum: {
      enum: [
        'Start',
        'End',
        'Action',
        'YesNo',
        'SubFlow',
        'LogicTree',
        'TrueFalse',
        'EmitData',
      ],
    },
    'Record<string,IFlowDefinitionNode>': {
      type: 'object',
    },
    FlowNode: {
      discriminator: { propertyName: 'nodeType' },
      oneOf: [
        { $ref: '#/definitions/StartNode' },
        { $ref: '#/definitions/EndNode' },
        { $ref: '#/definitions/TrueFalse' },
        { $ref: '#/definitions/NarrativeNode' },
        { $ref: '#/definitions/EmitDataNode' },
        { $ref: '#/definitions/LogicTreeNode' },
      ],
    },
    StartNode: {
      type: 'object',
      properties: {
        nodeType: { enum: ['Start'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        next: { $ref: '#/definitions/NextUnary' },
        label: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
      },
      required: ['id', 'nodeType', 'next', 'position'],
    },
    EndNode: {
      type: 'object',
      properties: {
        nodeType: { enum: ['End'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        label: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
      },
      required: ['id', 'nodeType', 'position'],
    },
    NarrativeNode: {
      type: 'object',
      properties: {
        nodeType: { enum: ['Narrative'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        label: { type: 'string' },
        narrative: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
      },
      required: ['id', 'nodeType', 'position'],
    },
    TrueFalse: {
      type: 'object',
      properties: {
        nodeType: { enum: ['TrueFalse'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        next: { $ref: '#/definitions/NextBinary' },
        label: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
      },
      required: ['id', 'nodeType', 'next'],
    },
    EmitDataNode: {
      type: 'object',
      properties: {
        nodeType: { enum: ['EmitData'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        next: { $ref: '#/definitions/NextUnary' },
        label: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
      },
      required: ['id', 'nodeType', 'next'],
    },
    LogicTreeNode: {
      type: 'object',
      properties: {
        nodeType: { enum: ['LogicTree'] },
        id: { type: 'string' },
        bindId: { type: 'string' },
        next: { $ref: '#/definitions/NextBinary' },
        label: { type: 'string' },
        position: { $ref: '#/definitions/NodePosition' },
        logicTree: { $ref: '#/definitions/LogicTreeItem' },
      },
      required: ['id', 'nodeType', 'next'],
    },
    LogicTreeItem: {
      discriminator: { propertyName: 'logicType' },
      oneOf: [
        { $ref: '#/definitions/LogicTreeAnd' },
        { $ref: '#/definitions/LogicTreeOr' },
        { $ref: '#/definitions/LogicTreeReference' },
      ],
    },
    LogicTreeAnd: {
      type: 'object',
      properties: {
        logicType: { enum: ['And'] },
        children: {
          type: 'array',
          items: { $ref: '#/definitions/LogicTreeItem' },
        },
      },
      required: ['logicType'],
    },
    LogicTreeOr: {
      type: 'object',
      properties: {
        logicType: { enum: ['Or'] },
        children: {
          type: 'array',
          items: { $ref: '#/definitions/LogicTreeItem' },
        },
      },
      required: ['logicType'],
    },
    LogicTreeReference: {
      type: 'object',
      properties: {
        logicType: { enum: ['Reference'] },
        referenceId: { type: 'string' },
      },
      required: ['logicType'],
    },
    NextUnary: {
      type: 'object',
      properties: {
        type: { enum: ['Unary'] },
        id: { type: 'string' },
      },
      required: ['type', 'id'],
    },
    NextBinary: {
      type: 'object',
      properties: {
        type: { enum: ['Binary'] },
        trueId: { type: 'string' },
        falseId: { type: 'string' },
      },
      required: ['type'],
    },
    NodePosition: {
      type: 'object',
      properties: {
        x: { type: 'number' },
        y: { type: 'number' },
        width: { type: 'number' },
        height: { type: 'number' },
      },
    },
  },
} as const;
