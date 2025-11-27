
import React, { useState } from 'react';
import { AggregatedStats } from '../types';
import { STYLES, QUESTIONS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { analyzeAudience } from '../services/geminiService';
import { Sparkles, BarChart3, PieChart as PieIcon, RefreshCw, Users, QrCode } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import QRCode from 'react-qr-code';

interface DashboardProps {
  stats: AggregatedStats;
  onSimulate: () => void;
  onReset: () => void;
  qrUrl: string; // Add prop to receive the global URL
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onSimulate, onReset, qrUrl }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Data for "Class Personnel Composition" (Pie Chart)
  const styleColors: Record<string, string> = {
    [STYLES.RESULT]: '#f43f5e', // Red
    [STYLES.TEAM]: '#3b82f6',   // Blue
    [STYLES.PROCESS]: '#10b981',// Emerald
    [STYLES.INNOVATION]: '#f59e0b' // Amber
  };

  const compositionData = Object.entries(stats.styleDistribution).map(([style, count]) => ({
    name: style,
    value: count,
    color: styleColors[style] || '#94a3b8'
  })).filter(d => d.value > 0);

  // Data for "Core Qualities" (Question 4)
  const q4 = QUESTIONS.find(q => q.id === 'q4');
  const qualitiesData = q4?.options.map(opt => ({
    name: opt.text.substring(3), // Remove "A. "
    count: stats.questionStats['q4']?.[opt.id] || 0,
    fullText: opt.text
  })).sort((a, b) => b.count - a.count) || [];

  const handleAiAnalysis = async () => {
    if (stats.totalParticipants === 0) return;
    setLoadingAi(true);
    const result = await analyzeAudience(stats);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10 font-sans">
      <header className="mb-8 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">参训人员管理倾向分析</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
              <Users size={16} className="mr-2" />
              已提交人数: {stats.totalParticipants}
            </span>
            <span className="text-slate-400 text-sm">实时数据同步中...</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
           <button 
            onClick={onSimulate}
            className="px-4 py-2 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium transition-colors"
          >
            模拟 (+5人)
          </button>
          <button 
            onClick={onReset}
            className="px-4 py-2 bg-white border border-slate-300 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
          >
            清空数据
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* QR Code Card */}
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-slate-500" />
            扫码参与调研
          </h3>
          <div className="bg-white p-2 border-2 border-slate-100 rounded-xl mb-4">
            {qrUrl && (
              <div style={{ height: "auto", margin: "0 auto", maxWidth: 160, width: "100%" }}>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={qrUrl}
                  viewBox={`0 0 256 256`}
                />
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 break-all px-2">{qrUrl}</p>
        </div>

        {/* Pie Chart: Personnel Classification */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <PieIcon className="w-5 h-5 mr-2 text-indigo-500" />
              人员类型分布 (基于Q1,2,3,5)
            </h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="middle" 
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  formatter={(value, entry: any) => (
                    <span className="text-slate-600 text-sm font-medium ml-2">
                      {value} <span className="text-slate-400">({entry.payload.value})</span>
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-slate-400 mt-2">
            *类型基于每位学员在相关问题中的最高频选项判定
          </div>
        </div>

        {/* Bar Chart: Core Qualities */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              看重的核心素质 (Q4)
            </h3>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualitiesData} layout="vertical" margin={{ left: 5, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={70} 
                  tick={{ fontSize: 13, fill: '#475569', fontWeight: 500 }} 
                  interval={0}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} label={{ position: 'right', fill: '#64748b', fontSize: 12 }}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl shadow-xl overflow-hidden text-white border border-slate-700">
        <div className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center text-white">
                <Sparkles className="w-6 h-6 mr-3 text-yellow-400" />
                AI 助教深度解读
              </h2>
              <p className="text-slate-400 text-sm mt-1">基于当前 {stats.totalParticipants} 份样本的培训建议</p>
            </div>
            <button
              onClick={handleAiAnalysis}
              disabled={loadingAi || stats.totalParticipants === 0}
              className={`
                flex items-center px-6 py-3 rounded-xl font-semibold transition-all
                ${loadingAi 
                  ? 'bg-slate-700 text-slate-400 cursor-wait' 
                  : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-lg shadow-indigo-500/30'}
              `}
            >
              {loadingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> 正在分析数据...
                </>
              ) : (
                '生成分析报告'
              )}
            </button>
          </div>

          {!aiAnalysis && !loadingAi && (
            <div className="text-slate-500 py-12 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50">
              <p>等待学员提交数据后，点击右上角生成基于班级画像的教学策略。</p>
            </div>
          )}

          {aiAnalysis && (
            <div className="prose prose-invert max-w-none animate-fade-in bg-slate-800/80 p-6 rounded-xl border border-slate-700">
              <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
