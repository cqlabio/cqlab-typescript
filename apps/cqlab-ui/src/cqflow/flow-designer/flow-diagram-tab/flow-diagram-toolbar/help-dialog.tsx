import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { NODES } from './flow-diagram-toolbar';
import HelpIcon from '@mui/icons-material/HelpCenterOutlined';

type HelpDialogProps = {
  isOpen: boolean;
  onToggleOpen: () => void;
};

export function HelpDialog({ isOpen, onToggleOpen }: HelpDialogProps) {
  return (
    <Dialog open={isOpen} fullWidth maxWidth="md" onClose={onToggleOpen}>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {' '}
        <HelpIcon sx={{ marginRight: '10px', color: '#1E88E5' }} /> Toolbar Help
      </DialogTitle>
      <DialogContent
        sx={{
          borderTop: '1px solid rgb(230,230,230)',
          padding: '20px',
          background: 'rgb(250,250,250)',
        }}
      >
        {NODES.map((nodeSection) => (
          <Box>
            <Box
              sx={{
                fontWeight: 'bold',
                fontSize: '13px',
                textTransform: 'uppercase',
                marginTop: '15px',
              }}
            >
              <Box sx={{ fontFamily: 'Red Hat Display' }}>
                {nodeSection.label}
              </Box>
            </Box>
            {nodeSection.children.map((node) => (
              <Box sx={{ display: 'flex', paddingBottom: '5px' }}>
                <Box
                  sx={{
                    color: 'secondary.main',
                    marginRight: '10px',
                    minWidth: '100px',
                    fontFamily: 'Red Hat Display',
                  }}
                >
                  {node.label}
                </Box>
                {node.description}
              </Box>
            ))}
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onToggleOpen} color="secondary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
