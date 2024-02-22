import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import { NewFlowDialog } from './new-flow-dialog';
import { UploadFlowDialog } from './upload-flow-dialog';
import { ChatGPTDialog } from './chatgpt-dialog';
import dayjs from 'dayjs';
import { useFlowDefinitions, useSeedDb } from '../../data/queries';
// import { MdLaunch } from 'react-icons/md';
import CreateIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../data/axios-instance';

const MAX_WIDTH = 1200;

export function CQFlowList() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);

  const { status, data: flows, error, isFetching } = useFlowDefinitions();
  const { mutate: onSeedDb } = useSeedDb();

  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleUploadOpen = () => setIsUploadOpen(!isUploadOpen);
  const toggleChatDialog = () => setIsChatDialogOpen(!isChatDialogOpen);

  // const fetchFlows = useCallback(() => {
  //   axios.get('api/flow').then((res) => {
  //     setFlows(res.data);
  //   });
  // }, [setFlows]);

  // useEffect(() => {
  //   if (!isOpen && !isUploadOpen) {
  //     fetchFlows();
  //   }
  // }, [isOpen, isUploadOpen]);

  if (!flows && isFetching) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: '45px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          fontSize: '16px',
        }}
      >
        <CircularProgress size={24} /> Loading...
      </Box>
    );
  } else if (!flows) {
    return (
      <Box sx={{ padding: '15px' }}>
        Error: Unable to fetch flows {error ? `: ${JSON.stringify(error)}` : ''}
      </Box>
    );
  }

  return (
    <Box sx={{ padding: '15px' }}>
      {flows.length === 0 && (
        <Box
          sx={{
            maxWidth: `${MAX_WIDTH}px`,
            margin: '30px auto',
            background: '#E1F5FE',
            padding: '15px',
            display: 'flex',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            No flows found were found in your environment. Would you like to
            populate your local database with some examples from the CQExamples
            package? These can easily be deleted later if you wish.
          </Box>
          <Box sx={{ minWidth: '200px' }}>
            <Button variant="contained" color="info" onClick={() => onSeedDb()}>
              Generate Examples
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ textAlign: 'right' }}>
        {/* <Button onClick={toggleUploadOpen} sx={{ marginRight: '5px' }}>
          Upload From Definition
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={toggleChatDialog}
          sx={{ marginRight: '5px' }}
        >
          ChatGPT
        </Button> */}
      </Box>
      <Paper
        sx={{
          maxWidth: `${MAX_WIDTH}px`,
          margin: '30px auto',
          a: { textDecoration: 'none', color: 'inherit' },
        }}
      >
        <Box
          sx={{
            padding: '18px 15px',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgb(230,230,230)',
            fontSize: '18px',
          }}
        >
          <Box>
            {/* <Box component="span" sx={{ color: 'secondary.main' }}>
              CQ
            </Box> */}
            Flow Dashboard
          </Box>
          <Button
            variant="contained"
            size="small"
            onClick={toggleOpen}
            sx={{ marginLeft: '30px' }}
            startIcon={<CreateIcon />}
          >
            Create New Flow
          </Button>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Flow ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                {/* <TableCell sx={{ fontWeight: 'bold' }}>Initial Data</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Launch</TableCell> */}
              </TableRow>
            </TableHead>

            <TableBody>
              {flows.map((flow, index) => (
                <TableRow id={index + '_'}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {/* */}
                    <Link to={`/flow/${flow.id}`}>
                      <Box
                        sx={{
                          ':hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {flow.bindId || flow.id}
                      </Box>
                    </Link>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {dayjs(flow.createdAt).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell sx={{ display: 'flex' }}>
                    <Link to={`/flow/${flow.id}`}>
                      <Box
                        sx={{
                          display: 'flex',
                          padding: '2px 12px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          alignItems: 'center',
                          border: '1px solid rgb(220,220,220)',
                          ':hover': {
                            backgroundColor: 'rgb(240,240,240)',
                          },
                        }}
                      >
                        {/* <MdLaunch style={{ color: '#D12733' }} /> */}
                        <Box
                          sx={{
                            marginLeft: '5px',
                            textTransform: 'uppercase',
                            fontSize: '13px',
                          }}
                        >
                          Open
                        </Box>
                      </Box>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* 
        <Box>
          {flows.map((flow) => (
            <Box key={flow.id}>
              <Link to={`/configure/${flow.id}`}>
                {flow.flowDefinition.bindId || flow.id}
              </Link>
            </Box>
          ))}
        </Box> */}
      </Paper>

      <NewFlowDialog isOpen={isOpen} onToggleOpen={toggleOpen} />

      <UploadFlowDialog isOpen={isUploadOpen} onToggleOpen={toggleUploadOpen} />
      <ChatGPTDialog
        isOpen={isChatDialogOpen}
        onToggleOpen={toggleChatDialog}
      />
    </Box>
  );
}
