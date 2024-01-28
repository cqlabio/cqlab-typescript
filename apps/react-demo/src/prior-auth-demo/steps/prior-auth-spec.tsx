import { DisplayFlowDiagram } from '@cqlab/ui-flow-diagram';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
// import flowDefinition from '../prior-auth-flow-def';

import { InteractiveBreastCancerScreening as flowDefinition } from '../prior-auth-flow-def';

import { ReactFlowProvider } from 'reactflow';

export function PriorAuthSpec() {
  return (
    <Box>
      <Paper sx={{ padding: '1px 15px 15px 15px' }}>
        <h2>A Prior Authorization Specification</h2>
        <p>
          An insurance company generally defines a{' '}
          <strong>set of requirements</strong> to determine what is needed to
          approve a prior authorization request for a medication or procedure
          based on a members particular insurance plan.
        </p>

        <p>
          There are several ways we can perform this task with CQLab. In this
          example, we will use a CQFlow to define a flow chart containing the
          decision points.
        </p>
      </Paper>

      <Paper sx={{ padding: '1px 15px 15px 15px', marginTop: '20px' }}>
        <h2>Flow Diagram of Prior Authorization Specification</h2>
        <p>
          Many times Prior Authorization documentation is provided as a text
          document or PDF. This approach may seem convenient at first, but tends
          to cause many issues down the road. For example, text documents tend
          to have ambiguity in how particular statements are written. They can
          be difficult to maintain and update. They also tend to be difficult to
          transform into a machine readable format.
        </p>
        <p>
          Using CQFlow, our first goal is to transform a text based
          specification into a structure that is{' '}
          <strong>less ambiguous and more machine readable</strong>.
        </p>
        <p>
          Below is a flow diagram that contains the decision points necessary to
          approve or reject a prior authorization request. Notice when reading
          the diagram that there is no ambiguity, and the exact steps required
          to approve or reject a request are clearly defined.
        </p>
        Include Diagram
        <ReactFlowProvider>
          <Box sx={{ height: '400px' }}>
            <DisplayFlowDiagram
              flowDefinition={flowDefinition}
              zoomOnScroll={false}
            />
          </Box>
        </ReactFlowProvider>
      </Paper>
    </Box>
  );
}
