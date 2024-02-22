import Box from '@mui/material/Box';

type PanelLabelProps = {
  label: string;
};

export function PanelLabel({ label }: PanelLabelProps) {
  return (
    <Box
      sx={{
        marginTop: '20px',
        fontWeight: 500,
        fontSize: '12px',
        textTransform: 'uppercase',
        color: 'rgb(170,170,170)',
        fontFamily: 'Red Hat Display',
      }}
    >
      {label}
    </Box>
  );
}
