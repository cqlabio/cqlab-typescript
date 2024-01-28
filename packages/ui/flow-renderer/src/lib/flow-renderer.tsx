import styles from './flow-renderer.module.css';

/* eslint-disable-next-line */
export interface FlowRendererProps {}

export function FlowRenderer(props: FlowRendererProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to FlowRenderer!</h1>
    </div>
  );
}

export default FlowRenderer;
