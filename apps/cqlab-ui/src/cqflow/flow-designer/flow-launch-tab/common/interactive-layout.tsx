import { Allotment } from 'allotment';
import { InteractiveFlowRenderer } from '@cqlab/ui-flow-renderer';
import CircleIcon from '@mui/icons-material/Circle';
import {
  IFlowStep,
  IFlowStepAnswer,
  ImplementationNodeTypeEnum,
  InteractiveFlowState,
} from '@cqlab/cqflow-core';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import compact from 'lodash/compact';
import React from 'react';
import { CodeHighlighter } from '../../../../common/code-highlighter';

type InteractiveLayoutProps = {
  steps: IFlowStep[];
  onUpdateAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
  flowState: InteractiveFlowState<any> | null;
  navHeader?: React.ReactNode;
  onResetState?: () => void;
};

export function InteractiveLayout({
  steps,
  onUpdateAnswer,
  flowState,
  navHeader,
  onResetState,
}: InteractiveLayoutProps) {
  const emittedData = compact(
    steps.map((step) => {
      if (step.stepType === ImplementationNodeTypeEnum.EmitData) {
        return step;
      }
    })
  );

  return (
    <Allotment defaultSizes={[100, 70]}>
      <Allotment.Pane minSize={300}>
        <Box
          sx={{
            maxWidth: '1000px',
            margin: '0 auto',
            height: '100%',
            overflowY: 'scroll',
            paddingBottom: '100px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              marginBottom: '15px',
            }}
          >
            <Box sx={{ marginLeft: '20px' }}>{navHeader}</Box>
            <Box sx={{ marginRight: '20px' }}>
              {onResetState && (
                <Button
                  onClick={onResetState}
                  size="small"
                  variant="contained"
                  color="info"
                >
                  Reset
                </Button>
              )}
            </Box>
          </Box>

          <InteractiveFlowRenderer
            steps={steps}
            onUpdateAnswer={onUpdateAnswer}
          />
        </Box>
      </Allotment.Pane>

      <Allotment.Pane minSize={250}>
        <Paper sx={{ height: '100%' }}>
          <Allotment vertical defaultSizes={[40, 60]}>
            <Allotment.Pane minSize={100}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    padding: '10px',
                    textTransform: 'uppercase',
                    color: 'rgb(100,100,100)',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    borderBottom: '1px solid rgb(230,230,230)',
                  }}
                >
                  Emitted Data
                </Box>
                <Box sx={{ flexGrow: 1, overflowY: 'scroll' }}>
                  {emittedData.length === 0 && (
                    <Box sx={{ padding: '10px', color: 'rgb(150,150,150)' }}>
                      No data emitted
                    </Box>
                  )}

                  {emittedData.map((step) => (
                    <Box
                      sx={{
                        padding: '3px 10px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <CircleIcon
                        sx={{
                          color: '#2196F3',
                          fontSize: '10px',
                          marginRight: '5px',
                        }}
                      />
                      {step?.label}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Allotment.Pane>

            <Allotment.Pane>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <Box
                  sx={{
                    padding: '10px',
                    textTransform: 'uppercase',
                    color: 'rgb(100,100,100)',
                    fontWeight: 'bold',
                    fontSize: '13px',
                    borderBottom: '1px solid rgb(230,230,230)',
                  }}
                >
                  Flow Context
                </Box>

                <Box
                  sx={{ fontSize: '13px', flexGrow: 1, overflowY: 'scroll' }}
                >
                  <CodeHighlighter
                    language="JSON"
                    code={JSON.stringify(flowState, null, 2)}
                  />
                </Box>
              </Box>
            </Allotment.Pane>
          </Allotment>
        </Paper>
      </Allotment.Pane>
    </Allotment>
  );
}
