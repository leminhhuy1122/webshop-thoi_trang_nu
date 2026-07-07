import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { RepositoryFactory } from '../repositories/RepositoryFactory';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', async (socket) => {
    console.log('Client kết nối Socket.io');
    
    try {
      const productRepo = RepositoryFactory.getProductRepository();
      const categoryRepo = RepositoryFactory.getCategoryRepository();
      const orderRepo = RepositoryFactory.getOrderRepository();

      // Lấy dữ liệu thực tế từ Database / JSON files
      const [productRes, categories, orders] = await Promise.all([
        productRepo.findMany({ limit: 1000 }),
        categoryRepo.findMany(),
        orderRepo.findMany()
      ]);

      socket.emit('initial_data', {
        products: productRes.products,
        categories,
        orders
      });
    } catch (err) {
      console.error('Lỗi tải dữ liệu ban đầu cho socket:', err);
    }
    
    socket.on('disconnect', () => {
      console.log('Client ngắt kết nối Socket.io');
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    // Trả về mock object khi chạy Vercel Serverless tránh crash sập luồng
    return {
      emit: (event: string, data: any) => {
        console.log(`[Socket Mock] Sự kiện "${event}" được kích hoạt trên Serverless`);
        return true;
      }
    } as any;
  }
  return io;
};
