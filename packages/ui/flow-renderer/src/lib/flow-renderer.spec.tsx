import { render } from '@testing-library/react';

import FlowRenderer from './flow-renderer';

describe('FlowRenderer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlowRenderer />);
    expect(baseElement).toBeTruthy();
  });
});
