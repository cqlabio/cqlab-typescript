const TOKEN_KEY = 'cqflow-token';
const FLOW_SERVERS = 'cqflow-flow-servers';
const SELECTED_SERVER = 'cqflow-selected-server';

export function getWebToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setWebToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearWebToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function setFlowServers(servers: string[]) {
  localStorage.setItem(FLOW_SERVERS, JSON.stringify(servers));
}

export function getFlowServers(): string[] {
  let servers: string[] = [];
  const found = localStorage.getItem(FLOW_SERVERS);
  if (found) {
    try {
      servers = JSON.parse(found);
    } catch (e) {
      console.error('unable to load servers');
    }
  }
  return Array.isArray(servers) ? servers : [];
}

export function setSelectedServer(server: string | null) {
  localStorage.setItem(SELECTED_SERVER, server || '');
}

export function getSelectedServer(): string | null {
  return localStorage.getItem(SELECTED_SERVER) || null;
}
