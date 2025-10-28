import { Socket } from "socket.io";
import { Peer, Room } from "./mediasoup";

export interface ClientData {
  socket: Socket;
  currentRoom?: Room;
  currentPeer?: Peer;
}