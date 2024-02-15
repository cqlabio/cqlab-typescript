import Box from '@mui/material/Box';

type PanelLabelProps = {
  label: string;
};

export function PanelLabel({ label }: PanelLabelProps) {
  return (
    <Box
      sx={{
        marginTop: '20px',
        fontWeight: 300,
        fontSize: '12px',
        textTransform: 'uppercase',
        color: 'rgb(130,130,130)',
      }}
    >
      {label}
    </Box>
  );
}
