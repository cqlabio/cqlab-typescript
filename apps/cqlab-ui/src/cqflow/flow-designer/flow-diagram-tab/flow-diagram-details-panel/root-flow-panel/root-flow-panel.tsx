import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PanelLabel } from '../common/panel-label';
import { PanelNodeLabel } from '../common/panel-node-label';
import { PanelNodeId } from '../common/panel-node-id';
import { useFlowStore } from '../../../../flow-store';
import { PanelWrapper } from '../common/panel-wrapper';
import { ValidationPanel } from './validation-panel';
import { validateFlowDefinition } from '../../../../../data/do-validation';
import { FlowDefinitionTypeEnum, IFlowDefinition } from '@cqlab/cqflow-core';
import { FlowDesignerContext } from '../../../flow-designer-context';
import {
  useUpdateFlowDefinitionMutation,
  useDeleteFlowDefinitionMutation,
} from '../../../../../data/queries';

const tabConfig = ['Flow Overview', 'Settings'];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box sx={{ height: '100%' }} hidden={value !== index} {...other}>
      {value === index && children}
    </Box>
  );
}

export function RootFlowPanel() {
  const navigate = useNavigate();
  const { flowDefinition } = useContext(FlowDesignerContext);
  const { mutate: updateFlowDefinition } = useUpdateFlowDefinitionMutation();
  const [tabIndex, setTabIndex] = useState(0);
  const { mutateAsync: deleteFlowDefinition } =
    useDeleteFlowDefinitionMutation();

  const flowImplementation = useFlowStore((state) => state.flowImplementation);

  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const validationResult = validateFlowDefinition(
    flowDefinition
    // flowImplementation
  );

  // const handleTypeChange = function (event: SelectChangeEvent) {
  //   const newType = event.target.value as FlowDefinitionTypeEnum;
  //   updateFlowDefinition({
  //     ...flowDefinition,
  //     type: newType,
  //   });
  // };
  // <PanelWrapper label="root">

  const deleteFlow = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this flow? This aciton can not be undone.'
    );
    if (!confirmed) {
      return;
    }

    deleteFlowDefinition(flowDefinition.id).then(() => {
      navigate('/');
    });
    // axios.delete(`/api/flows/${flowDefinition.id}`).then((res) => {
    //   navigate('/');
    // });
  };

  return (
    <Box>
      {/* <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab label="Overview" />
        <Tab label="Validation" />
      </Tabs> */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          // justifyContent: 'space-between',
          borderBottom: '1px solid rgb(230,230,230)',
          // padding: '10px',
        }}
      >
        {tabConfig.map((tab, index) => (
          <Box
            onClick={() => setTabIndex(index)}
            sx={{
              textTransform: 'uppercase',
              fontFamily: 'Red Hat Display',
              // paddingLeft: '10px',
              fontSize: '12px',
              fontWeight: 700,
              color: index === tabIndex ? 'rgb(70,70,70)' : 'rgb(150,150,150)',
              padding: '10px 10px',
              borderRight: '1px solid rgb(230,230,230)',
              cursor: 'pointer',
              ':hover': {
                color: 'rgb(70,70,70)',
              },
            }}
          >
            {tab}
          </Box>
        ))}
      </Box>

      <TabPanel value={value} index={0}>
        <Box sx={{ padding: '0px 10px' }}>
          {tabIndex === 0 && (
            <>
              <PanelLabel label="Bind Id" />
              {flowDefinition.bindId}
            </>
          )}

          {tabIndex === 1 && (
            <>
              <PanelLabel label="Delete" />
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={deleteFlow}
                sx={{ marginTop: '5px' }}
              >
                Delete Flow
              </Button>
            </>
          )}
        </Box>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ValidationPanel validationResults={validationResult} />
      </TabPanel>
    </Box>
  );
}
