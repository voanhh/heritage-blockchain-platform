// src/components/heritage/HeritageList.tsx
import { Edit3, Eye, Send, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Heritage, HeritageStatus } from '../../types/heritage';

const statuses: Array<HeritageStatus | 'ALL'> = ['ALL', 'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'PUBLISHED'];

const statusLabels: Record<HeritageStatus | 'ALL', string> = {
  ALL: 'Tất cả',
  DRAFT: 'Bản nháp',
  SUBMITTED: 'Đã gửi',
  UNDER_REVIEW: 'Đang duyệt',
  VERIFIED: 'Đã xác thực',
  REJECTED: 'Từ chối',
  PUBLISHED: 'Công khai'
};

interface HeritageListProps {
  heritages: Heritage[];
  loading: boolean;
  status: HeritageStatus | 'ALL';
  search: string;
  onStatusChange: (status: HeritageStatus | 'ALL') => void;
  onSearchChange: (search: string) => void;
  onSearchSubmit: () => void;
  onEdit: (heritage: Heritage) => void;
  onSubmitForReview: (id: string) => void;
  onRemove: (id: string) => void;
}

export function HeritageList({
  heritages,
  loading,
  status,
  search,
  onStatusChange,
  onSearchChange,
  onSearchSubmit,
  onEdit,
  onSubmitForReview,
  onRemove
}: HeritageListProps) {
  return (
    <div className="rounded border border-stone-200 bg-white">
      {/* Bộ lọc */}
      <div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[180px_1fr_auto]">
        <select className="rounded border border-stone-300 px-3 py-2 text-sm" value={status} onChange={(e) => onStatusChange(e.target.value as any)}>
          {statuses.map((item) => (
            <option key={item} value={item}>{statusLabels[item]}</option>
          ))}
        </select>
        <input
          className="rounded border border-stone-300 px-3 py-2 text-sm"
          placeholder="Tìm theo tên hoặc mã hồ sơ"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={onSearchSubmit} type="button">
          Tìm kiếm
        </button>
      </div>

      {/* Danh sách */}
      <div className="divide-y divide-stone-200">
        {loading && <p className="p-4 text-sm text-slate-500">Đang tải hồ sơ...</p>}
        {!loading && heritages.length === 0 && <p className="p-4 text-sm text-slate-500">Chưa có hồ sơ di sản nào.</p>}
        {heritages.map((heritage) => (
          <article key={heritage.id} className="grid gap-4 p-4 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-semibold text-slate-900">{heritage.name}</h3>
                <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                  {statusLabels[heritage.status]}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{heritage.heritageCode} · {heritage.category}</p>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{heritage.description}</p>
              <p className="mt-2 text-xs text-slate-500">Nguồn: {heritage.source} · {heritage.sourceOrganization}</p>
            </div>
            <div className="flex flex-wrap items-start gap-2">
              <Link className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" to={`/heritages/${heritage.id}`}>
                <Eye size={16} /> Xem
              </Link>
              <button className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" onClick={() => onEdit(heritage)} type="button">
                <Edit3 size={16} /> Sửa
              </button>
              <button className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" onClick={() => onSubmitForReview(heritage.id)} type="button">
                <Send size={16} /> Gửi duyệt
              </button>
              <button className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-sm text-red-700" onClick={() => onRemove(heritage.id)} type="button">
                <Trash2 size={16} /> Xóa
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
