
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Lock, Unlock, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { lumi } from '../lib/lumi';

interface CreateRoomPageProps {
  currentUser: string;
}

const CreateRoomPage: React.FC<CreateRoomPageProps> = ({ currentUser }) => {
  const [roomName, setRoomName] = useState('');
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setAccessCode(code);
  };

  const handlePrivateToggle = (privateMode: boolean) => {
    setIsPrivate(privateMode);
    if (privateMode && !accessCode) {
      generateAccessCode();
    }
  };

  const copyAccessCode = () => {
    navigator.clipboard.writeText(accessCode);
    toast.success('접근 코드가 복사되었습니다');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (roomName.trim().length < 2) {
      toast.error('방 이름은 최소 2글자 이상이어야 합니다');
      return;
    }

    if (maxParticipants < 2 || maxParticipants > 50) {
      toast.error('참가자 수는 2명 이상 50명 이하여야 합니다');
      return;
    }

    setIsLoading(true);

    try {
      const roomData = {
        name: roomName.trim(),
        maxParticipants,
        isPrivate,
        ownerId: currentUser,
        participants: [currentUser],
        creator: currentUser,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(isPrivate && { accessCode })
      };

      const newRoom = await lumi.entities.rooms.create(roomData);
      
      toast.success('방이 성공적으로 생성되었습니다!');
      
      // 방 생성 후 즉시 채팅방으로 이동
      setTimeout(() => {
        navigate(`/chat/${newRoom._id}`);
      }, 500);
    } catch (error) {
      console.error('방 생성 오류:', error);
      toast.error('방 생성 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
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
            <h1 className="text-4xl font-bold text-white">새 방 만들기</h1>
            <p className="text-purple-200">채팅방 정보를 입력해주세요</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="glass-effect rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 방 이름 */}
            <div>
              <label className="block text-white font-semibold mb-2">
                방 이름
              </label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="방 이름을 입력하세요"
                maxLength={50}
                className="w-full px-4 py-3 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-2xl border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                disabled={isLoading}
              />
              <p className="text-purple-200 text-sm mt-1 text-right">
                {roomName.length}/50
              </p>
            </div>

            {/* 최대 참가자 수 */}
            <div>
              <label className="block text-white font-semibold mb-2">
                최대 참가자 수
              </label>
              <div className="flex items-center space-x-4">
                <Users className="w-5 h-5 text-purple-200" />
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-white bg-opacity-20 rounded-lg appearance-none cursor-pointer"
                  disabled={isLoading}
                />
                <span className="text-white font-semibold min-w-[3rem] text-center">
                  {maxParticipants}명
                </span>
              </div>
            </div>

            {/* 공개/비공개 설정 */}
            <div>
              <label className="block text-white font-semibold mb-4">
                방 공개 설정
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePrivateToggle(false)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    !isPrivate
                      ? 'border-green-400 bg-green-400 bg-opacity-20'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10'
                  }`}
                  disabled={isLoading}
                >
                  <Unlock className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-white font-semibold">공개</p>
                  <p className="text-purple-200 text-sm">누구나 입장 가능</p>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePrivateToggle(true)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isPrivate
                      ? 'border-purple-400 bg-purple-400 bg-opacity-20'
                      : 'border-white border-opacity-30 bg-white bg-opacity-10'
                  }`}
                  disabled={isLoading}
                >
                  <Lock className="w-8 h-8 mx-auto mb-2 text-white" />
                  <p className="text-white font-semibold">비공개</p>
                  <p className="text-purple-200 text-sm">코드로 입장</p>
                </motion.button>
              </div>
            </div>

            {/* 접근 코드 (비공개 방일 때만 표시) */}
            {isPrivate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-white font-semibold mb-2">
                  접근 코드
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={accessCode}
                    readOnly
                    className="flex-1 px-4 py-3 bg-white bg-opacity-20 text-white rounded-2xl border border-white border-opacity-30"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyAccessCode}
                    className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-2xl transition-all duration-300"
                  >
                    <Copy className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generateAccessCode}
                    className="px-4 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-2xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    새로 생성
                  </motion.button>
                </div>
                <p className="text-purple-200 text-sm mt-2">
                  이 코드를 친구들과 공유하여 방에 초대하세요
                </p>
              </motion.div>
            )}

            {/* 생성 버튼 */}
            <motion.button
              type="submit"
              disabled={isLoading || roomName.trim().length < 2}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>생성 중...</span>
                </div>
              ) : (
                '방 생성하기'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateRoomPage;
