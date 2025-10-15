import React, { useState, useEffect } from 'react';
import { Station, AnswerSheet, QuestionType } from '../types';
import Timer from '../components/Timer';
import { STATIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StationPageProps {
  stationId: Station['id'];
  onComplete: (stationId: Station['id'], score: number, timeTaken: number, answers: AnswerSheet) => void;
}

const ChartDisplay: React.FC<{ stationId: Station['id'] }> = ({ stationId }) => {
    const commonProps = { width: 500, height: 300, margin: { top: 5, right: 30, left: 20, bottom: 5 } };
    switch (stationId) {
        case 'physics':
            const vData = Array.from({ length: 5 }, (_, i) => ({ t: i, v: 3*i*i - 12*i + 9 }));
            return (
                 <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-center text-blue-600">Đồ thị Vận tốc - Thời gian (v-t)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vData} {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" label={{ value: 'Thời gian (s)', position: 'insideBottom', offset: -5 }}/>
                            <YAxis label={{ value: 'Vận tốc (m/s)', angle: -90, position: 'insideLeft' }}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="v" fill="#3b82f6" name="Vận tốc" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        case 'economics':
             const lData = Array.from({ length: 10 }, (_, i) => ({ x: i*20, L: 60*(i*20) - 5000 }));
            return (
                 <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-center text-amber-600">Đồ thị Lợi nhuận - Sản lượng (L-x)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={lData} {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="x" label={{ value: 'Sản lượng (m)', position: 'insideBottom', offset: -5 }}/>
                            <YAxis label={{ value: 'Lợi nhuận (nghìn đồng)', angle: -90, position: 'insideLeft' }}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="L" fill="#d97706" name="Lợi nhuận" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        case 'chemistry':
            const cData = Array.from({ length: 10 }, (_, i) => ({ t: i, C: i * Math.exp(-i * 0.5) }));
             return (
                 <div className="p-4 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-2 text-center text-green-600">Đồ thị Nồng độ thuốc - Thời gian (C-t)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={cData} {...commonProps}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="t" label={{ value: 'Thời gian (giờ)', position: 'insideBottom', offset: -5 }}/>
                            <YAxis label={{ value: 'Nồng độ (mg/L)', angle: -90, position: 'insideLeft' }}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="C" fill="#16a34a" name="Nồng độ" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            );
        default: return null;
    }
}

const StationPage: React.FC<StationPageProps> = ({ stationId, onComplete }) => {
  const station = STATIONS[stationId];
  const [answers, setAnswers] = useState<AnswerSheet>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());
  const DURATION = 900; // 15 minutes

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    station.questions.forEach((q) => {
      if(Array.isArray(q.answer)) {
        if (q.answer.includes(answers[q.id]?.trim())) {
            currentScore++;
        }
      } else {
         if (answers[q.id]?.trim().toLowerCase() === String(q.answer).toLowerCase()) {
            currentScore++;
         }
      }
    });
    setScore(currentScore);
    setIsSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    onComplete(stationId, currentScore, timeTaken, answers);
  };
  
  useEffect(() => {
    // Auto-submit when submitted state changes, to handle timer time-up
    if (isSubmitted) {
        // This is a bit redundant but ensures the final answers are captured
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${station.color}`}>{station.icon}</div>
            <div>
              <h1 className={`text-3xl font-bold ${station.accentColor}`}>{station.name}</h1>
              <p className="text-gray-600">{station.description}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
             <Timer duration={DURATION} onTimeUp={() => !isSubmitted && handleSubmit()} />
          </div>
        </div>

        {!isSubmitted ? (
          <div className="space-y-8">
            {station.questions.map((q, index) => (
              <div key={q.id} className="bg-gray-50 p-6 rounded-lg">
                <p className="font-semibold text-lg text-gray-800 mb-4">{`Câu ${index + 1}: ${q.text}`}</p>
                {q.type === QuestionType.MULTIPLE_CHOICE && q.options && (
                  <div className="space-y-2">
                    {q.options.map((option) => (
                      <label key={option} className="flex items-center p-3 rounded-md hover:bg-gray-200 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className={`form-radio h-5 w-5 ${station.accentColor.replace('text-','ring-')}`}
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === QuestionType.FILL_IN_BLANK && (
                  <input
                    type="text"
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Nhập câu trả lời của bạn..."
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
             <ChartDisplay stationId={station.id} />
            <button
              onClick={handleSubmit}
              className={`w-full py-3 text-lg font-bold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 ${station.color}`}
            >
              Nộp bài
            </button>
          </div>
        ) : (
          <div className="text-center animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-800">Hoàn thành!</h2>
            <p className="text-xl mt-2">
              Điểm của bạn: <span className={`${station.accentColor} font-bold`}>{score} / {station.questions.length}</span>
            </p>
            <div className="mt-8 text-left space-y-6">
              <h3 className="text-2xl font-semibold border-b pb-2">Đáp án & Giải thích chi tiết</h3>
              {station.questions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg bg-gray-50 border-l-4" style={{ borderColor: (Array.isArray(q.answer) ? q.answer.includes(answers[q.id]?.trim()) : answers[q.id]?.trim().toLowerCase() === String(q.answer).toLowerCase()) ? '#22c55e' : '#ef4444' }}>
                  <p className="font-semibold text-gray-800">{`Câu ${index + 1}: ${q.text}`}</p>
                  <p className="text-sm mt-2">
                    Câu trả lời của bạn: <span className="font-mono p-1 bg-gray-200 rounded text-sm">{answers[q.id] || 'Chưa trả lời'}</span>
                  </p>
                  <p className="text-sm mt-1">
                    Đáp án đúng: <span className="font-mono p-1 bg-green-100 text-green-800 rounded text-sm">{Array.isArray(q.answer) ? q.answer.join(', '): q.answer}</span>
                  </p>
                  <p className="mt-2 pt-2 border-t text-gray-600 text-sm">
                    <strong className="text-gray-800">Giải thích:</strong> {q.explanation}
                  </p>
                </div>
              ))}
            </div>
             <div className="mt-8"><ChartDisplay stationId={station.id} /></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationPage;
