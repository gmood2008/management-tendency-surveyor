
import React, { useState } from 'react';
import { QUESTIONS, STYLE_DESCRIPTIONS } from '../constants';
import { VoteRecord, AggregatedStats } from '../types';
import { CheckCircle2, Circle, Square, CheckSquare, User, BarChart2 } from 'lucide-react';

interface SurveyFormProps {
  onSubmit: (name: string, answers: Record<string, string[]>) => VoteRecord;
  stats?: AggregatedStats; // Optional stats for comparison
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmit, stats }) => {
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<VoteRecord | null>(null);

  const handleOptionSelect = (questionId: string, optionId: string, isMulti: boolean) => {
    const currentSelected = answers[questionId] || [];
    
    if (isMulti) {
      if (currentSelected.includes(optionId)) {
        setAnswers({ ...answers, [questionId]: currentSelected.filter(id => id !== optionId) });
      } else {
        setAnswers({ ...answers, [questionId]: [...currentSelected, optionId] });
      }
    } else {
      setAnswers({ ...answers, [questionId]: [optionId] });
    }
  };

  const isFormValid = () => {
    if (!name.trim()) return false;
    return QUESTIONS.every(q => {
      const ans = answers[q.id];
      return ans && ans.length > 0;
    });
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      const record = onSubmit(name, answers);
      setResult(record);
      window.scrollTo(0, 0);
    }
  };

  if (result) {
    const styleDesc = STYLE_DESCRIPTIONS[result.calculatedStyle] || '您的管理风格比较均衡。';
    
    // Calculate stats comparison if available
    let populationPercentage = 0;
    if (stats && stats.totalParticipants > 0) {
      const count = stats.styleDistribution[result.calculatedStyle] || 0;
      populationPercentage = Math.round((count / stats.totalParticipants) * 100);
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50 animate-fade-in font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border-t-4 border-blue-600">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">提交成功</h2>
          <p className="text-slate-600 mb-6">感谢您的参与，{result.userName}。</p>
          
          <div className="bg-blue-50 p-6 rounded-xl text-left mb-6 relative overflow-hidden">
            <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2">您的管理倾向分析</h3>
            <p className="text-2xl font-extrabold text-blue-900 mb-3">{result.calculatedStyle}</p>
            <p className="text-blue-800 leading-relaxed text-sm">
              {styleDesc}
            </p>
          </div>

          {/* Group Comparison Section */}
          {stats && stats.totalParticipants > 0 && (
             <div className="bg-slate-100 p-4 rounded-xl text-left flex items-start space-x-3">
               <div className="p-2 bg-white rounded-full text-slate-500 shadow-sm">
                 <BarChart2 size={20} />
               </div>
               <div>
                 <h4 className="text-sm font-bold text-slate-700 mb-1">班级整体画像对比</h4>
                 <p className="text-xs text-slate-500 leading-5">
                   在当前已提交的 <strong className="text-slate-800">{stats.totalParticipants}</strong> 位学员中，
                   有 <strong className="text-blue-600 text-base">{populationPercentage}%</strong> 的人和您属于同一类型。
                 </p>
                 {/* Simple Bar Visual */}
                 <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                   <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${populationPercentage}%` }}
                   />
                 </div>
               </div>
             </div>
          )}
          
          <p className="text-xs text-slate-400 mt-8">请关注前方大屏幕查看全班详细分布与AI解读。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-32 font-sans">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-extrabold text-slate-900">管理风格调研</h1>
        <p className="text-slate-500 mt-1">请根据您的实际工作习惯如实填写</p>
      </header>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center">
            <User size={16} className="mr-2" />
            您的姓名
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入姓名"
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </section>

        {QUESTIONS.map((q) => (
          <section key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {q.text}
              {q.type === 'multi' && <span className="text-xs font-normal text-blue-600 ml-2 bg-blue-50 px-2 py-1 rounded-full">多选</span>}
            </h3>
            
            <div className="space-y-3">
              {q.options.map((opt) => {
                const isSelected = (answers[q.id] || []).includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleOptionSelect(q.id, opt.id, q.type === 'multi')}
                    className={`
                      relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-900' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'}
                    `}
                  >
                    <div className={`mr-3 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}>
                      {q.type === 'multi' 
                        ? (isSelected ? <CheckSquare size={22} /> : <Square size={22} />)
                        : (isSelected ? <CheckCircle2 size={22} /> : <Circle size={22} />)
                      }
                    </div>
                    <span className="font-medium">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-center z-10 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid()}
          className={`
            w-full max-w-md py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all
            ${!isFormValid() 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-95'}
          `}
        >
          查看结果
        </button>
      </div>
    </div>
  );
};
