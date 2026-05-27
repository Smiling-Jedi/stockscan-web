'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import StockInput from '@/components/StockInput';
import AnalysisPanel from '@/components/AnalysisPanel';
import { AnalysisRecord, AnalysisResult } from '@/types';
import { getHistory, addRecord, deleteRecord, clearHistory } from '@/lib/storage';

export default function Home() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [activeRecord, setActiveRecord] = useState<AnalysisRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRecords(getHistory());
  }, []);

  const handleAnalyze = async (stock: string) => {
    setIsLoading(true);
    setError('');
    setSidebarOpen(false);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '分析失败');
      }

      const record: AnalysisRecord = {
        id: Date.now().toString(),
        stock,
        timestamp: Date.now(),
        result: {
          step1: data.parsed?.step1,
          step2: data.parsed?.step2,
          step3: data.parsed?.step3,
          step4: data.parsed?.step4,
          step5: data.parsed?.step5,
          step6: data.parsed?.step6,
          rawText: data.raw || '',
        } as AnalysisResult,
      };

      addRecord(record);
      setRecords(getHistory());
      setActiveRecord(record);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (record: AnalysisRecord) => {
    setActiveRecord(record);
    setSidebarOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteRecord(id);
    const updated = getHistory();
    setRecords(updated);
    if (activeRecord?.id === id) {
      setActiveRecord(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleClear = () => {
    clearHistory();
    setRecords([]);
    setActiveRecord(null);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        records={records}
        activeId={activeRecord?.id || null}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onClear={handleClear}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">StockScan</span>
            <span className="text-xs text-gray-400 hidden sm:inline">AI 股票快速分析</span>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Stock Input */}
            <StockInput onAnalyze={handleAnalyze} isLoading={isLoading} />

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-700">分析失败</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Analysis Result */}
            <AnalysisPanel record={activeRecord} />
          </div>
        </div>
      </div>
    </div>
  );
}
