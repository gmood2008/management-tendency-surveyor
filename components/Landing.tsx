
import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { ScanLine, Play, LayoutDashboard, Link, Settings } from 'lucide-react';

interface LandingProps {
  onStartSurvey: () => void;
  onGoToDashboard: () => void;
  initialUrl: string;
  onUrlChange: (url: string) => void;
}

export const Landing: React.FC<LandingProps> = ({ onStartSurvey, onGoToDashboard, initialUrl, onUrlChange }) => {
  const [editingUrl, setEditingUrl] = useState(false);
  const [tempUrl, setTempUrl] = useState(initialUrl);

  const handleSaveUrl = () => {
    onUrlChange(tempUrl);
    setEditingUrl(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white relative overflow-hidden font-sans">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <div className="bg-white/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto backdrop-blur-sm ring-1 ring-white/20 mb-6">
            <ScanLine size={40} className="text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">管理倾向现场调研</h1>
          <p className="text-slate-400 text-lg">识别二维码或点击下方按钮开始</p>
        </div>

        {/* QR Code Section */}
        <div className="bg-white p-4 rounded-2xl shadow-2xl transform transition-transform hover:scale-105 duration-300">
          <div className="h-48 w-48 md:h-64 md:w-64 bg-white flex items-center justify-center">
            {initialUrl ? (
              <QRCode
                size={256}
                style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                value={initialUrl}
                viewBox={`0 0 256 256`}
              />
            ) : (
              <span className="text-slate-400 text-sm">无效的链接</span>
            )}
          </div>
        </div>

        {/* URL Configuration (Fix for deployment issue) */}
        <div className="w-full">
           {!editingUrl ? (
             <button 
               onClick={() => setEditingUrl(true)}
               className="text-slate-500 text-xs flex items-center justify-center mx-auto hover:text-slate-300 transition-colors"
             >
               <Link size={12} className="mr-1" />
               当前链接: {initialUrl.length > 30 ? initialUrl.substring(0, 30) + '...' : initialUrl}
               <Settings size={12} className="ml-2" />
             </button>
           ) : (
             <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg">
               <input 
                 type="text" 
                 value={tempUrl}
                 onChange={(e) => setTempUrl(e.target.value)}
                 className="flex-1 bg-transparent text-xs text-white outline-none border-b border-slate-600 focus:border-blue-500 pb-1"
                 placeholder="输入部署后的公开网址..."
               />
               <button onClick={handleSaveUrl} className="text-xs bg-blue-600 px-2 py-1 rounded text-white">确定</button>
             </div>
           )}
           {editingUrl && (
             <p className="text-[10px] text-slate-400 mt-1 text-left">
               * 请输入实际部署后的网址（如 https://myapp.vercel.app），否则手机扫码可能无法打开。
             </p>
           )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4 pt-4">
          <button
            onClick={onStartSurvey}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all active:scale-95"
          >
            <Play fill="currentColor" size={20} className="mr-2" />
            我是学员，开始填写
          </button>
          
          <button
            onClick={onGoToDashboard}
            className="w-full py-3 px-6 bg-transparent hover:bg-white/5 text-slate-300 hover:text-white rounded-xl font-medium text-sm flex items-center justify-center transition-all border border-slate-700 hover:border-slate-500"
          >
            <LayoutDashboard size={18} className="mr-2" />
            我是讲师，进入投屏页
          </button>
        </div>
      </div>
      
      <footer className="absolute bottom-6 text-slate-600 text-xs">
        Powered by GenAI Management Analytics
      </footer>
    </div>
  );
};
