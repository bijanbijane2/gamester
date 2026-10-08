/**
 * Web Speech API Psychological & Motivational Persian Voice Coach
 * Provides real-time spoken psychological cues, encouraging feedback,
 * and cognitive regulation tips during gameplay in Persian.
 */

export type SpeechContext =
  | 'game_start'
  | 'combo_high'
  | 'mistake_calm'
  | 'near_end'
  | 'level_complete'
  | 'daily_welcome'
  | 'cognitive_tip';

interface SpeechCoachConfig {
  enabled: boolean;
  volume: number; // 0.0 to 1.0
  rate: number;   // 0.8 to 1.2
  pitch: number;  // 0.8 to 1.2
}

const STORAGE_KEY_SPEECH = 'zehen_speech_coach_cfg_v1';

const PHRASES: Record<SpeechContext, string[]> = {
  game_start: [
    'نفس عمیق بکش و روی مرکز صفحه تمرکز کن.',
    'ترمزهای ذهنت رو آماده کن؛ دقت مهم‌تر از شتابه.',
    'آرامش کامل؛ مدار توجهت رو برای چالش فعال کن.',
    'حواس پرتی‌ها رو کنار بذار، بازی شروع شد.',
  ],
  combo_high: [
    'عالیه! سرعت پردازش مغزت فوق‌العاده‌ست.',
    'تمرکزت در اوجه، همین ریتم طلایی رو حفظ کن!',
    'فوق‌العاده! سیناپس‌های عصبی با بالاترین شتاب فعالند.',
    'تسلط بی‌نظیر؛ رفلکس‌های ذهنت شگفت‌انگیزه!',
  ],
  mistake_calm: [
    'آرامش خودت رو حفظ کن؛ به محرک بعدی نگاه کن.',
    'اشکالی نداره، سرعت رو فدای دقت نکن.',
    'یک نفس عمیق؛ ریتم تمرکزت رو دوباره پیدا کن.',
    'ذهنت رو رها کن؛ روی بازداری خطای بعدی متمرکز شو.',
  ],
  near_end: [
    'ثانیه‌های پایانی؛ تمام نیروی توجهت رو جمع کن!',
    'فقط چند لحظه مونده؛ تا آخرین نفس بجنگ!',
  ],
  level_complete: [
    'آفرین! مدار قشر پیش‌پیشانی تو عملکرد درخشانی نشون داد.',
    'تبریک! یک گام مهم در ارتقای انعطاف‌پذیری ذهنت برداشتی.',
    'فوق‌العاده بود! رکورد جدیدی برای قدرت تمرکزت ثبت شد.',
  ],
  daily_welcome: [
    'خوش اومدی؛ ذهنت رو برای رمز روز و رکورد تازه گرم کن.',
    'روز جدید، قدرت تازه برای مغز تو!',
  ],
  cognitive_tip: [
    'تنفس دیافراگمی اکسیژن‌رسانی به کورتکس مغز رو دو برابر می‌کنه.',
    'مهار تکانشگری کلید اصلی تصمیم‌های هوشمندانه است.',
  ],
};

class SpeechCoachService {
  private config: SpeechCoachConfig = {
    enabled: true,
    volume: 1.0,
    rate: 0.95,
    pitch: 1.05,
  };

  private lastSpokenTime = 0;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Array<(text: string, context: SpeechContext) => void> = [];
  private isSynthesizing = false;

  constructor() {
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SPEECH);
      if (raw) {
        this.config = { ...this.config, ...JSON.parse(raw) };
      }
    } catch {}
  }

  public saveConfig(cfg: Partial<SpeechCoachConfig>): void {
    this.config = { ...this.config, ...cfg };
    try {
      localStorage.setItem(STORAGE_KEY_SPEECH, JSON.stringify(this.config));
    } catch {}
  }

  public isEnabled(): boolean {
    return this.config.enabled;
  }

  public toggleEnabled(): boolean {
    const next = !this.config.enabled;
    this.saveConfig({ enabled: next });
    if (!next) {
      this.stop();
    }
    return next;
  }

  public subscribe(listener: (text: string, context: SpeechContext) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(text: string, context: SpeechContext): void {
    this.listeners.forEach((l) => {
      try {
        l(text, context);
      } catch {}
    });
  }

  /**
   * Speak a psychological guidance phrase for a given context
   */
  public speakContext(context: SpeechContext, specificPhrase?: string, force = false): void {
    if (!this.config.enabled) return;

    const now = Date.now();
    // Cooldown check (minimum 2.2 seconds between natural spoken cues to avoid speech overload)
    if (!force && now - this.lastSpokenTime < 2200) {
      return;
    }

    const phraseList = PHRASES[context] || PHRASES.game_start;
    const text = specificPhrase || phraseList[Math.floor(Math.random() * phraseList.length)];
    this.speak(text, context);
  }

  /**
   * Core Web Speech API execution with Persian language targeting & visual fallback
   */
  public speak(text: string, context: SpeechContext = 'cognitive_tip'): void {
    if (!this.config.enabled || !text) return;

    this.lastSpokenTime = Date.now();
    this.notify(text, context);

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    try {
      // Cancel pending utterance to avoid queue buildup
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      utterance.rate = this.config.rate;
      utterance.pitch = this.config.pitch;
      utterance.volume = this.config.volume;

      // Check available voices to pick Persian if installed
      const voices = window.speechSynthesis.getVoices();
      const persianVoice = voices.find(
        (v) =>
          v.lang.startsWith('fa') ||
          v.name.toLowerCase().includes('persian') ||
          v.name.toLowerCase().includes('farsi')
      );
      if (persianVoice) {
        utterance.voice = persianVoice;
      }

      utterance.onstart = () => {
        this.isSynthesizing = true;
      };
      utterance.onend = () => {
        this.isSynthesizing = false;
        this.currentUtterance = null;
      };
      utterance.onerror = () => {
        this.isSynthesizing = false;
        this.currentUtterance = null;
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback: UI subtitle notification already dispatched
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSynthesizing = false;
    this.currentUtterance = null;
  }
}

export const speechCoach = new SpeechCoachService();
