import {
  useState,
  useMemo,
  useEffect,
  useContext,
  KeyboardEventHandler,
} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import { shallow } from 'zustand/shallow';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import ConstraintPill from '../../common/rowPills/ConstraintPill';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useFlowStore } from '../../../../../../flow-store';
import { FlowDesignerContext } from '../../../../../flow-designer-context';
// import PersonOutlinedIcon from '@mui/icons-material/ConfigureOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { ITrueFalseLeaf } from '@cqlab/cqflow-core';
import { UpdateLogicTreeNode } from './boolean-node';
import { EditableTextRow } from '../../../common/editable-text-row';
import CheckIcon from '@mui/icons-material/CheckOutlined';
import CancelIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Close';

type TrueFalseLeafProps = {
  leafNode: ITrueFalseLeaf;
  updateLogicTreeNode: UpdateLogicTreeNode;
};

export function TrueFalseLeafView({
  leafNode,
  updateLogicTreeNode,
}: TrueFalseLeafProps) {
  // const { flowDefinition, doNodeUpdates } = useContext(FlowDesignerContext);
  const setSelectedLeafNodeId = useFlowStore(
    (state) => state.setSelectedLeafNodeId
  );

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!leafNode.label) {
      setIsEditing(true);
    }
  }, [leafNode]);

  const toggleEdit = () => setIsEditing(!isEditing);

  const onDoneEditing = () => {
    updateLogicTreeNode(
      {
        ...leafNode,
        label: text,
      },
      null
    );

    toggleEdit();
  };

  const onTextBlur = () => {
    onDoneEditing();
  };

  const onInputChange = (e: any) => {
    setText(e.target.value);
  };

  const openNodeDetails = () => {
    setSelectedLeafNodeId(leafNode.id);
  };

  const onDelete = () => {
    updateLogicTreeNode(null, null);
  };

  const onStartEdit = () => {
    setText(leafNode.label || '');
    toggleEdit();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key === 'Enter') {
      onDoneEditing();
    }
  };

  if (isEditing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            autoFocus
            value={text}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            margin="dense"
            fullWidth
            multiline
            size="small"
          />
        </Box>

        <Box
          sx={{ paddingLeft: '10px', display: 'flex', alignItems: 'center' }}
        >
          <IconButton
            size="small"
            onClick={toggleEdit}
            sx={{ marginLeft: '5px', border: '1px solid rgb(220,220,220)' }}
          >
            <CancelIcon
              className="cancel-icon"
              sx={{
                color: 'rgb(150,150,150)',
                fontSize: '16px',
                ':hover': {
                  color: 'red',
                },
              }}
            />
          </IconButton>

          <IconButton
            size="small"
            onClick={onDoneEditing}
            sx={{
              marginLeft: '5px',
              border: '1px solid rgb(220,220,220)',
              ':hover': {
                // background: '#BBDEFB'
              },
            }}
          >
            <CheckIcon color="success" sx={{ fontSize: '16px' }} />
          </IconButton>
        </Box>
      </Box>
    );
    // return (
    //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //     <Box sx={{ padding: '7px 0 5px 0', flexGrow: 1 }}>
    //       <TextField
    //         multiline
    //         fullWidth
    //         size="small"
    //         label={`Label`}
    //         onChange={onInputChange}
    //         value={text}
    //         onBlur={onTextBlur}
    //         autoFocus
    //       />
    //     </Box>
    //     <Box sx={{ paddingLeft: '5px' }}>
    //       <IconButton size="small" onClick={onDoneEditing}>
    //         <DoneIcon sx={{ fontSize: '20px', color: '#4CAF50' }} />
    //       </IconButton>
    //     </Box>
    //   </Box>
    // );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        '.hoverIcon': {
          color: 'white',
        },

        ':hover .hoverIcon': {
          color: 'rgb(180,180,180)',
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          padding: '0 5px',
          fontSize: '14px',
          fontWeight: 300,
        }}
      >
        {leafNode.label}
      </Box>
      <Box
        sx={{
          marginTop: '3px',
          textAlign: 'right',
          display: 'flex',
          alignItems: 'start',
        }}
      >
        <DeleteOutlineIcon
          className="hoverIcon"
          onClick={onDelete}
          sx={{
            fontSize: '14px',
            color: 'rgb(180,180,180)',
            cursor: 'pointer',
            marginRight: '6px',
            ':hover': {
              color: '#EF5350 !important',
            },
          }}
        />

        <EditOutlinedIcon
          className="hoverIcon"
          onClick={onStartEdit}
          sx={{
            fontSize: '15px',
            color: 'rgb(180,180,180)',
            marginRight: '6px',
            cursor: 'pointer',
            ':hover': {
              color: '#FFC107 !important',
            },
          }}
        />
      </Box>

      <Box
        component="span"
        onClick={openNodeDetails}
        sx={{
          display: 'flex',
          height: '16px',
          borderRadius: '4px',
          alignItems: 'center',
          border: '1px solid rgb(230,230,230)',
          padding: '0 ',
          margin: '0',
          minWidth: '24px',
          cursor: 'pointer',
          textAlign: 'center',
          justifyContent: 'space-around',
        }}
      >
        <SettingsIcon sx={{ fontSize: '14px', color: '#1976D2' }} />
      </Box>

      {/* {node.nodeType === NodeTypeEnum.Exec && (
        <EvaluatePill onClick={openNodeDetails} />
      )}
    */}

      {/* <IconButton size="small" onClick={toggleEdit}> */}
      {/* 
    <IconButton size="small" onClick={openNodeDetails}>
        <EditOutlinedIcon sx={{ fontSize: '14px', color: 'rgb(150,150,150)' }} />
      </IconButton> */}
    </Box>
  );

  // return <Box>{node.referenceId}</Box>
}
