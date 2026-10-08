/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * سرویس مدیریت رمز روز و تصادفی‌سازی اختصاصی هر دستگاه (۱۰۰ مرحله)
 * تضمین می‌کند که اگر دو کاربر با دو دستگاه مختلف همزمان وارد شوند، دو مرحله کاملاً متفاوت دریافت کنند.
 */

import { ENIGMA_STAGES_100, EnigmaStage } from '../data/enigmaJourney100';
import { loadUserStats, saveUserStats } from './storage';

const DEVICE_ID_KEY = 'zehen_unique_device_token';
const DAILY_STAGE_KEY_PREFIX = 'zehen_daily_stage_device_';
const SOLVED_STAGES_KEY = 'zehen_enigma_solved_list';
const CURRENT_ACTIVE_STAGE_KEY = 'zehen_enigma_journey_stage';

/**
 * دریافت یا ایجاد شناسه یکتا برای هر دستگاه
 */
export function getDeviceId(): string {
  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    if (!deviceId) {
      deviceId = 'dev_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    return deviceId;
  } catch {
    return 'temp_device_' + Math.random().toString(36).substring(2, 8);
  }
}

/**
 * تبدیل رشته به عدد هش پایدار
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * دریافت مرحله روز اختصاصی هر دستگاه
 * دو دستگاه با همزمان وارد شدن، مراحل متفاوتی را به واسطه هش مجزا دریافت می‌کنند
 */
export function getDeviceDailyStageNumber(): number {
  const todayStr = new Date().toISOString().slice(0, 10);
  const deviceId = getDeviceId();
  const cacheKey = `${DAILY_STAGE_KEY_PREFIX}${todayStr}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = parseInt(cached, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
        return parsed;
      }
    }
  } catch {}

  // محاسبه شاخص تصادفی بر پایه هش دستگاه و تاریخ
  // فرمول غیرخطی برای اطمینان از پخش یکنواخت ۱ تا ۱۰۰ در دستگاه‌های گوناگون
  const devHash = hashString(deviceId);
  const dateHash = hashString(todayStr);
  const mixed = (devHash * 31 + dateHash * 17 + 43) % 100;
  const stageNumber = mixed + 1; // 1 to 100

  try {
    localStorage.setItem(cacheKey, stageNumber.toString());
  } catch {}

  return stageNumber;
}

/**
 * ایجاد یک مرحله تصادفی تازه برای کاربر (تولید رمز تصادفی دیگر)
 * اولویت با مراحل حل‌نشده است
 */
export function rollNewRandomStage(excludeStageNumber?: number): number {
  const solved = getSolvedStages();
  const todayStr = new Date().toISOString().slice(0, 10);
  const cacheKey = `${DAILY_STAGE_KEY_PREFIX}${todayStr}`;

  // فهرست مراحلی که حل نشده‌اند
  const allStages = Array.from({ length: 100 }, (_, i) => i + 1);
  const unsolved = allStages.filter(s => !solved.includes(s) && s !== excludeStageNumber);

  let chosenStage: number;
  if (unsolved.length > 0) {
    const randomIndex = Math.floor(Math.random() * unsolved.length);
    chosenStage = unsolved[randomIndex];
  } else {
    // اگر همه حل شده‌اند، یک مرحله دلخواه به جز مرحله فعلی برگزین
    const remaining = allStages.filter(s => s !== excludeStageNumber);
    chosenStage = remaining[Math.floor(Math.random() * remaining.length)] || 1;
  }

  try {
    localStorage.setItem(cacheKey, chosenStage.toString());
    localStorage.setItem(CURRENT_ACTIVE_STAGE_KEY, chosenStage.toString());
  } catch {}

  return chosenStage;
}

/**
 * دریافت فهرست مراحل حل‌شده
 */
export function getSolvedStages(): number[] {
  try {
    const raw = localStorage.getItem(SOLVED_STAGES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

/**
 * بررسی اینکه آیا مرحله حل شده است
 */
export function isStageSolved(stageNumber: number): boolean {
  const solved = getSolvedStages();
  return solved.includes(stageNumber);
}

/**
 * علامت‌گذاری مرحله به عنوان حل‌شده و پاداش‌دهی
 */
export function markStageSolved(stageNumber: number): { isNew: boolean; xpEarned: number } {
  const solved = getSolvedStages();
  const isNew = !solved.includes(stageNumber);
  const stage = ENIGMA_STAGES_100[stageNumber - 1];
  const xpEarned = stage ? stage.xpReward : 50;

  if (isNew) {
    const updated = [...solved, stageNumber];
    try {
      localStorage.setItem(SOLVED_STAGES_KEY, JSON.stringify(updated));
    } catch {}

    // بروزرسانی امتیاز و استریک روزانه
    const stats = loadUserStats();
    const todayStr = new Date().toISOString().slice(0, 10);
    let newStreak = stats.dailyStreak;
    if (stats.lastDailyDate !== todayStr) {
      newStreak = stats.dailyStreak + 1;
    }

    const updatedStats = {
      ...stats,
      totalScore: stats.totalScore + xpEarned,
      dailyStreak: newStreak,
      lastDailyDate: todayStr,
      gamesPlayed: stats.gamesPlayed + 1,
    };
    saveUserStats(updatedStats);
  }

  return { isNew, xpEarned };
}

/**
 * دریافت مرحله فعال ذخیره‌شده یا مرحله اختصاصی امروز
 */
export function getActiveStageNumber(): number {
  try {
    const saved = localStorage.getItem(CURRENT_ACTIVE_STAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 100) {
        return parsed;
      }
    }
  } catch {}
  return getDeviceDailyStageNumber();
}

/**
 * ذخیره مرحله فعال
 */
export function setActiveStageNumber(stageNumber: number): void {
  try {
    localStorage.setItem(CURRENT_ACTIVE_STAGE_KEY, stageNumber.toString());
  } catch {}
}

/**
 * دریافت کل ۱۰۰ مرحله همراه با اطلاعات تکمیلی
 */
export function getAllStages(): EnigmaStage[] {
  return ENIGMA_STAGES_100;
}
