
import React, { useState, useMemo, useEffect } from 'react';
import { SurveyForm } from './components/SurveyForm';
import { Dashboard } from './components/Dashboard';
import { Landing } from './components/Landing';
import { VoteRecord, AggregatedStats, AppMode } from './types';
import { QUESTIONS, STYLES } from './constants';
import { LayoutDashboard, Smartphone, Home } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LANDING);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  // Manage the public URL for the QR code centrally
  const [qrUrl, setQrUrl] = useState<string>('');

  useEffect(() => {
    // Initialize with current location
    // For GitHub Pages, use the full URL
    const currentUrl = window.location.href;
    // If running on localhost, suggest the GitHub Pages URL
    if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
      setQrUrl('https://gmood2008.github.io/management-tendency-surveyor/');
    } else {
      setQrUrl(currentUrl);
    }
  }, []);

  // Function to determine dominant style for a single user
  const calculateStyle = (answers: Record<string, string[]>): string => {
    const scores: Record<string, number> = {
      [STYLES.RESULT]: 0,
      [STYLES.TEAM]: 0,
      [STYLES.PROCESS]: 0,
      [STYLES.INNOVATION]: 0
    };

    // Only iterate questions that have style mapping (Q1, Q2, Q3, Q5)
    QUESTIONS.forEach(q => {
      const selectedOpts = answers[q.id];
      if (selectedOpts) {
        selectedOpts.forEach(optId => {
          const option = q.options.find(o => o.id === optId);
          if (option && option.styleCategory) {
            scores[option.styleCategory]++;
          }
        });
      }
    });

    // Find max score
    let maxScore = -1;
    let maxStyle = STYLES.PROCESS; // Default fallback

    Object.entries(scores).forEach(([style, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxStyle = style;
      }
    });

    return maxStyle;
  };

  const handleSurveySubmit = (name: string, answers: Record<string, string[]>) => {
    const style = calculateStyle(answers);
    const newVote: VoteRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userName: name,
      answers,
      calculatedStyle: style,
      timestamp: Date.now()
    };
    setVotes(prev => [...prev, newVote]);
    return newVote;
  };

  // Aggregate data for dashboard and comparison
  const stats = useMemo<AggregatedStats>(() => {
    const s: AggregatedStats = {
      totalParticipants: votes.length,
      styleDistribution: {},
      questionStats: {}
    };

    votes.forEach(vote => {
      // Aggregate Styles
      s.styleDistribution[vote.calculatedStyle] = (s.styleDistribution[vote.calculatedStyle] || 0) + 1;

      // Aggregate Individual Questions
      Object.entries(vote.answers).forEach(([qId, optIds]) => {
        if (!s.questionStats[qId]) s.questionStats[qId] = {};
        optIds.forEach(optId => {
          s.questionStats[qId][optId] = (s.questionStats[qId][optId] || 0) + 1;
        });
      });
    });
    return s;
  }, [votes]);

  const simulateVotes = () => {
    const newVotes: VoteRecord[] = [];
    for (let i = 0; i < 5; i++) {
      const answers: Record<string, string[]> = {};
      // Randomly pick answers
      QUESTIONS.forEach(q => {
        if (q.type === 'single') {
           const randomOpt = q.options[Math.floor(Math.random() * q.options.length)];
           answers[q.id] = [randomOpt.id];
        } else {
           // Multi select (pick 2 random)
           const shuffled = [...q.options].sort(() => 0.5 - Math.random());
           answers[q.id] = shuffled.slice(0, 2).map(o => o.id);
        }
      });
      const style = calculateStyle(answers);
      newVotes.push({
        id: Math.random().toString(36).substr(2, 9),
        userName: `模拟学员${i+1}`,
        answers,
        calculatedStyle: style,
        timestamp: Date.now()
      });
    }
    setVotes(prev => [...prev, ...newVotes]);
  };

  const renderContent = () => {
    switch (mode) {
      case AppMode.LANDING:
        return (
          <Landing 
            onStartSurvey={() => setMode(AppMode.PARTICIPANT)}
            onGoToDashboard={() => setMode(AppMode.PRESENTER)}
            initialUrl={qrUrl}
            onUrlChange={setQrUrl}
          />
        );
      case AppMode.PARTICIPANT:
        return <SurveyForm onSubmit={handleSurveySubmit} stats={stats} />;
      case AppMode.PRESENTER:
        return (
          <Dashboard 
            stats={stats} 
            onSimulate={simulateVotes} 
            onReset={() => setVotes([])}
            qrUrl={qrUrl}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {renderContent()}

      {/* Floating Mode Switcher (Hidden on Landing to keep it clean, shown elsewhere for dev/demo ease) */}
      {mode !== AppMode.LANDING && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
           <button
            onClick={() => setMode(AppMode.LANDING)}
            className="bg-white hover:bg-slate-100 text-slate-700 p-3 rounded-full shadow-lg transition-all hover:scale-105 border border-slate-200"
            title="返回首页"
          >
            <Home size={20} />
          </button>
          
          <button
            onClick={() => setMode(mode === AppMode.PARTICIPANT ? AppMode.PRESENTER : AppMode.PARTICIPANT)}
            className="bg-slate-800 hover:bg-slate-900 text-white p-3 rounded-full shadow-xl transition-all hover:scale-105 flex items-center space-x-2 pr-4 border border-slate-700"
            title="切换视图"
          >
            {mode === AppMode.PARTICIPANT ? (
              <>
                <LayoutDashboard size={20} />
                <span className="text-sm font-medium">讲师投屏</span>
              </>
            ) : (
              <>
                <Smartphone size={20} />
                <span className="text-sm font-medium">学员端</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
