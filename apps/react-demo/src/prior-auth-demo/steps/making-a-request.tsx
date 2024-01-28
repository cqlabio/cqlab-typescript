import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

export function MakingAPriorAuthRequest() {
  return (
    <Box>
      <Paper sx={{ padding: '1px 15px 15px 15px' }}>
        <h2>Making a Request</h2>

        <p>
          There are different ways an electronic prior authorization request may
          be initiated and sent to an insurance company, including EHRs, third
          party applications, and proprietary systems.
        </p>

        <p>
          Regardless of the application that initiates them, prior authorization
          requests begin with a <strong>medicationID or procedureID</strong> and
          a <strong>memberID</strong>. Here is a simplified example request:
        </p>

        <pre style={{ background: 'rgb(250,250,250)' }}>
          <code style={{ padding: '5px' }}>
            {`{
    "memberID": "123456"
    "medicationID": "nurtec_1234",
}`}
          </code>
        </pre>
      </Paper>

      <Paper sx={{ padding: '1px 15px 15px 15px', marginTop: '30px' }}>
        <h2>Insurance Company On Receiving the Request</h2>
        <p>
          Once an insurance company receives the request, it performs several
          tasks:
        </p>
        <ol>
          <li>
            Using the <strong>memberID</strong>, the insurance company looks up
            the members insurance plan.
          </li>
          <li>
            Using a combination of both the plan and the requested medication or
            procedure, it looks up the corresponding rules defined in the prior
            auth specification.
          </li>
          <li>
            It then returns an electronic form to the caller that must be filled
            out by the provider validating that the member meets the
            requirements defined in the specification.
          </li>
        </ol>
      </Paper>

      <Paper sx={{ padding: '1px 15px 15px 15px', marginTop: '30px' }}>
        <h2>Returning the Form to the Request Caller</h2>

        <p>
          CQLab uses the specification created in the prior step to generate an
          electronic form automatically. This is the main advantage of creating
          the authorization rules in a machine readable format (as opposed to a
          text document or PDF).
        </p>

        <p>
          CQLab also provides the ability to greatly increase the efficiency of
          the process by auto-answering questions on the form using the
          patient's medical history if it is available.
        </p>
        <p>
          At times, this means a request can even be fully approved without
          requiring a provider to fill out the form at all. We will look at an
          example of this in the coming sections.
        </p>
      </Paper>
    </Box>
  );
}
