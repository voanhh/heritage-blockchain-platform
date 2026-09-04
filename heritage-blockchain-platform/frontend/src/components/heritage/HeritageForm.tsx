// src/components/heritage/HeritageForm.tsx
import { Edit3, Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { heritagePayloadSchema } from '../../types/heritage';
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
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialData]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Sử dụng Schema đã import để parse dữ liệu
    const validationResult = heritagePayloadSchema.safeParse(form);

    if (!validationResult.success) {
      setErrors(validationResult.error.flatten().fieldErrors);
      return;
    }

    setErrors({});
    await onSubmit(validationResult.data);

    if (!isEditing) {
      setForm(emptyForm);
    }
  };

  return (
    <form className="rounded border border-stone-200 bg-white p-5" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        {isEditing ? <Edit3 size={18} className="text-emerald-700" /> : <Plus size={18} className="text-emerald-700" />}
        <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới'}</h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Mã hồ sơ" value={form.heritageCode} error={errors.heritageCode?.[0]} onChange={(val) => setForm({ ...form, heritageCode: val })} />
        <Field label="Tên di sản" value={form.name} error={errors.name?.[0]} onChange={(val) => setForm({ ...form, name: val })} />
        <Field label="Loại hình" value={form.category} error={errors.category?.[0]} onChange={(val) => setForm({ ...form, category: val })} />
        <Field label="Nguồn dữ liệu" value={form.source} error={errors.source?.[0]} onChange={(val) => setForm({ ...form, source: val })} />
        <Field label="Tổ chức nguồn" value={form.sourceOrganization} error={errors.sourceOrganization?.[0]} onChange={(val) => setForm({ ...form, sourceOrganization: val })} />
        <Field label="Tài liệu tham chiếu" value={form.sourceReference || ''} error={errors.sourceReference?.[0]} onChange={(val) => setForm({ ...form, sourceReference: val })} />
        <label className="md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Mô tả</span>
          <textarea
            className={`mt-1 min-h-28 w-full rounded border px-3 py-2 text-sm outline-none transition-colors ${errors.description ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-700'
              }`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description[0]}</p>}
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

function Field({ label, value, error, onChange }: { label: string; value: string; error?: string; onChange: (v: string) => void }) {
  return (
    <label>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none transition-colors ${error ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-700'}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
