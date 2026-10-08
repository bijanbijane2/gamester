import React, { useState } from 'react';
import { GameId, UserStats } from '../../types/game';
import { sounds } from '../../services/sound';
import {
  WordLibrarySvg,
  MysteryRoomSvg,
  ChainStationSvg,
  WordWorkshopSvg,
  LogicRoomSvg,
  DailyTowerSvg,
  ClueHouseSvg,
  SpeedTowerSvg,
  WordMarketSvg,
  CaseOfficeSvg,
  StroopLabSvg,
  BalloonCarnivalSvg,
  MemoryVaultSvg,
  PerceptionObservatorySvg,
  CozyTreeSvg,
  CozyBushSvg,
  CozyStreetLampSvg,
} from './WorldLandmarkIllustrations';
import {
  Sun,
  Moon,
  Play,
  Sparkles,
  Trophy,
  Clock,
  Compass,
  X,
  ArrowRight,
  Filter,
  BarChart3,
  Brain,
  Flame,
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onSelectGame: (gameId: GameId) => void;
  onOpenDaily: () => void;
  onSelectTab: (tab: string) => void;
  onOpenChainModal?: () => void;
}

export type MapFilter = 'all' | 'quick' | 'words' | 'mind' | 'case';

interface LandmarkData {
  id: GameId;
  name: string;
  locationName: string;
  themeDesc: string;
  category: 'word' | 'speed' | 'mind' | 'case' | 'daily';
  duration: string;
  accentColor: string;
  accentBorder: string;
  highScore: number;
  x: number; // percentage coordinate on map
  y: number;
  renderSvg: (isNight: boolean) => React.ReactNode;
}

export const WorldMap: React.FC<Props> = ({
  stats,
  onSelectGame,
  onOpenDaily,
  onSelectTab,
  onOpenChainModal,
}) => {
  const [isNight, setIsNight] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<MapFilter>('all');
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkData | null>(null);

  // Toggle Day / Night
  const handleToggleDayNight = () => {
    sounds.playTap();
    setIsNight((prev) => !prev);
  };

  // Landmark catalog
  const landmarks: LandmarkData[] = [
    {
      id: 'horoofchin',
      name: 'حروف‌چین (حروف‌باز)',
      locationName: 'کتابخانه کلمات',
      themeDesc: 'ساخت و کشف واژگان از قفسه حروف در ۶۰ ثانیه با زنجیره Combo.',
      category: 'word',
      duration: '۱ دقیقه',
      accentColor: '#f59e0b',
      accentBorder: 'border-amber-500/40',
      highScore: stats.highScores.horoofchin,
      x: 18,
      y: 28,
      renderSvg: (night) => <WordLibrarySvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'sarenakh',
      name: 'کلمه ممنوع (سرنخ)',
      locationName: 'اتاق معمایی',
      themeDesc: 'کشف راز واژه مخفی از پشت ۳ سرنخ تدریجی با حداکثر امتیاز.',
      category: 'word',
      duration: '۲ دقیقه',
      accentColor: '#6366f1',
      accentBorder: 'border-indigo-500/40',
      highScore: stats.highScores.sarenakh,
      x: 82,
      y: 26,
      renderSvg: (night) => <MysteryRoomSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'zanjireh',
      name: 'زنجیره کلمات',
      locationName: 'ایستگاه پیوند کلمات',
      themeDesc: 'حرف پایانی به آغازین؛ هدایت واگن‌های متصل کلمات با سرعت بالا.',
      category: 'word',
      duration: '۴۵ ثانیه',
      accentColor: '#10b981',
      accentBorder: 'border-emerald-500/40',
      highScore: stats.highScores.zanjireh,
      x: 34,
      y: 52,
      renderSvg: (night) => <ChainStationSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'kalameh_ezafi',
      name: 'کلمه اضافی',
      locationName: 'اتاق منطق و نظم',
      themeDesc: 'کشف روابط پنهان میان کارت‌ها و تفکیک عنصر نامتناسب.',
      category: 'word',
      duration: '۱ دقیقه',
      accentColor: '#0284c7',
      accentBorder: 'border-sky-500/40',
      highScore: stats.highScores.kalameh_ezafi,
      x: 68,
      y: 52,
      renderSvg: (night) => <LogicRoomSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'panj_kalameh',
      name: 'پنج کلمه',
      locationName: 'بازارچه کلمات',
      themeDesc: 'جمع‌آوری سریع ۵ واژه از غرفه‌های موضوعی در کوتاه‌ترین زمان.',
      category: 'word',
      duration: '۱ دقیقه',
      accentColor: '#ea580c',
      accentBorder: 'border-orange-500/40',
      highScore: stats.highScores.panj_kalameh,
      x: 16,
      y: 72,
      renderSvg: (night) => <WordMarketSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'harfe_baadi',
      name: 'حرف بعدی (واکنش)',
      locationName: 'برج سرعت بادنما',
      themeDesc: 'تکمیل صاعقه‌ای جای خالی واژگان با ضربه‌های واکنشی سریع.',
      category: 'speed',
      duration: '۳۰ ثانیه',
      accentColor: '#06b6d4',
      accentBorder: 'border-cyan-500/40',
      highScore: stats.highScores.harfe_baadi,
      x: 84,
      y: 72,
      renderSvg: (night) => <SpeedTowerSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'stroop',
      name: 'استروپ (رنگ جوهر)',
      locationName: 'منشور طیف استروپ',
      themeDesc: 'تفکیک رنگ واقعی از معنای نوشته با مهار خطای شناختی.',
      category: 'speed',
      duration: '۳۰ ثانیه',
      accentColor: '#ec4899',
      accentBorder: 'border-pink-500/40',
      highScore: stats.highScores.stroop,
      x: 32,
      y: 84,
      renderSvg: (night) => <StroopLabSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'balloon',
      name: 'بادکنک جسور (BART)',
      locationName: 'میدان ریسک و سکه',
      themeDesc: 'تنظیم طمع و احتیاط؛ باد کردن بادکنک برای سکه بدون انفجار.',
      category: 'mind',
      duration: '۲ دقیقه',
      accentColor: '#f43f5e',
      accentBorder: 'border-rose-500/40',
      highScore: stats.highScores.balloon,
      x: 68,
      y: 84,
      renderSvg: (night) => <BalloonCarnivalSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'digit_span',
      name: 'فراخنای ارقام',
      locationName: 'خزانه حافظه و ارقام',
      themeDesc: 'به‌خاطرسپاری و بازخوانی زنجیره ارقام به ترتیب مستقیم یا معکوس.',
      category: 'mind',
      duration: '۲ دقیقه',
      accentColor: '#8b5cf6',
      accentBorder: 'border-purple-500/40',
      highScore: stats.highScores.digit_span,
      x: 50,
      y: 42,
      renderSvg: (night) => <MemoryVaultSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'illusions',
      name: 'گالری خطای دید',
      locationName: 'رصدخانه ادراک بینایی',
      themeDesc: 'آزمودن پیش‌بینی‌های قشر بینایی مغز و خطوط راهنمای اندازه و رنگ.',
      category: 'mind',
      duration: '۲ دقیقه',
      accentColor: '#10b981',
      accentBorder: 'border-emerald-500/40',
      highScore: 100,
      x: 82,
      y: 88,
      renderSvg: (night) => <PerceptionObservatorySvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
    {
      id: 'case_2347',
      name: 'پرونده: پیام ۲۳:۴۷',
      locationName: 'بایگانی کارآگاه شبانه',
      themeDesc: 'سناریوی چندمرحله‌ای تعاملی؛ قضاوت، لنگراندازی و افشاگری نهایی.',
      category: 'case',
      duration: '۶ دقیقه',
      accentColor: '#eab308',
      accentBorder: 'border-yellow-500/40',
      highScore: stats.completedCases.includes('case_2347') ? 250 : 0,
      x: 50,
      y: 74,
      renderSvg: (night) => <CaseOfficeSvg className="w-16 h-16 md:w-20 md:h-20" isNight={night} />,
    },
  ];

  // Filtering logic
  const matchesFilter = (l: LandmarkData) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'quick') return l.duration.includes('۳۰ ثانیه') || l.duration.includes('۴۵ ثانیه') || l.duration.includes('۱ دقیقه');
    if (activeFilter === 'words') return l.category === 'word';
    if (activeFilter === 'mind') return l.category === 'speed' || l.category === 'mind';
    if (activeFilter === 'case') return l.category === 'case';
    return true;
  };

  const handleLandmarkClick = (landmark: LandmarkData) => {
    sounds.playTap();
    setSelectedLandmark(landmark);
  };

  const handleLaunchGame = (id: GameId) => {
    sounds.playTap();
    setSelectedLandmark(null);
    onSelectGame(id);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Top World Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-sm">
        {/* User Agency Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0 ml-1">
            <Filter className="w-3.5 h-3.5" />
            <span>حالت:</span>
          </span>
          {[
            { id: 'all' as MapFilter, label: 'همه مکان‌ها' },
            { id: 'quick' as MapFilter, label: '⚡ ۳۰ ثانیه وقت دارم' },
            { id: 'words' as MapFilter, label: '📖 بازی‌های کلمه‌ای' },
            { id: 'mind' as MapFilter, label: '🧠 توجه و ذهن' },
            { id: 'case' as MapFilter, label: '📜 پرونده داستانی' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => { sounds.playTap(); setActiveFilter(btn.id); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                activeFilter === btn.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Controls: Chain, Daily Enigma, Analytics Shortcut & Day/Night Switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
          <button
            onClick={() => { sounds.playTap(); onOpenDaily(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-xs text-amber-300 font-bold transition-all shadow-sm"
            title="ورود به رمز روز (۱۰۰ مرحله روانشناسی، فلسفه و سیاست)"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>رمز روز</span>
          </button>

          <button
            onClick={() => { sounds.playTap(); onOpenChainModal?.(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-bold transition-all shadow-sm"
            title="مشاهده شبکه زنجیره روانشناختی بازی‌ها"
          >
            <Brain className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">زنجیره بازی‌ها</span>
          </button>

          <button
            onClick={() => { sounds.playTap(); onSelectTab('analytics'); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-amber-400 font-semibold hover:text-amber-300 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            <span>آمار و تحلیل</span>
          </button>

          <button
            onClick={handleToggleDayNight}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {isNight ? (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>شب آرام</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>روز آفتابی</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* The Illustrated World Map Canvas */}
      <div
        className={`relative w-full rounded-3xl border transition-colors duration-700 overflow-hidden shadow-2xl ${
          isNight
            ? 'bg-gradient-to-b from-slate-950 via-[#0c1322] to-[#090d16] border-slate-800 text-slate-100'
            : 'bg-gradient-to-b from-[#e2e8f0] via-[#f1f5f9] to-[#cbd5e1] border-slate-300 text-slate-900'
        }`}
        style={{ minHeight: '640px' }}
      >
        {/* Sky Background Elements */}
        {isNight ? (
          <div className="absolute inset-0 pointer-events-none">
            {/* Stars */}
            <div className="absolute top-6 left-12 w-1.5 h-1.5 rounded-full bg-cyan-200 animate-pulse" />
            <div className="absolute top-16 right-20 w-1 h-1 rounded-full bg-amber-200 animate-ping" />
            <div className="absolute top-24 left-1/3 w-1.5 h-1.5 rounded-full bg-white opacity-80" />
            <div className="absolute top-10 right-1/4 w-1 h-1 rounded-full bg-cyan-300" />
            <div className="absolute top-32 right-12 w-1.5 h-1.5 rounded-full bg-amber-300" />
            {/* Gentle Moon glow in corner */}
            <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-cyan-500/10 blur-xl" />
          </div>
        ) : (
          <div className="absolute inset-0 pointer-events-none">
            {/* Fluffy clouds */}
            <div className="absolute top-8 left-16 w-28 h-8 rounded-full bg-white/70 blur-xs animate-pulse" />
            <div className="absolute top-14 right-24 w-36 h-10 rounded-full bg-white/60 blur-xs" />
            <div className="absolute top-4 right-1/3 w-20 h-6 rounded-full bg-white/50 blur-xs" />
          </div>
        )}

        {/* SVG Procedural Ground Trails & River Paths */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 640"
          preserveAspectRatio="none"
        >
          {/* Gentle Hill Contours */}
          <path
            d="M0 240Q250 180 500 240T1000 220V640H0Z"
            fill={isNight ? '#0b121e' : '#e2e8f0'}
            opacity="0.6"
          />
          <path
            d="M0 380Q300 320 600 370T1000 350V640H0Z"
            fill={isNight ? '#0e1726' : '#f1f5f9'}
            opacity="0.8"
          />

          {/* Cozy Stream / River with wooden bridge */}
          <path
            d="M0 480Q350 430 500 500T1000 460"
            stroke={isNight ? '#1e3a5f' : '#93c5fd'}
            strokeWidth="28"
            fill="none"
            opacity="0.5"
          />
          {/* Water reflection ripples */}
          <path
            d="M100 470Q250 450 350 480"
            stroke={isNight ? '#38bdf8' : '#ffffff'}
            strokeWidth="3"
            strokeDasharray="8 12"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M650 490Q800 470 950 480"
            stroke={isNight ? '#38bdf8' : '#ffffff'}
            strokeWidth="3"
            strokeDasharray="8 12"
            fill="none"
            opacity="0.4"
          />

          {/* Cobblestone Walking Paths connecting all landmarks */}
          {/* Path from Library to Center */}
          <path
            d="M180 200Q340 230 500 240"
            stroke={isNight ? '#263345' : '#cbd5e1'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
          />
          {/* Path from Mystery House to Center */}
          <path
            d="M820 190Q660 220 500 240"
            stroke={isNight ? '#263345' : '#cbd5e1'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
          />
          {/* Path from Center southwards */}
          <path
            d="M500 270Q500 390 500 480"
            stroke={isNight ? '#263345' : '#cbd5e1'}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
          />
          {/* Cross paths */}
          <path
            d="M340 340Q420 320 500 320T680 340"
            stroke={isNight ? '#263345' : '#cbd5e1'}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
          />
          <path
            d="M160 460Q330 460 500 480T840 460"
            stroke={isNight ? '#263345' : '#cbd5e1'}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="4 8"
            fill="none"
          />

          {/* Cozy Trees & Bushes scattered throughout landscape */}
          <CozyTreeSvg x={80} y={150} scale={1.2} isNight={isNight} />
          <CozyTreeSvg x={280} y={140} scale={1} isNight={isNight} />
          <CozyTreeSvg x={920} y={160} scale={1.1} isNight={isNight} />
          <CozyTreeSvg x={740} y={140} scale={0.9} isNight={isNight} />
          <CozyTreeSvg x={40} y={390} scale={1.2} isNight={isNight} />
          <CozyTreeSvg x={960} y={380} scale={1.1} isNight={isNight} />
          <CozyTreeSvg x={410} y={430} scale={0.9} isNight={isNight} />
          <CozyTreeSvg x={590} y={430} scale={0.9} isNight={isNight} />

          <CozyBushSvg x={230} y={230} isNight={isNight} />
          <CozyBushSvg x={770} y={230} isNight={isNight} />
          <CozyBushSvg x={440} y={360} isNight={isNight} />
          <CozyBushSvg x={560} y={360} isNight={isNight} />

          {/* Street lamps along the paths */}
          <CozyStreetLampSvg x={350} y={260} isNight={isNight} />
          <CozyStreetLampSvg x={650} y={260} isNight={isNight} />
          <CozyStreetLampSvg x={500} y={420} isNight={isNight} />
        </svg>

        {/* Central Landmark: برج ساعت مرکزی (Daily Tower — رمز روز) */}
        <div
          onClick={() => { sounds.playTap(); onOpenDaily(); }}
          className="absolute left-1/2 top-[24%] -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group flex flex-col items-center"
        >
          {/* Subtle pulsating halo for daily challenge */}
          <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/20 blur-md animate-pulse pointer-events-none" />
          
          <div className="relative transform group-hover:scale-110 transition-transform duration-300">
            <DailyTowerSvg className="w-24 h-24 md:w-28 md:h-28" isNight={isNight} />
          </div>

          <div
            className={`mt-1 px-3 py-1 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 ${
              isNight
                ? 'bg-slate-900 border border-amber-500/50 text-amber-300'
                : 'bg-white border border-amber-400 text-amber-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>برج ساعت · رمز روز</span>
          </div>
        </div>

        {/* Interactive Landmark Pins */}
        {landmarks.map((landmark) => {
          const isDimmed = !matchesFilter(landmark);
          const isSelected = selectedLandmark?.id === landmark.id;

          return (
            <div
              key={landmark.id}
              onClick={() => handleLandmarkClick(landmark)}
              style={{
                left: `${landmark.x}%`,
                top: `${landmark.y}%`,
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group flex flex-col items-center transition-all duration-300 ${
                isDimmed ? 'opacity-30 pointer-events-none scale-90' : 'opacity-100 hover:scale-110'
              } ${isSelected ? 'scale-115 ring-4 ring-amber-400/40 rounded-full' : ''}`}
            >
              {/* Landmark Graphic */}
              <div className="relative drop-shadow-md">
                {landmark.renderSvg(isNight)}

                {/* Score or Completed Indicator Pill */}
                {landmark.highScore > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] tabular-nums shadow-sm">
                    {landmark.highScore}
                  </span>
                )}
              </div>

              {/* Landmark Nameplate */}
              <div
                className={`mt-0.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold shadow-sm transition-all whitespace-nowrap ${
                  isNight
                    ? 'bg-slate-900/90 border border-slate-700/80 text-slate-200 group-hover:text-amber-300 group-hover:border-amber-400/50'
                    : 'bg-white/95 border border-slate-300 text-slate-800 group-hover:text-amber-700 group-hover:border-amber-500'
                }`}
              >
                {landmark.locationName}
              </div>
            </div>
          );
        })}

        {/* Selected Landmark Drawer / Modal Popover */}
        {selectedLandmark && (
          <div className="absolute inset-x-4 bottom-4 z-30 max-w-lg mx-auto bg-slate-900/95 border border-slate-700 rounded-3xl p-5 shadow-2xl backdrop-blur-md animate-scale-up text-slate-100">
            <button
              onClick={() => setSelectedLandmark(null)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-2xl bg-slate-950 border border-slate-800 shrink-0">
                {selectedLandmark.renderSvg(isNight)}
              </div>

              <div className="flex-1 space-y-1 pr-1">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <span>{selectedLandmark.locationName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{selectedLandmark.duration}</span>
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">
                  {selectedLandmark.name}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedLandmark.themeDesc}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {selectedLandmark.highScore > 0 ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Trophy className="w-3.5 h-3.5" />
                        <span>رکورد شخصی: {selectedLandmark.highScore}</span>
                      </span>
                    ) : (
                      'آماده تجربه اول'
                    )}
                  </span>

                  <button
                    onClick={() => handleLaunchGame(selectedLandmark.id)}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span>ورود به بازی</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* World Map Legend & Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 shrink-0" />
          <span>هر مکان روی نقشه، نماد بصری و متامورفیک همان مینی‌گیم است.</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>با ضربه روی هر بنا، معرفی کوتاه و دکمه ورود باز می‌شود.</span>
        </div>
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>رکوردهای شما روی نقشه جهان ثبت و ذخیره می‌ماند.</span>
        </div>
      </div>
    </div>
  );
};
