import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000';
  }

  connect(token) {
    if (this.socket) {
      if (this.socket.connected) return this.socket;
      this.socket.disconnect();
    }

    this.socket = io(this.baseUrl, {
      auth: { token },
      transports: ['websocket', 'polling'] // Try WebSocket first
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to server');
    });

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const socketClient = new SocketClient();
