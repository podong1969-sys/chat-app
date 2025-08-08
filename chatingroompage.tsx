
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { lumi } from '../lib/lumi';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface ChatRoomPageProps {
  currentUser: string;
}

interface Message {
  _id: string;
  senderId: string;
  senderNickname: string;
  content: string;
  createdAt: string;
}

const ChatRoomPage: React.FC<ChatRoomPageProps> = ({ currentUser }) => {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingRoom, setIsLoadingRoom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 실시간 메시지 데이터
  const {
    data: messages,
    loading: messagesLoading,
    createItem: createMessage,
    refresh: refreshMessages
  } = useRealTimeData({
    entityName: 'messages',
    pollInterval: 1500, // 1.5초마다 새 메시지 확인
    filter: (msg: any) => msg.roomId === roomId,
    sort: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  });

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRoomData = async () => {
    try {
      const { list: rooms } = await lumi.entities.rooms.list();
      const currentRoom = rooms.find((r: any) => r._id === roomId);
      
      if (!currentRoom) {
        toast.error('방을 찾을 수 없습니다');
        navigate('/rooms');
        return;
      }

      setRoom(currentRoom);
    } catch (error) {
      console.error('방 정보 조회 오류:', error);
      toast.error('방 정보를 불러오는 중 오류가 발생했습니다');
    } finally {
      setIsLoadingRoom(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim().length === 0) {
      return;
    }

    if (newMessage.length > 100) {
      toast.error('메시지는 100글자를 초과할 수 없습니다');
      return;
    }

    setIsSending(true);

    try {
      const userNickname = localStorage.getItem('chatUserNickname') || '익명';
      
      const messageData = {
        roomId: roomId!,
        senderId: currentUser,
        senderNickname: userNickname,
        content: newMessage.trim(),
        creator: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await createMessage(messageData);
      setNewMessage('');
      
      // 메시지 전송 후 즉시 스크롤
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast.error('메시지 전송 중 오류가 발생했습니다');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '오늘';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    } else {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (isLoadingRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-effect p-4 flex items-center justify-between"
      >
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/rooms')}
            className="mr-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold text-white">{room?.name}</h1>
            <div className="flex items-center space-x-2 text-purple-200">
              <Users className="w-4 h-4" />
              <span className="text-sm">
                {room?.participants?.length || 0}/{room?.maxParticipants}명
              </span>
            </div>
          </div>
        </div>
        
        {/* 새로고침 버튼 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={refreshMessages}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
          disabled={messagesLoading}
        >
          <RefreshCw className={`w-5 h-5 text-white ${messagesLoading ? 'animate-spin' : ''}`} />
        </motion.button>
      </motion.div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="glass-effect rounded-3xl p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-white mb-2">
                첫 번째 메시지를 보내보세요!
              </h3>
              <p className="text-purple-200">
                이 방에서 나누는 첫 대화가 될 것입니다
              </p>
            </div>
          </motion.div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUser;
            const showDate = index === 0 || 
              formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt);

            return (
              <div key={message._id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="bg-white bg-opacity-20 text-purple-200 px-4 py-2 rounded-full text-sm">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`chat-bubble max-w-xs lg:max-w-md ${
                    isCurrentUser 
                      ? 'bg-purple-500 bg-opacity-80 text-white' 
                      : 'glass-effect text-white'
                  } rounded-2xl p-4`}>
                    {!isCurrentUser && (
                      <p className="text-purple-200 text-sm font-semibold mb-1">
                        {message.senderNickname}
                      </p>
                    )}
                    <p className="break-words">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      isCurrentUser ? 'text-purple-100' : 'text-purple-300'
                    }`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="p-4"
      >
        <form onSubmit={handleSendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="메시지를 입력하세요... (최대 100글자)"
              maxLength={100}
              className="w-full px-4 py-3 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-2xl border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 pr-16"
              disabled={isSending}
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200 text-sm">
              {newMessage.length}/100
            </span>
          </div>
          
          <motion.button
            type="submit"
            disabled={isSending || newMessage.trim().length === 0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 text-white p-3 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <Send className="w-6 h-6" />
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ChatRoomPage;
