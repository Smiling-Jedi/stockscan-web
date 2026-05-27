'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface StockInputProps {
  onAnalyze: (stock: string) => void;
  isLoading: boolean;
}

const QUICK_TAGS = [
  '腾讯',
  '阿里巴巴',
  '苹果',
  '英伟达',
  '茅台',
  '宁德时代',
  '浪潮信息',
  '比亚迪',
];

export default function StockInput({ onAnalyze, isLoading }: StockInputProps) {
  const [stock, setStock] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock.trim() || isLoading) return;
    onAnalyze(stock.trim());
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="输入股票名称或代码，如：浪潮信息 / SZ.000977 / 腾讯"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !stock.trim()}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2 transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              分析中
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              分析
            </>
          )}
        </button>
      </form>

      {/* Quick tags */}
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs text-gray-400 py-1">快捷：</span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setStock(tag);
              onAnalyze(tag);
            }}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-100 hover:text-blue-700 transition disabled:opacity-50"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
