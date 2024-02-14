import Box from '@mui/material/Box';
import { useContext } from 'react';
import { LaunchInteractive } from './launch-interactive/launch-interactive';
import { CqFlowLaunchOneshot } from './launch-oneshot/cqflow-launch-oneshot';
import { FlowDefinitionTypeEnum } from '@cqlab/cqflow-core';
import { FlowDesignerContext } from '../flow-designer-context';
import { FlowImplementationNotFound } from '../../../common/flow-implementation-not-found';
import { LaunchDefaultInteractive } from './launch-default-interactive/launch-default-interactive';

export function FlowLaunchTab() {
  const { flowDefinition, flowImplementation } =
    useContext(FlowDesignerContext);

  if (!flowImplementation) {
    return <LaunchDefaultInteractive flowDefinition={flowDefinition} />;
  }

  if (flowImplementation?.type === FlowDefinitionTypeEnum.NonInteractive) {
    return <CqFlowLaunchOneshot flow={flowDefinition} />;
  }

  return <LaunchInteractive flow={flowDefinition} />;
}
