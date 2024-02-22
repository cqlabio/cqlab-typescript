import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useVocabularyValueSets } from '../data/queries-flow-implementation';
// import { useFlowStore } from '../flow/flow-store';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { FlowImplementationNotFound } from '../common/flow-implementation-not-found';
import { useFlowStore } from '../cqflow/flow-store';

export function CQVocabulary() {
  const navigate = useNavigate();
  const location = useLocation();

  const flowImplementationServerUrl = useFlowStore(
    (state) => state.flowImplementationServerUrl
  );

  let selectedTab = -1;

  if (location.pathname.includes('value-sets')) {
    selectedTab = 0;
  } else if (location.pathname.includes('codes')) {
    selectedTab = 1;
  } else {
    return <Navigate to="/vocabulary/value-sets" replace />;
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      return navigate('/vocabulary/value-sets');
    } else if (newValue === 1) {
      return navigate('/vocabulary/codes');
    }
  };

  return (
    <Box>
      <Paper>
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="secondary"
          indicatorColor="secondary"
        >
          <Tab label="Value Sets" />
          <Tab label="Codes" />
          {/* <Tab label="Flow Expanded" /> */}
        </Tabs>
      </Paper>

      {!flowImplementationServerUrl ? (
        <FlowImplementationNotFound
          flowImplementationServerUrl={flowImplementationServerUrl}
        />
      ) : (
        <Box sx={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Outlet />
        </Box>
      )}
    </Box>
  );
}
