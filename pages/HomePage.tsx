
import React from 'react';
import { StationId, User } from '../types';
import { STATIONS } from '../constants';
import StationCard from '../components/StationCard';

interface HomePageProps {
  user: User | null;
  onSelectStation: (stationId: StationId) => void;
  completedStations: StationId[];
}

const HomePage: React.FC<HomePageProps> = ({ user, onSelectStation, completedStations }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">Luyện tập - Vận dụng Đạo hàm</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Chào mừng bạn đến với buổi học tương tác! Hãy khám phá sức mạnh của đạo hàm qua 3 trạm ứng dụng thực tiễn trong Vật lý, Kinh tế và Hóa học.
        </p>
      </div>

      {user ? (
        <>
           <div className="text-center mb-8 bg-white p-4 rounded-lg shadow-md inline-block">
             <p className="text-xl text-gray-700">Xin chào, <strong className="text-indigo-600">{user.name}</strong>!</p>
             <p className="text-md text-gray-500">Nhóm: {user.group} - Lớp: {user.class}</p>
           </div>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(STATIONS).map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onSelect={onSelectStation}
                isLocked={completedStations.includes(station.id)}
              />
            ))}
          </div>
           {completedStations.length === 3 && (
                <div className="mt-12 text-center p-6 bg-green-100 text-green-800 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold">Chúc mừng!</h2>
                    <p>Bạn đã hoàn thành tất cả các trạm. Hãy xem kết quả của nhóm mình nhé!</p>
                </div>
           )}
        </>
      ) : (
        <div className="text-center p-6 bg-yellow-100 text-yellow-800 rounded-lg shadow-md">
          <p className="text-xl font-semibold">Vui lòng đăng nhập để bắt đầu làm việc.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
