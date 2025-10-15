import React from 'react';
import { Station, Role, User, QuestionType, StationId } from './types';
import { PhysicsIcon, EconomicsIcon, ChemistryIcon } from './components/Icons';

export const STATIONS: Record<StationId, Station> = {
  [StationId.PHYSICS]: {
    id: StationId.PHYSICS,
    name: 'Trạm 1 – Vật lý',
    description: 'Ứng dụng đạo hàm để tính toán vận tốc và gia tốc trong chuyển động thẳng.',
    icon: React.createElement(PhysicsIcon),
    color: 'bg-blue-500',
    accentColor: 'text-blue-500',
    questions: [
      {
        id: 'p1',
        text: 'Một vật chuyển động thẳng có phương trình s = t³ - 6t² + 9t + 2 (m). Biểu thức v(t) = s\'(t) biểu thị đại lượng nào?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['Gia tốc tức thời', 'Vận tốc tức thời', 'Quãng đường', 'Thời gian'],
        answer: 'Vận tốc tức thời',
        explanation: 'Đạo hàm của phương trình quãng đường theo thời gian s(t) cho ta phương trình vận tốc tức thời v(t).',
      },
      {
        id: 'p2',
        text: 'Tìm vận tốc của vật tại thời điểm t = 3s.',
        type: QuestionType.FILL_IN_BLANK,
        answer: '0',
        explanation: 'Ta có v(t) = s\'(t) = 3t² - 12t + 9. Thay t = 3s vào, ta được v(3) = 3(3)² - 12(3) + 9 = 27 - 36 + 9 = 0 m/s.',
      },
       {
        id: 'p3',
        text: 'Vật giảm tốc (chuyển động chậm dần) trong khoảng thời gian nào?',
        type: QuestionType.MULTIPLE_CHOICE,
        options: ['(1, 2)', '(0, 1)', '(2, +∞)', '(0, 3)'],
        answer: '(1, 2)',
        explanation: 'Gia tốc a(t) = v\'(t) = 6t - 12. Vật chuyển động chậm dần khi v(t) và a(t) trái dấu (v.a < 0). Dấu của v(t) và a(t) cho thấy v.a < 0 khi t ∈ (1, 2).',
      },
      {
        id: 'p4',
        text: 'Vận tốc của vật đạt giá trị nhỏ nhất bằng bao nhiêu?',
        type: QuestionType.FILL_IN_BLANK,
        answer: '-3',
        explanation: "v(t) = 3t² - 12t + 9. Đây là một parabol có bề lõm quay lên, đạt giá trị nhỏ nhất tại đỉnh t = -b/(2a) = 12/6 = 2s. Vận tốc nhỏ nhất là v(2) = 3(2)² - 12(2) + 9 = -3 m/s.",
      },
    ],
  },
  [StationId.ECONOMICS]: {
    id: StationId.ECONOMICS,
    name: 'Trạm 2 – Kinh tế',
    description: 'Phân tích chi phí, doanh thu và lợi nhuận để tìm ra điểm tối ưu cho sản xuất.',
    icon: React.createElement(EconomicsIcon),
    color: 'bg-amber-500',
    accentColor: 'text-amber-500',
    questions: [
      {
        id: 'e1',
        text: 'Một gia đình đan lưới, chi phí sản xuất x mét lưới là C(x) = x² + 30x + 4000 (nghìn đồng). Giá bán mỗi mét là p = 210 (nghìn đồng). Xác định hàm doanh thu R(x).',
        type: QuestionType.FILL_IN_BLANK,
        answer: 'R(x) = 210x',
        explanation: 'Doanh thu bằng giá bán nhân với số lượng sản phẩm. Vậy R(x) = p * x = 210x.',
      },
      {
        id: 'e2',
        text: 'Xác định hàm lợi nhuận L(x) từ các thông tin trên.',
        type: QuestionType.FILL_IN_BLANK,
        answer: 'L(x) = -x^2 + 180x - 4000',
        explanation: 'Lợi nhuận bằng Doanh thu trừ Chi phí: L(x) = R(x) - C(x) = 210x - (x² + 30x + 4000) = -x² + 180x - 4000.',
      },
       {
        id: 'e3',
        text: 'Tính lợi nhuận của gia đình thu về khi bán được 50 mét lưới (đơn vị nghìn đồng).',
        type: QuestionType.FILL_IN_BLANK,
        answer: '2500',
        explanation: 'Thay x = 50 vào hàm lợi nhuận: L(50) = -(50)² + 180(50) - 4000 = -2500 + 9000 - 4000 = 2500 (nghìn đồng).',
      },
      {
        id: 'e4',
        text: 'Gia đình cần đan bao nhiêu mét lưới trong một ngày để đạt được lợi nhuận tối đa?',
        type: QuestionType.FILL_IN_BLANK,
        answer: '90',
        explanation: 'Lợi nhuận đạt tối đa khi L\'(x) = 0. Ta có L\'(x) = -2x + 180. L\'(x) = 0 ⇔ x = 90. Vậy cần đan 90 mét lưới.',
      },
    ],
  },
  [StationId.CHEMISTRY]: {
    id: StationId.CHEMISTRY,
    name: 'Trạm 3 – Hóa học',
    description: 'Khảo sát tốc độ thay đổi nồng độ thuốc trong máu theo thời gian.',
    icon: React.createElement(ChemistryIcon),
    color: 'bg-green-500',
    accentColor: 'text-green-500',
    questions: [
      {
        id: 'c1',
        text: 'Nồng độ thuốc trong máu của bệnh nhân sau khi tiêm t giờ được cho bởi hàm số C(t) = t / (t² + 1) (mg/L). Tính nồng độ thuốc sau 3 giờ.',
        type: QuestionType.FILL_IN_BLANK,
        answer: '0.3',
        explanation: 'Thay t = 3 vào công thức: C(3) = 3 / (3² + 1) = 3 / 10 = 0.3 (mg/L).',
      },
      {
        id: 'c2',
        text: 'Tính đạo hàm C\'(t).',
        type: QuestionType.FILL_IN_BLANK,
        answer: `C'(t) = (1 - t^2) / (t^2 + 1)^2`,
        explanation: `Áp dụng quy tắc đạo hàm của thương: C'(t) = [(t)'(t²+1) - t(t²+1)'] / (t²+1)² = [1(t²+1) - t(2t)] / (t²+1)² = (1 - t²) / (t²+1)².`,
      },
      {
        id: 'c3',
        text: 'Trong khoảng thời gian nào sau khi tiêm thì nồng độ thuốc trong máu bệnh nhân giảm?',
        type: QuestionType.FILL_IN_BLANK,
        answer: 't > 1',
        explanation: `Nồng độ thuốc giảm khi C'(t) < 0. Vì (t²+1)² luôn > 0, nên ta cần 1 - t² < 0 ⇔ t² > 1. Do t > 0, nên t > 1. Vậy sau 1 giờ, nồng độ thuốc bắt đầu giảm.`,
      },
      {
        id: 'c4',
        text: 'Nồng độ thuốc trong máu bệnh nhân cao nhất bằng bao nhiêu?',
        type: QuestionType.FILL_IN_BLANK,
        answer: '0.5',
        explanation: `Nồng độ cao nhất đạt được khi C'(t) = 0 ⇔ 1 - t² = 0 ⇔ t = 1 (vì t > 0). Nồng độ cao nhất là C(1) = 1 / (1² + 1) = 1/2 = 0.5 (mg/L).`,
      },
    ],
  },
};

export const MOCK_USERS: User[] = [
    { id: 'sv1', name: 'Nguyễn Văn A', class: '12A1', group: 'Nhóm 1', role: Role.STUDENT },
    { id: 'sv2', name: 'Trần Thị B', class: '12A1', group: 'Nhóm 1', role: Role.STUDENT },
    { id: 'sv3', name: 'Lê Văn C', class: '12A2', group: 'Nhóm 2', role: Role.STUDENT },
    { id: 'gv1', name: 'Cô giáo Thảo', class: 'Chuyên Toán', group: 'Giáo viên', role: Role.TEACHER },
];