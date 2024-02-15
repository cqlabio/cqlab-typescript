import { useEffect, useState } from 'react';
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
import { useFlowImplementationExampleData } from '../../../../data/queries-flow-implementation';
// import { LaunchQuestionnaire } from './launch-questionnaire';

// interface WorkflowInstance {
//   id:string
// }

// interface OneshotExecutorState {
//   type: 'oneshot'
//   steps: IFlowStep[]
// }

// type ExecutorState = OneshotExecutorState | QuestionnaireExecutorState

type TestCasePanelProps = {
  flow: IFlowDefinition;
  doLaunch: (testD: any) => void;
};

export function TestCasePanel({ flow, doLaunch }: TestCasePanelProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const { data: exampleData = [] } = useFlowImplementationExampleData(
    flow?.bindId || null,
    flowImplementationServerUrl
  );

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Index</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Initial Data</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Launch</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {exampleData.map((testD, index) => (
            <TableRow id={index + '_'}>
              <TableCell>Example {index + 1}</TableCell>

              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <pre>{JSON.stringify(testD, null, 2)}</pre>
              </TableCell>
              <TableCell>
                <Button onClick={() => doLaunch(testD)} variant="contained">
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
