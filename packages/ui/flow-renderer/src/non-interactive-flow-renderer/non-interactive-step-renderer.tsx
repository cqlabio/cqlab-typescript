import Box from '@mui/material/Box';

import ExecStepExplanation from './step-explanations/exec-step-explanation';
import { EmitDataStepExplanation } from './step-explanations/context-data-step-explanation';
import { StartExplanation } from './step-explanations/start-step-explanation';
import { EndExplanation } from './step-explanations/end-step-explanation';

import { NarrativeExplanation } from './step-explanations/narrative-step-explanation';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// import IExecStep from "./steps/IExecStep";
// import IYesNoStep from "./steps/IYesNoStep";
// import HookStep from "./steps/HookStep";
// import IActionStep from "./steps/IActionStep";
// import CustomFormStep from "./steps/CustomFormStep";

import { IFlowStep, ImplementationNodeTypeEnum } from '@cqlab/cqflow-core';

import { useParams } from 'react-router-dom';

type StepRouterProps = {
  steps: IFlowStep[];
  highlightIds?: string[];
  // fetchWorkflow: () => void;
};

export function NonInteractiveStepRenderer({
  steps,
  highlightIds,
}: StepRouterProps) {
  const highlightIdSet = new Set(highlightIds || []);

  const stepViews = steps.map((step, index) => {
    let result = null;

    if (step.stepType === ImplementationNodeTypeEnum.Start) {
      result = <StartExplanation step={step} stepIndex={index} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.End) {
      result = <EndExplanation step={step} stepIndex={index} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.Exec) {
      result = <ExecStepExplanation step={step} stepIndex={index} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.EmitData) {
      result = (
        <EmitDataStepExplanation
          step={step}
          highlight={highlightIdSet.has(step.stepId)}
          stepIndex={index}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.Narrative) {
      result = <NarrativeExplanation step={step} stepIndex={index} />;
    } else {
      result = <div>Not FOUND</div>;
    }
    return (
      <Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1 }}>{result}</Box>
        </Box>

        {/* {index < steps.length - 1 && (
          <Box sx={{ padding: '5px 0 0px 0', textAlign: 'center' }}>
            <ArrowDownwardIcon sx={{ color: 'rgb(140,140,140)' }} />
          </Box>
        )} */}
      </Box>
    );
  });

  return (
    <Box sx={{ paddingTop: '20px', paddingBottom: '10px' }}>{stepViews}</Box>
  );
}
