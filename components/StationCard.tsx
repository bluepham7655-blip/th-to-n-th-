
import React from 'react';
import { Station } from '../types';

interface StationCardProps {
  station: Station;
  onSelect: (id: Station['id']) => void;
  isLocked: boolean;
}

const StationCard: React.FC<StationCardProps> = ({ station, onSelect, isLocked }) => {
  return (
    <div className={`rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 ${isLocked ? 'grayscale filter cursor-not-allowed bg-gray-300' : `${station.color} cursor-pointer`}`}>
      <div className="p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className={`p-4 rounded-full ${station.color} bg-opacity-75`}>
            {station.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">{station.name}</h3>
            <p className="text-sm opacity-90">{station.description}</p>
          </div>
        </div>
      </div>
      <div className="bg-white p-6">
        <button
          onClick={() => onSelect(station.id)}
          disabled={isLocked}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
            isLocked ? 'bg-gray-400' : `${station.color} hover:bg-opacity-80`
          }`}
        >
          {isLocked ? 'Đã khóa' : 'Bắt đầu trạm'}
        </button>
      </div>
    </div>
  );
};

export default StationCard;
