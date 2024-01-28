import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// import { ExecFlowNode } from "../../types/flowNodeTypes";
// import { IYesNoStep, IndexAnswer, TernaryEnum } from "../../types/flowStepTypes";

import {
  IYesNoStep,
  TernaryEnum,
  IYesNoAnswer,
  AnswerTypeEnum,
} from '@cqlab/cqflow-core';

type IYesNoStepProps = {
  step: IYesNoStep;
  onUpdateAnswer: (stepId: string, answer: IYesNoAnswer) => void;
  stepIndex: number;
  // onDeleteAnswer: (stepId: string) => void;
};

export default function IYesNoStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: // onDeleteAnswer,
IYesNoStepProps) {
  // const value =
  // typeof execAnswer?.answer === 'boolean'
  //   ? execAnswer?.answer
  //     ? 'yes'
  //     : 'no'
  //   : null;

  let value = null;
  if (step.answer?.value === TernaryEnum.TRUE) {
    value = 'yes';
  } else if (step.answer?.value === TernaryEnum.FALSE) {
    value = 'no';
  }

  const handleChange = function (event: SelectChangeEvent) {
    // const selectedId = event.target.value as string;
    // const nextIndex = definition.options.findIndex(o => o.nextId === selectedId);
    // if (nextIndex === -1) {
    //   onDeleteAnswer(step.stepId)
    // } else {
    //   onUpdateAnswer(step.stepId, { answerType: 'Index', index: nextIndex})
    // }
  };

  const onChooseAnswer = (
    event: React.MouseEvent<HTMLElement>,
    nextValue: string
  ) => {
    if (nextValue === 'yes') {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.TRUE,
      });
    } else if (nextValue === 'no') {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.YesNo,
        value: TernaryEnum.FALSE,
      });
    }

    // updateAnswer(executionStepYesNo.id, {
    //   stepId: executionStepYesNo.id,
    //   type: executionStepYesNo.type,
    //   answer: nextValue === 'yes',
    // });
  };

  const deleteAnswer = () => {
    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.YesNo,
      value: TernaryEnum.UNKNOWN,
    });
  };

  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box sx={{ fontSize: '15px' }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>{step.label}</Box>

          <Box
            sx={{
              maxWidth: '35%',
              paddingRight: '0px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {value && (
              <Box
                onClick={deleteAnswer}
                sx={{
                  color: 'rgb(150,150,150)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginRight: '8px',
                  ':hover': {
                    color: 'rgb(100,100,100)',
                  },
                }}
              >
                Clear
              </Box>
            )}

            <Box>
              <ToggleButtonGroup
                color="info"
                value={value}
                exclusive
                onChange={onChooseAnswer}
                size="small"
              >
                <ToggleButton value="no">No</ToggleButton>
                <ToggleButton value="yes">Yes</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>
      </Box>
    </InteractiveStepWrapper>
  );
}
