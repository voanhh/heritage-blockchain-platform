import { Edit3, Eye, Plus, RefreshCw, Send, Trash2 } from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { heritageApi } from '../services/heritage.api';
import type { Heritage, HeritagePayload, HeritageStatus } from '../types/heritage';

const emptyForm: HeritagePayload = {
  heritageCode: '',
  name: '',
  description: '',
  category: '',
  source: '',
  sourceOrganization: '',
  sourceReference: ''
};

const statuses: Array<HeritageStatus | 'ALL'> = [
  'ALL',
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'VERIFIED',
  'REJECTED',
  'PUBLISHED'
];

const statusLabels: Record<HeritageStatus | 'ALL', string> = {
  ALL: 'Tất cả',
  DRAFT: 'Bản nháp',
  SUBMITTED: 'Đã gửi',
  UNDER_REVIEW: 'Đang duyệt',
  VERIFIED: 'Đã xác thực',
  REJECTED: 'Từ chối',
  PUBLISHED: 'Công khai'
};

export function HeritageListPage() {
  const [heritages, setHeritages] = useState<Heritage[]>([]);
  const [form, setForm] = useState<HeritagePayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState<HeritageStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const loadHeritages = useCallback(async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await heritageApi.list({ status, search });
      setHeritages(response.data.data);
    } catch {
      setMessage('Không thể tải danh sách hồ sơ di sản. Hãy kiểm tra backend và MySQL.');
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    void loadHeritages();
  }, [loadHeritages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await heritageApi.update(editingId, form);
        setMessage('Đã cập nhật hồ sơ di sản.');
      } else {
        await heritageApi.create(form);
        setMessage('Đã tạo hồ sơ di sản.');
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadHeritages();
    } catch {
      setMessage('Không thể lưu hồ sơ. Hãy kiểm tra mã hồ sơ và các trường nguồn dữ liệu bắt buộc.');
    }
  }

  function startEdit(heritage: Heritage) {
    setEditingId(heritage.id);
    setForm({
      heritageCode: heritage.heritageCode,
      name: heritage.name,
      description: heritage.description,
      category: heritage.category,
      source: heritage.source,
      sourceOrganization: heritage.sourceOrganization,
      sourceReference: heritage.sourceReference
    });
  }

  async function submitForReview(id: string) {
    try {
      await heritageApi.submit(id);
      setMessage('Đã gửi hồ sơ sang trạng thái chờ kiểm duyệt.');
      await loadHeritages();
    } catch {
      setMessage('Chỉ hồ sơ DRAFT hoặc REJECTED mới có thể gửi kiểm duyệt.');
    }
  }

  async function removeHeritage(id: string) {
    const confirmed = window.confirm('Bạn chắc chắn muốn xóa hồ sơ di sản này?');

    if (!confirmed) {
      return;
    }

    try {
      await heritageApi.remove(id);
      setMessage('Đã xóa hồ sơ di sản.');
      await loadHeritages();
    } catch {
      setMessage('Không thể xóa hồ sơ di sản.');
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase text-emerald-700">Anh em tao macau</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">Quản lý hồ sơ di sản</h1>
          <p className="mt-2 text-sm text-slate-600">
            Tạo, cập nhật, tra cứu và gửi hồ sơ di sản văn hóa phi vật thể sang bước kiểm duyệt.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          onClick={() => void loadHeritages()}
          type="button"
        >
          <RefreshCw size={16} />
          Tải lại
        </button>
      </div>

      {message && <div className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{message}</div>}

      <form className="rounded border border-stone-200 bg-white p-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          {isEditing ? <Edit3 size={18} className="text-emerald-700" /> : <Plus size={18} className="text-emerald-700" />}
          <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới'}</h2>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Mã hồ sơ" value={form.heritageCode} onChange={(value) => setForm({ ...form, heritageCode: value })} />
          <Field label="Tên di sản" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field label="Loại hình" value={form.category} onChange={(value) => setForm({ ...form, category: value })} />
          <Field label="Nguồn dữ liệu" value={form.source} onChange={(value) => setForm({ ...form, source: value })} />
          <Field
            label="Tổ chức nguồn"
            value={form.sourceOrganization}
            onChange={(value) => setForm({ ...form, sourceOrganization: value })}
          />
          <Field
            label="Tài liệu tham chiếu"
            value={form.sourceReference}
            onChange={(value) => setForm({ ...form, sourceReference: value })}
          />
          <label className="md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Mô tả</span>
            <textarea
              className="mt-1 min-h-28 w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
              required
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white" type="submit">
            {isEditing ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
          </button>
          {isEditing && (
            <button
              className="rounded border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
              type="button"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      <div className="rounded border border-stone-200 bg-white">
        <div className="grid gap-3 border-b border-stone-200 p-4 md:grid-cols-[180px_1fr_auto]">
          <select
            className="rounded border border-stone-300 px-3 py-2 text-sm"
            value={status}
            onChange={(event) => setStatus(event.target.value as HeritageStatus | 'ALL')}
          >
            {statuses.map((item) => (
              <option key={item} value={item}>
                {statusLabels[item]}
              </option>
            ))}
          </select>
          <input
            className="rounded border border-stone-300 px-3 py-2 text-sm"
            placeholder="Tìm theo tên hoặc mã hồ sơ"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={() => void loadHeritages()} type="button">
            Tìm kiếm
          </button>
        </div>

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
                <p className="mt-2 text-xs text-slate-500">
                  Nguồn: {heritage.source} · {heritage.sourceOrganization}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-2">
                <Link className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" to={`/heritages/${heritage.id}`}>
                  <Eye size={16} />
                  Xem
                </Link>
                <button className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" onClick={() => startEdit(heritage)} type="button">
                  <Edit3 size={16} />
                  Sửa
                </button>
                <button className="inline-flex items-center gap-2 rounded border border-stone-300 px-3 py-2 text-sm" onClick={() => void submitForReview(heritage.id)} type="button">
                  <Send size={16} />
                  Gửi duyệt
                </button>
                <button className="inline-flex items-center gap-2 rounded border border-red-200 px-3 py-2 text-sm text-red-700" onClick={() => void removeHeritage(heritage.id)} type="button">
                  <Trash2 size={16} />
                  Xóa
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{props.label}</span>
      <input
        className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
        required
        value={props.value}
        onChange={(event) => props.onChange(event.target.value)}
      />
    </label>
  );
}
