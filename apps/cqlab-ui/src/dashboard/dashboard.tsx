import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const apps = [
  {
    link: '/flow',
    name: 'CQFlow',
    text: 'The primary application for authoring flow diagrams and clinical rules.',
  },
  {
    link: '/define',
    name: 'CQDefine',
    text: 'View the currently configured logic libraries that execute against data sources.',
  },
  {
    link: '/vocabulary',
    name: 'CQVocabulary',
    text: 'View configured value sets and codes used by the logic in CQDefine.',
  },
  {
    link: '/mock-data',
    name: 'CQMockData',
    text: 'View and manage mock data used for testing and development.',
  },
];

export function AppDashboard() {
  return (
    <Box
      sx={{
        maxWidth: '1000px',
        margin: '50px auto',
      }}
    >
      <h2 style={{ fontFamily: 'Red Hat Display' }}>CQLab Applications</h2>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {apps.map((app) => (
          <Link to={app.link} style={{ textDecoration: 'none', width: '45%' }}>
            <Paper
              sx={{
                padding: '30px',
                marginBottom: '30px',
                ':hover': {
                  backgroundColor: 'rgb(240,240,240)',
                },

                //
              }}
            >
              <Box
                sx={{
                  fontWeight: 'bold',
                  paddingBottom: '5px',
                  fontFamily: 'Red Hat Display',
                }}
              >
                {app.name}
              </Box>
              {app.text}
            </Paper>
          </Link>
        ))}
      </Box>
    </Box>
  );
}
