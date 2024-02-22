import { memo } from 'react';
import RectangleDiagramNode from './common/rectangle-node';
import { IFlowDefinitionNode, ISubFlowNode } from '@cqlab/cqflow-core';
import { NodeProps } from 'reactflow';
import { FlowNodeData } from '../convert-nodes-and-edges';
// import { useFlowDefinition } from '../../../../../apps/cqflow-frontend/src/data/queries';
// import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { FlowDefinitionName } from './subflow-query/flow-definition-name';
import { queryClient } from './subflow-query/subflow-query';
type InputNodeProps = NodeProps<FlowNodeData<ISubFlowNode>>;

export const SubFlowNode = memo(
  ({ data, isConnectable, ...rest }: InputNodeProps) => {
    const navigate = useNavigate();

    const { node, validationStatus, editMode } = data;

    // const { data: subFlowDefinition, isFetching } = useFlowDefinition(
    //   node.subFlowId
    // );

    // const onRouteSubflow = () => {
    //   navigate(`/configure/${subFlowDefinition?.id}`);
    // };

    // const subFlowLabel = subFlowDefinition
    //   ? subFlowDefinition.bindId
    //   : node.subFlowId;

    return (
      <RectangleDiagramNode
        title="Sub-Flow"
        color="#D12733"
        flowNode={node}
        validationStatus={validationStatus}
        editMode={editMode}
      >
        <QueryClientProvider client={queryClient}>
          <FlowDefinitionName flowId={node.subFlowId} />
        </QueryClientProvider>
        {/* <Box sx={{ textAlign: 'center' }}>
          {subFlowDefinition ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {subFlowDefinition.bindId}
              <InsertLinkIcon
                onClick={onRouteSubflow}
                sx={{
                  marginLeft: '4px',
                  color: '#1E88E5',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              />
            </Box>
          ) : (
            <Box>{node.subFlowId}</Box>
          )}
        </Box> */}
      </RectangleDiagramNode>
    );
  }
);
