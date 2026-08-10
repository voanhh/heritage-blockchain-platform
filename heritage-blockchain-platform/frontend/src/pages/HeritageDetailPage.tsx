import { useParams } from 'react-router-dom';

export function HeritageDetailPage() {
  const { id } = useParams();

  return (
    <section>
      <h1 className="text-2xl font-semibold text-slate-900">Chi tiết hồ sơ di sản</h1>
      <p className="mt-2 text-slate-600">Mã hồ sơ: {id}</p>
    </section>
  );
}

