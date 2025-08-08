
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8"
        >
          <MessageCircle className="w-20 h-20 mx-auto mb-6 text-white" />
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-wider">
            AWESOME
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-purple-200 tracking-wider">
            CHAT
          </h2>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xl text-purple-100 mb-12 max-w-md mx-auto"
        >
          보라색 그라데이션의 아름다운 채팅 플랫폼에 오신 것을 환영합니다
        </motion.p>

        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/nickname')}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-4 px-12 rounded-full text-xl transition-all duration-300 glass-effect"
        >
          시작하기
        </motion.button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
