import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StockScan - 股票快速分析',
  description: 'AI驱动的股票投资快速分析工具',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
