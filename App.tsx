
import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  FileUp, 
  ClipboardCheck, 
  Sparkles, 
  Loader2, 
  QrCode, 
  Calendar, 
  MapPin, 
  Users, 
  User, 
  ArrowRight, 
  Info, 
  MousePointerClick, 
  ShieldCheck, 
  CheckCircle, 
  Target, 
  Award, 
  Maximize2, 
  Zap,
  AlertCircle
} from 'lucide-react';
import { MeetingPoster, AnalysisResult, AppStatus } from './types';
import { GeminiService } from './services/geminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * BrandHeader Component
 * Visual requirements: Orange cartoon-style icon (using Zap) + "致趣 百川" text.
 */
const BrandHeader: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div className="flex items-center gap-4">
    <div className={`${size === 'sm' ? 'w-10 h-10 p-2' : 'w-14 h-14 p-3'} bg-orange-500 rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center transform hover:rotate-6 transition-transform cursor-pointer`}>
      <Zap className="text-white fill-white/20" size={size === 'sm' ? 24 : 32} strokeWidth={3} />
    </div>
    <div className="flex flex-col">
      <div className={`${size === 'sm' ? 'text-xl' : 'text-4xl'} font-black text-slate-900 leading-none tracking-tighter`}>
        致趣 百川
      </div>
      {size === 'md' && (
        <div className="text-[10px] font-black text-orange-400 mt-2 uppercase tracking-[0.4em] hidden sm:block">
          Diagnostic Engine Pro
        </div>
      )}
    </div>
  </div>
);

/**
 * SubImage component for rendering extracted visual focal points
 */
const SubImage: React.FC<{ 
  src: string; 
  rect: { top: number | string; left: number | string; width: number | string; height: number | string }; 
  className?: string;
}> = ({ src, rect, className }) => {
  const top = Number(rect.top) || 0;
  const left = Number(rect.left) || 0;
  const width = Number(rect.width) || 100;
  const height = Number(rect.height) || 100;

  if (width <= 0 || height <= 0) {
    return (
      <div className="bg-slate-50 w-full h-full flex items-center justify-center text-slate-300">
        <Sparkles size={24} />
      </div>
    );
  }

  return (
    <div className={`overflow-hidden relative ${className}`} style={{ width: '100%', height: '100%' }}>
      <img 
        src={src} 
        alt="Visual Focal Point" 
        className="absolute max-w-none"
        style={{
          width: `${100 / (width / 100)}%`,
          height: `${100 / (height / 100)}%`,
          left: `-${(left / width) * 100}%`,
          top: `-${(top / height) * 100}%`,
        }}
      />
    </div>
  );
};

/**
 * RevisedPoster: Custom optimized poster preview based on AI diagnosis
 */
const RevisedPoster: React.FC<{ 
  data: any, 
  originalImg?: string 
}> = ({ data, originalImg }) => {
  if (!data) return (
    <div className="p-12 text-slate-400 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-orange-400" size={32} />
      <span className="font-bold text-sm italic tracking-widest">专家诊断深度构建中...</span>
    </div>
  );

  const primaryColor = data.theme_color || '#FF6A3D';
  const secondaryColor = data.secondary_color || '#1e293b';

  return (
    <div className="w-full h-full bg-white flex flex-col relative font-sans shadow-2xl overflow-y-auto scrollbar-hide">
      {/* Optimization Header */}
      <div className="px-6 py-5 flex justify-between items-center bg-white border-b border-orange-50 sticky top-0 z-20">
        <div className="flex items-center gap-3">
           <div className="bg-orange-500 p-1.5 rounded-lg">
             <Zap className="text-white" size={14} strokeWidth={3} />
           </div>
           <span className="text-sm font-black text-slate-800 tracking-tight">致趣 百川</span>
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
           Expert Diagnostic
        </div>
      </div>

      {/* Hero Visual Area */}
      <div className="flex-shrink-0 bg-slate-50 relative aspect-[16/10] overflow-hidden group">
        {originalImg && data.illustration_rect ? (
          <SubImage src={originalImg} rect={data.illustration_rect} className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-orange-50 text-orange-200">
             <Target size={48} strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Headline & Value Proposition */}
      <div className="p-10 space-y-6">
        <h1 className="text-3xl font-black text-slate-900 leading-[1.1] tracking-tight">
          {data.optimized_header?.title}
        </h1>
        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
        <p className="text-base font-bold text-slate-500 leading-relaxed italic">
          {data.optimized_header?.subtitle}
        </p>
      </div>

      {/* Core Benefits */}
      <div className="px-10 space-y-6 mb-8">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
           <Award size={16} className="text-orange-500" /> 核心参会收益
        </div>
        <div className="grid grid-cols-1 gap-3">
          {data.highlights?.map((h: string, i: number) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-orange-50/30 rounded-3xl border border-orange-100 hover:bg-white hover:shadow-xl transition-all">
               <div className="flex-shrink-0 p-1 bg-orange-500 rounded-full">
                  <CheckCircle size={14} className="text-white" />
               </div>
               <span className="text-sm font-black text-slate-700 leading-tight">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Info & Conversion */}
      <div className="mt-auto p-10 bg-slate-950 text-white rounded-t-[4rem] space-y-10 shadow-inner">
        <div className="grid grid-cols-2 gap-8">
           <div className="space-y-2">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                 <Calendar size={14} /> 时间安排
              </div>
              <div className="text-sm font-bold text-slate-200">{data.event_details?.time || "详见落地页"}</div>
           </div>
           <div className="space-y-2">
              <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                 <MapPin size={14} /> 参与平台
              </div>
              <div className="text-sm font-bold text-slate-200">{data.event_details?.venue || "线上直播"}</div>
           </div>
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-white/10">
           <div className="space-y-2">
              <p className="text-sm font-black text-slate-100">{data.instructions || "立即扫码占位"}</p>
              <div className="text-[10px] text-white/20 tracking-[0.4em] uppercase font-bold">Beschannels Expert</div>
           </div>
           <div className="bg-white p-3 rounded-2xl shadow-2xl">
              <QrCode size={56} className="text-slate-900" />
           </div>
        </div>

        <button 
          className="w-full py-6 rounded-3xl font-black text-base tracking-widest transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 transform hover:-translate-y-1"
          style={{ backgroundColor: primaryColor }}
        >
          {data.cta_text || "立即预约报名"}
          <ArrowRight size={20} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [database, setDatabase] = useState<MeetingPoster[]>([]);
  const [searchId, setSearchId] = useState('');
  const [currentPoster, setCurrentPoster] = useState<MeetingPoster | null>(null);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [reconstructionData, setReconstructionData] = useState<any>(null);

  const gemini = useMemo(() => new GeminiService(), []);

  const parseResponse = (rawText: string) => {
    try {
      const jsonStartMarker = "JSON_DATA_START";
      const jsonEndMarker = "JSON_DATA_END";
      const startIdx = rawText.indexOf(jsonStartMarker);
      const endIdx = rawText.indexOf(jsonEndMarker);
      
      if (startIdx !== -1 && endIdx !== -1) {
        const jsonStr = rawText.substring(startIdx + jsonStartMarker.length, endIdx).trim();
        const parsedData = JSON.parse(jsonStr);
        setReconstructionData(parsedData);
        return rawText.substring(0, startIdx).trim();
      }
    } catch (e) {
      console.error("Parse Error:", e);
    }
    return rawText;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const idIndex = headers.indexOf('meeting_id');
      const contentIndex = headers.indexOf('content');

      if (idIndex === -1 || contentIndex === -1) {
        setErrorMsg("CSV 格式有误: 必须包含 meeting_id 和 content 字段");
        return;
      }

      const data: MeetingPoster[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols[idIndex] && cols[contentIndex]) {
          data.push({ meeting_id: cols[idIndex], content: cols[contentIndex] });
        }
      }
      setDatabase(data);
      setUploadSuccess(true);
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const startAnalysis = async () => {
    const poster = database.find(p => p.meeting_id === searchId);
    if (!poster) {
      setErrorMsg(`数据库中未找到 ID: ${searchId}`);
      return;
    }
    setCurrentPoster(poster);
    setStatus(AppStatus.ANALYZING);
    setAnalysis(null);
    setReconstructionData(null);
    setErrorMsg(null);

    try {
      const raw = await gemini.analyzePoster(poster.content);
      const markdown = parseResponse(raw);
      setAnalysis({ markdownText: markdown });
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setErrorMsg(err.message || "分析请求失败，请稍后重试");
      setStatus(AppStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf5] selection:bg-orange-100 pb-20">
      <header className="bg-white/80 backdrop-blur-md border-b border-orange-50 h-32 sticky top-0 z-50 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-10 h-full flex items-center justify-between">
          <BrandHeader />
          <div className={`px-6 py-3 rounded-3xl border text-[11px] font-black tracking-[0.2em] transition-all shadow-sm ${
            uploadSuccess ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            DATABASE: {database.length} ENTRIES
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          <div className="lg:col-span-4 space-y-10">
            {/* Step 01: Data Input */}
            <section className="bg-white p-12 rounded-[3.5rem] border border-orange-50 shadow-xl shadow-orange-950/5 space-y-10">
              <h2 className="text-[12px] font-black text-orange-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <Database size={18} /> 01. 数据接入
              </h2>
              <div className={`relative border-2 border-dashed rounded-[2.5rem] p-16 transition-all cursor-pointer group ${
                uploadSuccess ? 'border-orange-500 bg-orange-50/40' : 'border-slate-100 hover:border-orange-300 hover:bg-orange-50/20'
              }`}>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center">
                  {uploadSuccess ? (
                    <div className="bg-orange-500 p-5 rounded-3xl text-white shadow-2xl animate-in zoom-in duration-500">
                       {/* Fixed icon name from CheckCircle2 to CheckCircle as per guideline recommendation */}
                       <CheckCircle size={40} />
                    </div>
                  ) : (
                    <div className="p-6 bg-orange-50 rounded-[2.5rem] text-orange-200 group-hover:text-orange-500 transition-all group-hover:scale-110 group-hover:rotate-3">
                       <FileUp size={48} />
                    </div>
                  )}
                  <p className="mt-8 text-base font-black text-slate-700">{uploadSuccess ? '数据库就绪' : '上传会议数据库 (CSV)'}</p>
                </div>
              </div>
            </section>

            {/* Step 02: Search & Diagnosis */}
            <section className="bg-white p-12 rounded-[3.5rem] border border-orange-50 shadow-xl shadow-orange-950/5 space-y-10">
              <h2 className="text-[12px] font-black text-orange-400 uppercase tracking-[0.4em] flex items-center gap-3">
                <Search size={18} /> 02. 会议检索
              </h2>
              <div className="space-y-8">
                <div className="space-y-4">
                   <label className="text-[11px] font-black text-orange-300 uppercase ml-2 tracking-widest">Meeting ID</label>
                   <input 
                      type="text" 
                      value={searchId} 
                      onChange={(e) => setSearchId(e.target.value)} 
                      placeholder="输入会议 ID 进行专家诊断" 
                      className="w-full px-8 py-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-black text-base text-slate-900 placeholder:text-slate-300" 
                   />
                </div>
                <button 
                  onClick={startAnalysis} 
                  disabled={!searchId || database.length === 0 || status === AppStatus.ANALYZING} 
                  className="w-full py-6 rounded-3xl font-black text-sm tracking-[0.3em] bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-20 transition-all active:scale-95 shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-4 uppercase transform hover:-translate-y-1"
                >
                  {status === AppStatus.ANALYZING ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                  开始专家诊断
                </button>
              </div>
              {errorMsg && (
                <div className="mt-6 p-5 bg-red-50 text-red-600 text-[12px] font-black rounded-3xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                  {/* AlertCircle is now imported and used to fix the error */}
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-8 space-y-16">
            {!currentPoster ? (
              <div className="bg-white border-2 border-dashed border-orange-100 rounded-[5rem] h-[700px] flex flex-col items-center justify-center text-orange-50/50 group">
                <div className="p-16 bg-orange-50/30 rounded-[4rem] mb-10 transition-all group-hover:bg-orange-50/60 group-hover:scale-105 duration-700">
                   <ClipboardCheck size={120} className="opacity-10 group-hover:opacity-30 transition-opacity" />
                </div>
                <p className="font-black tracking-[0.6em] uppercase text-lg text-orange-200">等待诊断输入</p>
                <p className="text-[11px] font-bold opacity-30 mt-4 uppercase text-orange-300 tracking-[0.2em]">Beschannels AI Diagnostic Engine Ready</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-16 duration-1000">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
                  <div className="space-y-6">
                    <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] ml-4 flex items-center gap-3">
                       <Info size={16} /> 原始海报视图
                    </h3>
                    <div className="aspect-[3/4.2] rounded-[4.5rem] overflow-hidden bg-white border border-slate-100 shadow-2xl group relative">
                      <img src={currentPoster.content} alt="Original" className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105" />
                      <div className="absolute top-8 right-8 bg-slate-900/40 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-white/80 uppercase tracking-widest">Baseline</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between ml-4">
                       <h3 className="text-[12px] font-black text-orange-500 uppercase tracking-[0.4em] animate-pulse flex items-center gap-3">
                          <Target size={16} /> 专家优化方案
                       </h3>
                    </div>
                    <div className="aspect-[3/4.2] rounded-[4.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(15,23,42,0.15)] border border-orange-100 bg-white flex items-center justify-center relative">
                      {status === AppStatus.ANALYZING ? (
                         <div className="text-center space-y-8 p-16">
                            <div className="relative inline-block">
                               <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full animate-pulse" />
                               <Loader2 className="animate-spin text-orange-500 relative" size={72} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-3">
                               <p className="text-sm font-black uppercase text-slate-800 tracking-[0.2em]">正在深度重构视觉层级</p>
                               <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase">Applying TIPS Principles & Content Power</p>
                            </div>
                         </div>
                      ) : (
                        <RevisedPoster data={reconstructionData} originalImg={currentPoster.content} />
                      )}
                    </div>
                  </div>
                </div>

                {analysis && (
                  <div className="bg-white p-16 md:p-28 rounded-[5.5rem] border border-orange-50 shadow-2xl markdown-table relative overflow-hidden transition-all hover:shadow-orange-950/5">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/50 blur-[180px] rounded-full -mr-80 -mt-80 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-50/80 blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none" />
                    
                    <div className="flex items-center gap-10 mb-20 pb-16 border-b border-slate-100 relative z-10">
                      <div className="p-8 bg-orange-500 text-white rounded-[2.5rem] shadow-2xl shadow-orange-200 transform hover:rotate-12 transition-transform cursor-pointer">
                        <ShieldCheck size={48} />
                      </div>
                      <div>
                        <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-[1.1]">会前诊断专家报告</h2>
                        <div className="flex items-center gap-5 mt-6">
                           <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-5 py-2 rounded-full uppercase tracking-[0.3em] border border-orange-100 shadow-sm">
                             ID: {currentPoster.meeting_id}
                           </span>
                           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">
                             Model v2.5.PRO-THINK
                           </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="prose prose-slate max-w-none relative z-10 
                      prose-headings:text-slate-950 prose-headings:font-black prose-headings:tracking-tight
                      prose-strong:text-orange-600 prose-strong:font-black
                      prose-table:border-orange-50 prose-table:shadow-sm prose-table:rounded-3xl prose-table:overflow-hidden">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis.markdownText}</ReactMarkdown>
                    </div>

                    <div className="mt-20 pt-16 border-t border-slate-100 flex items-center justify-between opacity-40 grayscale hover:grayscale-0 transition-all">
                      <p className="text-[10px] font-black tracking-[0.5em] uppercase text-slate-400">Diagnostic Output Approved by Beschannels</p>
                      <div className="flex gap-4">
                         <div className="w-8 h-1 rounded-full bg-orange-500" />
                         <div className="w-8 h-1 rounded-full bg-slate-200" />
                         <div className="w-8 h-1 rounded-full bg-slate-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="max-w-7xl mx-auto px-10 text-center py-20 border-t border-orange-50/50 mt-20">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-orange-500/10 p-4 rounded-3xl">
            <Zap className="text-orange-500 fill-orange-500/10" size={32} />
          </div>
          <p className="text-[12px] font-black uppercase tracking-[1em] text-slate-300 ml-[1em]">
            致趣 百川 | 专家级 B2B 营销云诊断系统
          </p>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            © 2024 Beschannels AI Lab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
