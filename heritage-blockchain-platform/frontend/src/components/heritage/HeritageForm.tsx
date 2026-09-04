// src/components/heritage/HeritageForm.tsx
import { Edit3, Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import type { HeritagePayload } from '../../types/heritage';

const emptyForm: HeritagePayload = {
  heritageCode: '',
  name: '',
  description: '',
  category: '',
  source: '',
  sourceOrganization: '',
  sourceReference: ''
};

interface HeritageFormProps {
  initialData?: HeritagePayload | null;
  onSubmit: (data: HeritagePayload) => Promise<void>;
  onCancel?: () => void;
}

export function HeritageForm({ initialData, onSubmit, onCancel }: HeritageFormProps) {
  const [form, setForm] = useState<HeritagePayload>(emptyForm);
  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
    if (!isEditing) setForm(emptyForm);
  };

  return (
    <form className="rounded border border-stone-200 bg-white p-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        {isEditing ? <Edit3 size={18} className="text-emerald-700" /> : <Plus size={18} className="text-emerald-700" />}
        <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới'}</h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Mã hồ sơ" value={form.heritageCode} onChange={(val) => setForm({ ...form, heritageCode: val })} />
        <Field label="Tên di sản" value={form.name} onChange={(val) => setForm({ ...form, name: val })} />
        <Field label="Loại hình" value={form.category} onChange={(val) => setForm({ ...form, category: val })} />
        <Field label="Nguồn dữ liệu" value={form.source} onChange={(val) => setForm({ ...form, source: val })} />
        <Field label="Tổ chức nguồn" value={form.sourceOrganization} onChange={(val) => setForm({ ...form, sourceOrganization: val })} />
        <Field label="Tài liệu tham chiếu" value={form.sourceReference} onChange={(val) => setForm({ ...form, sourceReference: val })} />
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Mô tả</span>
          <textarea
            className="mt-1 min-h-28 w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white" type="submit">
          {isEditing ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
        </button>
        {isEditing && (
          <button className="rounded border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={onCancel} type="button">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className="mt-1 w-full rounded border border-stone-300 px-3 py-2 text-sm outline-none focus:border-emerald-700"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
