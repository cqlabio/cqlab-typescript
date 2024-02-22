import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { LibraryRegistry } from '@cqlab/cqdefine';
import { LibraryFunctionDisplay } from './library-function-display';
// import { SelectedLibraryFunction } from '../cds-rule-server';

type LogicLibraryProps = {
  libraryRegistry: LibraryRegistry;
};

export function LibraryDisplay({ libraryRegistry }: LogicLibraryProps) {
  return (
    <Paper sx={{ margin: '30px' }}>
      <Box sx={{ padding: '15px', borderBottom: '1px solid rgb(230,230,230)' }}>
        <strong>{libraryRegistry.libraryId}</strong>{' '}
        {/* <Box
          component="span"
          sx={{ color: 'secondary.main', fontSize: '15px' }}
        >
          [{libraryRegistry.libraryId}]
        </Box> */}
      </Box>
      {Object.values(libraryRegistry.definitions).map((libraryFunction) => (
        <LibraryFunctionDisplay
          libraryName={libraryRegistry.libraryId}
          libraryFunctionRegistry={libraryFunction}
        />
      ))}
    </Paper>
  );
}
