import React, { useState } from 'react';

// --- UI COMPONENTS ---
const Currency = ({ amount, className = "" }) => {
  const parts = amount.toFixed(2).split('.');
  const integerPart = Number(parts[0]).toLocaleString();
  const decimalPart = parts[1];

  return (
    <span className={`inline-block ${className}`}>
      <span>₩ {integerPart}</span>
      <span className="text-[0.6em] text-muted opacity-60 ml-[2px]">.{decimalPart}</span>
    </span>
  );
};

// 1. Configuration Screen
const Calibration = ({ onComplete }) => {
  const [rate, setRate] = useState(30000);
  const [items, setItems] = useState([
    { id: 'sns', label: 'SNS 탐색 (인스타/유튜브)', desc: '미래 에너지 대출', type: 'range', max: 180, format: '분' },
    { id: 'netflix', label: '의미없는 정주행', desc: '도파민 과다 소비', type: 'range', max: 240, format: '분' },
    { id: 'smoke', label: '흡연 시간 (담배)', desc: '생명과 돈의 동시 소각', type: 'count', multiplier: 15, format: '개비' },
    { id: 'coffee', label: '습관성 커피/군것질', desc: '카페인/당분 의존 비용', type: 'count', multiplier: 20, format: '잔/회' }
  ]);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setItems([...items, {
      id: Date.now().toString(),
      label: newLabel,
      desc: newDesc || "기타 손실 반납",
      type: 'range',
      max: 120,
      format: '분'
    }]);
    setNewLabel("");
    setNewDesc("");
  };

  const handleRemove = (id) => setItems(items.filter(i => i.id !== id));

  return (
    <div className="relative flex min-h-screen w-full flex-col max-w-md mx-auto border-x border-muted/30 bg-background-dark p-6 overflow-y-auto z-20">
      <h1 className="font-display font-black text-3xl text-ink uppercase mb-2 mt-8">내 시간의 가치</h1>
      <p className="font-mono text-xs text-muted mb-8">당신의 1시간은 얼마짜리입니까?</p>

      <div className="mb-8">
        <label className="block font-mono text-xs text-muted uppercase tracking-widest mb-4">목표 시급 (₩)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="w-full bg-surface border-2 border-muted p-4 text-white font-mono text-2xl focus:border-ink focus:outline-none transition-colors"
        />
      </div>

      <div className="mb-8">
        <label className="block font-mono text-xs text-muted uppercase tracking-widest mb-4">입력할 손실 항목 관리</label>
        <div className="space-y-2 mb-6">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-surface border border-muted p-3">
              <div>
                <span className="font-display font-bold text-white uppercase block">{item.label}</span>
                <span className="font-mono text-[10px] text-muted block mt-1">{item.desc}</span>
              </div>
              <button onClick={() => handleRemove(item.id)} className="text-muted hover:text-primary material-symbols-outlined text-lg">close</button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAdd} className="flex flex-col gap-2 p-4 border border-muted/30 bg-surface">
          <span className="font-mono text-[10px] text-muted mb-2">새로운 항목 추가 (시간 단위)</span>
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="항목명 (예: 쇼츠 보기)"
            className="w-full bg-background-dark border border-muted p-3 text-white font-mono text-sm focus:border-ink focus:outline-none"
          />
          <input
            type="text"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="짧은 설명 (예: 뇌세포 휴식 거부)"
            className="w-full bg-background-dark border border-muted p-3 text-white font-mono text-xs focus:border-ink focus:outline-none"
          />
          <button type="submit" className="w-full mt-2 bg-muted text-white p-3 hover:bg-white hover:text-black font-mono text-xs uppercase transition-colors">항목 추가하기</button>
        </form>
      </div>

      <div className="mt-auto pt-4 pb-4">
        <button
          onClick={() => onComplete(rate, items.map(i => ({ ...i, value: 0 })))}
          className="w-full h-16 bg-ink text-black font-display font-bold text-xl uppercase tracking-widest hover:bg-white transition-colors border-2 border-transparent"
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

// 2. Input Screen (The Incinerator)
const Incinerator = ({ logs, setLogs, hourlyRate, onCalculate }) => {
  const handleUpdate = (id, newValue) => {
    setLogs(logs.map(log => log.id === id ? { ...log, value: Number(newValue) } : log));
  };

  const totalLoss = logs.reduce((sum, log) => {
    const minutes = log.type === 'count' ? log.value * log.multiplier : log.value;
    return sum + (minutes / 60) * hourlyRate;
  }, 0);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto border-x border-muted/30">
      <div className="w-full bg-surface border-b border-muted z-10 p-4 pt-8 flex justify-between items-end">
        <div>
          <h1 className="font-display font-bold text-2xl tracking-tighter leading-none text-white">하지 말았어야<br />할 일들</h1>
        </div>
        <div className="font-mono text-right text-ink">
          <div className="text-[10px] text-muted mb-1 uppercase tracking-widest">내 시급</div>
          <div className="text-lg font-bold"><Currency amount={hourlyRate} /></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative p-6 pb-32 z-20 space-y-8">
        {logs.map((log) => {
          const minutes = log.type === 'count' ? log.value * log.multiplier : log.value;
          const cost = (minutes / 60) * hourlyRate;

          return (
            <div key={log.id} className="group relative">
              <div className="flex justify-between items-baseline mb-1">
                <label className="font-display font-bold text-base text-white">{log.label}</label>
                <span className={`font-mono text-sm ${cost > 0 ? 'text-ink' : 'text-muted'}`}>
                  <Currency amount={cost} />
                </span>
              </div>

              <div className="text-[10px] text-primary mb-3 font-mono">{log.desc}</div>

              <div className="flex justify-between items-center text-[10px] text-muted font-mono mb-2 uppercase tracking-wider">
                <span>{log.type === 'count' ? '수량 (횟수)' : '소요 시간'}</span>
                <span className="text-white font-bold text-xs">{log.value} {log.format}</span>
              </div>

              {log.type === 'range' ? (
                <>
                  <input
                    className="w-full h-2 bg-muted rounded-none appearance-none cursor-pointer relative z-30"
                    max={log.max} min="0" step="5" type="range"
                    value={log.value}
                    onChange={(e) => handleUpdate(log.id, e.target.value)}
                  />
                  <div className="flex justify-between mt-1 text-[9px] text-muted font-mono">
                    <span>0분</span>
                    <span>{log.max}분</span>
                  </div>
                </>
              ) : (
                <div className="flex gap-1 h-10 w-full">
                  <button onClick={() => handleUpdate(log.id, Math.max(0, log.value - 1))} className="flex-1 bg-surface border border-muted text-muted font-mono text-xl">-</button>
                  <button onClick={() => handleUpdate(log.id, log.value + 1)} className="flex-1 bg-surface border border-muted text-ink font-mono text-xl">+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-background-dark p-6 border-t border-muted z-30">
        <div className="flex justify-between items-end mb-4">
          <span className="font-mono text-xs text-muted">달성 못한 기회비용</span>
          <span className="font-mono text-xl font-bold text-white tracking-tighter">
            <Currency amount={totalLoss} />
          </span>
        </div>
        <button
          onClick={() => onCalculate({ totalLoss })}
          className="w-full h-14 bg-white text-black font-display font-bold text-lg hover:bg-ink transition-colors"
        >
          손실 확정
        </button>
      </div>
    </div>
  );
};

// 3. Result Screen (The Ledger)
const Ledger = ({ hourlyRate, logs, reportData, onDismiss }) => {
  const [period, setPeriod] = useState(1); // 1 = Today, 7 = Weekly, 30 = Monthly
  const { totalLoss } = reportData;

  const projectedLoss = totalLoss * period;
  const now = new Date();
  const dateStr = now.toLocaleDateString('ko-KR');

  const periodLabels = {
    1: '오늘 태운 기회비용',
    7: '이번 주 태운 기회비용 (단순 곱 x7)',
    30: '이번 달 태운 기회비용 (단순 곱 x30)'
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-start bg-background-dark overflow-y-auto px-4 py-8">

      {/* Toggle View */}
      <div className="w-full max-w-[380px] bg-surface p-1 flex gap-1 mb-6 rounded-sm">
        <button onClick={() => setPeriod(1)} className={`flex-1 py-3 text-xs font-mono transition-colors ${period === 1 ? 'bg-white text-black font-bold' : 'text-muted hover:text-white'}`}>일간</button>
        <button onClick={() => setPeriod(7)} className={`flex-1 py-3 text-xs font-mono transition-colors ${period === 7 ? 'bg-white text-black font-bold' : 'text-muted hover:text-white'}`}>주간</button>
        <button onClick={() => setPeriod(30)} className={`flex-1 py-3 text-xs font-mono transition-colors ${period === 30 ? 'bg-white text-black font-bold' : 'text-muted hover:text-white'}`}>월간</button>
      </div>

      <div className="relative w-full max-w-[380px] bg-paper receipt-shadow torn-paper-edge">
        <div className="flex flex-col p-6 pb-2 text-paper-ink font-mono text-sm leading-relaxed tracking-tight relative z-20">

          <div className="text-center border-b-2 border-black pb-4 mb-4">
            <h2 className="text-xl font-black uppercase tracking-widest font-display mb-1">가치 소각 계산서</h2>
            <p className="text-xs font-bold text-paper-ink/80">{dateStr}</p>
          </div>

          <div className="flex justify-between border-b border-black pb-2 mb-4 text-[10px] font-bold tracking-wider">
            <span>소실 내역</span>
            <span className="text-right">환산 금액 (₩)</span>
          </div>

          <ul className="space-y-4 mb-8">
            {logs.filter(l => l.value > 0).map(log => {
              const minutes = log.type === 'count' ? log.value * log.multiplier : log.value;
              const cost = ((minutes / 60) * hourlyRate) * period;

              return (
                <li key={log.id} className="flex flex-col">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs truncate pr-4">{log.label}</span>
                    <span className="font-bold tabular-nums"><Currency amount={cost} /></span>
                  </div>
                  <div className="flex justify-between text-[10px] text-paper-ink/60 mt-0.5">
                    <span>{log.desc}</span>
                    <span>{log.value * period}{log.format}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t-2 border-black border-dashed pt-4 mb-6">
            <div className="flex flex-col my-2">
              <span className="font-bold text-xs tracking-wider text-muted/80 mb-1">
                {periodLabels[period]}
              </span>
              <span className="font-display text-3xl font-black tabular-nums tracking-tighter text-black text-right border-y-2 border-black py-2 mb-2">
                <Currency amount={projectedLoss} />
              </span>
            </div>
            <div className="text-center text-[10px] mt-4 font-bold">
              (시간은 환불이 불가합니다)
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full max-w-[380px] mt-6 flex flex-col gap-3">
        {/* Viral Requirement - Must be present */}
        <button
          className="w-full h-14 flex items-center justify-center gap-2 bg-[#FF2A00] text-white font-display font-bold text-sm tracking-widest transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">ios_share</span>
          계산서 공유하기
        </button>
        <button
          onClick={onDismiss}
          className="w-full h-14 flex items-center justify-center gap-2 bg-transparent border border-muted text-ink font-display font-bold text-sm tracking-widest hover:border-white transition-colors"
        >
          처음으로 돌아가기
        </button>
      </div>

    </div>
  );
};

// --- MAIN APP OVERSEER ---
export default function App() {
  const [view, setView] = useState('calibrate'); // 'calibrate' | 'incinerator' | 'ledger'
  const [hourlyRate, setHourlyRate] = useState(0);
  const [logs, setLogs] = useState([]);
  const [reportData, setReportData] = useState(null);

  const handleCalibration = (rate, initLogs) => {
    setHourlyRate(rate);
    setLogs(initLogs);
    setView('incinerator');
  };

  const handleCalculate = (data) => {
    if (data.totalLoss === 0) return; // Don't calculate if empty
    setReportData(data);
    setView('ledger');
  };

  const resetFlow = () => {
    setLogs(logs.map(l => ({ ...l, value: 0 })));
    setReportData(null);
    setView('incinerator');
  };

  return (
    <>
      <div className="bg-noise"></div>
      {view === 'calibrate' && (
        <Calibration onComplete={handleCalibration} />
      )}
      {view === 'incinerator' && (
        <Incinerator
          logs={logs}
          setLogs={setLogs}
          hourlyRate={hourlyRate}
          onCalculate={handleCalculate}
        />
      )}
      {view === 'ledger' && reportData && (
        <Ledger
          hourlyRate={hourlyRate}
          logs={logs}
          reportData={reportData}
          onDismiss={resetFlow}
        />
      )}
    </>
  );
}
