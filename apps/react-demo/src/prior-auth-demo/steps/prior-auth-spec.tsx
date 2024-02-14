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
          Therefore the first step in improving the prior authorization is for
          an insurance company to define these requirements in a 
          consistent and clear way. Ideally these requirements should be 
          easily accessible to all parties involved in the process.
        </p>

        <p>
          There are several tools we can use to perform this task with CQLab. In this
          example, we will use CQFlow to define a flow chart 
          containing <strong>decision points</strong> that will be used to determine if a
          prior authorization request should be approved or rejected.
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
          Using CQFlow, our first goal is create a
          specification that is{' '}
          <strong>unambiguous and machine readable</strong>.
        </p>
        <p>
          Below is a flow diagram that contains the decision points necessary to
          approve or reject a prior authorization request. Notice when reading
          the diagram that there is no ambiguity, and the exact steps required
          to approve or reject a request are clearly defined.
        </p>
        <ReactFlowProvider>
          <Box sx={{ height: '400px', border: '1px solid rgb(245,245,245)' }}>
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
