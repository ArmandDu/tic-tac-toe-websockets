import io from "socket.io";

interface SocketIOClientWrapper<T extends Record<string, any>>
  extends SocketIOClient.Socket {
  on<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;
  off<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;
  once<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;

  emit<K extends keyof T>(event: K, data: T[K]): this;
}

export interface SocketIOWrapper<T extends Record<any, any>> extends io.Socket {
  on<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;
  off<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;
  once<K extends keyof T>(event: K, cb: (data: T[K]) => void): this;

  emit<K extends keyof T>(event: K, data: T[K]): boolean;
}

export function wrapClientSocket<T>(
  io: SocketIOClientStatic
): (opts?: SocketIOClient.ConnectOpts) => SocketIOClientWrapper<T> {
  return io as any;
}

export function wrapServerSocket<T>(client: io.Socket): SocketIOWrapper<T> {
  return client as any;
}
