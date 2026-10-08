import React, { useState } from 'react';
import { GameId, UserStats } from '../../types/game';
import { sounds } from '../../services/sound';
import { CASES_LIST } from '../../data/casesData';
import { WorldMap } from '../world/WorldMap';
import { WeaknessRecommendationSection } from './WeaknessRecommendationSection';
import { AchievementsCardsSection } from './AchievementsCardsSection';
import { UserStatsLowerSection } from './UserStatsLowerSection';
import { getDeviceDailyStageNumber } from '../../services/dailyEnigmaService';
import { ENIGMA_STAGES_100 } from '../../data/enigmaJourney100';
import {
  Flame,
  Zap,
  Sparkles,
  Brain,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Lock,
  Play,
  Clock,
  Compass,
  MapPin,
  BookOpen,
} from 'lucide-react';

interface Props {
  stats: UserStats;
  onSelectGame: (gameId: GameId) => void;
  onOpenDaily: () => void;
  onSelectTab: (tab: string) => void;
  onOpenChainModal?: () => void;
  onOpenAdmin?: () => void;
  onOpenMembership?: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  stats,
  onSelectGame,
  onOpenDaily,
  onSelectTab,
  onOpenChainModal,
  onOpenAdmin,
  onOpenMembership,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const handleLaunch = (id: GameId) => {
    sounds.playTap();
    onSelectGame(id);
  };

  // Quick play games (Words, Speed, Perception)
  const quickGames = [
    {
      id: 'horoofchin' as GameId,
      title: 'حروف‌چین',
      category: 'واژه و زبان',
      desc: 'ترکیب حروفباز و چهار حرف؛ ساخت حداکثر کلمه در ۶۰ ثانیه با زنجیره Combo.',
      duration: '۱ دقیقه',
      score: stats.highScores.horoofchin,
    },
    {
      id: 'sarenakh' as GameId,
      title: 'سرنخ',
      category: 'واژه و معما',
      desc: 'کشف کلمه مخفی با ۳ سرنخ تدریجی؛ حدس سریع‌تر امتیاز بالاتری دارد.',
      duration: '۲ دقیقه',
      score: stats.highScores.sarenakh,
    },
    {
      id: 'zanjireh' as GameId,
      title: 'زنجیره کلمات',
      category: 'واژه و سرعت',
      desc: 'حرف پایانی کلمه قبل، آغاز کلمه بعد؛ زنجیره پیوسته بسازید.',
      duration: '۴۵ ثانیه',
      score: stats.highScores.zanjireh,
    },
    {
      id: 'kalameh_ezafi' as GameId,
      title: 'کلمه اضافی',
      category: 'استدلال زبانی',
      desc: 'کشف رابطه پنهان میان واژگان و تشخیص هوشمندانه کلمه نامتناسب.',
      duration: '۱ دقیقه',
      score: stats.highScores.kalameh_ezafi,
    },
    {
      id: 'stroop' as GameId,
      title: 'استروپ (Stroop)',
      category: 'سرعت و توجه',
      desc: 'تفکیک رنگ جوهر از معنای کلمه؛ مهار خطاهای شناختی در سرعت بالا.',
      duration: '۳۰ ثانیه',
      score: stats.highScores.stroop,
    },
    {
      id: 'gonogo' as GameId,
      title: 'Go / No-Go',
      category: 'مهار تکانه',
      desc: 'سبز بزن، قرمز نزن! مهار شوک ناگهانی در ریتم محرک‌های سریع.',
      duration: '۴۰ ثانیه',
      score: stats.highScores.gonogo,
    },
    {
      id: 'reaction' as GameId,
      title: 'زمان واکنش',
      category: 'سرعت خالص',
      desc: 'ثبت صدم‌ثانیه‌ای زمان واکنش عصبی به محض تغییر رنگ صفحه.',
      duration: '۲۰ ثانیه',
      score: stats.highScores.reaction,
    },
    {
      id: 'visual_search' as GameId,
      title: 'جستجوی بصری',
      category: 'دقت دیداری',
      desc: 'پیدا کردن عنصر نفوذی و متفاوت در شبکه نمادها در کمترین زمان.',
      duration: '۳۰ ثانیه',
      score: stats.highScores.visual_search,
    },
  ];

  // Deep cognitive & decision games
  const deepGames = [
    {
      id: 'balloon' as GameId,
      title: 'بادکنک جسور (BART)',
      category: 'ریسک و تصمیم',
      desc: 'هر بادکنک پول بیشتر یا انفجار ناگهانی! تعادل هوشمندانه طمع و محافظت.',
      duration: '۲ دقیقه',
      score: stats.highScores.balloon,
      minScoreRequired: 0,
    },
    {
      id: 'iowa_boxes' as GameId,
      title: 'چهار جعبه (Iowa Task)',
      category: 'تصمیم و پاداش',
      desc: 'کشف شهودی استراتژی پایدار بلندمدت در برابر سودهای پرخطر گمراه‌کننده.',
      duration: '۲ دقیقه',
      score: stats.highScores.iowa_boxes,
      minScoreRequired: 150,
    },
    {
      id: 'rule_switch' as GameId,
      title: 'تغییر قانون (Wisconsin)',
      category: 'انعطاف ذهنی',
      desc: 'ذهن به قانون قبلی خو می‌گیرد، بازی ناگهان قانون را عوض می‌کند!',
      duration: '۲ دقیقه',
      score: stats.highScores.rule_switch,
      minScoreRequired: 200,
    },
    {
      id: 'digit_span' as GameId,
      title: 'فراخنای ارقام',
      category: 'حافظه کاری',
      desc: 'به‌خاطرسپاری و بازخوانی زنجیره اعداد به ترتیب مستقیم یا معکوس.',
      duration: '۲ دقیقه',
      score: stats.highScores.digit_span,
      minScoreRequired: 100,
    },
    {
      id: 'social_mind' as GameId,
      title: 'ذهن دیگران و نیت',
      category: 'ادراک اجتماعی',
      desc: 'خواندن انگیزه‌های پنهان پیام‌ها در ابهام دیجیتال و آزمون حقیقت.',
      duration: '۲ دقیقه',
      score: stats.highScores.social_mind,
      minScoreRequired: 150,
    },
    {
      id: 'illusions' as GameId,
      title: 'خطای دید و ادراک',
      category: 'روانشناسی ادراک',
      desc: 'آزمودن فرضیات خطای بینایی و مشاهده واقعیت ابعاد و رنگ‌ها.',
      duration: '۱ دقیقه',
      score: stats.highScores.illusions,
      minScoreRequired: 0,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      {/* View Switcher: Illustrated World Map (Default) vs Categorized Directory */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl md:text-2xl font-black text-slate-100">
            {viewMode === 'map' ? 'جهان بازی‌ها · World Map' : 'فهرست جامع بازی‌ها'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium">
          <button
            onClick={() => { sounds.playTap(); setViewMode('map'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'map'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            نقشه مصور جهان (World Map)
          </button>
          <button
            onClick={() => { sounds.playTap(); setViewMode('list'); }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            فهرست بازی‌ها
          </button>
        </div>
      </div>

      {/* Mode A: Illustrated World Map (Primary) */}
      {viewMode === 'map' ? (
        <WorldMap
          stats={stats}
          onSelectGame={onSelectGame}
          onOpenDaily={onOpenDaily}
          onSelectTab={onSelectTab}
          onOpenChainModal={onOpenChainModal}
        />
      ) : null}

      {/* 1. امروز: رمز روز (Featured Daily Challenge Banner) */}
      {(() => {
        const todayStageNum = getDeviceDailyStageNumber();
        const todayStage = ENIGMA_STAGES_100[todayStageNum - 1] || ENIGMA_STAGES_100[0];
        return (
          <section className="relative overflow-hidden bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                  <Flame className="w-4 h-4 fill-amber-400/20" />
                  <span>رمز روز · ۱۰۰ مرحله روانشناسی، فلسفه و اندیشه سیاسی</span>
                  <span aria-hidden="true">·</span>
                  <span>پیوستگی: {stats.dailyStreak} روز</span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-100 flex items-center gap-2">
                  <span>چالش امروز شما: مرحله {todayStage.stage}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    {todayStage.domainLabel} · {todayStage.difficultyLabel}
                  </span>
                </h2>
                <p className="text-xs md:text-sm text-slate-300 max-w-xl leading-relaxed">
                  «{todayStage.title}» — معماهای عمیق شناختی، پارادوکس‌های فلسفی و نظریه‌های قدرت. هر دستگاه به طور تصادفی مرحله متفاوتی را دریافت می‌کند.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 flex-wrap">
                <button
                  onClick={onOpenDaily}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>ورود به رمز روز</span>
                </button>
                <button
                  onClick={() => {
                    sounds.playTap();
                    onSelectTab('enigma_100');
                  }}
                  className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>فهرست ۱۰۰ مرحله</span>
                </button>
              </div>
            </div>
          </section>
        );
      })()}

      {/* 2. زنجیره روانشناختی ۱۰۰ مرحله‌ای بازی‌ها (100-Level Interconnected Chain) */}
      <section className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 rounded-3xl p-6 md:p-7 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>زنجیره روانشناختی ۱۰۰ مرحله‌ای</span>
              <span>·</span>
              <span className="text-emerald-400">۳ سطح نخست تمام بازی‌ها باز است</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-100">
              سیستم پیشرفت زنجیره‌ای و پیوند مهارت‌ها
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
              برای هر بازی ۱۰۰ مرحله اختصاصی با درجه‌بندی چالش طراحی شده است. از سطح ۴ به بعد، قفل مراحل با پیشرفت در بازی متصل در زنجیره گشوده می‌شود!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 self-start md:self-center">
            <button
              onClick={() => {
                sounds.playTap();
                onSelectTab('enigma_100');
              }}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs md:text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>شروع چالش ۱۰۰ مرحله‌ای معما و رمز</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => {
                sounds.playTap();
                onOpenChainModal?.();
              }}
              className="px-4 py-3.5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 font-bold text-xs md:text-sm rounded-xl transition-all border border-slate-700/80 flex items-center justify-center gap-2"
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>شبکه زنجیره مهارت‌ها</span>
            </button>
          </div>
        </div>

        {/* Quick chain links sample tags */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
            🔗 حروف‌چین ⟵ زنجیره کلمات (روانی تداعی)
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
            🔗 استروپ ⟵ برو/نرو (کنترل تکانه)
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
            🔗 بادکنک BART ⟵ برو/نرو (مهار طمع)
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-800/80 text-slate-300 border border-slate-700/60">
            🔗 فراخنای ارقام ⟵ استروپ (حافظه کاری)
          </span>
        </div>
      </section>

      {/* سیستم پیشنهاد بازی‌های مکمل بر اساس تحلیل نقاط ضعف شناختی (Cognitive Weakness & Boosters) */}
      <WeaknessRecommendationSection
        stats={stats}
        onSelectGame={onSelectGame}
      />

      {/* 3. سریع بازی کن (Fast Play: Words & Reaction) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-100">سریع بازی کن</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              بازی‌های ۳۰ ثانیه تا ۲ دقیقه‌ای؛ مناسب سرگرمی فوری، سرعت و تقویت واژگان
            </p>
          </div>
          <button
            onClick={() => onSelectTab('fast_play')}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors hidden sm:block"
          >
            مشاهده همه بازی‌های سریع ←
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleLaunch(game.id)}
              className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{game.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{game.duration}</span>
                </div>
                <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {game.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {game.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {game.score > 0 ? `رکورد: ${game.score}` : 'هنوز بازی نشده'}
                </span>
                <span className="text-amber-400 font-semibold group-hover:translate-x-[-2px] transition-transform">
                  شروع ←
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. ذهن را محک بزن (Cognitive Deep Dive) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-800/80 pb-3">
          <div>
            <h3 className="text-xl font-bold text-slate-100">ذهن را محک بزن</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              آزمون‌های تصمیم‌گیری، حافظه فعال، پذیرش ریسک و الگوهای رفتارشناختی
            </p>
          </div>
          <button
            onClick={() => onSelectTab('test_mind')}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors hidden sm:block"
          >
            مشاهده همه آزمون‌ها ←
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {deepGames.map((game) => {
            const isUnlocked = stats.totalScore >= game.minScoreRequired;
            return (
              <div
                key={game.id}
                onClick={() => {
                  if (isUnlocked) handleLaunch(game.id);
                }}
                className={`border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-slate-900/90 hover:bg-slate-850 border-slate-800 hover:border-slate-700 cursor-pointer hover:-translate-y-0.5 group'
                    : 'bg-slate-950/60 border-slate-900 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>{game.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{game.duration}</span>
                    </div>
                    {!isUnlocked && (
                      <span className="flex items-center gap-1 text-slate-500">
                        <Lock className="w-3 h-3" />
                        <span>نیاز به {game.minScoreRequired} امتیاز</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {game.desc}
                  </p>
                </div>

                <div className="pt-4 mt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {game.score > 0 ? `بهترین نتیجه: ${game.score}` : 'ثبت در نقشه ذهن'}
                  </span>
                  {isUnlocked && (
                    <span className="text-amber-400 font-semibold group-hover:translate-x-[-2px] transition-transform">
                      ورود به آزمون ←
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. پرونده‌های من (Flagship Behavioral Cases) */}
      <section className="space-y-4">
        <div className="flex items-end justify-between border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-bold">تجربه محوری (Flagship)</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">پرونده‌های داستانی و تعاملی</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              سناریوهای چندمرحله‌ای ترکیبی همراه با تصمیم، بار شناختی، شواهد و افشاگری نهایی
            </p>
          </div>
          <button
            onClick={() => onSelectTab('cases')}
            className="text-xs text-amber-400 hover:text-amber-300 transition-colors hidden sm:block"
          >
            مشاهده پرونده‌ها ←
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASES_LIST.map((c) => {
            const isCompleted = stats.completedCases.includes(c.id);
            return (
              <div
                key={c.id}
                onClick={() => handleLaunch(c.id as GameId)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 flex flex-col justify-between cursor-pointer transition-all hover:-translate-y-0.5 group shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-medium">{c.category}</span>
                    <span className="text-slate-400">{c.estimatedMinutes} دقیقه مطالعه و تصمیم</span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {c.overview}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                    {isCompleted ? 'پرونده حل شده ✓' : 'آماده بررسی و تصمیم‌گیری'}
                  </span>
                  <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                    <span>گشودن پرونده</span>
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* بخش جدید دستاوردهای کسب‌شده به صورت کارت‌های گرافیکی (Graphic Achievements Cards) */}
      <AchievementsCardsSection stats={stats} />

      {/* 5. نقشه من (User Profile Callout) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
            <Brain className="w-4 h-4" />
            <span>نمودار ۶ شاخص شناختی و رکوردهای شما</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            نقشه من: الگوهای شکل‌گرفته از رفتارهای شما
          </h3>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            سرعت پردازش، مهار تکانه، انعطاف ذهنی، تنظیم ریسک، روانی کلامی و ادراک اجتماعی شما در یک نمای جامع.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('mind_map')}
          className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          ورود به نقشه من و کارنامه
        </button>
      </section>

      {/* پنل آمار دقیق کاربران در پایین صفحه (Genuine User Statistics Lower Section) */}
      <UserStatsLowerSection
        stats={stats}
        onOpenAdmin={() => onOpenAdmin?.()}
        onOpenMembership={() => onOpenMembership?.()}
      />
    </div>
  );
};
