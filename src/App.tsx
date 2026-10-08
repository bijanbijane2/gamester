/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameId, UserStats } from './types/game';
import { loadUserStats, saveUserStats } from './services/storage';
import { Header } from './components/layout/Header';
import { HomeScreen } from './components/home/HomeScreen';
import { DailyChallengeModal } from './components/daily/DailyChallengeModal';
import { MindMapProfile } from './components/profile/MindMapProfile';
import { VisualAnalyticsPanel } from './components/stats/VisualAnalyticsPanel';
import { AppStatsWidget } from './components/common/AppStatsWidget';
import { Footer } from './components/layout/Footer';
import { LevelSelectModal } from './components/levels/LevelSelectModal';
import { CognitiveChainMapModal } from './components/levels/CognitiveChainMapModal';
import { GameLevelHeader } from './components/levels/GameLevelHeader';
import { AdminManagementPanel } from './components/admin/AdminManagementPanel';
import { MembershipModal } from './components/auth/MembershipModal';
import { SpeechCoachBanner } from './components/common/SpeechCoachBanner';
import { MentalProgressionEngine } from './components/progression/MentalProgressionEngine';
import { getHighestCompletedLevel } from './services/levelProgression';

// Games
import { HoroofChinGame } from './components/words/HoroofChinGame';
import { SarenakhGame } from './components/words/SarenakhGame';
import { ZanjirehGame } from './components/words/ZanjirehGame';
import { KalamehEzafiGame } from './components/words/KalamehEzafiGame';
import { PanjKalamehGame } from './components/words/PanjKalamehGame';
import { HarfeBaadiGame } from './components/words/HarfeBaadiGame';

import { StroopGame } from './components/speed/StroopGame';
import { GoNoGoGame } from './components/speed/GoNoGoGame';
import { VisualSearchGame } from './components/speed/VisualSearchGame';
import { ReactionGame } from './components/speed/ReactionGame';

import { DigitSpanGame } from './components/memory/DigitSpanGame';
import { RuleSwitchGame } from './components/memory/RuleSwitchGame';
import { IllusionGame } from './components/perception/IllusionGame';

import { BalloonRiskGame } from './components/decision/BalloonRiskGame';
import { IowaBoxesGame } from './components/decision/IowaBoxesGame';
import { SocialMindGame } from './components/social/SocialMindGame';
import { CaseFileViewer } from './components/cases/CaseFileViewer';

export default function App() {
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [isDailyActive, setIsDailyActive] = useState<boolean>(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [gameSelectedLevels, setGameSelectedLevels] = useState<Record<GameId, number>>({} as any);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [levelModalGameId, setLevelModalGameId] = useState<GameId | null>(null);
  const [isChainModalOpen, setIsChainModalOpen] = useState<boolean>(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState<boolean>(false);

  // Sync user stats
  const refreshStats = () => {
    setStats(loadUserStats());
  };

  const handleSelectGame = (gameId: GameId, isDaily: boolean = false) => {
    const currentLvl = gameSelectedLevels[gameId] || Math.min(100, Math.max(1, getHighestCompletedLevel(gameId) + 1));
    setGameSelectedLevels((prev) => ({ ...prev, [gameId]: currentLvl }));
    setActiveGameId(gameId);
    setIsDailyActive(isDaily);
  };

  const handleBackToMenu = () => {
    setActiveGameId(null);
    setIsDailyActive(false);
    refreshStats();
  };

  const handleDailyComplete = (bonusScore: number) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const current = loadUserStats();

    let newStreak = current.dailyStreak;
    if (current.lastDailyDate !== todayStr) {
      newStreak = current.dailyStreak + 1;
    }

    const updated: UserStats = {
      ...current,
      dailyStreak: newStreak,
      lastDailyDate: todayStr,
      totalScore: current.totalScore + 100, // Daily bonus!
    };
    saveUserStats(updated);
    setStats(updated);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden w-full max-w-full">
      {/* Top Header */}
      <Header
        activeTab={activeGameId ? '' : activeTab}
        onSelectTab={(tab) => {
          setActiveGameId(null);
          setActiveTab(tab);
          refreshStats();
        }}
        onOpenDaily={() => setIsDailyModalOpen(true)}
        onOpenChainModal={() => setIsChainModalOpen(true)}
        onOpenMembership={() => setIsMembershipModalOpen(true)}
        dailyStreak={stats.dailyStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Active Specific Game View */}
        {activeGameId ? (
          <div className="animate-fade-in">
            {/* 100-Level Indicator and Controls Header */}
            <GameLevelHeader
              gameId={activeGameId}
              currentLevel={gameSelectedLevels[activeGameId] || 1}
              onOpenLevelSelect={() => {
                setLevelModalGameId(activeGameId);
                setIsLevelSelectOpen(true);
              }}
              onOpenChainMap={() => setIsChainModalOpen(true)}
              onBack={handleBackToMenu}
            />
            {activeGameId === 'horoofchin' && (
              <HoroofChinGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'sarenakh' && (
              <SarenakhGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'zanjireh' && (
              <ZanjirehGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'kalameh_ezafi' && (
              <KalamehEzafiGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'panj_kalameh' && (
              <PanjKalamehGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'harfe_baadi' && (
              <HarfeBaadiGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}

            {activeGameId === 'stroop' && (
              <StroopGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'gonogo' && (
              <GoNoGoGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'visual_search' && (
              <VisualSearchGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'reaction' && (
              <ReactionGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}

            {activeGameId === 'digit_span' && (
              <DigitSpanGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'rule_switch' && (
              <RuleSwitchGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'illusions' && (
              <IllusionGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}

            {activeGameId === 'balloon' && (
              <BalloonRiskGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'iowa_boxes' && (
              <IowaBoxesGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}
            {activeGameId === 'social_mind' && (
              <SocialMindGame
                onBack={handleBackToMenu}
                isDaily={isDailyActive}
                onCompleteDaily={handleDailyComplete}
              />
            )}

            {(activeGameId === 'case_2347' || activeGameId === 'case_whisper') && (
              <CaseFileViewer
                caseId={activeGameId}
                onBack={handleBackToMenu}
              />
            )}
          </div>
        ) : (
          /* Main Tab Views */
          <>
            {activeTab === 'home' && (
              <HomeScreen
                stats={stats}
                onSelectGame={(id) => handleSelectGame(id, false)}
                onOpenDaily={() => setIsDailyModalOpen(true)}
                onSelectTab={setActiveTab}
                onOpenChainModal={() => setIsChainModalOpen(true)}
                onOpenAdmin={() => setActiveTab('admin')}
                onOpenMembership={() => setIsMembershipModalOpen(true)}
              />
            )}

            {activeTab === 'fast_play' && (
              <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">سریع بازی کن</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    بازی‌های کلمه‌ای و آزمون‌های واکنشی سریع (۳۰ ثانیه تا ۲ دقیقه) برای سرگرمی و رکورد
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'horoofchin', title: 'حروف‌چین', desc: 'ساخت کلمات با حروف داده‌شده در ۶۰ ثانیه' },
                    { id: 'sarenakh', title: 'سرنخ', desc: 'کشف کلمه مخفی با ۳ سرنخ تدریجی' },
                    { id: 'zanjireh', title: 'زنجیره کلمات', desc: 'حرف آخر به حرف اول؛ رکورد زنجیره پیوسته' },
                    { id: 'kalameh_ezafi', title: 'کلمه اضافی', desc: 'کشف رابطه پنهان و پیدا کردن عنصر ناهمگون' },
                    { id: 'panj_kalameh', title: 'پنج کلمه', desc: 'ورود سریع ۵ واژه مرتبط با موضوع مطرح‌شده' },
                    { id: 'harfe_baadi', title: 'حرف بعدی / جای خالی', desc: 'تکمیل صاعقه‌ای جای خالی واژگان' },
                    { id: 'stroop', title: 'استروپ (رنگ جوهر)', desc: 'تفکیک سریع رنگ واقعی از معنای نوشته' },
                    { id: 'gonogo', title: 'Go / No-Go', desc: 'سبز بزن، قرمز نزن! آزمون بازداری تکانه' },
                    { id: 'reaction', title: 'زمان واکنش میلی‌ثانیه‌ای', desc: 'ثبت کمترین زمان واکنش عصبی به علامت' },
                    { id: 'visual_search', title: 'جستجوی بصری', desc: 'شناسایی نماد نفوذی در شبکه اشکال' },
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGame(g.id as GameId)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all group"
                    >
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                        {g.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{g.desc}</p>
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                        <span className="text-xs text-amber-400 font-semibold">شروع بازی ←</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'test_mind' && (
              <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">ذهن را محک بزن</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    آزمون‌های رفتارشناسی، ریسک و تصمیم‌گیری، انعطاف شناختی و استنباط ذهن دیگران
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'balloon', title: 'بادکنک BART (ریسک)', desc: 'تنظیم هوشمندانه خطر انفجار در برابر سودآوری' },
                    { id: 'iowa_boxes', title: 'چهار جعبه Iowa', desc: 'کشف استراتژی سود پایدار در برابر تله‌های فریبنده' },
                    { id: 'rule_switch', title: 'تغییر قانون Wisconsin', desc: 'کشف قوانین جهش‌یافته و رها کردن عادت کهنه' },
                    { id: 'digit_span', title: 'فراخنای ارقام', desc: 'سنجش ظرفیت حافظه فعال دیداری و شنیداری' },
                    { id: 'social_mind', title: 'ذهن دیگران و نیت', desc: 'تفکیک نیت واقعی از پیش‌داوری در پیام‌ها' },
                    { id: 'illusions', title: 'گالری خطای دید', desc: 'آزمودن فرضیات خطای بینایی با خطوط راهنما' },
                  ].map((g) => (
                    <div
                      key={g.id}
                      onClick={() => handleSelectGame(g.id as GameId)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 transition-all group"
                    >
                      <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                        {g.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{g.desc}</p>
                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex justify-end">
                        <span className="text-xs text-amber-400 font-semibold">ورود به آزمون ←</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cases' && (
              <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
                <div>
                  <span className="text-xs text-amber-400 font-semibold block mb-1">
                    پرونده‌های داستانی چندمرحله‌ای
                  </span>
                  <h2 className="text-2xl font-bold text-slate-100">پرونده‌های من</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    تجربه‌های روایی ترکیبی با ادغام تصمیم‌گیری، آزمون‌های سرعت، شواهد و تحلیل نهایی
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'case_2347',
                      title: 'پرونده: پیام ساعت ۲۳:۴۷',
                      desc: 'قضاوت در شرایط خستگی، شایعه ۶۰۰ میلیونی، و آزمون به‌روزرسانی باور.',
                      time: '۶ دقیقه',
                      completed: stats.completedCases.includes('case_2347'),
                    },
                    {
                      id: 'case_whisper',
                      title: 'پرونده: زمزمه در راهرو',
                      desc: 'تفکر گروهی (Groupthink)، مغالطه هزینه هدررفته (Sunk Cost) و شجاعت سازمانی.',
                      time: '۵ دقیقه',
                      completed: stats.completedCases.includes('case_whisper'),
                    },
                  ].map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelectGame(c.id as GameId)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 cursor-pointer hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-amber-400 font-medium">{c.time}</span>
                          {c.completed && <span className="text-emerald-400 font-bold">حل شده ✓</span>}
                        </div>
                        <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
                        <span className="text-xs text-amber-400 font-semibold">بررسی پرونده ←</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <VisualAnalyticsPanel
                onBack={() => setActiveTab('home')}
                onSelectGame={(id) => handleSelectGame(id, false)}
              />
            )}

            {activeTab === 'enigma_100' && (
              <MentalProgressionEngine
                onBack={() => setActiveTab('home')}
                onStageCompleted={() => refreshStats()}
              />
            )}

            {activeTab === 'mind_map' && (
              <MindMapProfile onBack={() => setActiveTab('home')} />
            )}

            {activeTab === 'admin' && (
              <AdminManagementPanel
                onBack={() => setActiveTab('home')}
                onSelectGame={(id) => handleSelectGame(id, false)}
                onOpenMembership={() => setIsMembershipModalOpen(true)}
              />
            )}

            {/* Bottom Footer Attribution */}
            <Footer />
          </>
        )}
      </main>

      {/* Persistent Visitor & Gameplay Stats Widget */}
      <AppStatsWidget />

      {/* Web Speech API Psychological Motivational Voice Banner */}
      <SpeechCoachBanner />

      {/* Google Account Membership Modal */}
      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onUserChange={() => refreshStats()}
      />

      {/* 100-Level Selector Modal */}
      {levelModalGameId && (
        <LevelSelectModal
          isOpen={isLevelSelectOpen}
          gameId={levelModalGameId}
          onClose={() => setIsLevelSelectOpen(false)}
          onSelectLevel={(level) => {
            setGameSelectedLevels((prev) => ({ ...prev, [levelModalGameId]: level }));
            setActiveGameId(levelModalGameId);
            setIsLevelSelectOpen(false);
          }}
          onNavigateToPrereqGame={(prereqId) => {
            setIsLevelSelectOpen(false);
            handleSelectGame(prereqId, false);
          }}
          onOpenChainMap={() => {
            setIsLevelSelectOpen(false);
            setIsChainModalOpen(true);
          }}
        />
      )}

      {/* Psychological Cognitive Dependency Chain Map Modal */}
      <CognitiveChainMapModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        onSelectGame={(gameId) => {
          setIsChainModalOpen(false);
          handleSelectGame(gameId, false);
        }}
      />

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onOpenEnigmaProgression={(stageNum) => {
          setActiveTab('enigma_100');
          setActiveGameId(null);
          if (stageNum) {
            try {
              localStorage.setItem('zehen_enigma_journey_stage', stageNum.toString());
            } catch {}
          }
          refreshStats();
        }}
        onLaunchDailyGame={(gameId) => handleSelectGame(gameId, true)}
      />
    </div>
  );
}
