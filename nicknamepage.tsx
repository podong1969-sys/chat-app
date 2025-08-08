
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { lumi } from '../lib/lumi';

interface NicknamePageProps {
  setCurrentUser: (user: string) => void;
}

const NicknamePage: React.FC<NicknamePageProps> = ({ setCurrentUser }) => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname.trim().length < 2) {
      toast.error('닉네임은 최소 2글자 이상이어야 합니다');
      return;
    }

    if (nickname.length > 20) {
      toast.error('닉네임은 20글자를 초과할 수 없습니다');
      return;
    }

    setIsLoading(true);

    try {
      // 닉네임 중복 검사
      const { list: existingUsers } = await lumi.entities.users.list();
      const isDuplicate = existingUsers.some((user: any) => 
        user.nickname?.toLowerCase() === nickname.trim().toLowerCase()
      );

      if (isDuplicate) {
        toast.error('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.');
        setIsLoading(false);
        return;
      }

      // 새 사용자 생성
      const newUser = await lumi.entities.users.create({
        nickname: nickname.trim(),
        isOnline: true,
        lastSeen: new Date().toISOString(),
        creator: nickname.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      localStorage.setItem('chatUser', newUser._id);
      localStorage.setItem('chatUserNickname', nickname.trim());
      setCurrentUser(newUser._id);
      
      toast.success(`환영합니다, ${nickname.trim()}님!`);
      navigate('/rooms');
    } catch (error) {
      console.error('닉네임 설정 오류:', error);
      toast.error('닉네임 설정 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="glass-effect rounded-3xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <User className="w-16 h-16 mx-auto text-white mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">닉네임 설정</h1>
            <p className="text-purple-200">채팅에서 사용할 닉네임을 입력해주세요</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                className="w-full px-4 py-3 bg-white bg-opacity-20 text-white placeholder-purple-200 rounded-2xl border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-300"
                disabled={isLoading}
              />
              <p className="text-purple-200 text-sm mt-2 text-right">
                {nickname.length}/20
              </p>
            </motion.div>

            <motion.button
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              type="submit"
              disabled={isLoading || nickname.trim().length < 2}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>확인</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default NicknamePage;
