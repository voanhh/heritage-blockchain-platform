import { ShieldCheck } from 'lucide-react';

export function DashboardPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Dashboard nền tảng nghiên cứu</h1>
        <p className="mt-3 max-w-3xl text-slate-600">
          Prototype chuẩn bị kiến trúc định danh, hash dữ liệu, lưu trữ lai và đối chiếu Database với
          Blockchain cho hồ sơ di sản văn hóa phi vật thể.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {['Hồ sơ di sản', 'Kiểm duyệt', 'Bản ghi Blockchain'].map((label) => (
          <div key={label} className="rounded border border-stone-200 bg-white p-5">
            <ShieldCheck className="text-emerald-700" size={22} />
            <h2 className="mt-4 text-base font-semibold text-slate-900">{label}</h2>
            <p className="mt-2 text-sm text-slate-600">Placeholder cho giai đoạn triển khai nghiệp vụ sau.</p>
          </div>
        ))}
      </div>
    </section>
  );
}

