import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { axiosInstance } from '../../data/axios-instance';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { useFlowStore } from '../../flow/flow-store';
import { LibraryContainerRegistry } from '@cqlab/cqdefine';
import { PanelLabel } from './panel-label';
import { ParameterizedForm } from './parameterized-form';
import { DisplaySchema } from './display-schema';
import { useFlowStore } from '../../cqflow/flow-store';

type RegistrySidebarProps = {
  libraryContainerRegistry: LibraryContainerRegistry;
};

export function RegistrySidebar({
  libraryContainerRegistry,
}: RegistrySidebarProps) {
  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  const selectedFunctionDefinition = useFlowStore(
    (state) => state.selectedFunctionDefinition
  );

  const [patientId, setSelectedPatientId] = useState('');
  const [result, setResult] = useState<any>(null);

  const libraryRegistry =
    selectedFunctionDefinition &&
    libraryContainerRegistry[selectedFunctionDefinition.libraryName];

  const funcRegistry =
    libraryRegistry &&
    libraryRegistry.definitions[selectedFunctionDefinition.funcName];

  useEffect(() => {
    setResult(null);
  }, [selectedFunctionDefinition]);

  const handleChange = function (event: SelectChangeEvent) {
    const selectedId = event.target.value as string;
    setSelectedPatientId(selectedId);
  };

  const onExecute = function (paramaters?: any) {
    if (!libraryRegistry || !funcRegistry) {
      return;
    }

    const foundTestData = libraryRegistry.mockData?.find(
      (d) => d.id === patientId
    );

    if (!foundTestData) {
      return;
    }

    axiosInstance
      .post(`/libraries/execute`, {
        className: libraryRegistry.libraryId,
        classFunctionName: funcRegistry.funcName,
        parameters: paramaters || null,
        mockDataId: foundTestData.id,
        // bundle: foundTestData.data,
      })
      .then((res) => {
        setResult(res.data);
      });
  };

  const rootLibraries = Object.values(libraryContainerRegistry);

  return (
    <Paper
      square
      sx={{
        height: '100%',
        borderTop: '1px solid rgb(230,230,230)',
        overflowY: 'scroll',
      }}
    >
      {libraryRegistry && funcRegistry ? (
        <Box>
          <Box
            sx={{
              background: 'rgb(245,245,245)',
              padding: '10px',
              fontSize: '14px',
              borderBottom: '1px solid rgb(230,230,230)',
            }}
          >
            <strong>Selected:</strong>{' '}
            <Box component="span" sx={{ color: 'rgb(60,60,60)' }}>
              {libraryRegistry.libraryId}.{funcRegistry.funcName}
            </Box>
          </Box>
          <Box sx={{ padding: '1px 15px 0 15px' }}>
            <PanelLabel label="Library" />
            <Box>
              {libraryRegistry.libraryId}{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                [{libraryRegistry.label}]
              </Box>
            </Box>
            <PanelLabel label="Definition" />
            <Box>
              {funcRegistry.label}{' '}
              <Box component="span" sx={{ color: 'secondary.main' }}>
                [{funcRegistry.funcName}]
              </Box>
            </Box>
            <PanelLabel label="Parameters" />
            <DisplaySchema schmea={funcRegistry.params} />
            {/* <Box sx={{ color: 'rgb(130,130,130)' }}>None</Box> */}
            <PanelLabel label="Return Type" />
            <DisplaySchema schmea={funcRegistry.returnType} />
          </Box>

          <Box sx={{ paddingLeft: '15px' }}>
            <PanelLabel label="Test With Example Data" />
          </Box>
          <Box
            sx={{
              padding: '10px 15px',
              borderTop: '1px solid rgb(230,230,230)',
              marginTop: '10px',
            }}
          >
            <Select
              fullWidth
              value={patientId}
              onChange={handleChange}
              sx={{ minWidth: '100px', background: 'white', marginTop: '3px' }}
              size={funcRegistry.params ? 'medium' : 'small'}
              // label="Choose Patient"
              displayEmpty
            >
              <MenuItem
                value=""
                sx={{ color: 'rgb(120,120,120)', fontStyle: 'italic' }}
              >
                Choose Patient
              </MenuItem>
              {libraryRegistry?.mockData?.map((mockData) => (
                <MenuItem key={mockData.id} value={mockData.id}>
                  {mockData.label}
                </MenuItem>
              ))}
            </Select>

            {funcRegistry.params ? (
              <ParameterizedForm
                functionRegistry={funcRegistry}
                onExecute={onExecute}
              />
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => onExecute()}
                sx={{ marginTop: '10px' }}
              >
                Submit
              </Button>
            )}

            {result && (
              <Box
                component="pre"
                sx={{
                  border: '1px solid rgb(230,230,230)',
                  padding: '10px',
                  fontSize: '13px',
                  background: 'rgb(245,245,245)',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              padding: '15px',
              borderBottom: '1px solid rgb(230,230,230)',
              fontWeight: 'bold',
            }}
          >
            Library Overview
          </Box>
          <Box
            sx={{
              color: 'rgb(100,100,100)',
              padding: '10px 10px 5px 10px',
              fontSize: '13px',
              textTransform: 'uppercase',
            }}
          >
            {rootLibraries.length} configured libraries
          </Box>
          {rootLibraries.map((library) => (
            <Box sx={{ padding: '3px 10px' }}>
              {library.label}{' '}
              <Box
                component="span"
                sx={{ color: 'secondary.main', fontSize: '14px' }}
              >
                [{library.libraryId}]
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}
