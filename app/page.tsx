'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsStats {
  totalPageViews: number;
  totalAnalyses: number;
  uniqueSessions: number;
  averageCharacterCount: number;
  averageDifficultyScore: number;
  averageReadingTimeSeconds: number;
  sampleTextUsage: {
    short: number;
    medium: number;
    difficult: number;
  };
  errorCount: number;
  dailyStats: {
    date: string;
    pageViews: number;
    analyses: number;
    uniqueSessions: number;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    const savedApiUrl = localStorage.getItem('analytics_api_url');
    if (savedApiUrl) {
      setApiUrl(savedApiUrl);
      fetchStats(savedApiUrl);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async (url: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${url}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleApiUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('analytics_api_url', apiUrl);
    fetchStats(apiUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">読み込み中...</div>
      </div>
    );
  }

  if (!apiUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4">Analytics API URL設定</h1>
          <form onSubmit={handleApiUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                API URL
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-api.vercel.app"
                className="w-full px-4 py-2 border rounded-lg text-black"
                required
              </input>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              設定
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">エラー: {error}</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>データがありません</div>
      </div>
    );
  }

  // Prepare chart data
  const dailyChartData = {
    labels: stats.dailyStats.map(d => d.date),
    datasets: [
      {
        label: 'ページビュー',
        data: stats.dailyStats.map(d => d.pageViews),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
      {
        label: '分析実行数',
        data: stats.dailyStats.map(d => d.analyses),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  };

  const sampleTextData = {
    labels: ['短いサンプル', '中程度のサンプル', '難しいサンプル'],
    datasets: [
      {
        data: [
          stats.sampleTextUsage.short,
          stats.sampleTextUsage.medium,
          stats.sampleTextUsage.difficult,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">note読了時間予想 - 統計ダッシュボード</h1>
          <button
            onClick={() => fetchStats(apiUrl)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            更新
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">総ページビュー</div>
            <div className="text-3xl font-bold">{stats.totalPageViews.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">総分析実行数</div>
            <div className="text-3xl font-bold">{stats.totalAnalyses.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">ユニークセッション</div>
            <div className="text-3xl font-bold">{stats.uniqueSessions.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">エラー数</div>
            <div className="text-3xl font-bold">{stats.errorCount.toLocaleString()}</div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">平均文字数</div>
            <div className="text-2xl font-bold">{stats.averageCharacterCount.toLocaleString()}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">平均難易度スコア</div>
            <div className="text-2xl font-bold">{stats.averageDifficultyScore.toFixed(1)}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm mb-1">平均読了時間</div>
            <div className="text-2xl font-bold">
              {Math.floor(stats.averageReadingTimeSeconds / 60)}分
              {stats.averageReadingTimeSeconds % 60}秒
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">30日間の推移</h2>
            <Line
              data={dailyChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">サンプルテキスト使用状況</h2>
            <Doughnut
              data={sampleTextData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* API URL Settings */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">設定</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Analytics API URL</label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-black"
              />
            </div>
            <button
              onClick={() => {
                localStorage.setItem('analytics_api_url', apiUrl);
                fetchStats(apiUrl);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
