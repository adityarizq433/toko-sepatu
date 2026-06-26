import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = null;

    const connectSocket = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api$/, '');
          if (!newSocket) {
            newSocket = io(socketUrl);
            setSocket(newSocket);

            newSocket.on('connect', () => {
              newSocket.emit('register', parsedUser.id);
            });

            newSocket.on('order_updated', (data) => {
              toast.success(data.message, {
                duration: 5000,
                icon: '📦',
                style: {
                  background: '#000',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                },
              });
              window.dispatchEvent(new CustomEvent('orderUpdated', { detail: data }));
            });
          }
        } catch(e) {
            console.error('Socket connect error', e);
        }
      } else {
        if (newSocket) {
          newSocket.disconnect();
          newSocket = null;
          setSocket(null);
        }
      }
    };

    connectSocket();
    window.addEventListener('authStateChanged', connectSocket);

    return () => {
      window.removeEventListener('authStateChanged', connectSocket);
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
