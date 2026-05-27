import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

function getSystemPrompt(): string {
  try {
    const skillPath = join(process.cwd(), '..', '.claude', 'skills', 'stockscan', 'skill.md');
    return readFileSync(skillPath, 'utf-8');
  } catch {
    // Fallback prompt if file not found
    return `你是股票投资快速分析师 StockScan。对用户指定的股票执行 6 步结构化快速分析：
Step 1 模式识别、Step 2 财务体检、Step 3 估值定位、Step 4 趋势判断、Step 5 交叉验证、Step 6 操作参考。
核心约束：结论必须有数据锚点（具体数字+单位）、禁止模糊词汇、总字数≤800字。`;
  }
}

export async function POST(request: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not configured' },
      { status: 500 }
    );
  }

  try {
    const { stock } = await request.json();
    if (!stock || typeof stock !== 'string') {
      return NextResponse.json(
        { error: 'Stock code/name is required' },
        { status: 400 }
      );
    }

    const systemPrompt = getSystemPrompt();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `分析一下 ${stock}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error?.message || 'Claude API error' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content?.[0]?.text || '';

    // Parse the analysis result into structured format
    const parsed = parseAnalysis(content);

    return NextResponse.json({
      raw: content,
      parsed,
    });
  } catch (error) {
    console.error('Analyze error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function parseAnalysis(text: string): Record<string, unknown> {
  // Simple parsing logic - extract sections
  const result: Record<string, unknown> = {};

  // Step 1
  const step1Match = text.match(/\*\*([^*]+)\*\*[\s\S]*?做什么[:：]([^\n]+)\n怎么收费[:：]([^\n]+)\n客户黏性[:：]([^\n]+)/);
  if (step1Match) {
    result.step1 = {
      summary: step1Match[1].trim(),
      business: step1Match[2].trim(),
      pricing: step1Match[3].trim(),
      stickiness: step1Match[4].trim(),
    };
  }

  // Step 2 - extract table rows
  const step2Rows = text.match(/盈利真实性\s*\|\s*([^|]+)\|\s*([^\n|]+)/);
  if (step2Rows) {
    result.step2 = {
      profit: { signal: step2Rows[1].trim(), logic: step2Rows[2].trim() },
    };
  }

  // Step 3
  const step3Model = text.match(/适用模型[:：]([^\n]+)/);
  const step3Percentile = text.match(/历史分位[:：]([^\n]+)/);
  const step3Forecast = text.match(/机构预测[^\n]*/);
  const step3Judgment = text.match(/综合判断[:：]([^\n]+)/);
  if (step3Model || step3Percentile) {
    result.step3 = {
      model: step3Model?.[1]?.trim() || '数据不可得',
      percentile: step3Percentile?.[1]?.trim() || '数据不可得',
      forecast: step3Forecast?.[0]?.trim() || '数据不可得',
      judgment: step3Judgment?.[1]?.trim() || '数据不可得',
    };
  }

  // Step 4
  const step4Trend = text.match(/\*\*([^*]+)\*\*/);
  const step4Status = text.match(/股价[^\n]+/);
  const step4Support = text.match(/支撑位[^\n]+/);
  if (step4Trend) {
    result.step4 = {
      trend: step4Trend[1].trim(),
      status: step4Status?.[0]?.trim() || '',
      support: step4Support?.[0]?.trim() || '',
      resistance: '',
    };
  }

  // Step 5
  const step5Fundamental = text.match(/基本面[（(][^)]+[）)][:：]([^\n]+)/);
  const step5Technical = text.match(/技术面[（(][^)]+[）)][:：]([^\n]+)/);
  const step5Conclusion = text.match(/\*\*([^*]+)\*\*/g);
  if (step5Fundamental || step5Technical) {
    result.step5 = {
      fundamental: step5Fundamental?.[1]?.trim() || '',
      technical: step5Technical?.[1]?.trim() || '',
      conclusion: step5Conclusion?.[step5Conclusion.length - 1]?.replace(/\*\*/g, '').trim() || '',
    };
  }

  // Step 6
  const step6Logic = text.match(/核心逻辑[:：]([^\n]+)/);
  const step6Risk = text.match(/核心风险[:：]([^\n]+)/);
  const step6Advice = text.match(/当前建议[:：]([^\n]+)/);
  if (step6Logic || step6Risk) {
    result.step6 = {
      logic: step6Logic?.[1]?.trim() || '',
      risk: step6Risk?.[1]?.trim() || '',
      signals: [],
      advice: step6Advice?.[1]?.trim() || '',
    };
  }

  return result;
}
