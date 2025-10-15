import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Derivative calculator will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const calculateDerivative = async (expression: string): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Cannot calculate derivative.";
  }

  try {
    const prompt = `Tính đạo hàm của hàm số sau theo biến t: f(t) = ${expression}. Chỉ trả về biểu thức đạo hàm, không giải thích thêm.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error calculating derivative with Gemini:", error);
    return "Đã xảy ra lỗi khi tính toán. Vui lòng thử lại.";
  }
};

export const generateAIFeedback = async (stationName: string, score: number, totalQuestions: number, timeTaken: number): Promise<string> => {
  if (!API_KEY) {
    return "API Key not configured. Cannot generate feedback.";
  }

  try {
    const prompt = `Bạn là một giáo viên tận tâm. Dựa vào kết quả bài làm sau đây của một nhóm học sinh tại trạm '${stationName}', hãy đưa ra một nhận xét ngắn gọn (khoảng 2-3 câu) để khích lệ và chỉ ra điểm cần cải thiện nếu có.
    - Kết quả: ${score}/${totalQuestions} câu đúng.
    - Thời gian làm bài: ${timeTaken} giây.
    
    Hãy viết nhận xét với giọng văn thân thiện, tích cực.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating AI feedback:", error);
    return "Đã xảy ra lỗi khi tạo nhận xét. Vui lòng thử lại.";
  }
};
