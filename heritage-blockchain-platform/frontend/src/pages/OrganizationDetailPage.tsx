import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, Mail, ArrowLeft, Calendar, FileText, ExternalLink, Loader2, ShieldCheck } from 'lucide-react';
import axiosClient from '../api/axiosClient';

interface OrganizationDetail {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  legalDocumentUrls: string[];
  createdAt: string;
  status: string;
}

export default function OrganizationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [org, setOrg] = useState<OrganizationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgDetail = async () => {
      try {
        setLoading(true);
        // API lấy chi tiết 1 tổ chức theo ID
        const res = await axiosClient.get(`/organization/${id}`);
        setOrg(res.data.data);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết tổ chức:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrgDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!org) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <p className="text-slate-500">Không tìm thấy thông tin tổ chức.</p>
        <button
          onClick={() => navigate('/organization/list')}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:underline"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Nút Quay lại */}
      <button
        onClick={() => navigate('/organization/list')}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} /> Quay lại danh sách tổ chức
      </button>

      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-stone-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{org.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail size={14} className="text-slate-400" /> {org.contactEmail}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} className="text-slate-400" /> Ngày tham gia: {new Date(org.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <ShieldCheck size={14} /> Đã phê duyệt chính thức
          </span>
        </div>

        {/* Nội dung chi tiết */}
        <div className="mt-6 space-y-6">
          {/* Mô tả */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-800">Giới thiệu & Chức năng</h3>
            <p className="whitespace-pre-line rounded-lg bg-stone-50 p-4 text-sm leading-relaxed text-slate-600 border border-stone-100">
              {org.description}
            </p>
          </div>

          {/* Hồ sơ pháp lý */}
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-800">Hồ sơ & Tài liệu đính kèm</h3>
            {org.legalDocumentUrls && org.legalDocumentUrls.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {org.legalDocumentUrls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-3 text-xs font-medium text-slate-700 transition-colors hover:border-emerald-500 hover:text-emerald-700"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText size={16} className="text-slate-400" />
                      <span className="truncate">Tài liệu pháp lý #{idx + 1}</span>
                    </div>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Không có tài liệu minh chứng công khai.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
