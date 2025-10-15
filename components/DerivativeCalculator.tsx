
import React, { useState } from 'react';
import { calculateDerivative } from '../services/geminiService';

const DerivativeCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCalculate = async () => {
    if (!expression) return;
    setIsLoading(true);
    setResult('');
    const derivative = await calculateDerivative(expression);
    setResult(derivative);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-110 z-50"
        aria-label="Mở máy tính đạo hàm"
      >
        <i className="fas fa-calculator"></i>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Máy tính đạo hàm Mini</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-800">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="expression" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập biểu thức (theo biến t)
            </label>
            <input
              type="text"
              id="expression"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Ví dụ: t^3 - 6*t^2 + 9*t + 2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            onClick={handleCalculate}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 flex items-center justify-center"
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fas fa-equals mr-2"></i>
            )}
            {isLoading ? 'Đang tính...' : 'Tính đạo hàm'}
          </button>
          {result && (
            <div className="mt-4 p-3 bg-gray-100 rounded-md">
              <p className="text-sm font-medium text-gray-700">Kết quả đạo hàm:</p>
              <p className="text-lg font-mono text-indigo-600 break-words">{result}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DerivativeCalculator;
