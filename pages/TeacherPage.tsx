import React, { useState } from 'react';
import { GroupResult, User, Role, StationId, AnswerSheet } from '../types';
import { STATIONS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { generateAIFeedback } from '../services/geminiService';

interface TeacherPageProps {
    results: GroupResult[];
    setResults: React.Dispatch<React.SetStateAction<GroupResult[]>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const DetailsModal: React.FC<{ result: GroupResult, onClose: () => void }> = ({ result, onClose }) => {
    const station = STATIONS[result.stationId];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4 border-b pb-2">
                    <h2 className="text-2xl font-bold text-gray-800">Chi tiết bài làm - {result.groupId}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                <div className="space-y-4">
                    {station.questions.map((q, index) => {
                        const userAnswer = result.answers[q.id] || 'Chưa trả lời';
                        const isCorrect = Array.isArray(q.answer)
                            ? q.answer.map(a => a.toLowerCase()).includes(userAnswer.trim().toLowerCase())
                            : String(q.answer).toLowerCase() === userAnswer.trim().toLowerCase();

                        return (
                            <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                                <p className="font-semibold text-gray-800">{`Câu ${index + 1}: ${q.text}`}</p>
                                <p className="text-sm mt-2">
                                    Trả lời của nhóm: <span className="font-mono p-1 bg-gray-200 rounded text-sm">{userAnswer}</span>
                                </p>
                                {!isCorrect && (
                                    <p className="text-sm mt-1">
                                        Đáp án đúng: <span className="font-mono p-1 bg-green-100 text-green-800 rounded text-sm">{Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</span>
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


const TeacherPage: React.FC<TeacherPageProps> = ({ results, setResults, users, setUsers }) => {
    const students = users.filter(u => u.role === Role.STUDENT);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [detailedResult, setDetailedResult] = useState<GroupResult | null>(null);
    const [aiFeedbacks, setAiFeedbacks] = useState<Record<string, string>>({});
    const [isLoadingAi, setIsLoadingAi] = useState<string | null>(null);

    const groups = Array.from(new Set(students.map(s => s.group)));

    const getGroupResults = (groupId: string) => results.filter(r => r.groupId === groupId);

    const aggregateResults = groups.map(group => {
        // FIX: Corrected typo in function call from getGroupresults to getGroupResults.
        const groupResults = getGroupResults(group);
        const totalScore = groupResults.reduce((acc, r) => acc + r.score, 0);
        const totalQuestions = groupResults.reduce((acc, r) => acc + STATIONS[r.stationId].questions.length, 0);
        const avgAccuracy = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;
        return {
            name: group,
            accuracy: parseFloat(avgAccuracy.toFixed(2)),
        };
    });
    
    const pieData = Object.values(StationId).map(id => ({
        name: STATIONS[id as StationId].name,
        value: results.filter(r => r.stationId === id).length
    }));

    const handleDeleteStudent = (userId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xoá học sinh này?')) {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        }
    };

    const handleClearData = () => {
        if (window.confirm('Hành động này sẽ XOÁ TOÀN BỘ KẾT QUẢ và DANH SÁCH HỌC SINH đã tham gia. Hành động này không thể hoàn tác. Bạn có chắc chắn muốn tiếp tục?')) {
            setResults([]);
            setUsers(prevUsers => prevUsers.filter(u => u.role !== Role.STUDENT));
        }
    };

    const handleDeleteResult = (groupId: string, stationId: StationId) => {
        if (window.confirm(`Bạn có chắc chắn muốn xoá kết quả của ${groupId} tại trạm ${STATIONS[stationId].name}?`)) {
            setResults(prevResults => prevResults.filter(r => !(r.groupId === groupId && r.stationId === stationId)));
        }
    };
    
    const handleGenerateFeedback = async (result: GroupResult) => {
        const resultId = `${result.groupId}-${result.stationId}`;
        setIsLoadingAi(resultId);
        try {
            const station = STATIONS[result.stationId];
            const feedback = await generateAIFeedback(station.name, result.score, station.questions.length, result.timeTaken);
            setAiFeedbacks(prev => ({ ...prev, [resultId]: feedback }));
        } catch (error) {
            console.error(error);
            setAiFeedbacks(prev => ({ ...prev, [resultId]: "Lỗi khi tạo nhận xét." }));
        } finally {
            setIsLoadingAi(null);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {detailedResult && <DetailsModal result={detailedResult} onClose={() => setDetailedResult(null)} />}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Bảng điều khiển của Giáo viên</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Tổng quan Hoàn thành Trạm</h2>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name}: ${(Number(percent ?? 0) * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                             <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Độ chính xác trung bình của các nhóm</h2>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={aggregateResults}>
                            <XAxis dataKey="name" />
                            <YAxis unit="%" />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Bar dataKey="accuracy" fill="#8884d8" name="Độ chính xác" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Kết quả chi tiết theo Nhóm</h2>
                <div className="flex space-x-2 mb-4">
                    {groups.map(group => (
                        <button key={group} onClick={() => setSelectedGroup(group)} className={`px-4 py-2 rounded-md ${selectedGroup === group ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                            {group}
                        </button>
                    ))}
                </div>
                {selectedGroup && (
                    <div className="mt-4 animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-2">Kết quả của {selectedGroup}</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạm</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm số</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian (giây)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {getGroupResults(selectedGroup).length > 0 ? getGroupResults(selectedGroup).map(result => {
                                        const resultId = `${result.groupId}-${result.stationId}`;
                                        return (
                                        <React.Fragment key={resultId}>
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{STATIONS[result.stationId].name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.score} / {STATIONS[result.stationId].questions.length}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.timeTaken}s</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.submittedAt.toLocaleString('vi-VN')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button onClick={() => setDetailedResult(result)} className="text-indigo-600 hover:text-indigo-900">Xem chi tiết</button>
                                                    <button 
                                                        onClick={() => handleGenerateFeedback(result)} 
                                                        className="text-purple-600 hover:text-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center"
                                                        disabled={isLoadingAi !== null}
                                                    >
                                                        {isLoadingAi === resultId ? (
                                                            <><i className="fas fa-spinner fa-spin mr-2"></i> Đang tạo...</>
                                                        ) : (
                                                            'Nhận xét AI'
                                                        )}
                                                    </button>
                                                    <button onClick={() => handleDeleteResult(result.groupId, result.stationId)} className="text-red-600 hover:text-red-900">Xoá</button>
                                                </td>
                                            </tr>
                                            {aiFeedbacks[resultId] && (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-3 bg-gray-50">
                                                        <div className="flex items-start space-x-3">
                                                            <i className="fas fa-robot text-purple-500 mt-1"></i>
                                                            <p className="text-sm text-gray-700 italic">{aiFeedbacks[resultId]}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                        )
                                    }) : (
                                        <tr><td colSpan={5} className="text-center py-4">Chưa có kết quả cho nhóm này.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Quản lý Lớp học</h2>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Danh sách Học sinh đã tham gia</h3>
                    <div className="max-h-64 overflow-y-auto border rounded-md">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nhóm</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-sm">{s.name}</td>
                                        <td className="px-4 py-2 text-sm">{s.group}</td>
                                        <td className="px-4 py-2 text-sm">
                                            <button onClick={() => handleDeleteStudent(s.id)} className="text-red-500 hover:text-red-700">Xoá</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                         </table>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
                <h2 className="text-2xl font-semibold mb-4 text-red-600">Khu vực nguy hiểm</h2>
                <p className="text-gray-600 mb-4">Hành động này sẽ xóa vĩnh viễn tất cả kết quả và danh sách học sinh đã tham gia. Hãy chắc chắn trước khi tiếp tục.</p>
                <button onClick={handleClearData} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700">
                    <i className="fas fa-trash-alt mr-2"></i>Xoá Toàn bộ Dữ liệu
                </button>
            </div>
        </div>
    );
};

export default TeacherPage;