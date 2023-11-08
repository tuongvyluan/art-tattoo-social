import { Card, CardBody } from "ui";
import React, { useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  removeElements,
} from 'react-flow-renderer';

const data = [
  {
    id: '1',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: '#6366F1',
      borderRadius: '0.5rem',
      border: 'none',
      color: 'white'
    },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: 'Another default node',
    },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  {
    id: '5',
    data: {
      label: 'Node id: 5',
    },
    position: { x: 250, y: 325 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  {
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
    style: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      background: 'rgba(255, 255, 255, 1)',
      borderRadius: '0.5rem',
      border: 'none'
    },
  },
  { id: 'e1-2', source: '1', target: '2', label: 'this is an edge label' },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    arrowHeadType: 'arrowclosed',
    label: 'edge with arrow head',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

const onLoad = (reactFlowInstance) => {
  console.log('flow loaded:', reactFlowInstance);
  reactFlowInstance.fitView();
};

const OverviewFlow = () => {
  const [elements, setElements] = useState(data);
  const onElementsRemove = (elementsToRemove) => setElements((els) => removeElements(elementsToRemove, els));
  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <div className="relative flex flex-row flex-auto -mx-4 -mt-4 h-workspace md:overflow-hidden" dir="ltr">
      <ReactFlow
        elements={elements}
        onElementsRemove={onElementsRemove}
        onConnect={onConnect}
        onLoad={onLoad}
        snapToGrid={true}
        snapGrid={[15, 15]}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default OverviewFlow;