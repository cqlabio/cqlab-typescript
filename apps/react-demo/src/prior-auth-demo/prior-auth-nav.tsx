import Box from '@mui/material/Box';

interface PriorAuthNavProps {
  stepNames: string[];
  onSelectStep: (index: number) => void;
  activeStep: number;
}

export function PriorAuthNav({
  stepNames,
  onSelectStep,
  activeStep,
}: PriorAuthNavProps) {
  return (
    <Box sx={{}}>
      {stepNames.map((stepName, index) => (
        <Box
          onClick={() => onSelectStep(index)}
          key={stepName}
          sx={{
            display: 'flex',
            paddingTop: '10px',
            cursor: 'pointer',
            color: index > activeStep ? 'rgb(130,130,130)' : 'black',

            borderRight:
              index === activeStep ? '2px solid #FFC400' : '2px solid white',
          }}
        >
          <Box sx={{ padding: '0 6px 0 15px', fontWeight: 'bold' }}>
            {index + 1})
          </Box>
          <Box sx={{ paddingRight: '5px' }}>{stepName}</Box>
        </Box>
      ))}
    </Box>
  );
}
