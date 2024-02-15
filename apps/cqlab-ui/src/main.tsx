import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CQFlowList } from './cqflow/flow-list/cqflow-list';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './app/theme';
import { AppDashboard } from './dashboard/dashboard';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './data/queries';
import { FlowDesigner } from './cqflow/flow-designer/flow-designer';
import { CQDefine } from './cqdefine/cqdefine';
import { CQVocabulary } from './cqvocabulary/cqvocabulary';
import { ValueSetList } from './cqvocabulary/value-set-list';
import { ValueSetDetails } from './cqvocabulary/value-set-details';
import { CodeList } from './cqvocabulary/code-list';
import { MockData } from './cqmockdata/mock-data';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        // element: <Navigate to="/flow" />,
        element: <AppDashboard />,
      },

      {
        path: '/flow',
        element: <CQFlowList />,
      },
      {
        path: '/flow/:flowDefinitionId',
        element: <FlowDesigner />,
      },
      {
        path: '/define',
        element: <CQDefine />,
      },
      {
        path: '/vocabulary',
        element: <CQVocabulary />,

        children: [
          {
            path: 'value-sets',
            element: <ValueSetList />,
          },
          {
            path: 'value-sets/:valueSetId',
            element: <ValueSetDetails />,
          },
          {
            path: 'codes',
            element: <CodeList />,
          },
        ],
      },
      {
        path: '/mock-data',
        element: <MockData />,
      },
      // {
      //   path: '/llm',
      //   element: <LLMViewer />,
      // },
      // {
      //   path: '/calculator',
      //   element: <Calculator />,
      // },
    ],
  },
  // {
  //   path: '/login',
  //   element: <Login />,
  // },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
