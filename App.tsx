import React, { useState } from 'react';
import { User, Role, StationId, GroupResult, AnswerSheet } from './types';
import { MOCK_USERS } from './constants';
import HomePage from './pages/HomePage';
import StationPage from './pages/StationPage';
import TeacherPage from './pages/TeacherPage';
import DerivativeCalculator from './components/DerivativeCalculator';
import { HomeIcon, ResultsIcon, TeacherIcon } from './components/Icons';

type Page = 'home' | 'results' | 'teacher' | StationId;

const App: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [groupResults, setGroupResults] = useState<GroupResult[]>([]);
    const [completedStations, setCompletedStations] = useState<StationId[]>([]);
    
    // State for the new login UI
    const [loginAs, setLoginAs] = useState<Role>(Role.STUDENT);
    const [studentName, setStudentName] = useState('');
    const [studentClass, setStudentClass] = useState('');
    const [studentGroup, setStudentGroup] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [teacherPassword, setTeacherPassword] = useState('');

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginAs === Role.STUDENT) {
            if (!studentName.trim() || !studentClass.trim() || !studentGroup.trim()) {
                alert('Vui lòng nhập đầy đủ Họ tên, Lớp và Nhóm.');
                return;
            }
            const newUser: User = {
                id: `sv-${Date.now()}`,
                name: studentName,
                class: studentClass,
                group: studentGroup,
                role: Role.STUDENT,
            };
            setUsers(prev => [...prev.filter(u => u.name !== newUser.name || u.role !== Role.STUDENT), newUser]);
            setCurrentUser(newUser);
            setCurrentPage('home');
        } else { // Role.TEACHER
            if (teacherPassword !== '123456') {
                alert('Mật khẩu không đúng!');
                return;
            }
            if (!teacherName.trim()) {
                alert('Vui lòng nhập Tên giáo viên.');
                return;
            }
            const teacherUser: User = {
                id: `gv-${teacherName.replace(/\s+/g, '')}`,
                name: teacherName,
                class: 'N/A',
                group: 'Giáo viên',
                role: Role.TEACHER,
            };
            setUsers(prev => {
                if (!prev.find(u => u.name === teacherUser.name && u.role === Role.TEACHER)) {
                    return [...prev, teacherUser];
                }
                return prev;
            });
            setCurrentUser(teacherUser);
            setCurrentPage('teacher');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentPage('home');
        setCompletedStations([]);
        setTeacherPassword('');
        setStudentName('');
        setStudentClass('');
        setStudentGroup('');
        setTeacherName('');
    };

    const handleSelectStation = (stationId: StationId) => {
        setCurrentPage(stationId);
    };

    const handleCompleteStation = (stationId: StationId, score: number, timeTaken: number, answers: AnswerSheet) => {
        if (!currentUser || currentUser.role !== Role.STUDENT) return;
        
        const newResult: GroupResult = {
            groupId: currentUser.group,
            stationId,
            answers,
            score,
            timeTaken,
            submittedAt: new Date(),
        };
        setGroupResults(prev => [...prev.filter(r => !(r.groupId === newResult.groupId && r.stationId === newResult.stationId)), newResult]);
        setCompletedStations(prev => [...new Set([...prev, stationId])]);
        setCurrentPage('home');
    };

    const renderPage = () => {
        if (!currentUser) return <HomePage user={null} onSelectStation={() => {}} completedStations={[]} />;

        if (currentPage === 'home') {
            return <HomePage user={currentUser} onSelectStation={handleSelectStation} completedStations={completedStations} />;
        }
        if (currentPage === 'teacher') {
            return <TeacherPage results={groupResults} setResults={setGroupResults} users={users} setUsers={setUsers} />;
        }
        if (Object.values(StationId).includes(currentPage as StationId)) {
            return <StationPage stationId={currentPage as StationId} onComplete={handleCompleteStation} />;
        }
        return <HomePage user={currentUser} onSelectStation={handleSelectStation} completedStations={completedStations} />;
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white shadow-md sticky top-0 z-40">
                <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="text-2xl font-bold text-indigo-600">
                        <i className="fas fa-square-root-alt mr-2"></i>Đạo hàm & Ứng dụng
                    </div>
                    <div className="flex items-center space-x-4">
                        {currentUser ? (
                            <>
                                {currentUser.role === Role.STUDENT && (
                                    <>
                                        <button onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-indigo-600"><HomeIcon/>Trang chủ</button>
                                        <button onClick={() => alert("Chức năng xem kết quả nhóm sẽ có sau!")} className="text-gray-600 hover:text-indigo-600"><ResultsIcon/>Kết quả nhóm</button>
                                    </>
                                )}
                                 {currentUser.role === Role.TEACHER && (
                                     <button onClick={() => setCurrentPage('teacher')} className="text-gray-600 hover:text-indigo-600"><TeacherIcon/>Quản lý</button>
                                )}
                                <span className="text-gray-700">|</span>
                                <span className="font-semibold">{currentUser.name}</span>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors flex items-center">
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    <span>Đăng xuất</span>
                                </button>
                            </>
                        ) : (
                             <div className="flex items-center">
                                <div className="p-1 bg-gray-200 rounded-lg flex items-center">
                                    <button 
                                        onClick={() => setLoginAs(Role.STUDENT)} 
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${loginAs === Role.STUDENT ? 'bg-white shadow text-indigo-600 font-semibold' : 'text-gray-600'}`}
                                    >
                                        Học sinh
                                    </button>
                                    <button 
                                        onClick={() => setLoginAs(Role.TEACHER)} 
                                        className={`px-3 py-1 text-sm rounded-md transition-colors ${loginAs === Role.TEACHER ? 'bg-white shadow text-indigo-600 font-semibold' : 'text-gray-600'}`}
                                    >
                                        Giáo viên
                                    </button>
                                </div>
                                <form onSubmit={handleLoginSubmit} className="flex items-center space-x-2 ml-2">
                                    {loginAs === Role.STUDENT ? (
                                        <>
                                            <input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Họ và tên" className="px-2 py-1.5 border rounded-md text-sm w-36"/>
                                            <input value={studentClass} onChange={e => setStudentClass(e.target.value)} placeholder="Lớp" className="px-2 py-1.5 border rounded-md text-sm w-20"/>
                                            <input value={studentGroup} onChange={e => setStudentGroup(e.target.value)} placeholder="Nhóm" className="px-2 py-1.5 border rounded-md text-sm w-24"/>
                                            <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700">Vào học</button>
                                        </>
                                    ) : (
                                        <>
                                            <input value={teacherName} onChange={e => setTeacherName(e.target.value)} placeholder="Tên giáo viên" className="px-2 py-1.5 border rounded-md text-sm w-40"/>
                                            <input 
                                                type="password" 
                                                value={teacherPassword}
                                                onChange={(e) => setTeacherPassword(e.target.value)}
                                                placeholder="Mật khẩu" 
                                                className="px-2 py-1.5 border rounded-md text-sm w-32" 
                                            />
                                            <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700">Đăng nhập</button>
                                        </>
                                    )}
                                </form>
                            </div>
                        )}
                    </div>
                </nav>
            </header>
            <main>
                {renderPage()}
            </main>
            {currentUser && currentUser.role === Role.STUDENT && <DerivativeCalculator />}
             <footer className="bg-gray-800 text-white text-center p-4 mt-8">
                <p>&copy; 2024 Nền tảng Học tập Đạo hàm. Mọi quyền được bảo lưu.</p>
            </footer>
        </div>
    );
};

export default App;
