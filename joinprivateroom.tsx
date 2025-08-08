
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Key, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { lumi } from '../lib/lumi';

interface JoinPrivateRoomPageProps {
  currentUser: string;
}

const JoinPrivateRoomPage: React.FC<JoinPrivateRoomPageProps> = ({ currentUser }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (accessCode.trim().length < 3) {
      toast.error('접근 코드를 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const { list: allRooms } = await lumi.entities.rooms.list();
      const targetRoom = allRooms.find((room: any) => 
        room.isPrivate && room.accessCode === accessCode.trim().toUpperCase()
      );

      if (!targetRoom) {
        toast.error('유효하지 않은 접근 코드입니다');
        setIsLoading(false);
        return;
      }

      // 방이 가득 찬지 확인
      if ((targetRoom.participants?.length || 0) >= targetRoom.maxParticipants) {
        toast.error('방이 가득 차서 입장할 수 없습니다');
        setIsLoading(false);
        return;
      }

      // 이미 참가 중인지 확인
      if (targetRoom.participants?.includes(currentUser)) {
        navigate(`/chat/${targetRoom._id}`);
        return;
      }

      // 방 참가자 목록에 현재 사용자 추가
      const updatedParticipants = [...(targetRoom.participants || []), currentUser];

      await lumi.entities.rooms.update(targetRoom._id, {
        participants: updatedParticipants,
        updatedAt: new Date().toISOString()
      });

      toast.success(`${targetRoom.name} 방에 입장했습니다!`);
      navigate(`/chat/${targetRoom._id}`);
    } catch (error) {
      console.error('비공개 방 입장 오류:', error);
      toast.error('방 입장 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/rooms')}
            className="mr-4 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-white">비공개 방 입장</h1>
            <p className="text-purple-200">접근 코드를 입력해주세요</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-effect rounded-3xl p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-8"
          >
            <Key className="w-16 h-16 mx-auto text-white mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">접근 코드 입력</h2>
            <p className="text-purple-200">
              방 생성자로부터 받은 코드를 입력하세요
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <input
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                placeholder="접근 코드를 입력하세요"
                maxLength={10}
                className="w-full px-4 py-4 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-2xl border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300 text-center text-xl font-mono tracking-wider"
                disabled={isLoading}
              />
            </motion.div>

            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              type="submit"
              disabled={isLoading || accessCode.trim().length < 3}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>입장하기</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-6 p-4 bg-white bg-opacity-10 rounded-2xl"
          >
            <p className="text-purple-200 text-sm text-center">
              💡 접근 코드는 대소문자를 구분하지 않습니다
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinPrivateRoomPage;

