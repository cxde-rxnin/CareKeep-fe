import { io, Socket } from 'socket.io-client';
// import useAuth from '../store/authStore';

class SocketService {
  private socket: Socket | null = null;
  
  connect(tokenOverride?: string) {
    if (this.socket?.connected) return;
    // Get token from store if not provided
    let token = tokenOverride;
    if (!token) {
      try {
        // Avoid hook-in-component violation by using getState
        // @ts-ignore
        token = require('../store/authStore').default.getState().token;
      } catch {}
    }
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      autoConnect: true,
      query: token ? { token } : undefined,
    });
    this.socket.on('connect', () => {
      console.log('🔌 Connected to WebSocket server');
    });
    this.socket.on('disconnect', () => {
      console.log('🔌 Disconnected from WebSocket server');
    });
    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
    });
    return this.socket;
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.socket) this.connect();
    this.socket?.on(event, callback);
  }
  off(event: string, callback?: (...args: any[]) => void) {
    this.socket?.off(event, callback);
  }
  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
