import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Calculator, DollarSign, CheckCircle, Briefcase, 
  UploadCloud, Activity, ArrowRight, Settings, BarChart2, 
  Sparkles, MessageSquare, FileText, Loader2, FileSpreadsheet, 
  TrendingDown, AlertCircle, ChevronRight, Send,
  TrendingUp, Calendar, Anchor, Zap, ChevronDown, ChevronUp // Icons
} from 'lucide-react';

const App = () => {
  // ==========================================
  // 0. UI State & Gemini API Logic
  // ==========================================
  const [mainTab, setMainTab] = useState('setup'); // 'setup' | 'analysis'
  const [isStrategyExpanded, setIsStrategyExpanded] = useState(true); // Toggle state for Strategy Guide
  
  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStrategyResponse, setAiStrategyResponse] = useState('');
  const [aiProposalResponse, setAiProposalResponse] = useState('');
  const [clientContext, setClientContext] = useState('');

  // Load XLSX Library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {};
  }, []);

  // Gemini API Call Helper
  const callGeminiAPI = async (prompt) => {
    const apiKey = ""; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    try {
      setAiLoading(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "AI 응답을 불러올 수 없습니다.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "죄송합니다. AI 서비스 연결에 실패했습니다.";
    } finally {
      setAiLoading(false);
    }
  };

  // Feature 1: AI Strategy Advisor
  const handleAskAIStrategy = async () => {
    if (!clientContext.trim()) { alert("고객 상황을 입력해주세요."); return; }
    const prompt = `
      당신은 B2B 파트너십 전문가입니다. 고객 상황: "${clientContext}"
      
      모델 옵션:
      - A. 안정 추구형 (Base 80%, Success 10%)
      - B. 균형 제안형 (Base 60%, Success 20%)
      - C. 성과 집중형 (Base 30%, Success 40%)
      - D. 성과 극대화형 (Base 10%, Success 50%)
      - E. 선지급 확정형 (Base 100%, Success 0%)

      가장 적합한 모델 1가지를 추천하고, 설득 논리(Key Selling Point)를 한국어로 간결하게 작성해주세요.
    `;
    const result = await callGeminiAPI(prompt);
    setAiStrategyResponse(result);
  };

  // Feature 2: AI Proposal Generator
  const handleGenerateProposal = async (finalStats) => {
    const prompt = `
      세일즈 컨설턴트로서 아래 데이터로 제안서 요약(Executive Summary)을 작성하세요.
      - 모델: ${finalStats.modelName}
      - 고정비: ${finalStats.baseFee}
      - 절감액: ${finalStats.savings}
      - 성과보수: ${finalStats.successFee}
      - 총비용: ${finalStats.totalCost}
      
      요청: 경제적 이점 강조, 수치 인용, 정중한 해요체, 3~4문장 요약.
    `;
    const result = await callGeminiAPI(prompt);
    setAiProposalResponse(result);
  };


  // ==========================================
  // 1. Configuration State (From Code A)
  // ==========================================
  const [standardPrice, setStandardPrice] = useState(100000);
  const [estimatedSavings, setEstimatedSavings] = useState(200000);
  const [itemType, setItemType] = useState('type_a'); // Default to Type A
  const [selectedModelId, setSelectedModelId] = useState('C'); 

  // Models Definition
  const MODELS = {
    OLD: { id: 'OLD', name: '기존 모델', baseRate: 1.0, successRate: 0.0, desc: '100% 고정비', risk: 'None', color: '#9CA3AF' },
    A: { id: 'A', name: 'A. 안정 추구형', baseRate: 0.8, successRate: 0.10, desc: 'Low Risk', risk: 'Low', color: '#34D399' },
    B: { id: 'B', name: 'B. 균형 제안형', baseRate: 0.6, successRate: 0.20, desc: 'Balanced', risk: 'Medium', color: '#3B82F6' },
    C: { id: 'C', name: 'C. 성과 집중형', baseRate: 0.3, successRate: 0.40, desc: 'High Reward', risk: 'High', color: '#8B5CF6' },
    D: { id: 'D', name: 'D. 성과 극대화형', baseRate: 0.1, successRate: 0.50, desc: 'Min Base / Max Reward', risk: 'Very High', color: '#F43F5E' },
    E: { id: 'E', name: 'E. 선지급 확정형', baseRate: 1.0, successRate: 0.0, desc: '100% Base / No Success Fee', risk: 'Fixed', color: '#64748B' },
  };

  // Updated Strategy Logic
  const ITEM_STRATEGIES = {
    type_a: { 
      label: 'Type A. 시세 연동형', 
      icon: <TrendingUp size={20} className="text-red-500"/>,
      rec: ['C', 'D'], 
      desc: '국제 시세(CBOT 등)와 밀접하게 연동되며 변동성이 매우 큼 (밀, 옥수수, 커피 등).',
      reason: '변동성이 크므로 성과급 비중을 높여 Risk/Reward를 공유하는 모델(C, D)이 유리합니다.' 
    },
    type_b: { 
      label: 'Type B. 계절성형', 
      icon: <Calendar size={20} className="text-orange-500"/>,
      rec: ['B', 'C'], 
      desc: '수확 시기에 따라 공급량이 요동치며 정현파 패턴을 보임 (과일 농축액, 유제품 등).',
      reason: '주기적인 변동이 있으므로 균형 잡힌 모델(B)이나 성과 집중형(C)으로 기회를 포착하세요.' 
    },
    type_c: { 
      label: 'Type C. 계단식 변동형', 
      icon: <Anchor size={20} className="text-blue-500"/>,
      rec: ['A', 'E'], 
      desc: '연간 계약 등으로 가격이 장기간 고정되다가 갱신 시점에 점프함 (가공식품, 소스류).',
      reason: '가격이 안정적이므로 고정비 비중이 높은 안정형(A)이나 확정형(E)이 적합합니다.' 
    },
    type_d: { 
      label: 'Type D. 이벤트 반응형', 
      icon: <Zap size={20} className="text-purple-500"/>,
      rec: ['D'], 
      desc: '평소엔 안정적이나 질병, 전쟁 등 이슈 발생 시 폭등함 (돈육, 계란, 식용유).',
      reason: '예측 불가능한 리스크가 크므로, 평소 비용을 최소화하는 성과 극대화형(D)을 제안하세요.' 
    },
  };

  const currentModel = MODELS[selectedModelId];

  // ==========================================
  // 2. Analysis Data State
  // ==========================================
  const [activeTab, setActiveTab] = useState('standard');
  const [unit, setUnit] = useState('KG');
  const [excelData, setExcelData] = useState([]);
  const [importers, setImporters] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedImporter, setSelectedImporter] = useState('');
  const [baseYear, setBaseYear] = useState('');
  const [evalYear, setEvalYear] = useState('');

  const [stdInputs, setStdInputs] = useState({ myPrice: 4.20, mktPrice: 4.50, volume: 50000, baseMyPrice: 5.00, baseMktPrice: 4.90 });
  const [advInputs, setAdvInputs] = useState({ baseMean: 5.00, baseStd: 0.40, baseMyPrice: 5.00, evalMean: 4.50, evalStd: 0.40, evalMyPrice: 4.20, volume: 50000 });

  // ==========================================
  // Helpers
  // ==========================================
  const fmtUSD = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  const fmtNum = (num) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);

  // ==========================================
  // Calculation Logic
  // ==========================================
  const setupSimResult = useMemo(() => {
    const baseFee = standardPrice * currentModel.baseRate;
    const discountAmount = standardPrice - baseFee;
    
    const rawSuccessFee = estimatedSavings * currentModel.successRate;
    
    let actualSuccessFee = rawSuccessFee;
    let isCapped = false;
    if (currentModel.baseRate > 0) {
        const capAmount = baseFee * 3;
        if (rawSuccessFee > capAmount) {
            actualSuccessFee = capAmount;
            isCapped = true;
        }
    }

    const totalCost = baseFee + actualSuccessFee;
    const netBenefit = estimatedSavings - actualSuccessFee;
    const roi = totalCost > 0 ? ((estimatedSavings - totalCost) / totalCost) * 100 : 0;

    const chartData = [{
        name: '비용 구조',
        'Base': baseFee,
        'Success': actualSuccessFee,
        'Benefit': netBenefit > 0 ? netBenefit : 0
    }];

    const comparisonData = Object.keys(MODELS).map(k => {
        const m = MODELS[k];
        const b = standardPrice * m.baseRate;
        const s = estimatedSavings * m.successRate;
        const c = b * 3;
        const finalS = (m.baseRate > 0 && s > c) ? c : s;
        return {
            name: k === 'OLD' ? '기존' : k,
            Base: b, Success: finalS, Total: b + finalS,
            isCurrent: k === selectedModelId
        };
    });

    return { baseFee, discountAmount, actualSuccessFee, isCapped, netBenefit, roi, chartData, comparisonData };
  }, [standardPrice, estimatedSavings, currentModel]);


  const effectiveBaseFee = setupSimResult.baseFee; 
  const effectiveSuccessRate = currentModel.successRate;

  const stdResult = useMemo(() => {
    const spread = Math.max(0, stdInputs.mktPrice - stdInputs.myPrice);
    const totalSaving = spread * stdInputs.volume;
    const rawFee = totalSaving * effectiveSuccessRate;
    
    let actualFee = rawFee;
    let isCapped = false;
    
    if (effectiveBaseFee > 0) {
        const capAmount = effectiveBaseFee * 3;
        if (rawFee > capAmount) { 
            actualFee = capAmount; 
            isCapped = true; 
        }
    }
    
    return { spread, totalSaving, successFee: actualFee, uncappedFee: rawFee, totalRevenue: effectiveBaseFee + actualFee, isCapped };
  }, [stdInputs, effectiveBaseFee, effectiveSuccessRate]);

  const advResult = useMemo(() => {
    const zBase = advInputs.baseStd ? (advInputs.baseMyPrice - advInputs.baseMean) / advInputs.baseStd : 0;
    const zEval = advInputs.evalStd ? (advInputs.evalMyPrice - advInputs.evalMean) / advInputs.evalStd : 0;
    const deltaZ = zBase - zEval; 
    const unitSaving = deltaZ * advInputs.evalStd;
    const totalSaving = unitSaving * advInputs.volume;
    const rawFee = Math.max(0, totalSaving * effectiveSuccessRate);
    
    let actualFee = rawFee;
    let isCapped = false;

    if (effectiveBaseFee > 0) {
        const capAmount = effectiveBaseFee * 3;
        if (rawFee > capAmount) { 
            actualFee = capAmount; 
            isCapped = true; 
        }
    }
    
    return { zBase, zEval, deltaZ, unitSaving, totalSaving, successFee: actualFee, uncappedFee: rawFee, totalRevenue: effectiveBaseFee + actualFee, isCapped };
  }, [advInputs, effectiveBaseFee, effectiveSuccessRate]);


  // ==========================================
  // Handlers
  // ==========================================
  const handleUnitChange = (newUnit) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    const factor = newUnit === 'MT' ? 1000 : 0.001;
    const volFactor = newUnit === 'MT' ? 0.001 : 1000;
    
    const updateState = (state, setState) => {
        setState(prev => ({
            ...prev,
            myPrice: parseFloat((prev.myPrice * factor).toFixed(2)),
            mktPrice: parseFloat((prev.mktPrice * factor).toFixed(2)),
            volume: prev.volume * volFactor,
        }));
    };
    updateState(stdInputs, setStdInputs);
    updateState(advInputs, setAdvInputs);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!window.XLSX) { alert("엑셀 라이브러리 로드 중..."); return; }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = window.XLSX.read(data, { type: 'array' });
        const jsonData = window.XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
        
        setExcelData(jsonData);
        const impSet = new Set();
        const yearSet = new Set();
        const keys = Object.keys(jsonData[0]);
        const impKey = keys.find(k => /importer|buyer|company|기업/i.test(k)) || keys[0];
        const yearKey = keys.find(k => /year|date|연도/i.test(k)) || 'Year';
        
        jsonData.forEach(row => {
          if (row[impKey]) impSet.add(String(row[impKey]).trim());
          const m = String(row[yearKey]).match(/20\d{2}/);
          if (m) yearSet.add(m[0]);
        });
        
        setImporters([...impSet].sort());
        const sortedYears = [...yearSet].sort();
        setYears(sortedYears);
        if (sortedYears.length >= 2) {
            setBaseYear(sortedYears[sortedYears.length-2]);
            setEvalYear(sortedYears[sortedYears.length-1]);
        }
        alert(`로드 완료! ${jsonData.length}행`);
      } catch (err) { alert("파일 처리 오류: " + err.message); }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (!selectedImporter || !baseYear || !evalYear || excelData.length === 0) return;
    
    const keys = Object.keys(excelData[0]);
    const impKey = keys.find(k => /importer|buyer|company|기업/i.test(k));
    const yearKey = keys.find(k => /year|date|연도/i.test(k));
    const valKey = keys.find(k => /value|amount|usd|price|금액/i.test(k));
    const volKey = keys.find(k => /volume|quantity|qty|kg|물량/i.test(k));

    let baseStats = { val: 0, vol: 0, prices: [] };
    let evalStats = { val: 0, vol: 0, prices: [] };
    let targetBase = { val: 0, vol: 0 };
    let targetEval = { val: 0, vol: 0 };

    excelData.forEach(row => {
        const y = String(row[yearKey] || "");
        const imp = String(row[impKey] || "").trim();
        const v = parseFloat(String(row[valKey]||'0').replace(/[$,]/g,''));
        const q = parseFloat(String(row[volKey]||'0').replace(/[,kgKG]/g,''));
        const p = q > 0 ? v / q : 0;
        if(q===0) return;

        if(y.includes(baseYear)) {
            baseStats.val+=v; baseStats.vol+=q; baseStats.prices.push(p);
            if(imp===selectedImporter) { targetBase.val+=v; targetBase.vol+=q; }
        } else if(y.includes(evalYear)) {
            evalStats.val+=v; evalStats.vol+=q; evalStats.prices.push(p);
            if(imp===selectedImporter) { targetEval.val+=v; targetEval.vol+=q; }
        }
    });

    const calcMean = (s) => s.vol ? s.val / s.vol : 0;
    const calcStd = (prices, mean) => {
        if(!prices.length) return 1;
        const v = prices.reduce((a,p)=>a+Math.pow(p-mean,2),0)/prices.length;
        return Math.sqrt(v) || 0.1;
    };

    const mBase = calcMean(baseStats); const mEval = calcMean(evalStats);
    const tBase = calcMean(targetBase); const tEval = calcMean(targetEval);
    const sBase = calcStd(baseStats.prices,mBase); const sEval = calcStd(evalStats.prices,mEval);
    
    const factor = unit === 'MT' ? 1000 : 1;
    const volFactor = unit === 'MT' ? 0.001 : 1;
    
    const common = { volume: Math.round(targetEval.vol * volFactor) };
    setStdInputs({ 
        myPrice: parseFloat((tEval*factor).toFixed(2)), 
        mktPrice: parseFloat((mEval*factor).toFixed(2)), 
        baseMyPrice: parseFloat((tBase*factor).toFixed(2)), 
        baseMktPrice: parseFloat((mBase*factor).toFixed(2)), 
        ...common 
    });
    setAdvInputs({ 
        baseMean: parseFloat((mBase*factor).toFixed(2)), baseStd: parseFloat((sBase*factor).toFixed(2)), 
        baseMyPrice: parseFloat((tBase*factor).toFixed(2)), 
        evalMean: parseFloat((mEval*factor).toFixed(2)), evalStd: parseFloat((sEval*factor).toFixed(2)), 
        evalMyPrice: parseFloat((tEval*factor).toFixed(2)), 
        ...common 
    });

  }, [selectedImporter, baseYear, evalYear, excelData, unit]);

  // ==========================================
  // VIEW COMPONENT
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <header>
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-slate-900 flex justify-center items-center gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg"><Calculator size={24} /></div>
                    통합 파트너십 수익성 시뮬레이터
                </h1>
                <div className="text-xs font-medium text-blue-600 mt-2 flex justify-center items-center gap-1">
                    <Sparkles size={12} /> Powered by Gemini
                </div>
            </div>
            <div className="flex justify-center gap-4 border-b border-slate-200 pb-1">
                <button onClick={() => setMainTab('setup')} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-lg border-b-4 transition-all ${mainTab==='setup' ? 'bg-white text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'}`}>
                    <Settings size={20} /> 1. 시뮬레이션 조건 모델링
                </button>
                <button onClick={() => setMainTab('analysis')} className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-lg border-b-4 transition-all ${mainTab==='analysis' ? 'bg-white text-purple-600 border-purple-600' : 'text-slate-400 border-transparent'}`}>
                    <BarChart2 size={20} /> 2. 최종 파트너십 검증
                </button>
            </div>
        </header>

        {/* ================= TAB 1: SETUP ================= */}
        {mainTab === 'setup' && (
            <div className="animate-fade-in">
                
                {/* AI Strategy Advisor */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                         <div className="flex items-center gap-2 text-indigo-800 font-bold whitespace-nowrap">
                            <div className="bg-indigo-100 p-2 rounded-lg"><Sparkles size={18}/></div>
                            AI 전략 어드바이저
                        </div>
                        <div className="flex-1 w-full flex gap-2">
                            <input 
                                type="text" 
                                placeholder="고객 성향 또는 고민을 입력하세요 (예: 예산이 부족하고 보수적임, 신규 품목 도입 예정)" 
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={clientContext} 
                                onChange={(e)=>setClientContext(e.target.value)} 
                                onKeyPress={(e)=>e.key==='Enter'&&handleAskAIStrategy()}
                            />
                            <button 
                                onClick={handleAskAIStrategy} 
                                disabled={aiLoading} 
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl font-bold flex items-center gap-2 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                                {aiLoading ? <Loader2 className="animate-spin" size={18}/> : <Send size={18}/>} 
                                <span className="hidden md:inline">조언 구하기</span>
                            </button>
                        </div>
                    </div>
                    {aiStrategyResponse && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-slate-700 text-sm leading-relaxed animate-fade-in">
                            <div className="font-bold text-indigo-700 mb-2 flex items-center gap-2"><MessageSquare size={14}/> Gemini's Insight</div>
                            {aiStrategyResponse.split('\n').map((line, i) => <p key={i} className="mb-1">{line}</p>)}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* LEFT PANEL: Controls & Strategy */}
                    <div className="lg:col-span-5 space-y-6 flex flex-col">
                        {/* 1. Price & Savings Input */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><DollarSign className="text-blue-500"/> 기준 금액 설정</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 mb-1">표준 계약 금액 (Base 100%)</label>
                                    <input type="number" value={standardPrice} onChange={(e)=>setStandardPrice(Number(e.target.value))} className="w-full p-3 border rounded-xl text-lg font-mono focus:ring-2 focus:ring-blue-500 outline-none"/>
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-sm font-bold text-slate-500">예상 절감액 (Target Savings)</label>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">{fmtUSD(estimatedSavings)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min={0} 
                                        max={1000000} 
                                        step={10000} 
                                        value={estimatedSavings} 
                                        onChange={(e)=>setEstimatedSavings(Number(e.target.value))} 
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Strategy Selection (IMPROVED UI) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-lg text-slate-700 mb-4 flex items-center gap-2"><Briefcase className="text-purple-500"/> 품목군 전략 선택</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {Object.keys(ITEM_STRATEGIES).map(k => (
                                    <button 
                                        key={k} 
                                        onClick={() => setItemType(k)} 
                                        className={`p-4 rounded-xl text-left transition-all flex flex-col justify-between gap-2 h-full min-h-[100px] shadow-sm hover:shadow-md ${
                                            itemType === k 
                                                ? 'bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500 ring-2 ring-purple-100' 
                                                : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1.5 rounded-full ${itemType === k ? 'bg-purple-100' : 'bg-slate-100'}`}>
                                                {ITEM_STRATEGIES[k].icon}
                                            </div>
                                            <span className={`font-bold text-sm ${itemType === k ? 'text-purple-800' : 'text-slate-700'}`}>
                                                {ITEM_STRATEGIES[k].label.split('.')[1].trim()}
                                            </span>
                                        </div>
                                        <div className={`text-xs leading-snug ${itemType === k ? 'text-purple-600' : 'text-slate-400'}`}>
                                            {ITEM_STRATEGIES[k].label.split('.')[0]}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-4 bg-gradient-to-r from-purple-50 to-slate-50 p-5 rounded-xl border border-purple-100 transition-all">
                                <div 
                                    className="flex items-center justify-between cursor-pointer" 
                                    onClick={() => setIsStrategyExpanded(!isStrategyExpanded)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-purple-600 bg-purple-100 p-1.5 rounded-full"><Activity size={16}/></div>
                                        <div className="text-xs font-extrabold text-purple-800 uppercase tracking-wide">STRATEGY GUIDE</div>
                                    </div>
                                    <div className="text-purple-400 hover:text-purple-600">
                                        {isStrategyExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>
                                
                                {isStrategyExpanded && (
                                    <div className="mt-3 pl-10 animate-fade-in">
                                        <div className="text-sm text-slate-700 font-medium leading-relaxed mb-2">{ITEM_STRATEGIES[itemType].desc}</div>
                                        <div className="text-sm text-purple-700 font-medium leading-relaxed bg-white/60 p-2 rounded-lg border border-purple-100/50">
                                            💡 {ITEM_STRATEGIES[itemType].reason}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. Model Grid */}
                        <div className="space-y-2 flex-1">
                            {Object.keys(MODELS).filter(k=>k!=='OLD').map(key => {
                                const m = MODELS[key];
                                const isSel = selectedModelId === key;
                                const isRec = ITEM_STRATEGIES[itemType].rec.includes(key);
                                return (
                                    <button key={key} onClick={() => setSelectedModelId(key)} className={`w-full relative p-3 rounded-xl border-2 text-left transition-all ${isSel ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                                        {isRec && <span className="absolute top-3 right-3 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle size={10}/> 추천</span>}
                                        <div className={`font-bold ${isSel?'text-blue-800':'text-slate-700'}`}>{m.name}</div>
                                        <div className="text-xs text-slate-400 mt-1">Base {Math.round(m.baseRate*100)}% + Success {Math.round(m.successRate*100)}%</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Dashboard & Charts */}
                    <div className="lg:col-span-7 flex flex-col gap-6 h-full">
                        {/* Main KPI Card */}
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 relative overflow-hidden flex-1 flex flex-col">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">시뮬레이션 결과</h2>
                                    <p className="text-sm text-slate-500">선택 모델: <span className="font-bold text-blue-600">{currentModel.name}</span></p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400">고객 ROI</div>
                                    <div className="text-2xl font-bold text-green-600">{setupSimResult.roi > 0 ? `+${setupSimResult.roi.toFixed(0)}%` : '-'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="text-xs text-slate-500 mb-1">고정비 (Base)</div>
                                    <div className="text-lg font-bold text-slate-800">{fmtUSD(setupSimResult.baseFee)}</div>
                                    {setupSimResult.discountAmount > 0 && <div className="text-[10px] text-green-600 flex items-center gap-1"><TrendingDown size={10}/> {fmtUSD(setupSimResult.discountAmount)} 절감</div>}
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 relative">
                                    <div className="text-xs text-blue-600 mb-1 flex justify-between">성과급 (Success) {setupSimResult.isCapped && <AlertCircle size={12} className="text-orange-500"/>}</div>
                                    <div className="text-lg font-bold text-blue-700">{fmtUSD(setupSimResult.actualSuccessFee)}</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                    <div className="text-xs text-green-700 mb-1">순이익 (Benefit)</div>
                                    <div className="text-lg font-bold text-green-700">{fmtUSD(setupSimResult.netBenefit)}</div>
                                </div>
                            </div>

                            {/* Charts Area */}
                            <div className="flex flex-col gap-6 flex-1 min-h-[400px]">
                                {/* Chart 1: Cost Structure */}
                                <div className="bg-white p-4 border rounded-xl flex-1 min-h-[300px] flex flex-col">
                                    <h4 className="text-sm font-bold text-center mb-4 text-slate-600">비용 대비 효과 분석</h4>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={setupSimResult.chartData} layout="vertical" margin={{top:5, right:30, left:20, bottom:5}}>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                                <XAxis type="number" hide/>
                                                <YAxis type="category" dataKey="name" hide/>
                                                <RechartsTooltip formatter={(val)=>fmtUSD(val)} cursor={{fill: 'transparent'}}/>
                                                <Legend />
                                                <Bar dataKey="Base" stackId="a" fill="#9CA3AF" radius={[4,0,0,4]} name="고정비"/>
                                                <Bar dataKey="Success" stackId="a" fill="#3B82F6" name="성과급"/>
                                                <Bar dataKey="Benefit" stackId="a" fill="#34D399" radius={[0,4,4,0]} name="고객이득"/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Chart 2: Model Comparison */}
                                <div className="bg-white p-4 border rounded-xl flex-1 min-h-[300px] flex flex-col">
                                    <h4 className="text-sm font-bold text-center mb-4 text-slate-600">모델별 총 비용 비교</h4>
                                    <div className="flex-1 w-full min-h-0">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={setupSimResult.comparisonData} margin={{top:20, right:30, left:20, bottom:5}}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                                <XAxis dataKey="name" tick={{fontSize:12}}/>
                                                <RechartsTooltip formatter={(val)=>fmtUSD(val)} cursor={{fill: 'transparent'}}/>
                                                <Legend />
                                                <Bar dataKey="Base" stackId="a" fill="#D1D5DB" name="고정비"/>
                                                <Bar dataKey="Success" stackId="a" fill="#60A5FA" name="성과급">
                                                    {setupSimResult.comparisonData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.isCurrent ? '#2563EB' : '#93C5FD'} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Next Step Button */}
                        <div className="text-right">
                            <button onClick={()=>setMainTab('analysis')} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 ml-auto hover:bg-slate-800 transition-colors">
                                최종 파트너십 검증 단계로 이동 <ArrowRight size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ================= TAB 2: ANALYSIS ================= */}
        {mainTab === 'analysis' && (
            <div className="animate-fade-in">
                {/* Context Bar */}
                <div className="bg-white border border-slate-200 rounded-lg p-3 mb-4 flex justify-between items-center shadow-sm">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">SETUP INFO</span>
                        <span>모델: <strong>{currentModel.name}</strong></span>
                        <span className="text-slate-300">|</span>
                        <span>확정 Base: <strong>{fmtUSD(effectiveBaseFee)}</strong></span>
                    </div>
                    <button onClick={()=>setMainTab('setup')} className="text-xs text-blue-600 font-bold hover:underline">설정 변경하기</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Controls */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <h2 className="font-bold text-slate-700 flex items-center gap-2"><Activity size={20}/> 최종 파트너십 검증</h2>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button onClick={()=>handleUnitChange('KG')} className={`px-3 py-1 text-xs font-bold rounded ${unit==='KG'?'bg-white shadow text-blue-600':'text-slate-500'}`}>KG</button>
                                    <button onClick={()=>handleUnitChange('MT')} className={`px-3 py-1 text-xs font-bold rounded ${unit==='MT'?'bg-white shadow text-blue-600':'text-slate-500'}`}>MT</button>
                                </div>
                            </div>

                            {/* Upload & Selectors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 relative">
                                    <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <FileSpreadsheet className="w-8 h-8 text-green-600 mx-auto mb-2"/>
                                    <p className="text-xs font-bold text-slate-600">엑셀/CSV 데이터 업로드</p>
                                </div>
                                <div className="space-y-3">
                                    <select className="w-full p-2 border rounded text-sm" value={selectedImporter} onChange={e=>setSelectedImporter(e.target.value)}>
                                        <option value="">기업 선택 ({importers.length})</option>
                                        {importers.map(i=><option key={i} value={i}>{i}</option>)}
                                    </select>
                                    <div className="grid grid-cols-2 gap-2">
                                        <select className="p-2 border rounded text-sm" value={baseYear} onChange={e=>setBaseYear(e.target.value)}>
                                            {years.map(y=><option key={y} value={y}>{y}년 (기준)</option>)}
                                        </select>
                                        <select className="p-2 border rounded text-sm font-bold text-blue-600" value={evalYear} onChange={e=>setEvalYear(e.target.value)}>
                                            {years.map(y=><option key={y} value={y}>{y}년 (평가)</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Analysis Tabs */}
                            <div className="mb-4 flex border-b border-slate-200">
                                <button onClick={()=>setActiveTab('standard')} className={`pb-3 px-4 font-bold text-sm border-b-2 ${activeTab==='standard'?'border-blue-500 text-blue-600':'border-transparent text-slate-400'}`}>🅰️ 표준 가격 비교</button>
                                <button onClick={()=>setActiveTab('advanced')} className={`pb-3 px-4 font-bold text-sm border-b-2 ${activeTab==='advanced'?'border-purple-500 text-purple-600':'border-transparent text-slate-400'}`}>🅱️ 심화 이격률 분석</button>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                                {activeTab === 'standard' ? (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-xs text-slate-400 px-1"><span>내 가격 (My VWAP)</span><span>시장 가격 (Market VWAP)</span></div>
                                        <div className="flex items-center gap-4">
                                            <input type="number" value={stdInputs.myPrice} onChange={e=>setStdInputs({...stdInputs,myPrice:Number(e.target.value)})} className="flex-1 p-3 border border-blue-300 rounded-lg font-bold text-right text-blue-700"/>
                                            <span className="text-slate-400">vs</span>
                                            <input type="number" value={stdInputs.mktPrice} onChange={e=>setStdInputs({...stdInputs,mktPrice:Number(e.target.value)})} className="flex-1 p-3 border border-slate-300 rounded-lg text-right"/>
                                        </div>
                                        <div><label className="text-xs font-bold text-slate-500">물량 ({unit})</label><input type="number" value={stdInputs.volume} onChange={e=>setStdInputs({...stdInputs,volume:Number(e.target.value)})} className="w-full p-2 mt-1 border rounded-lg"/></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-fade-in">
                                        {/* RESTORED Z-SCORE UI */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white p-3 rounded border border-slate-200">
                                                <div className="text-xs font-bold text-slate-400 mb-2">기준 연도</div>
                                                <div className="flex justify-between text-xs"><span>Mean</span><span>{advInputs.baseMean}</span></div>
                                                <div className="flex justify-between text-xs"><span>Std</span><span>{advInputs.baseStd}</span></div>
                                                <div className="flex justify-between text-xs font-bold border-t pt-1 mt-1"><span>My</span><span>{advInputs.baseMyPrice}</span></div>
                                                <div className="mt-2 text-center">
                                                    <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-bold">Z: {advResult.zBase > 0 ? '+' : ''}{advResult.zBase.toFixed(2)}σ</span>
                                                </div>
                                            </div>
                                            <div className="bg-purple-50 p-3 rounded border border-purple-200">
                                                <div className="text-xs font-bold text-purple-500 mb-2">평가 연도</div>
                                                <div className="flex justify-between text-xs"><span>Mean</span><input className="w-12 text-right bg-transparent border-b" value={advInputs.evalMean} onChange={e=>setAdvInputs({...advInputs,evalMean:Number(e.target.value)})}/></div>
                                                <div className="flex justify-between text-xs"><span>Std</span><input className="w-12 text-right bg-transparent border-b" value={advInputs.evalStd} onChange={e=>setAdvInputs({...advInputs,evalStd:Number(e.target.value)})}/></div>
                                                <div className="flex justify-between text-xs font-bold border-t border-purple-200 pt-1 mt-1"><span>My</span><input className="w-12 text-right bg-transparent font-bold" value={advInputs.evalMyPrice} onChange={e=>setAdvInputs({...advInputs,evalMyPrice:Number(e.target.value)})}/></div>
                                                <div className="mt-2 text-center">
                                                    <span className="bg-white border border-purple-200 text-purple-600 text-[10px] px-2 py-1 rounded font-bold shadow-sm">Z: {advResult.zEval > 0 ? '+' : ''}{advResult.zEval.toFixed(2)}σ</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div><label className="text-xs font-bold text-slate-500">물량 ({unit})</label><input type="number" value={advInputs.volume} onChange={e=>setAdvInputs({...advInputs,volume:Number(e.target.value)})} className="w-full p-2 mt-1 border rounded-lg"/></div>

                                        {/* Visual Logic Box */}
                                        <div className="bg-slate-900 text-white p-4 rounded-lg text-center flex justify-center items-center space-x-3 text-sm">
                                            <div>
                                                <div className="text-slate-400 text-[10px] mb-1">개선폭($\Delta Z$)</div>
                                                <div className="font-bold text-yellow-400 text-lg">{advResult.deltaZ > 0 ? '+' : ''}{advResult.deltaZ.toFixed(2)}σ</div>
                                            </div>
                                            <div className="text-slate-500">×</div>
                                            <div>
                                                <div className="text-slate-400 text-[10px] mb-1">가치($\sigma_{eval}$)</div>
                                                <div className="font-bold text-slate-200 text-lg">${advInputs.evalStd}</div>
                                            </div>
                                            <div className="text-slate-500">=</div>
                                            <div>
                                                <div className="text-slate-400 text-[10px] mb-1">단위인정액</div>
                                                <div className="font-bold text-green-400 text-lg">${advResult.unitSaving.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Result Dashboard */}
                    <div className="lg:col-span-4">
                        <div className="bg-slate-900 text-white rounded-2xl shadow-xl p-6 h-full flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-6"><Activity size={20} className="text-green-400"/><h3 className="font-bold text-lg">최종 수익성 분석</h3></div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                                        <div><div className="text-xs text-slate-400 mb-1">확정 고정비</div><div className="text-xl font-bold">{fmtUSD(effectiveBaseFee)}</div></div>
                                        <div className="text-xs bg-slate-800 px-2 py-1 rounded">{currentModel.name}</div>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                                        <div><div className="text-xs text-slate-400 mb-1">총 절감 인정액</div><div className="text-xl font-bold text-green-400">{fmtUSD(activeTab === 'standard' ? stdResult.totalSaving : advResult.totalSaving)}</div></div>
                                        <div className="text-right"><div className="text-[10px] text-slate-500">Logic</div><div className="text-xs font-bold text-green-600">{activeTab === 'standard' ? 'Standard' : 'Z-Score'}</div></div>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-slate-700 pb-3">
                                        <div>
                                            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">성과급 {(activeTab === 'standard' ? stdResult.isCapped : advResult.isCapped) && <span className="text-[10px] text-orange-400 bg-orange-900/50 px-1 rounded">CAP</span>}</div>
                                            <div className="text-2xl font-bold text-blue-400">{fmtUSD(activeTab === 'standard' ? stdResult.successFee : advResult.successFee)}</div>
                                            {(activeTab === 'standard' ? stdResult.isCapped : advResult.isCapped) && (
                                                <div className="text-[10px] text-slate-500 mt-1">
                                                    (산출액: <span className="line-through decoration-slate-500">{fmtUSD(activeTab === 'standard' ? stdResult.uncappedFee : advResult.uncappedFee)}</span>)
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right"><div className="text-[10px] text-slate-500">요율</div><div className="text-xs font-bold text-blue-500">{Math.round(effectiveSuccessRate * 100)}%</div></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button onClick={() => handleGenerateProposal({
                                    modelName: currentModel.name, baseFee: fmtUSD(effectiveBaseFee),
                                    savings: fmtUSD(activeTab === 'standard' ? stdResult.totalSaving : advResult.totalSaving),
                                    successFee: fmtUSD(activeTab === 'standard' ? stdResult.successFee : advResult.successFee),
                                    logic: activeTab === 'standard' ? 'Standard' : 'Z-Score',
                                    totalCost: fmtUSD(activeTab === 'standard' ? stdResult.totalRevenue : advResult.totalRevenue)
                                })} disabled={aiLoading} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-3 shadow-lg">
                                    {aiLoading ? <Loader2 className="animate-spin" size={16}/> : <FileText size={16}/>} AI 제안서 생성
                                </button>
                                {aiProposalResponse && <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">{aiProposalResponse.split('\n').map((l,i)=><p key={i} className="mb-1">{l}</p>)}</div>}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-300 uppercase">Total Cost</span>
                                <span className="text-3xl font-extrabold text-white">{fmtUSD(activeTab === 'standard' ? stdResult.totalRevenue : advResult.totalRevenue)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default App;