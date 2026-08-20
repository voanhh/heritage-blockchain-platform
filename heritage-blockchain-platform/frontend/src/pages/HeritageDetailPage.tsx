import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { heritageApi } from '../services/heritage.api';
import type { Heritage, HeritageStatus } from '../types/heritage';

const statusLabels: Record<HeritageStatus, string> = {
  DRAFT: 'Bản nháp',
  SUBMITTED: 'Đã gửi',
  UNDER_REVIEW: 'Đang duyệt',
  VERIFIED: 'Đã xác thực',
  REJECTED: 'Từ chối',
  PUBLISHED: 'Công khai'
};

export function HeritageDetailPage() {
  const { id } = useParams();
  const [heritage, setHeritage] = useState<Heritage | null>(null);
  const [message, setMessage] = useState('');

  const loadHeritage = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      const response = await heritageApi.detail(id);
      setHeritage(response.data.data);
    } catch {
      setMessage('Không thể tải chi tiết hồ sơ di sản.');
    }
  }, [id]);

  useEffect(() => {
    void loadHeritage();
  }, [loadHeritage]);

  async function updateStatus(status: HeritageStatus) {
    if (!id) {
      return;
    }

    try {
      const response = await heritageApi.updateStatus(id, status);
      setHeritage(response.data.data);
      setMessage('Đã cập nhật trạng thái hồ sơ.');
    } catch {
      setMessage('Không thể cập nhật trạng thái hồ sơ.');
    }
  }

  if (!heritage) {
    return (
      <section className="space-y-4">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600" to="/heritages">
          <ArrowLeft size={16} />
          Quay lại danh sách
        </Link>
        <p className="text-sm text-slate-600">{message || 'Đang tải chi tiết hồ sơ...'}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600" to="/heritages">
        <ArrowLeft size={16} />
        Quay lại danh sách
      </Link>

      {message && <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</div>}

      <div className="rounded border border-stone-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase text-emerald-700">{heritage.heritageCode}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{heritage.name}</h1>
            <p className="mt-2 text-slate-600">{heritage.category}</p>
          </div>
          <span className="rounded bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            {statusLabels[heritage.status]}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Mô tả hồ sơ</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{heritage.description}</p>
          </div>

          <aside className="rounded border border-stone-200 bg-stone-50 p-4">
            <h2 className="text-base font-semibold text-slate-900">Nguồn dữ liệu</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <Info label="Nguồn" value={heritage.source} />
              <Info label="Tổ chức nguồn" value={heritage.sourceOrganization} />
              <Info label="Tài liệu tham chiếu" value={heritage.sourceReference} />
              <Info label="Cập nhật cuối" value={new Date(heritage.updatedAt).toLocaleString()} />
            </dl>
          </aside>
        </div>
      </div>

      <div className="rounded border border-stone-200 bg-white p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} className="text-emerald-700" />
          <h2 className="text-base font-semibold text-slate-900">Cập nhật trạng thái nghiên cứu</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(statusLabels).map(([value, label]) => (
            <button
              className="rounded border border-stone-300 px-3 py-2 text-sm hover:bg-stone-100"
              key={value}
              onClick={() => void updateStatus(value as HeritageStatus)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Info(props: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-slate-900">{props.label}</dt>
      <dd className="mt-1 text-slate-600">{props.value}</dd>
    </div>
  );
}
