import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { products } from "./models/products";
import { categories } from "./models/categories";
import { orders } from "./models/orders";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected");
    
    socket.emit("initial_data", {
      products,
      categories,
      orders
    });
    
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    // Return a mock object to prevent crash when deployed on serverless / Vercel
    return {
      emit: (event: string, data: any) => {
        console.log(`[Socket Mock] Event "${event}" emitted on serverless`);
        return true;
      }
    } as any;
  }
  return io;
};
