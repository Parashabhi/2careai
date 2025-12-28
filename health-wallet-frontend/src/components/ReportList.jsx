import React from 'react';
import { FileText, Download, Eye, Share2, Calendar, Tag } from 'lucide-react';

const ReportList = ({ reports , onShareClick}) => {
  const API_BASE_URL = "http://localhost:5000";

  const handleView = (fileUrl) => {
    // Opens the PDF/Image in a new browser tab for viewing
    window.open(`${API_BASE_URL}${fileUrl}`, '_blank');
  };

  const handleDownload = async (fileUrl, fileName) => {
    // This force-downloads the file instead of just opening it
    const response = await fetch(`${API_BASE_URL}${fileUrl}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || 'health-report');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <FileText className="text-blue-600" size={20} /> 
        Your Medical Records
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.length === 0 ? (
          <div className="col-span-2 py-10 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            No reports found. Upload your first record to get started.
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{report.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-tight">
                        {report.type}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar size={12} /> {report.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-6">
                <button 
                  onClick={() => handleView(report.file_url)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Eye size={16} /> View
                </button>
                <button 
                  onClick={() => handleDownload(report.file_url, report.title)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-blue-50 hover:text-blue-600 transition-all"
                >
                  <Download size={16} /> Get
                </button>
                <button 
                onClick={() => onShareClick(report.id)}
                  className="flex items-center justify-center gap-2 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                >
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;