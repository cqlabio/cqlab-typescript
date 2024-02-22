import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import { IExecStep, TernaryEnum } from '@cqlab/cqflow-core';
import { AutoResolvedLabel } from './common/auto-resolved-label';

type ExecStepProps = {
  step: IExecStep;
  onUpdateAnswer: (stepId: string, answer: any) => void;
  stepIndex: number;
};

export default function ExecStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: ExecStepProps) {
  let value = null;

  if (step.evaluation === TernaryEnum.TRUE) {
    value = 'yes';
  } else if (step.evaluation === TernaryEnum.FALSE) {
    value = 'no';
  } else if (step.answer?.value === TernaryEnum.TRUE) {
    value = 'yes';
  } else if (step.answer?.value === TernaryEnum.FALSE) {
    value = 'no';
  }

  const onChooseAnswer = (
    event: React.MouseEvent<HTMLElement>,
    nextValue: string
  ) => {
    if (nextValue === 'yes') {
      onUpdateAnswer(step.stepId, {
        answerType: 'YesNo',
        value: TernaryEnum.TRUE,
      });
    } else if (nextValue === 'no') {
      onUpdateAnswer(step.stepId, {
        answerType: 'YesNo',
        value: TernaryEnum.FALSE,
      });
    }
  };

  const deleteAnswer = () => {
    if (step.evaluation === TernaryEnum.UNKNOWN) {
      onUpdateAnswer(step.stepId, {
        answerType: 'YesNo',
        value: TernaryEnum.UNKNOWN,
      });
    }
  };

  const wasAutoResolved = step.evaluation !== TernaryEnum.UNKNOWN;

  const topRightLabel = wasAutoResolved && <AutoResolvedLabel />;

  const extraData = step.supplementalData && (
    <Box
      component="pre"
      sx={{
        padding: '5px',
        margin: 0,
        background: 'rgb(255,255,255)',
        fontSize: '13px',
      }}
    >
      {JSON.stringify(step.supplementalData, null, 2)}
    </Box>
  );

  return (
    <InteractiveStepWrapper
      stepIndex={stepIndex}
      topRightLabel={topRightLabel}
      extraDataLabel="Supplemental Data"
      extraData={extraData}
    >
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
            {!wasAutoResolved && value && (
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
              {wasAutoResolved ? (
                <ToggleButtonGroup
                  color="info"
                  value={value}
                  exclusive
                  onChange={onChooseAnswer}
                  size="small"
                  disabled={wasAutoResolved}
                  sx={{
                    '.Mui-selected': {
                      background: 'rgb(240,240,240)',
                      color: 'rgba(0, 0, 0, 0.54);',
                    },
                  }}
                >
                  <ToggleButton value="no">No</ToggleButton>
                  <ToggleButton value="yes">Yes</ToggleButton>
                </ToggleButtonGroup>
              ) : (
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
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </InteractiveStepWrapper>
  );
}
