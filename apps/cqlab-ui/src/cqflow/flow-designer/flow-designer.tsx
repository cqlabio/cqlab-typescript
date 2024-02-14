import { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { FlowDiagramTab } from './flow-diagram-tab/flow-diagram-tab';
import { FlowImplementationView } from './flow-implementation-tab/flow-implementation';
import { FlowLaunchTab } from './flow-launch-tab/cqflow-launch';
import { useParams, Link } from 'react-router-dom';
import { applyOpsToFlowDefinition, NodeOp } from '../../data/utils';
import { FlowDesignerContext } from './flow-designer-context';
import { useFlowStore } from '../flow-store';
import { validateFlowDefinition } from '../../data/do-validation';
// import { ImplementationServerDialog } from '../../common/implementation-server-dialog';
import {
  useFlowDefinition,
  useUpdateFlowDefinitionMutation,
} from '../../data/queries';

import { useFlowImplementation } from '../../data/queries-flow-implementation';
import { ReactFlowProvider } from 'reactflow';
import { IFlowDefinition } from '@cqlab/cqflow-core';

// import { getFlowById, updateFlowById } from '../data/browser-db';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box sx={{ height: '100%' }} hidden={value !== index} {...other}>
      {value === index && children}
    </Box>
  );
}

export function FlowDesigner() {
  const { flowDefinitionId } = useParams();
  const [value, setValue] = useState(0);

  const {
    flowImplementationServerUrl,
    flowHistory,
    updateFlowDefinitionHistory,
  } = useFlowStore((state) => ({
    flowImplementationServerUrl: state.flowImplementationServerUrl,
    flowHistory: state.flowDefinitionHistory[flowDefinitionId as string],
    updateFlowDefinitionHistory: state.updateFlowDefinitionHistory,
  }));

  const { data: flowDefinition, isFetching } = useFlowDefinition(
    flowDefinitionId as string
  );

  const { data: flowImplementation } = useFlowImplementation(
    flowDefinition?.bindId || null,
    flowImplementationServerUrl
  );

  const { mutate: updateFlowDefinition } = useUpdateFlowDefinitionMutation();

  const validationResults = useMemo(() => {
    return validateFlowDefinition(flowDefinition || null);
  }, [flowDefinition]);

  const doNodeUpdates = useCallback(
    (ops: NodeOp | NodeOp[]) => {
      if (!flowDefinition) {
        return;
      }
      const nextFlow = applyOpsToFlowDefinition(flowDefinition, ops);

      const nextFlowHistory = flowHistory
        ? {
            past: [...flowHistory.past],
            future: [],
          }
        : {
            past: [],
            future: [],
          };

      nextFlowHistory.past.push(nextFlow);

      // Hold only 25 history items
      if (nextFlowHistory.past.length > 75) {
        nextFlowHistory.past.shift();
      }

      updateFlowDefinitionHistory(flowDefinition.id, nextFlowHistory);
      updateFlowDefinition(nextFlow);
    },
    [
      flowDefinition,
      updateFlowDefinition,
      flowHistory,
      updateFlowDefinitionHistory,
    ]
  );

  // add the initial state to the history
  useEffect(() => {
    if (!flowDefinition) {
      return;
    }

    if (!flowHistory || flowHistory.past.length === 0) {
      updateFlowDefinitionHistory(flowDefinition.id, {
        past: [flowDefinition],
        future: [],
      });
    }
  }, [flowDefinition, updateFlowDefinitionHistory, flowHistory]);

  const undoFlowDefOperation = useCallback(() => {
    if (!flowHistory) {
      return;
    }

    if (flowHistory.past.length < 2) {
      return;
    }

    const prevFlow = flowHistory.past[flowHistory.past.length - 2];
    const nextFlow = flowHistory.past.pop();
    const nextHistory = {
      past: [...flowHistory.past],
      future: [nextFlow as IFlowDefinition, ...flowHistory.future],
    };

    updateFlowDefinition(prevFlow);
    updateFlowDefinitionHistory(prevFlow.id, nextHistory);
  }, [flowHistory, updateFlowDefinition, updateFlowDefinitionHistory]);

  const redoFlowDefOperation = useCallback(() => {
    if (!flowHistory) {
      return;
    }

    if (flowHistory.future.length < 1) {
      return;
    }

    const nextFlow = flowHistory.future.shift();

    if (!nextFlow) {
      return;
    }

    const nextHistory = {
      past: [...flowHistory.past, nextFlow],
      future: [...flowHistory.future],
    };

    updateFlowDefinition(nextFlow);
    updateFlowDefinitionHistory(nextFlow.id, nextHistory);
  }, [flowHistory, updateFlowDefinition, updateFlowDefinitionHistory]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  if (!flowDefinition) {
    if (isFetching) {
      return <div style={{ padding: '10px' }}>Loading...</div>;
    }

    return (
      <Box sx={{ padding: '10px' }}>
        Flow Definition not found: {flowDefinitionId}
      </Box>
    );
  }

  const tabs = [
    {
      label: 'Flow Designer',
    },
  ];

  if (flowImplementation) {
    tabs.push({
      label: 'Flow Implementation',
    });
    tabs.push({
      label: 'Launch',
    });
  } else {
    tabs.push({
      label: 'Launch',
    });
  }

  // TODO: this is dumb, clean up
  const selectedTabIndex = flowImplementation ? value : value === 1 ? 2 : value;

  return (
    <FlowDesignerContext.Provider
      value={{
        flowDefinition,
        doNodeUpdates,
        flowImplementation: flowImplementation || null,
        validationResults: validationResults,
        undoFlowDefOperation,
        redoFlowDefOperation,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Paper square sx={{ zIndex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              padding: '8px 15px',
              borderBottom: '1px solid rgb(230,230,230)',
              fontSize: '13px',
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                a: {
                  color: 'black',
                },
                'a:hover': {
                  color: 'secondary.main',
                },
              }}
            >
              <Box>
                <Link to="/flow" style={{ textDecoration: 'none' }}>
                  All Flows
                </Link>
              </Box>
              <Box sx={{ padding: '0 5px' }}>{`/`}</Box>
              <Box sx={{ color: 'rgb(120,120,120)' }}>
                {flowDefinition?.bindId}
              </Box>
            </Box>
            {/* <ImplementationServerDialog /> */}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.label}
                  label={tab.label}
                  sx={{ fontWeight: 400 }}
                />
              ))}
            </Tabs>
            <Box>
              {!flowImplementation && (
                <Box
                  sx={{
                    fontSize: '13px',
                    color: '#B71C1C',
                    background: '#FFEBEE',

                    padding: '4px 8px',
                    borderRadius: '8px',
                    marginRight: '10px',
                  }}
                >
                  Flow Implementation not found
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        <Box sx={{ flexGrow: 1 }}>
          <TabPanel value={selectedTabIndex} index={0}>
            <FlowDiagramTab />
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={1}>
            <ReactFlowProvider>
              <FlowImplementationView />
            </ReactFlowProvider>
          </TabPanel>
          <TabPanel value={selectedTabIndex} index={2}>
            <FlowLaunchTab />
          </TabPanel>
        </Box>
      </Box>
    </FlowDesignerContext.Provider>
  );
}
