import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  ShieldCheck,
  User,
} from 'lucide-react';
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
  PUBLISHED: 'Công khai',
};

export function HeritageDetailPage() {
  const { id } = useParams();
  const [heritage, setHeritage] = useState<Heritage | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadHeritage = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await heritageApi.detail(id);
      setHeritage(response.data?.data || response.data);
    } catch {
      setMessage('Không thể tải chi tiết hồ sơ di sản.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadHeritage();
  }, [loadHeritage]);

  async function updateStatus(status: HeritageStatus) {
    if (!id) return;

    try {
      const response = await heritageApi.updateStatus(id, status);
      setHeritage(response.data?.data || response.data);
      setMessage('Đã cập nhật trạng thái hồ sơ thành công.');
    } catch {
      setMessage('Không thể cập nhật trạng thái hồ sơ.');
    }
  }

  if (loading) {
    return (
      <section className="space-y-4">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900" to="/heritages">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <p className="text-sm text-slate-600">Đang tải chi tiết hồ sơ...</p>
      </section>
    );
  }

  if (!heritage) {
    return (
      <section className="space-y-4">
        <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900" to="/heritages">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
        <p className="text-sm text-red-600">{message || 'Không tìm thấy thông tin di sản.'}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <Link className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="/heritages">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      {message && (
        <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 flex items-center justify-between">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage('')} className="text-xs font-semibold hover:underline">
            Đóng
          </button>
        </div>
      )}

      {/* Header chính */}
      <div className="rounded border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {heritage.heritageCode}
              </span>
              <span className="text-sm text-slate-500">
                {heritage.field?.name || 'Loại hình chưa phân loại'}
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{heritage.name}</h1>
          </div>

          <span className="self-start rounded bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-900 border border-emerald-300">
            {statusLabels[heritage.status] || heritage.status}
          </span>
        </div>

        {/* Danh sách địa điểm */}
        {Boolean(heritage.location?.length) && (
          <div className="mt-4 flex items-start gap-2 border-t border-stone-100 pt-4 text-sm text-slate-700">
            <MapPin size={18} className="text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-slate-900">Địa điểm: </span>
              {heritage.location
                ?.map((loc) => [loc.ward, loc.district, loc.province].filter(Boolean).join(', '))
                .join(' | ')}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Cột trái: Mô tả & Tài liệu pháp lý */}
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900 border-b border-stone-100 pb-2">Mô tả hồ sơ</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{heritage.description}</p>
            </div>

            {/* Thông tin pháp lý & IPFS CID */}
            {(heritage.sourceDocumentNumber || heritage.sourceUrl || heritage.sourceDocumentCid) && (
              <div className="rounded border border-stone-200 bg-stone-50/50 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-700" />
                  Căn cứ pháp lý & Dữ liệu lưu trữ
                </h3>
                <dl className="grid gap-2 text-sm md:grid-cols-2">
                  {heritage.sourceDocumentNumber && (
                    <Info label="Số hiệu quyết định / Căn cứ" value={heritage.sourceDocumentNumber} />
                  )}
                  {heritage.sourceUrl && (
                    <div>
                      <dt className="font-medium text-slate-900">Đường dẫn tham khảo</dt>
                      <dd className="mt-0.5">
                        <a
                          href={heritage.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-700 hover:underline break-all"
                        >
                          Xem tài liệu gốc <ExternalLink size={12} />
                        </a>
                      </dd>
                    </div>
                  )}
                  {heritage.sourceDocumentCid && (
                    <div className="md:col-span-2">
                      <dt className="font-medium text-slate-900">Mã IPFS CID (Lưu trữ Blockchain)</dt>
                      <dd className="mt-0.5 font-mono text-xs text-slate-800 bg-white p-2 rounded border border-stone-200 break-all">
                        {heritage.sourceDocumentCid}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>

          {/* Cột phải: Nguồn dữ liệu & Thông tin kiểm duyệt */}
          <aside className="space-y-4">
            <div className="rounded border border-stone-200 bg-stone-50 p-4">
              <h2 className="text-base font-semibold text-slate-900 border-b border-stone-200 pb-2">Nguồn dữ liệu</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <Info label="Nguồn thông tin" value={heritage.source} />
                <Info label="Tổ chức nguồn" value={heritage.sourceOrganization} />

                {heritage.recognizedAt && (
                  <Info
                    label="Thời điểm ghi danh / công nhận"
                    value={new Date(heritage.recognizedAt).toLocaleDateString('vi-VN')}
                    icon={<Calendar size={14} className="text-emerald-700 inline mr-1" />}
                  />
                )}
              </dl>
            </div>

            <div className="rounded border border-stone-200 bg-stone-50 p-4">
              <h2 className="text-base font-semibold text-slate-900 border-b border-stone-200 pb-2">Thông tin nhật ký</h2>
              <dl className="mt-3 space-y-3 text-sm">
                {heritage.createdBy && (
                  <Info
                    label="Người tạo hồ sơ"
                    value={heritage.createdBy}
                    icon={<User size={14} className="text-slate-500 inline mr-1" />}
                  />
                )}
                {heritage.verifiedBy && (
                  <Info
                    label="Người xác thực"
                    value={heritage.verifiedBy}
                    icon={<ShieldCheck size={14} className="text-emerald-700 inline mr-1" />}
                  />
                )}
                <Info
                  label="Ngày khởi tạo"
                  value={new Date(heritage.createdAt).toLocaleString('vi-VN')}
                  icon={<Clock size={14} className="text-slate-500 inline mr-1" />}
                />
                <Info
                  label="Cập nhật gần nhất"
                  value={new Date(heritage.updatedAt).toLocaleString('vi-VN')}
                  icon={<Clock size={14} className="text-slate-500 inline mr-1" />}
                />
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* Cập nhật trạng thái
      <div className="rounded border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
          <CheckCircle2 size={18} className="text-emerald-700" />
          <h2 className="text-base font-semibold text-slate-900">Cập nhật trạng thái quy trình</h2>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(statusLabels).map(([value, label]) => {
            const isCurrent = heritage.status === value;
            return (
              <button
                key={value}
                type="button"
                disabled={isCurrent}
                onClick={() => void updateStatus(value as HeritageStatus)}
                className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${isCurrent
                    ? 'border-emerald-700 bg-emerald-700 text-white cursor-default'
                    : 'border-stone-300 bg-white text-slate-700 hover:bg-stone-100'
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div> */}
    </section>
  );
}

function Info({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</dt>
      <dd className="mt-0.5 text-slate-900 font-medium">
        {icon}
        {value}
      </dd>
    </div>
  );
}
