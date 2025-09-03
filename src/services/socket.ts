import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  
  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      autoConnect: true,
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
