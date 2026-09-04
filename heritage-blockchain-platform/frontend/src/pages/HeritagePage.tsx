// src/pages/HeritageListPage.tsx
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast'; // Import thư viện Toast
import { heritageApi } from '../services/heritage.api';
import type { Heritage, HeritagePayload, HeritageStatus } from '../types/heritage';

// Import các component con
import { HeritageForm } from '../components/heritage/HeritageForm';
import { HeritageList } from '../components/heritage/HeritageList';

export function HeritagePage() {
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [editingHeritage, setEditingHeritage] = useState<HeritagePayload | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [status, setStatus] = useState<HeritageStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // ĐÃ XÓA state message ở đây

  const loadHeritages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await heritageApi.list({ status, search });
      setHeritages(response.data.data);
    } catch {
      // Dùng toast báo lỗi thay vì setState
      toast.error('Không thể tải danh sách hồ sơ di sản.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void loadHeritages();
  }, [loadHeritages]);

  const handleFormSubmit = async (payload: HeritagePayload) => {
    try {
      if (editingId) {
        await heritageApi.update(editingId, payload);
        toast.success('Đã cập nhật hồ sơ di sản thành công!');
      } else {
        await heritageApi.create(payload);
        toast.success('Đã tạo hồ sơ di sản thành công!');
      }
      setEditingId(null);
      setEditingHeritage(null);
      await loadHeritages();
    } catch {
      toast.error('Không thể lưu hồ sơ. Hãy kiểm tra lại thông tin.');
    }
  };

  const startEdit = (heritage: Heritage) => {
    setEditingId(heritage.id);
    setEditingHeritage(heritage);
    // Kéo mượt lên đầu trang để người dùng thấy form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await heritageApi.submit(id);
      toast.success('Đã gửi hồ sơ sang trạng thái chờ kiểm duyệt!');
      await loadHeritages();
    } catch {
      toast.error('Chỉ hồ sơ DRAFT hoặc REJECTED mới có thể gửi kiểm duyệt.');
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hồ sơ di sản này?')) return;
    try {
      await heritageApi.remove(id);
      toast.success('Đã xóa hồ sơ di sản thành công.');
      await loadHeritages();
    } catch {
      toast.error('Lỗi! Không thể xóa hồ sơ di sản.');
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-emerald-700">Hệ thống di sản</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Quản lý hồ sơ di sản</h1>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          onClick={() => void loadHeritages()}
        >
          <RefreshCw size={16} /> Tải lại
        </button>
      </div>

      {/* ĐÃ XÓA thẻ div render message màu vàng ở đây */}

      {/* Component Form: Được import từ HeritageForm_4.tsx của bạn */}
      <HeritageForm
        initialData={editingHeritage}
        onSubmit={handleFormSubmit}
        onCancel={() => {
          setEditingId(null);
          setEditingHeritage(null);
        }}
      />

      {/* Component List: Được import từ HeritageList.tsx của bạn */}
      <HeritageList
        heritages={heritages}
        loading={loading}
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
        onSearchSubmit={() => void loadHeritages()}
        onEdit={startEdit}
        onSubmitForReview={(id) => void handleSubmitForReview(id)}
        onRemove={(id) => void handleRemove(id)}
      />
    </section>
  );
}
