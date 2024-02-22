import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LibraryDisplay } from './registry-display/library-display';
import { RegistrySidebar } from './registry-sidebar/registry-sidebar';
import { Allotment } from 'allotment';
import { useLibraryRegistry } from '../data/queries-flow-implementation';
// import { ImplementationServerDialog } from '../common/implementation-server-dialog';
import { FlowImplementationNotFound } from '../common/flow-implementation-not-found';
import { useFlowStore } from '../cqflow/flow-store';

export function CQDefine() {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const {
    status,
    data: libraryRegistry,
    error,
    isFetching,
  } = useLibraryRegistry(flowImplementationServerUrl);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        square
        sx={{
          fontSize: '13px',
          padding: '8px 15px',
          display: 'flex',
          justifyContent: 'space-between',
          zIndex: 2,
        }}
      >
        <Box sx={{ fontWeight: 'bold' }}>Library Registry / All</Box>

        {/* <ImplementationServerDialog /> */}
      </Paper>

      {!flowImplementationServerUrl ? (
        <FlowImplementationNotFound
          flowImplementationServerUrl={flowImplementationServerUrl}
        />
      ) : !libraryRegistry ? (
        <Paper sx={{ padding: '15px', margin: '30px' }}>
          <Box
            sx={{ paddingBottom: '10px', fontSize: '18px', fontWeight: 'bold' }}
          >
            Not Found
          </Box>
          {!flowImplementationServerUrl ? (
            <>Implementation server is not configured.</>
          ) : (
            <>
              Unable to find registry on{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                {flowImplementationServerUrl}
              </Box>
              . Please contact engineering support if this is unexpected.
            </>
          )}
        </Paper>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          {libraryRegistry && (
            <Allotment>
              <Allotment.Pane>
                <Box
                  sx={{
                    height: '100%',
                    overflowY: 'scroll',
                  }}
                >
                  {Object.values(libraryRegistry).map((libraryRegistry) => (
                    <LibraryDisplay libraryRegistry={libraryRegistry} />
                  ))}
                </Box>
              </Allotment.Pane>

              <Allotment.Pane maxSize={700} minSize={200} preferredSize={500}>
                <RegistrySidebar libraryContainerRegistry={libraryRegistry} />
              </Allotment.Pane>
            </Allotment>
          )}
        </Box>
      )}
    </Box>
  );
}
