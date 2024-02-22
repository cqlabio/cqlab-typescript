import { render } from '@testing-library/react';

import FlowDiagram from './flow-diagram';

describe('FlowDiagram', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowDiagram />);
    expect(baseElement).toBeTruthy();
  });
});
