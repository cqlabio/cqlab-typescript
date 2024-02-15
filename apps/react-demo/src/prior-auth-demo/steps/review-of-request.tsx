import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

export function ReviewRequest() {
  return (
    <Box>
      <Paper sx={{ padding: '1px 15px 15px 15px' }}>
        <h2>Review of the Prior Authorization Request</h2>
        <p>
          After receiving the prior authorization request form from a healthcare
          provider, there are different ways an insurance company may decide to
          setup their prior authorization process for review. This may even vary
          significantly within a single company based on the medication or
          procedure requested. A medication requested less often and with a high
          cost may follow a different review process than a relatively
          inexpensive medication requested very commonly.
        </p>

        <p>
          In general though, the insurance company will have a dashboard of all
          requests that have been submitted. Some requests will be automatically
          approved or rejected, while others will be sent to a specialist for
          manual review.
        </p>

        <p>
          At times, there may need to be follow up requests for additional
          information or clarification creating delays. However, the more this
          can be reduced using the previous steps in this walkthrough, the more
          efficient and timely the overall process will be.
        </p>
      </Paper>
    </Box>
  );
}
