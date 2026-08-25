import { Check, ClipboardCheck, RefreshCw, Search, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { heritageApi } from '../services/heritage.api';
import { verificationApi } from '../services/verification.api';
import type { Heritage, Verification } from '../types/heritage';

const heritageStatusLabels: Record<Heritage['status'], string> = {
  DRAFT: 'Bản nháp',
  SUBMITTED: 'Đã gửi',
  UNDER_REVIEW: 'Đang duyệt',
  VERIFIED: 'Đã xác thực',
  REJECTED: 'Từ chối',
  PUBLISHED: 'Công khai'
};

const verificationStatusLabels: Record<Verification['status'], string> = {
  PENDING: 'Đang chờ',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối'
};

export function VerificationPage() {
  const [submittedHeritages, setSubmittedHeritages] = useState<Heritage[]>([]);
  const [underReviewHeritages, setUnderReviewHeritages] = useState<Heritage[]>([]);
  const [verificationRecords, setVerificationRecords] = useState<Verification[]>([]);
  const [notesByHeritageId, setNotesByHeritageId] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const reviewQueue = useMemo(
    () =>
      [...submittedHeritages, ...underReviewHeritages].filter((heritage) => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
          return true;
        }

        return (
          heritage.name.toLowerCase().includes(keyword) ||
          heritage.heritageCode.toLowerCase().includes(keyword) ||
          heritage.sourceOrganization.toLowerCase().includes(keyword)
        );
      }),
    [search, submittedHeritages, underReviewHeritages]
  );

  const loadVerificationPage = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      const [submittedResponse, underReviewResponse, recordsResponse] = await Promise.all([
        heritageApi.list({ status: 'SUBMITTED' }),
        heritageApi.list({ status: 'UNDER_REVIEW' }),
        verificationApi.list()
      ]);

      setSubmittedHeritages(submittedResponse.data.data);
      setUnderReviewHeritages(underReviewResponse.data.data);
      setVerificationRecords(recordsResponse.data.data);
    } catch {
      setMessage('Không thể tải dữ liệu kiểm duyệt. Hãy kiểm tra backend và MySQL.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadVerificationPage();
  }, [loadVerificationPage]);

  function updateNotes(heritageId: string, notes: string) {
    setNotesByHeritageId((current) => ({
      ...current,
      [heritageId]: notes
    }));
  }

  async function startReview(heritage: Heritage) {
    try {
      await verificationApi.startReview(heritage.id, {
        notes: notesByHeritageId[heritage.id]
      });
      setMessage(`Đã bắt đầu kiểm duyệt: ${heritage.name}`);
      updateNotes(heritage.id, '');
      await loadVerificationPage();
    } catch {
      setMessage('Chỉ hồ sơ SUBMITTED mới có thể bắt đầu kiểm duyệt.');
    }
  }

  async function approveHeritage(heritage: Heritage) {
    try {
      await verificationApi.approve(heritage.id, {
        notes: notesByHeritageId[heritage.id]
      });
      setMessage(`Đã phê duyệt hồ sơ: ${heritage.name}`);
      updateNotes(heritage.id, '');
      await loadVerificationPage();
    } catch {
      setMessage('Chỉ hồ sơ UNDER_REVIEW mới có thể được phê duyệt.');
    }
  }

  async function rejectHeritage(heritage: Heritage) {
    try {
      await verificationApi.reject(heritage.id, {
        notes: notesByHeritageId[heritage.id]
      });
      setMessage(`Đã từ chối hồ sơ: ${heritage.name}`);
      updateNotes(heritage.id, '');
      await loadVerificationPage();
    } catch {
      setMessage('Chỉ hồ sơ UNDER_REVIEW mới có thể bị từ chối.');
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-emerald-700">Phase 4</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Kiểm duyệt hồ sơ di sản</h1>
          <p className="mt-2 text-sm text-slate-600">
            Quản lý luồng SUBMITTED → UNDER_REVIEW → VERIFIED hoặc REJECTED.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          onClick={() => void loadVerificationPage()}
          type="button"
        >
          <RefreshCw size={16} />
          Tải lại
        </button>
      </div>

      {message && <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</div>}

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryItem label="Chờ bắt đầu duyệt" value={submittedHeritages.length} />
        <SummaryItem label="Đang kiểm duyệt" value={underReviewHeritages.length} />
        <SummaryItem label="Bản ghi kiểm duyệt" value={verificationRecords.length} />
      </div>

      <div className="rounded border border-stone-200 bg-white">
        <div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              className="w-full rounded border border-stone-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-700"
              placeholder="Tìm theo tên, mã hồ sơ hoặc tổ chức nguồn"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <Link className="rounded border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700" to="/heritages">
            Quản lý hồ sơ
          </Link>
        </div>

        <div className="divide-y divide-stone-200">
          {loading && <p className="p-4 text-sm text-slate-500">Đang tải hàng đợi kiểm duyệt...</p>}
          {!loading && reviewQueue.length === 0 && (
            <p className="p-4 text-sm text-slate-500">Không có hồ sơ nào đang chờ hoặc đang kiểm duyệt.</p>
          )}
          {reviewQueue.map((heritage) => (
            <article key={heritage.id} className="grid gap-4 p-4 xl:grid-cols-[1fr_360px]">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-slate-900">{heritage.name}</h2>
                  <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                    {heritageStatusLabels[heritage.status]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {heritage.heritageCode} · {heritage.category}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{heritage.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Nguồn: {heritage.source} · {heritage.sourceOrganization}
                </p>
                <Link className="mt-3 inline-block text-sm font-medium text-emerald-800" to={`/heritages/${heritage.id}`}>
                  Xem chi tiết
                </Link>
              </div>

              <div className="space-y-3">
                <textarea
                  className="min-h-24 w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
                  placeholder="Ghi chú kiểm duyệt"
                  value={notesByHeritageId[heritage.id] ?? ''}
                  onChange={(event) => updateNotes(heritage.id, event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  {heritage.status === 'SUBMITTED' && (
                    <button
                      className="inline-flex items-center gap-2 rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                      onClick={() => void startReview(heritage)}
                      type="button"
                    >
                      <ClipboardCheck size={16} />
                      Bắt đầu duyệt
                    </button>
                  )}
                  {heritage.status === 'UNDER_REVIEW' && (
                    <>
                      <button
                        className="inline-flex items-center gap-2 rounded bg-emerald-700 px-3 py-2 text-sm font-medium text-white"
                        onClick={() => void approveHeritage(heritage)}
                        type="button"
                      >
                        <Check size={16} />
                        Phê duyệt
                      </button>
                      <button
                        className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
                        onClick={() => void rejectHeritage(heritage)}
                        type="button"
                      >
                        <X size={16} />
                        Từ chối
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-4">
          <h2 className="text-base font-semibold text-slate-900">Lịch sử kiểm duyệt gần đây</h2>
        </div>
        <div className="divide-y divide-stone-200">
          {verificationRecords.length === 0 && <p className="p-4 text-sm text-slate-500">Chưa có bản ghi kiểm duyệt.</p>}
          {verificationRecords.slice(0, 10).map((record) => (
            <article key={record.id} className="grid gap-2 p-4 md:grid-cols-[180px_1fr_180px]">
              <span className="text-sm font-medium text-slate-900">{verificationStatusLabels[record.status]}</span>
              <div>
                <p className="text-sm font-medium text-slate-900">{record.heritage?.name ?? record.heritageId}</p>
                <p className="mt-1 text-sm text-slate-600">{record.notes || 'Không có ghi chú'}</p>
              </div>
              <time className="text-sm text-slate-500">{new Date(record.createdAt).toLocaleString()}</time>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryItem(props: { label: string; value: number }) {
  return (
    <div className="rounded border border-stone-200 bg-white p-5">
      <p className="text-sm text-slate-500">{props.label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{props.value}</p>
    </div>
  );
}
