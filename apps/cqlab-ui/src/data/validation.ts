// lowercase letters, numbers, and underscores only
const FLOW_BIND_ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const NODE_BIND_ID_REGEX = /^[a-z0-9]+(_[a-z0-9]+)*$/;

export function validateFlowBindId(bindId: string): boolean {
  return FLOW_BIND_ID_REGEX.test(bindId);
}

export function validateNodeBindId(bindId: string): boolean {
  return NODE_BIND_ID_REGEX.test(bindId);
}
