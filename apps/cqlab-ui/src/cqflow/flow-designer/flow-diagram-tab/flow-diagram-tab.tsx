import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Allotment } from 'allotment';
import { FlowDiagramToolbar } from './flow-diagram-toolbar/flow-diagram-toolbar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FlowDiagram } from './flow-diagram/flow-diagram';
import { ReactFlowProvider } from 'reactflow';
import { FlowDiagramDetailsPanel } from './flow-diagram-details-panel/flow-diagram-details-panel';
import { FlowJsonViewer } from './flow-json-viewer/flow-json-viewer';
import { FlowDiagramExpansion } from './flow-diagram-expansion/flow-diagram-expansion';
import { FlowDiagramErrors } from './flow-diagram-errors/flow-diagram-errors';
import { FlowDesignerContext } from '../flow-designer-context';
import { FlowDiagramDocument } from './flow-diagram-document/flow-diagram-document';
import { ErrorBoundary } from 'react-error-boundary';

import 'allotment/dist/style.css';

enum ViewTab {
  JSON = 'JSON',
  EXPANSION = 'EXPANSION',
  VALIDATION = 'VALIDATION',
  DOCUMENT = 'DOCUMENT',
}

// type FlowDiagramTabProps = {
//   flowDefinition: IFlowDefinition
//   doNodeOps: DoNodeUpdates
// }

export function FlowDiagramTab() {
  const { validationResults } = useContext(FlowDesignerContext);

  const [openTab, setOpenTab] = useState<ViewTab | null>(null);

  const toggleView = (tab: ViewTab | null) => {
    if (tab === openTab) {
      setOpenTab(null);
    } else {
      setOpenTab(tab);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        {openTab === ViewTab.JSON ? (
          <Box sx={{ flexGrow: 1 }}>
            <FlowJsonViewer />
          </Box>
        ) : openTab === ViewTab.EXPANSION ? (
          <Box sx={{ flexGrow: 1 }}>
            <FlowDiagramExpansion />
          </Box>
        ) : openTab === ViewTab.DOCUMENT ? (
          <Box sx={{ flexGrow: 1 }}>
            <FlowDiagramDocument />
          </Box>
        ) : (
          <ReactFlowProvider>
            <Allotment>
              <Allotment.Pane preferredSize={235}>
                <FlowDiagramToolbar />
              </Allotment.Pane>
              <Allotment.Pane>
                <Box
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Box sx={{ flexGrow: 1, position: 'relative' }}>
                    <ErrorBoundary
                      fallback={
                        <Box
                          sx={{
                            padding: '30px',
                            textAlign: 'center',
                            color: 'red',
                          }}
                        >
                          There was an error rendering the graph
                        </Box>
                      }
                    >
                      <FlowDiagram />
                    </ErrorBoundary>
                  </Box>

                  {openTab === ViewTab.VALIDATION && (
                    <Box sx={{ height: '200px', zIndex: 100 }}>
                      <FlowDiagramErrors
                        validationResults={validationResults}
                      />
                    </Box>
                  )}
                </Box>
              </Allotment.Pane>

              <Allotment.Pane maxSize={700} minSize={200} preferredSize={400}>
                <FlowDiagramDetailsPanel />
              </Allotment.Pane>
            </Allotment>
          </ReactFlowProvider>
        )}

        <Paper
          square
          sx={{
            borderTop: '1px solid rgb(230,230,230)',
            display: 'flex',
            fontFamily: 'Red Hat Display',
          }}
        >
          <Box
            onClick={() => toggleView(ViewTab.JSON)}
            sx={{
              cursor: 'pointer',
              padding: '5px 20px',
              fontSize: '13px',
              borderRight: '1px solid rgb(230,230,230)',

              background:
                openTab === ViewTab.JSON
                  ? 'rgb(235,235,235)'
                  : 'rgb(250,250,250)',
            }}
          >
            View JSON
          </Box>
          {/* <Box
            onClick={() => toggleView(ViewTab.DOCUMENT)}
            sx={{
              cursor: 'pointer',
              padding: '5px 20px',
              fontSize: '13px',
              borderRight: '1px solid rgb(230,230,230)',

              background:
                openTab === ViewTab.DOCUMENT
                  ? 'rgb(235,235,235)'
                  : 'rgb(250,250,250)',
            }}
          >
            View Document
          </Box> 
          <Box
            onClick={() => toggleView(ViewTab.EXPANSION)}
            sx={{
              cursor: 'pointer',
              padding: '5px 20px',
              fontSize: '13px',
              borderRight: '1px solid rgb(230,230,230)',

              background:
                openTab === ViewTab.EXPANSION
                  ? 'rgb(235,235,235)'
                  : 'rgb(250,250,250)',
            }}
          >
            View Expansion
          </Box>

          */}

          <Box
            onClick={() => toggleView(ViewTab.VALIDATION)}
            sx={{
              cursor: 'pointer',
              padding: '5px 35px 5px 20px',
              fontSize: '13px',
              borderRight: '1px solid rgb(230,230,230)',
              display: 'flex',
              position: 'relative',

              background:
                openTab === ViewTab.VALIDATION
                  ? 'rgb(235,235,235)'
                  : 'rgb(250,250,250)',
            }}
          >
            View Errors
            <Box
              sx={{
                backgroundColor:
                  validationResults.length > 0 ? '#FFCDD2' : 'rgb(230,230,230)',
                color:
                  validationResults.length > 0 ? '#B71C1C' : 'rgb(115,115,115)',
                position: 'absolute',
                right: '7px',
                padding: '0px 6px',
                borderRadius: '20px',
              }}
            >
              {validationResults.length}
            </Box>
          </Box>
        </Paper>
      </Box>
    </DndProvider>
  );
}
