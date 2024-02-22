import Box from '@mui/material/Box';
import { LibraryFunctionRegistry } from '@cqlab/cqdefine';
import { useFlowStore } from '../../cqflow/flow-store';
// import { useFlowStore } from '../../flow/flow-store';

type LogicLibraryProps = {
  libraryFunctionRegistry: LibraryFunctionRegistry;
  libraryName: string;
};

export function LibraryFunctionDisplay({
  libraryFunctionRegistry,
  libraryName,
}: LogicLibraryProps) {
  const setSelectedFunctionDefinition = useFlowStore(
    (state) => state.setSelectedFunctionDefinition
  );

  const onClickFunction = () => {
    setSelectedFunctionDefinition({
      libraryName,
      funcName: libraryFunctionRegistry.funcName,
    });
  };

  return (
    <Box
      sx={{
        padding: '10px 15px',
        cursor: 'pointer',
        ':hover': { background: 'rgb(250,250,250)' },
      }}
      onClick={onClickFunction}
    >
      {libraryFunctionRegistry.label}{' '}
      <Box component="span" sx={{ color: 'secondary.main', fontSize: '14px' }}>
        [{libraryFunctionRegistry.funcName}]
      </Box>
      <Box
        component="span"
        sx={{ color: '#1565C0', fontSize: '14px', marginLeft: '7px' }}
      >
        [{libraryFunctionRegistry.returnType ? 'retrieve' : 'evaluate'}]
      </Box>
      {libraryFunctionRegistry.params && (
        <Box
          component="span"
          sx={{ color: '#2E7D32', fontSize: '14px', marginLeft: '7px' }}
        >
          [parameterized]
        </Box>
      )}
      <Box sx={{ color: 'rgb(120,120,120)', fontSize: '14px' }}>
        {libraryFunctionRegistry.documentation}
      </Box>
      {/* 
      <Box sx={{ color: 'rgb(120,120,120)', fontSize: '14px' }}>
        {JSON.stringify(libraryFunctionRegistry.params)}
      </Box> */}
    </Box>
  );
}
