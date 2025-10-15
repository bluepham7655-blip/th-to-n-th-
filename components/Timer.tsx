
import React, { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 120; // 2 minutes warning

  return (
    <div className={`p-2 rounded-lg text-white font-bold text-lg shadow-md transition-colors ${
        isWarning ? 'bg-red-500 animate-pulse' : 'bg-gray-700'
      }`}
    >
      <i className="far fa-clock mr-2"></i>
      <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
      {isWarning && timeLeft > 0 && <span className="ml-2 text-sm">(Sắp hết giờ!)</span>}
    </div>
  );
};

export default Timer;
