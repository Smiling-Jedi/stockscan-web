'use client';

import { AnalysisRecord } from '@/types';
import { Trash2, Clock, BarChart3 } from 'lucide-react';

interface SidebarProps {
  records: AnalysisRecord[];
  activeId: string | null;
  onSelect: (record: AnalysisRecord) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  records,
  activeId,
  onSelect,
  onDelete,
  onClear,
  isOpen,
  onClose,
}: SidebarProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900">分析历史</h2>
          </div>
          {records.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition"
            >
              <Trash2 className="w-3 h-3" />
              清空
            </button>
          )}
        </div>

        {/* Record list */}
        <div className="flex-1 overflow-y-auto">
          {records.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Clock className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">暂无分析记录</p>
              <p className="text-xs mt-1">输入股票代码开始分析</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {records.map((record) => (
                <div
                  key={record.id}
                  onClick={() => onSelect(record)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition group ${
                    activeId === record.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 truncate flex-1">
                      {record.stock}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(record.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(record.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-400 text-center">
          共 {records.length} 条记录
        </div>
      </aside>
    </>
  );
}
