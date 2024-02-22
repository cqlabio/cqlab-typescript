import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { LibraryFunctionRegistry } from '@cqlab/cqdefine';

type ParameterizedFormProps = {
  functionRegistry: LibraryFunctionRegistry;
  onExecute: (parameters: any) => void;
};

export function ParameterizedForm({
  functionRegistry,
  onExecute,
}: ParameterizedFormProps) {
  const [formData, setFormData] = useState(null);

  const onSubmit = (data: IChangeEvent, e: any) => {
    onExecute(data.formData);
  };

  const onChange = (e: IChangeEvent) => {
    setFormData(e.formData);
  };

  useEffect(() => {
    setFormData(null);
  }, [functionRegistry]);

  return (
    <Box
      sx={{
        '.MuiGrid-item': {
          paddingTop: '5px',
        },
        // May run into issue with other buttons
        '.MuiButtonBase-root': {
          position: 'relative',
          top: '-15px',
        },
      }}
    >
      <Form
        schema={functionRegistry.params}
        validator={validator}
        formData={formData}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </Box>
  );
}
