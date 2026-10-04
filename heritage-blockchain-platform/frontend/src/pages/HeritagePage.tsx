import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Plus,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { heritageVersionApi } from '../api/heritage-version.api';
import { HeritageVersionItem, LocationItem } from '../types/heritage';
import toast from 'react-hot-toast';

export function HeritagePage() {
  const [versions, setVersions] = useState<HeritageVersionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');

  // Fetch danh sách Phiên bản Di sản
  const fetchVersions = async () => {
    try {
      setLoading(true);
      const res = await heritageVersionApi.getVersions({
        search: search.trim() || undefined,
        location: locationFilter.trim() || undefined,
      });

      const list = Array.isArray(res.data) ? res.data : [];
      setVersions(list);
    } catch (error) {
      console.error('Lỗi khi tải danh sách di sản:', error);
      toast.error('Không thể tải danh sách di sản');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVersions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, locationFilter]);

  // Helper bóc tách chỉ lấy Tỉnh/Thành phố
  const renderProvince = (locations?: LocationItem[] | null) => {
    if (!locations || locations.length === 0) return 'Chưa xác định';
    const provinces = Array.from(
      new Set(locations.map((loc) => loc.province).filter(Boolean))
    );
    return provinces.length > 0 ? provinces.join(', ') : 'Chưa xác định';
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] p-4 sm:p-6 font-sans text-slate-800">
      {/* Header & Tiêu đề */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Danh mục Di sản Văn hóa Quốc gia
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Hệ thống lưu trữ, minh bạch thông tin và xác thực tính toàn vẹn dữ liệu di sản trên Blockchain.
          </p>
        </div>

        <Link
          to="/heritage/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
        >
          <Plus size={18} />
          Lập hồ sơ di sản
        </Link>
      </div>

      {/* Thanh Tìm kiếm & Lọc */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        {/* Tìm kiếm tên / mã */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên di sản, mã di sản..."
            className="w-full rounded-lg border border-stone-300 bg-stone-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>

        {/* Lọc tỉnh/thành */}
        <div className="relative flex-1 sm:max-w-xs">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Lọc theo tỉnh / thành..."
            className="w-full rounded-lg border border-stone-300 bg-stone-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all"
          />
        </div>

        <button
          onClick={fetchVersions}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-stone-100 transition-colors shrink-0"
          title="Tải lại dữ liệu"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin text-emerald-700' : ''} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Danh sách Dạng Grid Card Responsive */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="flex flex-col items-center justify-center gap-2">
            <RefreshCw size={28} className="animate-spin text-emerald-700" />
            <span>Đang tải danh sách di sản...</span>
          </div>
        </div>
      ) : versions.length === 0 ? (
        <div className="rounded-xl border border-stone-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-2">
            <AlertTriangle size={32} className="text-amber-500" />
            <p className="font-medium">Không tìm thấy di sản nào phù hợp.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {versions.map((vItem) => {
            const canonical = vItem.canonicalData;
            const heritage = canonical?.heritage;
            const field = canonical?.field;

            // Thumbnail Image
            const mediaList = vItem.mediaList || vItem.media || [];
            const firstMedia = mediaList.find((m) => m.type === 'IMAGE') || mediaList[0];
            const displayImageUrl = firstMedia?.thumbnailUrl || firstMedia?.url;

            return (
              <Link
                key={vItem.id}
                to={`/heritages/${vItem.heritageId}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-emerald-600/40"
              >
                {/* Frame Ảnh Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-stone-100 border-b border-stone-100">
                  {displayImageUrl ? (
                    <img
                      src={displayImageUrl}
                      alt={heritage?.name || 'Di sản'}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <ImageIcon size={32} />
                    </div>
                  )}

                  {/* Mã Di sản góc trên ảnh */}
                  {heritage?.heritageCode && (
                    <span className="absolute top-2.5 left-2.5 rounded bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[11px] font-mono font-medium text-white shadow-xs">
                      {heritage.heritageCode}
                    </span>
                  )}
                </div>

                {/* Nội dung bên dưới */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    {/* Badge Loại hình */}
                    {field?.name && (
                      <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded px-2 py-0.5 mb-2">
                        {field.name}
                      </span>
                    )}

                    {/* Tên di sản */}
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-800 line-clamp-2 text-base leading-snug transition-colors">
                      {heritage?.name || 'Chưa có tên'}
                    </h3>
                  </div>

                  {/* Địa điểm Tỉnh & Ngày ghi danh */}
                  <div className="mt-4 border-t border-stone-100 pt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={14} className="text-stone-400 shrink-0" />
                      <span className="truncate font-medium">{renderProvince(heritage?.location)}</span>
                    </div>

                    {heritage?.recognizedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-stone-400 shrink-0" />
                        <span>{new Date(heritage.recognizedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
