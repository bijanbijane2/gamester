import { UserStats, GameId } from '../types/game';
import { recordLevelCompletion, getHighestCompletedLevel } from './levelProgression';
import { addGameplaySeconds } from './appVisitTracker';
import { getCurrentUser, saveCurrentUser } from './authService';

const STORAGE_KEY = 'zehen_user_stats_v1';

export const INITIAL_STATS: UserStats = {
  totalScore: 120,
  gamesPlayed: 0,
  dailyStreak: 1,
  lastDailyDate: '',
  highScores: {
    horoofchin: 0,
    sarenakh: 0,
    zanjireh: 0,
    kalameh_ezafi: 0,
    panj_kalameh: 0,
    harfe_baadi: 0,
    stroop: 0,
    flanker: 0,
    gonogo: 0,
    visual_search: 0,
    reaction: 0,
    digit_span: 0,
    rule_switch: 0,
    illusions: 0,
    balloon: 0,
    iowa_boxes: 0,
    social_mind: 0,
    case_2347: 0,
    case_whisper: 0,
  },
  cognitiveProfile: {
    processingSpeed: 65,
    inhibitoryControl: 70,
    cognitiveFlexibility: 62,
    riskRegulation: 58,
    verbalFluency: 68,
    socialPerception: 72,
  },
  sampleCounts: {
    processingSpeed: 1,
    inhibitoryControl: 1,
    cognitiveFlexibility: 1,
    riskRegulation: 1,
    verbalFluency: 1,
    socialPerception: 1,
  },
  completedCases: [],
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      cognitiveProfile: { ...INITIAL_STATS.cognitiveProfile, ...(parsed.cognitiveProfile || {}) },
      highScores: { ...INITIAL_STATS.highScores, ...(parsed.highScores || {}) },
    };
  } catch {
    return INITIAL_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {}
}

export function recordGameResult(
  gameId: GameId,
  score: number,
  cognitiveUpdates?: Partial<Record<keyof UserStats['cognitiveProfile'], number>>
): UserStats {
  const current = loadUserStats();
  const newGamesPlayed = current.gamesPlayed + 1;
  const newTotalScore = current.totalScore + score;
  const prevHighScore = current.highScores[gameId] || 0;
  const newHighScores = {
    ...current.highScores,
    [gameId]: Math.max(prevHighScore, score),
  };

  const newCognitive = { ...current.cognitiveProfile };
  const newSamples = { ...current.sampleCounts };

  if (cognitiveUpdates) {
    (Object.keys(cognitiveUpdates) as Array<keyof UserStats['cognitiveProfile']>).forEach((key) => {
      const incomingVal = cognitiveUpdates[key];
      if (typeof incomingVal === 'number') {
        const count = newSamples[key] || 1;
        // Moving update with learning weight
        const weight = Math.max(0.15, 1 / (count + 1));
        const updated = Math.round(newCognitive[key] * (1 - weight) + incomingVal * weight);
        newCognitive[key] = Math.max(10, Math.min(99, updated));
        newSamples[key] = count + 1;
      }
    });
  }

  const updated: UserStats = {
    ...current,
    gamesPlayed: newGamesPlayed,
    totalScore: newTotalScore,
    highScores: newHighScores,
    cognitiveProfile: newCognitive,
    sampleCounts: newSamples,
  };

  saveUserStats(updated);

  // Genuine statistics: register active gameplay time (60 seconds)
  try {
    addGameplaySeconds(60);
    const authUser = getCurrentUser();
    if (authUser) {
      saveCurrentUser({
        ...authUser,
        totalGamesPlayed: authUser.totalGamesPlayed + 1,
        bestScore: Math.max(authUser.bestScore, score),
      });
    }
  } catch {}

  // Advance level in the 100-level system
  try {
    const highest = getHighestCompletedLevel(gameId);
    const lvl = highest === 0 ? 1 : Math.min(100, highest + 1);
    const stars = score >= 200 ? 3 : score >= 80 ? 2 : 1;
    recordLevelCompletion(gameId, lvl, score, stars);
  } catch {}

  return updated;
}

export function markCaseCompleted(caseId: string, bonusScore: number = 250): UserStats {
  const current = loadUserStats();
  if (!current.completedCases.includes(caseId)) {
    const updated: UserStats = {
      ...current,
      completedCases: [...current.completedCases, caseId],
      totalScore: current.totalScore + bonusScore,
      highScores: {
        ...current.highScores,
        [caseId as GameId]: Math.max(current.highScores[caseId as GameId] || 0, bonusScore),
      },
    };
    saveUserStats(updated);
    try {
      const highest = getHighestCompletedLevel(caseId as GameId);
      recordLevelCompletion(caseId as GameId, highest === 0 ? 1 : Math.min(100, highest + 1), bonusScore, 3);
    } catch {}
    return updated;
  }
  return current;
}
