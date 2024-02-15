import { useEffect, useState } from 'react';
import last from 'lodash/last';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import { IFlowDefinition } from '@cqlab/cqflow-core';
import { useFlowStore } from '../../../flow-store';
import {
  useDeleteFlowInstanceMutation,
  useFlowImplementationExampleData,
  useFlowInstances,
} from '../../../../data/queries-flow-implementation';
import DeleteIcon from '@mui/icons-material/Delete';

// import { LaunchQuestionnaire } from './launch-questionnaire';

// interface WorkflowInstance {
//   id:string
// }

// interface OneshotExecutorState {
//   type: 'oneshot'
//   steps: IFlowStep[]
// }

// type ExecutorState = OneshotExecutorState | QuestionnaireExecutorState

type FlowInstancePanelProps = {
  flow: IFlowDefinition;
  setSelectedWorkflowInstanceId: (id: string) => void;
};

export function FlowInstancePanel({
  flow,
  setSelectedWorkflowInstanceId,
}: FlowInstancePanelProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: workflowInstances = [] } = useFlowInstances(
    flow.id,
    flowImplementationServerUrl
  );

  const { mutate: deleteFlowInstance } = useDeleteFlowInstanceMutation(
    flowImplementationServerUrl
  );

  const onDeleteInstance = (instanceId: string) => {
    deleteFlowInstance(instanceId);
  };

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Id</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Answers</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Initial Data</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {workflowInstances.map((flowInstance, index) => (
            <TableRow id={index + '_'}>
              <TableCell>
                <Box
                  sx={{
                    cursor: 'pointer',
                    ':hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={() => setSelectedWorkflowInstanceId(flowInstance.id)}
                >
                  {last(flowInstance.id.split('-'))}
                </Box>
              </TableCell>
              <TableCell>{flowInstance.status}</TableCell>
              <TableCell>{flowInstance.answers.length}</TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <pre>{JSON.stringify(flowInstance.initialData, null, 2)}</pre>
              </TableCell>

              <TableCell>
                <Button
                  sx={{ marginRight: '8px' }}
                  color="secondary"
                  onClick={() => onDeleteInstance(flowInstance.id)}
                  variant="contained"
                >
                  Delete
                </Button>

                <Button
                  onClick={() => setSelectedWorkflowInstanceId(flowInstance.id)}
                  variant="contained"
                >
                  Launch
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
