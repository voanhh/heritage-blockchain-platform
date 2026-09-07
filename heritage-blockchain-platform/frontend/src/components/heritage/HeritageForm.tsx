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

export interface HeritageCategoryOption {
  id: string;
  name: string;
}

export interface OrganizationOption {
  id: string;
  name: string;
  status?: string;
}

interface HeritageFormProps {
  initialData?: HeritagePayload | null;
  categories?: HeritageCategoryOption[]; // Danh sách Loại hình di sản
  organizations?: OrganizationOption[]; // Danh sách Tổ chức đang hoạt động
  onSubmit: (data: HeritagePayload) => Promise<void>;
  onCancel?: () => void;
}

export function HeritageForm({
  initialData,
  categories = [],
  organizations = [],
  onSubmit,
  onCancel
}: HeritageFormProps) {
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

    // 🟢 Kiểm tra thủ công bắt buộc chọn loại hình nếu zod chưa validate
    if (!form.category || form.category.trim() === '') {
      setErrors((prev) => ({ ...prev, category: ['Vui lòng chọn loại hình di sản'] }));
      return;
    }

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
    <form className="rounded border border-stone-200 bg-white p-5 shadow-sm" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
        {isEditing ? <Edit3 size={18} className="text-emerald-700" /> : <Plus size={18} className="text-emerald-700" />}
        <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ mới'}</h2>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Mã hồ sơ" value={form.heritageCode} error={errors.heritageCode?.[0]} onChange={(val) => setForm({ ...form, heritageCode: val })} />
        <Field label="Tên di sản" value={form.name} error={errors.name?.[0]} onChange={(val) => setForm({ ...form, name: val })} />

        {/* 🟢 1. BẮT BUỘC CHỌN LOẠI HÌNH DI SẢN */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Loại hình di sản <span className="text-red-500">*</span>
          </span>
          <select
            required
            className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none transition-colors ${errors.category ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-700'
              }`}
            value={form.category}
            onChange={(e) => {
              setForm({ ...form, category: e.target.value });
              if (errors.category) setErrors({ ...errors, category: undefined });
            }}
          >
            <option value="">-- Chọn loại hình di sản --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category[0]}</p>}
        </label>

        <Field label="Nguồn dữ liệu" value={form.source} error={errors.source?.[0]} onChange={(val) => setForm({ ...form, source: val })} />

        {/* 🟢 2. CHỌN TỪ TỔ CHỨC ĐANG HOẠT ĐỘNG */}
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Tổ chức nguồn</span>
          <select
            className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none transition-colors ${errors.sourceOrganization ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-700'
              }`}
            value={form.sourceOrganization}
            onChange={(e) => setForm({ ...form, sourceOrganization: e.target.value })}
          >
            <option value="">-- Chọn tổ chức --</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.name}>
                {org.name}
              </option>
            ))}
          </select>
          {errors.sourceOrganization && <p className="mt-1 text-xs text-red-600">{errors.sourceOrganization[0]}</p>}
        </label>

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
        <button className="rounded bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 transition-colors" type="submit">
          {isEditing ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
        </button>
        {isEditing && (
          <button className="rounded border border-stone-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-stone-50 transition-colors" onClick={onCancel} type="button">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, value, error, onChange }: { label: string; value: string; error?: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        className={`mt-1 w-full rounded border px-3 py-2 text-sm outline-none transition-colors ${error ? 'border-red-500 focus:border-red-600' : 'border-stone-300 focus:border-emerald-700'
          }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  );
}
