import React from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL as string;

export const socket = io(SOCKET_URL);

if(!socket) {
    throw new Error("Socket connection failed");
    }

export const SocketContext = React.createContext(socket);