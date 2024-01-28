import Box from '@mui/material/Box';

import Paper from '@mui/material/Paper';

export function PriorAuthSummary() {
  return (
    <Box>
      <Paper sx={{ padding: '1px 15px 15px 15px' }}>
        <h2>Summary</h2>
        <p>
          In this walkthrough, we covered the basics of prior authorization and
          how CQLab can be used to document and automate the request process.
          {/* As a quick recap, we covered the  */}
        </p>
      </Paper>
    </Box>
  );
}
