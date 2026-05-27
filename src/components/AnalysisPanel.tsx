'use client';

import { AnalysisRecord } from '@/types';
import { FileText, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

interface AnalysisPanelProps {
  record: AnalysisRecord | null;
}

function SignalBadge({ signal }: { signal: string }) {
  const color = signal.includes('🟢') || signal.includes('绿灯')
    ? 'bg-green-100 text-green-700'
    : signal.includes('🔴') || signal.includes('红灯')
    ? 'bg-red-100 text-red-700'
    : 'bg-yellow-100 text-yellow-700';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {signal}
    </span>
  );
}

export default function AnalysisPanel({ record }: AnalysisPanelProps) {
  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <FileText className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium text-gray-500">输入股票开始分析</p>
        <p className="text-sm mt-1">支持中文名称、股票代码、英文名称</p>
      </div>
    );
  }

  const r = record.result;
  const hasParsed = r.step1 || r.step2 || r.step3;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{record.stock}</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {new Date(record.timestamp).toLocaleString('zh-CN')}
          </p>
        </div>
      </div>

      {/* Raw text view (fallback) */}
      {!hasParsed ? (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {r.rawText}
          </pre>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Step 1 */}
          {r.step1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 1</span>
                <span className="text-sm font-medium text-gray-700">模式识别</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-2">{r.step1.summary}</p>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p><span className="text-gray-400">做什么：</span>{r.step1.business}</p>
                <p><span className="text-gray-400">怎么收费：</span>{r.step1.pricing}</p>
                <p><span className="text-gray-400">客户黏性：</span>{r.step1.stickiness}</p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {r.step2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 2</span>
                <span className="text-sm font-medium text-gray-700">财务体检</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 text-gray-500 font-normal">指标</th>
                      <th className="text-left py-2 text-gray-500 font-normal">信号</th>
                      <th className="text-left py-2 text-gray-500 font-normal">关键数据与逻辑</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-gray-700">盈利真实性</td>
                      <td className="py-2"><SignalBadge signal={r.step2.profit?.signal || '?'} /></td>
                      <td className="py-2 text-gray-600">{r.step2.profit?.logic || ''}</td>
                    </tr>
                    <tr className="border-b border-gray-50">
                      <td className="py-2 text-gray-700">回款健康度</td>
                      <td className="py-2"><SignalBadge signal={r.step2.receivable?.signal || '?'} /></td>
                      <td className="py-2 text-gray-600">{r.step2.receivable?.logic || ''}</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-gray-700">现金流质量</td>
                      <td className="py-2"><SignalBadge signal={r.step2.cashflow?.signal || '?'} /></td>
                      <td className="py-2 text-gray-600">{r.step2.cashflow?.logic || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {r.step3 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 3</span>
                <span className="text-sm font-medium text-gray-700">估值定位</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p><span className="text-gray-400">适用模型：</span>{r.step3.model}</p>
                <p><span className="text-gray-400">历史分位：</span>{r.step3.percentile}</p>
                <p><span className="text-gray-400">机构预测：</span>{r.step3.forecast}</p>
                <p><span className="text-gray-400">综合判断：</span>{r.step3.judgment}</p>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {r.step4 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 4</span>
                <span className="text-sm font-medium text-gray-700">趋势判断</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-2">{r.step4.trend}</p>
              <p className="text-sm text-gray-600 mb-2">{r.step4.status}</p>
              <div className="flex gap-4 text-sm">
                <span className="text-red-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {r.step4.support}
                </span>
                <span className="text-green-600">
                  {r.step4.resistance}
                </span>
              </div>
            </div>
          )}

          {/* Step 5 */}
          {r.step5 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 5</span>
                <span className="text-sm font-medium text-gray-700">交叉验证</span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <p>基本面：{r.step5.fundamental}</p>
                <p>技术面：{r.step5.technical}</p>
                <p className="font-semibold text-gray-900 mt-2">{r.step5.conclusion}</p>
              </div>
            </div>
          )}

          {/* Step 6 */}
          {r.step6 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Step 6</span>
                <span className="text-sm font-medium text-gray-700">操作参考</span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <span>{r.step6.logic}</span>
                </p>
                <p className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <span>{r.step6.risk}</span>
                </p>
                {r.step6.signals && r.step6.signals.length > 0 && (
                  <div className="pl-6">
                    {r.step6.signals.map((s, i) => (
                      <p key={i} className="text-gray-500">{s}</p>
                    ))}
                  </div>
                )}
                <p className="font-medium text-gray-900 mt-2">{r.step6.advice}</p>
              </div>
            </div>
          )}

          {/* Raw text toggle */}
          {r.rawText && (
            <details className="bg-gray-50 rounded-xl border border-gray-200">
              <summary className="px-4 py-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700 select-none">
                查看原始文本
              </summary>
              <pre className="px-4 pb-4 text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                {r.rawText}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
