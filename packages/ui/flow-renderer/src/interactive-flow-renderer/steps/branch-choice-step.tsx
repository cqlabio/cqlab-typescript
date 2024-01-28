import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';

// import { BranchChoiceNode } from "../../types/flowNodeTypes";
// import { IBranchChoiceStep, IndexAnswer } from "../../types/flowStepTypes";
import {
  IBranchChoiceStep,
  IOptionAnswer,
  AnswerTypeEnum,
} from '@cqlab/cqflow-core';
import { AutoResolvedLabel } from './common/auto-resolved-label';

type BranchChoiceStepProps = {
  step: IBranchChoiceStep;
  onUpdateAnswer: (stepId: string, answer: IOptionAnswer) => void;
  stepIndex: number;
};

export function BranchChoiceStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: BranchChoiceStepProps) {
  const isRadio = false;

  // const value = Number.isInteger(step?.answer?.value)
  //   ? step.options[step?.answer?.value as number].id
  //   : null;

  const handleChange = function (event: SelectChangeEvent) {
    const selectedId = event.target.value as string;
    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.SingleOption,
      selectedId: selectedId || '',
    });
  };

  const wasAutoResolved = !!step.evaluation;

  const topRightLabel = wasAutoResolved && <AutoResolvedLabel />;

  const value = step.evaluation
    ? step.evaluation.selectedId
    : step?.answer?.selectedId || '';

  return (
    <InteractiveStepWrapper stepIndex={stepIndex} topRightLabel={topRightLabel}>
      <Box sx={{ fontSize: '15px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>{step.label}</Box>

          <Box sx={{ maxWidth: '35%', paddingRight: '0px' }}>
            {isRadio ? (
              <RadioGroup
                value={value}
                onChange={handleChange}
                sx={{ '.MuiRadio-root': { padding: '6px 9px' } }}
              >
                {step.options.map((answer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id}
                    labelPlacement="start"
                    control={<Radio size="small" color="info" />}
                    label={<Box sx={{ fontSize: '14px' }}>{answer.label}</Box>}
                  />
                ))}
              </RadioGroup>
            ) : (
              <Select
                fullWidth
                value={value || ''}
                disabled={wasAutoResolved}
                onChange={handleChange}
                sx={{ minWidth: '100px', background: 'white' }}
                size="small"
                displayEmpty
                color="info"
              >
                <MenuItem
                  value=""
                  sx={{ color: 'rgb(120,120,120)', fontStyle: 'italic' }}
                >
                  Choose One
                </MenuItem>
                {step.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Box>
        </Box>

        {/* <SupportingEvidence
      cqlExecutionResults={executionStepUserDecision.supportingEvidence}
    /> */}
      </Box>
    </InteractiveStepWrapper>
  );
}
