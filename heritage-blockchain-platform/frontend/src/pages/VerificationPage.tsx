import { RefreshCw, Search, UserCheck, Users } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { type Verification, verificationApi } from '../api/verification.api';
import { MyAssignmentsTab } from '../components/verification/MyAssignmentsTab';
import { ReviewProgressTab } from '../components/verification/ReviewProgressTab';
import { heritageApi } from '../services/heritage.api';
import type { Heritage } from '../types/heritage';
import { useAuthStore } from '../store/authStore';
// 👈 Thay bằng hook/context Auth của dự án bạn

export function VerificationPage() {
  const user = useAuthStore((state) => state.user); // Lấy thông tin user hiện tại (ví dụ: user.role = 'EXPERT' hoặc 'ADMIN')

  // Xác định quyền hạn
  const isExpert = ['INDEPENDENT_EXPERT', 'ORG_EXPERT'].includes(user?.role || '');
  const isAdmin = ['SYSTEM_ADMIN', 'ORG_ADMIN'].includes(user?.role || '');
  const hasBothRoles = isExpert && isAdmin; // Hoặc SUPER_ADMIN

  // State quản lý Tab (Mặc định chọn tab phù hợp với Role)
  const [activeTab, setActiveTab] = useState<'my-assignments' | 'all-reviews'>(
    isExpert ? 'my-assignments' : 'all-reviews'
  );

  // States Dữ liệu
  const [myAssignments, setMyAssignments] = useState<Verification[]>([]);
  const [underReviewHeritages, setUnderReviewHeritages] = useState<Heritage[]>([]);
  const [selectedHeritageVerifications, setSelectedHeritageVerifications] = useState<Verification[]>([]);
  const [selectedHeritageId, setSelectedHeritageId] = useState<string | null>(null);

  const [voteNotes, setVoteNotes] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Tải nhiệm vụ Chuyên gia
  const loadMyAssignments = useCallback(async () => {
    try {
      const res = await verificationApi.getMyAssignments();
      setMyAssignments(res.data.data || []);
    } catch {
      toast.error('Không thể tải danh sách nhiệm vụ thẩm định');
    }
  }, []);

  // 2. Tải danh sách hồ sơ cho Admin
  const loadUnderReviewHeritages = useCallback(async () => {
    try {
      const [submittedRes, underReviewRes] = await Promise.all([
        heritageApi.list({ status: 'SUBMITTED' }),
        heritageApi.list({ status: 'UNDER_REVIEW' })
      ]);
      const combined = [...(submittedRes.data?.data || []), ...(underReviewRes.data?.data || [])];
      setUnderReviewHeritages(combined);
    } catch {
      toast.error('Lỗi nạp danh sách hồ sơ thẩm định');
    }
  }, []);

  // 🟢 CHỈ TẢI API TƯƠNG ỨNG VỚI ROLE (Tối ưu performance)
  const refreshData = useCallback(async () => {
    setLoading(true);
    const apiTasks: Promise<void>[] = [];

    if (isExpert) apiTasks.push(loadMyAssignments());
    if (isAdmin) apiTasks.push(loadUnderReviewHeritages());

    await Promise.all(apiTasks);
    setLoading(false);
  }, [isExpert, isAdmin, loadMyAssignments, loadUnderReviewHeritages]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  // Cập nhật tab active ban đầu nếu thông tin user nạp chậm
  useEffect(() => {
    if (isExpert && !isAdmin) setActiveTab('my-assignments');
    if (isAdmin && !isExpert) setActiveTab('all-reviews');
  }, [isExpert, isAdmin]);

  // Chi tiết phiếu của 1 di sản (cho Admin)
  const handleSelectHeritage = async (heritageId: string) => {
    setSelectedHeritageId(heritageId);
    try {
      const res = await verificationApi.getVerificationsByHeritage(heritageId);
      setSelectedHeritageVerifications(res.data?.data || []);
    } catch {
      toast.error('Không thể tải chi tiết phiếu biểu quyết');
    }
  };

  // Kích hoạt Auto Match (cho Admin)
  const handleAutoAssign = async (heritageId: string, count = 5) => {
    try {
      const res = await verificationApi.triggerAutoAssign(heritageId, count);
      toast.success(res.data?.data?.message || `Đã tự động phân công ${count} chuyên gia!`);
      await refreshData();
      if (selectedHeritageId === heritageId) {
        await handleSelectHeritage(heritageId);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Phân công chuyên gia thất bại');
    }
  };

  // Bỏ phiếu (cho Chuyên gia)
  const handleVote = async (verificationId: string, status: 'APPROVED' | 'REJECTED' | 'ABSTAINED') => {
    const notes = voteNotes[verificationId] || '';
    try {
      const res = await verificationApi.submitVote(verificationId, { status, notes });
      toast.success(res.data?.message || 'Gửi đánh giá thành công!');

      setVoteNotes((prev) => {
        const updated = { ...prev };
        delete updated[verificationId];
        return updated;
      });

      await refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gửi biểu quyết thất bại');
    }
  };

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredAssignments = myAssignments.filter((item) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      item.heritage?.name?.toLowerCase().includes(keyword) ||
      item.heritage?.heritageCode?.toLowerCase().includes(keyword)
    );
  });

  const filteredUnderReviewHeritages = underReviewHeritages.filter((item) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return item.name.toLowerCase().includes(keyword) || item.heritageCode.toLowerCase().includes(keyword);
  });

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-emerald-700">
            {isAdmin ? 'Quản trị viên Hội đồng' : 'Chuyên gia Thẩm định'}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            {isAdmin ? 'Theo dõi Tiến độ Thẩm định' : 'Hội đồng Kiểm duyệt Di sản'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isAdmin
              ? 'Tự động gán Hội đồng chuyên gia và giám sát tiến độ biểu quyết thời gian thực.'
              : 'Đánh giá, đưa ra ý kiến chuyên môn và biểu quyết chấp thuận/từ chối hồ sơ di sản.'}
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          onClick={() => void refreshData()}
          type="button"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Tải lại
        </button>
      </div>

      {/* 🔴 CHỈ HIỂN THỊ THANH TABS KHI USER CÓ CẢ 2 ROLES */}
      {hasBothRoles && (
        <div className="flex border-b border-stone-200">
          <button
            type="button"
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'my-assignments'
              ? 'border-emerald-700 font-semibold text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            onClick={() => setActiveTab('my-assignments')}
          >
            <UserCheck size={18} />
            Nhiệm vụ của tôi ({myAssignments.filter((a) => a.status === 'PENDING').length} chờ duyệt)
          </button>
          <button
            type="button"
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'all-reviews'
              ? 'border-emerald-700 font-semibold text-emerald-800'
              : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            onClick={() => setActiveTab('all-reviews')}
          >
            <Users size={18} />
            Theo dõi tiến độ Thẩm định ({underReviewHeritages.length})
          </button>
        </div>
      )}

      {/* Ô tìm kiếm */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
        <input
          className="w-full rounded border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-700"
          placeholder="Tìm theo tên hồ sơ di sản hoặc mã hồ sơ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 🟢 RENDER GIAO DIỆN THEO ROLE HOẶC TAB ĐANG CHỌN */}
      {activeTab === 'my-assignments' && isExpert && (
        <MyAssignmentsTab
          assignments={filteredAssignments}
          loading={loading}
          voteNotes={voteNotes}
          onNoteChange={(id, note) => setVoteNotes((prev) => ({ ...prev, [id]: note }))}
          onVote={handleVote}
        />
      )}

      {activeTab === 'all-reviews' && isAdmin && (
        <ReviewProgressTab
          heritages={filteredUnderReviewHeritages}
          selectedHeritageId={selectedHeritageId}
          selectedVerifications={selectedHeritageVerifications}
          onSelectHeritage={handleSelectHeritage}
          onAutoAssign={handleAutoAssign}
        />
      )}
    </section>
  );
}
