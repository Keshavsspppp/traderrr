// lib/services/websocket.service.ts
import { Server } from 'socket.io'

export class WebSocketService {
  private io: Server
  
  constructor(server: any) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST']
      }
    })
    
    this.setupConnections()
  }
  
  private setupConnections() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)
      
      socket.on('subscribe-stock', (symbol: string) => {
        socket.join(`stock-${symbol}`)
      })
      
      socket.on('unsubscribe-stock', (symbol: string) => {
        socket.leave(`stock-${symbol}`)
      })
      
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  
  broadcastStockUpdate(symbol: string, price: number) {
    this.io.to(`stock-${symbol}`).emit('price-update', {
      symbol,
      price,
      timestamp: new Date()
    })
  }
}

// Hook for real-time updates
// hooks/useStockPrice.ts
export function useStockPrice(symbol: string) {
  const [price, setPrice] = useState<number>(0)
  const [change, setChange] = useState<number>(0)
  
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!)
    
    socket.emit('subscribe-stock', symbol)
    
    socket.on('price-update', (data) => {
      setPrice(prev => {
        setChange(data.price - prev)
        return data.price
      })
    })
    
    return () => {
      socket.emit('unsubscribe-stock', symbol)
      socket.disconnect()
    }
  }, [symbol])
  
  return { price, change }
}