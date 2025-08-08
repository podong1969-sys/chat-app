
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, Lock, Unlock, Key, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { lumi } from '../lib/lumi';
import { useRealTimeData } from '../hooks/useRealTimeData';

interface RoomsPageProps {
  currentUser: string;
}

const RoomsPage: React.FC<RoomsPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();

  // 실시간 방 데이터
  const {
    data: rooms,
    loading: roomsLoading,
    updateItem: updateRoom,
    refresh: refreshRooms
  } = useRealTimeData({
    entityName: 'rooms',
    pollInterval: 3000, // 3초마다 방 목록 업데이트
    filter: (room: any) => !room.isPrivate, // 공개 방만 표시
    sort: (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  });

  const handleJoinRoom = async (roomId: string, room: any) => {
    try {
      // 방이 가득 찬지 확인
      if ((room.participants?.length || 0) >= room.maxParticipants) {
        toast.error('방이 가득 찼습니다');
        return;
      }

      // 방 참가자 목록에 현재 사용자 추가
      const updatedParticipants = room.participants?.includes(currentUser) 
        ? room.participants 
        : [...(room.participants || []), currentUser];

      await updateRoom(roomId, {
        participants: updatedParticipants,
        updatedAt: new Date().toISOString()
      });

      navigate(`/chat/${roomId}`);
    } catch (error) {
      console.error('방 입장 오류:', error);
      toast.error('방에 입장하는 중 오류가 발생했습니다');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">채팅방</h1>
            <p className="text-purple-200">참여하고 싶은 방을 선택하세요</p>
          </div>
          
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshRooms}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center space-x-2"
              disabled={roomsLoading}
            >
              <RefreshCw className={`w-5 h-5 ${roomsLoading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/join-private')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <Key className="w-5 h-5" />
              <span>비공개 방 입장</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-room')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>새 방 만들기</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 로딩 상태 */}
        {roomsLoading && rooms.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* 방 목록 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="glass-effect rounded-3xl p-6 hover:bg-opacity-30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-white truncate flex-1">
                  {room.name}
                </h3>
                <div className="flex items-center space-x-2 ml-2">
                  {room.isPrivate ? (
                    <Lock className="w-5 h-5 text-purple-300" />
                  ) : (
                    <Unlock className="w-5 h-5 text-green-300" />
                  )}
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2 text-purple-200">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {room.participants?.length || 0}/{room.maxParticipants}명
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-purple-200">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(room.createdAt)}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJoinRoom(room._id, room)}
                disabled={(room.participants?.length || 0) >= room.maxParticipants}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 disabled:bg-opacity-10 text-white font-semibold py-3 px-4 rounded-2xl transition-all duration-300 disabled:cursor-not-allowed"
              >
                {(room.participants?.length || 0) >= room.maxParticipants ? '방이 가득참' : '입장하기'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* 빈 상태 */}
        {!roomsLoading && rooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 mx-auto text-purple-200 mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              아직 생성된 방이 없습니다
            </h3>
            <p className="text-purple-200 mb-6">
              첫 번째 채팅방을 만들어보세요!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create-room')}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300"
            >
              방 만들기
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;

