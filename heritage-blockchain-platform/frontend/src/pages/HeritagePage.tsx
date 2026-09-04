// src/pages/HeritageListPage.tsx
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { heritageApi } from '../services/heritage.api';
import type { Heritage, HeritagePayload, HeritageStatus } from '../types/heritage';
import { HeritageForm } from '../components/heritage/HeritageForm';
import { HeritageList } from '../components/heritage/HeritageList';

export function HeritagePage() {
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [editingHeritage, setEditingHeritage] = useState<HeritagePayload | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<HeritageStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadHeritages = useCallback(async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await heritageApi.list({ status, search });
      setHeritages(response.data.data);
    } catch {
      setMessage('Không thể tải danh sách hồ sơ di sản.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void loadHeritages();
  }, [loadHeritages]);

  const handleFormSubmit = async (payload: HeritagePayload) => {
    setMessage('');
    try {
      if (editingId) {
        await heritageApi.update(editingId, payload);
        setMessage('Đã cập nhật hồ sơ di sản.');
      } else {
        await heritageApi.create(payload);
        setMessage('Đã tạo hồ sơ di sản.');
      }
      setEditingId(null);
      setEditingHeritage(null);
      await loadHeritages();
    } catch {
      setMessage('Không thể lưu hồ sơ. Hãy kiểm tra các trường bắt buộc.');
    }
  };

  const startEdit = (heritage: Heritage) => {
    setEditingId(heritage.id);
    setEditingHeritage(heritage);
  };

  const handleSubmitForReview = async (id: string) => {
    try {
      await heritageApi.submit(id);
      setMessage('Đã gửi hồ sơ sang trạng thái chờ kiểm duyệt.');
      await loadHeritages();
    } catch {
      setMessage('Chỉ hồ sơ DRAFT hoặc REJECTED mới có thể gửi kiểm duyệt.');
    }
  };

  const handleRemove = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hồ sơ di sản này?')) return;
    try {
      await heritageApi.remove(id);
      setMessage('Đã xóa hồ sơ di sản.');
      await loadHeritages();
    } catch {
      setMessage('Không thể xóa hồ sơ di sản.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-emerald-700">Hệ thống di sản</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Quản lý hồ sơ di sản</h1>
        </div>
        <button className="inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={() => void loadHeritages()}>
          <RefreshCw size={16} /> Tải lại
        </button>
      </div>

      {message && <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</div>}

      {/* Component Form */}
      <HeritageForm initialData={editingHeritage} onSubmit={handleFormSubmit} onCancel={() => { setEditingId(null); setEditingHeritage(null); }} />

      {/* Component List */}
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
