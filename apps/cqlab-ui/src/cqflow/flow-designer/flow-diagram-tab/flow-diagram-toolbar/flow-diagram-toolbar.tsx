import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DraggableNewNode } from './draggable-new-node';
import { IFlowDefinition, DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';
// import { FlowContext } from '../flow-context';
import { FlowDesignerContext } from '../../flow-designer-context';
import RedoIcon from '@mui/icons-material/Redo';
import UndoIcon from '@mui/icons-material/Undo';
import HelpIcon from '@mui/icons-material/HelpCenterOutlined';
import { HelpDialog } from './help-dialog';
import { useFlowStore } from '../../../flow-store';

// const NODES = [
//   { type: 'root', label: 'Core' },

//   { label: 'Start', nodeType: DefinitionNodeTypeEnum.Start },
//   { label: 'End', nodeType: DefinitionNodeTypeEnum.End },
//   { label: 'Sub-Flow', nodeType: DefinitionNodeTypeEnum.SubFlow },
//   { label: 'Narrative' },

//   { type: 'root', label: 'Interaction' },

//   { label: 'Yes/No', nodeType: DefinitionNodeTypeEnum.YesNo },
//   { label: 'Branch Choice', nodeType: DefinitionNodeTypeEnum.BranchChoice },
//   { label: 'Custom Form' },
//   { label: 'Action', nodeType: DefinitionNodeTypeEnum.Action },

//   { type: 'root', label: 'Execution' },

//   { label: 'Evaluate', nodeType: DefinitionNodeTypeEnum.Exec },
//   { label: 'Logic Tree', nodeType: DefinitionNodeTypeEnum.LogicTree },
//   { label: 'Step Evaluate' },

//   { type: 'root', label: 'Context' },

//   { label: 'Contextual Data', nodeType: DefinitionNodeTypeEnum.EmitData },
//   { label: 'Recommendation' },
//   { label: 'Message', nodeType: DefinitionNodeTypeEnum.Message },
// ];

export const NODES = [
  {
    label: 'Core',
    children: [
      {
        label: 'Start',
        nodeType: DefinitionNodeTypeEnum.Start,
        description: 'Each flow diagram must have exactly one start node.',
      },
      {
        label: 'End',
        nodeType: DefinitionNodeTypeEnum.End,
        description:
          'There can be many end nodes within a diagram, but every flow path must finalize in an end node.',
      },
      {
        label: 'Sub-Flow',
        nodeType: DefinitionNodeTypeEnum.SubFlow,
        disabled: true,
        description:
          'A Sub-Flow is a flow embedded inside another flow. It can be used to modularize a flow diagram, and to create reusable components.',
      },
      // {
      //   label: 'Narrative',
      //   nodeType: DefinitionNodeTypeEnum.Narrative,
      //   description:
      //     'Narrative nodes are used for informational purposes. They can be used to provide documentation and other context about the flow.',
      // },
      {
        label: 'Note',
        nodeType: DefinitionNodeTypeEnum.Note,
        description:
          'Note nodes are used for informational purposes. They can be used to provide documentation and other context about the flow.',
      },
    ],
  },
  {
    label: 'Flow Control',
    children: [
      {
        label: 'True/False',
        nodeType: DefinitionNodeTypeEnum.TrueFalse,
        description:
          'The True/False node branches between a True/False execution. True or False must be chosen. The decision point can either be calculated on the backend, or chosen by the user.',
      },
      {
        label: 'Multi Option',
        nodeType: DefinitionNodeTypeEnum.MultiOption,
        description:
          'The Multi-Option requires a minimum certain number of nodes to be chosen in order to be true.',
      },
      {
        label: 'Branch',
        nodeType: DefinitionNodeTypeEnum.Branch,
        description:
          'The Branch node branches between 2 or more flows paths. Exactly one path must be chosen. Which path is chosen can either be calculated on the backend, or chosen by the user.',
      },
      {
        label: 'Logic Tree',
        nodeType: DefinitionNodeTypeEnum.LogicTree,
        description:
          'The logic tree node allows for a series of AND/OR statements to be defined and constructed into a tree. It can be useful for modelling eligibility or exclusion criteria. The final result branches between a True or False code path.',
      },
    ],
  },
  {
    label: 'Flow Input',
    children: [
      {
        label: 'Form Field',
        nodeType: DefinitionNodeTypeEnum.FormField,
        description:
          'A form field is a single input field. It can be used for simple inputs such as text, numbers, quantities, multi-choice options, or dates. These inputs can then be used by control flow nodes at later points.',
      },
      {
        label: 'Custom Form',
        nodeType: DefinitionNodeTypeEnum.CustomForm,
        description:
          'A fully embedable customizable form. The form itself is built on the backend flow implementation server, and is NOT built inside this UI editor. This generally serves as input for complex and dynamic form inputs such as lab results.',
      },
    ],
  },

  {
    label: 'Flow Output',
    children: [
      {
        label: 'Emit Data',
        nodeType: DefinitionNodeTypeEnum.EmitData,
        description:
          'The Emit data node is how information is passed back to the caller of the CDS flow. It is the final data response of the flow. It can include recommendations, tasks to be performed, or any other final output',
      },
      {
        label: 'Action',
        nodeType: DefinitionNodeTypeEnum.Action,
        // disabled: true,
        description:
          'An action to be triggered, such as a medication or lab test order.',
      },
    ],
  },
];

export function FlowDiagramToolbar() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const { flowDefinition, undoFlowDefOperation, redoFlowDefOperation } =
    useContext(FlowDesignerContext);

  const flowHistory = useFlowStore(
    (state) => state.flowDefinitionHistory[flowDefinition.id]
  );

  const prevDisabled = !flowHistory || flowHistory.past.length < 2;
  const futureDisabled = !flowHistory || flowHistory.future.length < 1;

  let hasStartNode = false;
  Object.keys(flowDefinition.nodes || {}).forEach((nodeId) => {
    if (
      flowDefinition.nodes[nodeId].nodeType === DefinitionNodeTypeEnum.Start
    ) {
      hasStartNode = true;
    }
  });

  const nodeViews = NODES.map((node) => {
    const children = node.children.map((child) => {
      const isDisabled =
        child.disabled ||
        (!hasStartNode && child.nodeType !== DefinitionNodeTypeEnum.Start);
      return (
        <DraggableNewNode
          key={child.label}
          label={child.label}
          flowNodeType={child.nodeType}
          isDisabled={isDisabled}
        />
      );
    });

    return (
      <Box>
        <Box
          key={node.label}
          sx={{
            fontWeight: 500,
            fontSize: '12px',
            textTransform: 'uppercase',
            padding: '1px 10px 1px 10px',
            color: 'rgb(160,160,160)',
            display: 'flex',
            alignItems: 'center',
            marginTop: '30px',
            borderBottom: '1px solid rgb(235,235,235)',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>{node.label}</Box>

          {/* <KeyboardArrowDownIcon /> */}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            padding: '3px 7px 0 7px',
            justifyContent: 'space-between',
          }}
        >
          {children}
        </Box>
      </Box>
    );
  });

  return (
    <Paper
      square
      sx={{
        height: '100%',
        fontFamily: 'Red Hat Display',
        zIndex: 2,
        overflowY: 'scroll',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgb(230,230,230)',
        }}
      >
        {/* Undo Redo */}
        <Box
          sx={{
            textTransform: 'uppercase',
            paddingLeft: '10px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'rgb(70,70,70)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          ToolBar
          <HelpIcon
            onClick={() => setIsHelpOpen(true)}
            sx={{
              color: 'rgb(200,200,200)',
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: '5px',
              ':hover': {
                color: '#1E88E5',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex' }}>
          <Box sx={{ padding: '10px 10px 0 10px' }}>
            <UndoIcon
              onClick={undoFlowDefOperation}
              sx={{
                color: prevDisabled ? 'rgb(210,210,210)' : 'rgb(130,130,130)',
                cursor: 'pointer',
                fontSize: '20px',
                ':hover': {
                  color: prevDisabled ? 'rgb(210,210,210)' : 'rgb(90,90,90)',
                },
              }}
            />
          </Box>
          <Box
            sx={{
              padding: '10px 10px 0 10px',
            }}
          >
            <RedoIcon
              onClick={redoFlowDefOperation}
              sx={{
                color: futureDisabled ? 'rgb(210,210,210)' : 'rgb(130,130,130)',
                cursor: 'pointer',
                fontSize: '20px',
                ':hover': {
                  color: futureDisabled ? 'rgb(210,210,210)' : 'rgb(90,90,90)',
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box>{nodeViews}</Box>
      <HelpDialog
        isOpen={isHelpOpen}
        onToggleOpen={() => setIsHelpOpen(!isHelpOpen)}
      />
    </Paper>
  );
}
