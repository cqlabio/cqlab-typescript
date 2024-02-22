import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  ITextFieldStep,
  IFlowStepAnswer,
  AnswerTypeEnum,
  ActionStatusEnum,
} from '@cqlab/cqflow-core';
import TextField from '@mui/material/TextField';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';

type TextFieldStepProps = {
  step: ITextFieldStep;
  onUpdateAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
  stepIndex: number;
};

export function TextFieldStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: TextFieldStepProps) {
  const [val, setVal] = useState('');

  const onUpdate = () => {
    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.Text,
      value: val || null,
    });
  };

  const onInputChange = (e: any) => {
    setVal(e.target.value);
  };

  useEffect(() => {
    if (step.answer) {
      setVal(step.answer.value || '');
    }
  }, []);

  // Should be able to add a null value
  const disabledButton = val && step.answer?.value === val;

  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box sx={{ fontSize: '15px', display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>{step.label}</Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                sx={{ margin: 0 }}
                value={val}
                onChange={onInputChange}
                margin="dense"
                fullWidth
                variant="outlined"
                // color="secondary"
                size="small"
              />
            </Box>

            <Box sx={{ marginLeft: '5px' }}>
              <Button
                size="small"
                onClick={onUpdate}
                disabled={!!disabledButton}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </InteractiveStepWrapper>
  );
}
