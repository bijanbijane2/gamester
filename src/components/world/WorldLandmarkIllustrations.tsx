import React from 'react';

interface SvgProps {
  className?: string;
  isNight?: boolean;
  isActive?: boolean;
}

// 1. کتابخانه کلمات (حروف‌چین / حروف‌باز - Word Library)
export const WordLibrarySvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base Shadow */}
    <ellipse cx="50" cy="88" rx="36" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Foundation & Steps */}
    <rect x="22" y="80" width="56" height="5" rx="2" fill={isNight ? '#334155' : '#e2e8f0'} />
    <rect x="26" y="76" width="48" height="4" rx="1.5" fill={isNight ? '#475569' : '#f1f5f9'} />
    
    {/* Library Walls */}
    <rect x="30" y="44" width="40" height="32" rx="3" fill={isNight ? '#1e293b' : '#fef3c7'} stroke={isNight ? '#475569' : '#d97706'} strokeWidth="2" />
    
    {/* Bookshelves texture visible through window */}
    <rect x="42" y="52" width="16" height="24" rx="2" fill={isNight ? '#0f172a' : '#78350f'} />
    {/* Books on shelf */}
    <rect x="44" y="60" width="3" height="14" rx="0.5" fill="#f59e0b" />
    <rect x="48" y="58" width="3.5" height="16" rx="0.5" fill="#10b981" />
    <rect x="53" y="62" width="3" height="12" rx="0.5" fill="#ef4444" />
    
    {/* Library Columns */}
    <rect x="32" y="44" width="4" height="32" rx="1" fill={isNight ? '#475569' : '#fbbf24'} />
    <rect x="64" y="44" width="4" height="32" rx="1" fill={isNight ? '#475569' : '#fbbf24'} />
    
    {/* Roof (Book Gable shape) */}
    <path d="M24 44L50 20L76 44H24Z" fill={isNight ? '#334155' : '#b45309'} stroke={isNight ? '#64748b' : '#92400e'} strokeWidth="2" />
    
    {/* Open Book Emblem on pediment */}
    <path d="M42 36C46 34 50 35 50 38C50 35 54 34 58 36V40C54 38 50 39 50 42C50 39 46 38 42 40V36Z" fill="#fef3c7" />
    
    {/* Floating Persian Letter Glyphs */}
    <g className="animate-pulse">
      <text x="18" y="28" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="Vazirmatn">ب</text>
      <text x="75" y="24" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="Vazirmatn">م</text>
      <text x="47" y="14" fill="#34d399" fontSize="12" fontWeight="bold" fontFamily="Vazirmatn">س</text>
    </g>
    
    {/* Warm lantern light at night */}
    {isNight && (
      <circle cx="50" cy="62" r="10" fill="#f59e0b" opacity="0.25" filter="blur(4px)" />
    )}
  </svg>
);

// 2. اتاق معمایی / کلمه ممنوع (Mystery Room / Puzzle House)
export const MysteryRoomSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Cottage Body */}
    <rect x="28" y="46" width="44" height="34" rx="4" fill={isNight ? '#1e2638' : '#e0e7ff'} stroke={isNight ? '#4338ca' : '#6366f1'} strokeWidth="2" />
    
    {/* Steep Detective Attic Roof */}
    <path d="M22 46L50 18L78 46H22Z" fill={isNight ? '#312e81' : '#4f46e5'} />
    
    {/* Magnifying Glass Chimney */}
    <rect x="64" y="22" width="6" height="14" rx="1" fill={isNight ? '#475569' : '#64748b'} />
    <circle cx="67" cy="18" r="7" stroke="#fbbf24" strokeWidth="2.5" fill={isNight ? '#1e1b4b' : '#dbeafe'} />
    <line x1="72" y1="23" x2="77" y2="28" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
    
    {/* Glowing Attic Keyhole Window */}
    <circle cx="50" cy="34" r="5" fill="#fef08a" />
    <path d="M48 35L47 41H53L52 35Z" fill="#fef08a" />
    
    {/* Mystery Door with Envelope Slot */}
    <rect x="42" y="58" width="16" height="22" rx="2" fill={isNight ? '#0f172a' : '#312e81'} />
    <circle cx="54" cy="69" r="1.5" fill="#fbbf24" />
    
    {/* Question Mark Weathervane */}
    <path d="M49 11C49 8 53 8 53 11C53 13 50 13.5 50 15M50 17H50.5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. ایستگاه زنجیره کلمات (Word Chain Station)
export const ChainStationSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="38" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Track & Links on ground */}
    <path d="M12 84H88" stroke={isNight ? '#475569' : '#94a3b8'} strokeWidth="3" strokeDasharray="4 4" />
    
    {/* Chain Station Platform */}
    <rect x="25" y="48" width="50" height="32" rx="3" fill={isNight ? '#1e293b' : '#f1f5f9'} stroke={isNight ? '#059669' : '#10b981'} strokeWidth="2" />
    
    {/* Station Canopy */}
    <path d="M18 48L50 32L82 48H18Z" fill={isNight ? '#064e3b' : '#059669'} />
    
    {/* Connected Train/Chain Link Symbol */}
    <rect x="36" y="58" width="12" height="14" rx="4" stroke="#10b981" strokeWidth="2.5" fill="none" />
    <rect x="44" y="58" width="12" height="14" rx="4" stroke="#34d399" strokeWidth="2.5" fill="none" />
    <line x1="56" y1="65" x2="64" y2="65" stroke="#10b981" strokeWidth="2.5" strokeDasharray="2 2" />
    
    {/* Clock/Signal Post */}
    <circle cx="50" cy="24" r="6" fill="#f8fafc" stroke="#10b981" strokeWidth="1.5" />
    <line x1="50" y1="24" x2="50" y2="21" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="50" y1="24" x2="53" y2="24" stroke="#047857" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 4. کارگاه کلمات / چهار حرف (Word Workshop)
export const WordWorkshopSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="36" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Timbered Cabin Walls */}
    <rect x="26" y="46" width="48" height="34" rx="3" fill={isNight ? '#27201c' : '#fed7aa'} stroke={isNight ? '#78350f' : '#ea580c'} strokeWidth="2" />
    
    {/* Workshop Sloped Roof */}
    <path d="M20 46L50 24L80 46H20Z" fill={isNight ? '#7c2d12' : '#c2410c'} />
    
    {/* Wooden Toy Blocks at workshop door (4 blocks for 4 letters) */}
    <rect x="32" y="66" width="8" height="8" rx="1.5" fill="#f97316" stroke="#9a3412" strokeWidth="1" />
    <rect x="42" y="66" width="8" height="8" rx="1.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
    <rect x="52" y="66" width="8" height="8" rx="1.5" fill="#06b6d4" stroke="#0e7490" strokeWidth="1" />
    <rect x="62" y="66" width="8" height="8" rx="1.5" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1" />
    
    {/* Crossed Carpenter Rulers / Hammer on Roof Crest */}
    <path d="M46 16L54 24M54 16L46 24" stroke="#fb923c" strokeWidth="2" strokeLinecap="round" />
    
    {/* Workshop Window with blueprint glow */}
    <rect x="44" y="48" width="12" height="12" rx="2" fill={isNight ? '#38bdf8' : '#7dd3fc'} opacity={isNight ? 0.8 : 0.6} />
  </svg>
);

// 5. اتاق منطق / کلمه اضافی (Logic Room / Geometric Pavilion)
export const LogicRoomSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="35" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Symmetrical Classical Pavilion */}
    <rect x="25" y="78" width="50" height="4" rx="1.5" fill={isNight ? '#334155' : '#cbd5e1'} />
    <rect x="28" y="48" width="44" height="30" rx="2" fill={isNight ? '#1e293b' : '#f8fafc'} stroke={isNight ? '#38bdf8' : '#0284c7'} strokeWidth="2" />
    
    {/* Triangular Geometric Dome */}
    <path d="M22 48L50 20L78 48H22Z" fill={isNight ? '#0369a1' : '#0284c7'} />
    
    {/* Geometric Balancing Balance Scale in Center Window */}
    <circle cx="50" cy="58" r="3" fill="#38bdf8" />
    <line x1="38" y1="62" x2="62" y2="62" stroke="#38bdf8" strokeWidth="1.5" />
    <polygon points="38,62 35,68 41,68" fill="#38bdf8" />
    <polygon points="62,62 59,68 65,68" fill="#f43f5e" /> {/* The odd one out! */}
    
    {/* Rhombus Finial on Roof */}
    <polygon points="50,12 55,18 50,24 45,18" fill="#38bdf8" />
  </svg>
);

// 6. برج ساعت مرکزی / رمز روز (Daily Tower)
export const DailyTowerSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="90" rx="38" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Tower Base & Buttresses */}
    <path d="M34 86L38 46H62L66 86H34Z" fill={isNight ? '#1e293b' : '#fef3c7'} stroke={isNight ? '#eab308' : '#d97706'} strokeWidth="2" />
    
    {/* Central Clock Chamber */}
    <rect x="36" y="28" width="28" height="22" rx="3" fill={isNight ? '#334155' : '#fef08a'} stroke={isNight ? '#f59e0b' : '#ca8a04'} strokeWidth="2" />
    
    {/* Clock Face with glowing hands */}
    <circle cx="50" cy="39" r="8" fill={isNight ? '#0f172a' : '#ffffff'} stroke="#eab308" strokeWidth="1.5" />
    <line x1="50" y1="39" x2="50" y2="34" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="50" y1="39" x2="54" y2="39" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Spire with Golden Rooster / Star Flag */}
    <path d="M34 28L50 6L66 28H34Z" fill={isNight ? '#713f12' : '#b45309'} />
    <line x1="50" y1="6" x2="50" y2="1" stroke="#f59e0b" strokeWidth="1.5" />
    <path d="M50 1L57 4L50 7Z" fill="#eab308" />
    
    {/* Tower Portal */}
    <path d="M45 86V72C45 69.2 47.2 67 50 67C52.8 67 55 69.2 55 72V86H45Z" fill={isNight ? '#0f172a' : '#78350f'} />
    
    {/* Warm radial glow */}
    <circle cx="50" cy="39" r="16" fill="#fbbf24" opacity="0.2" filter="blur(6px)" />
  </svg>
);

// 7. خانه سه سرنخ (Clue House / Triple Window)
export const ClueHouseSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Cozy Triple A-frame House */}
    <rect x="28" y="48" width="44" height="32" rx="3" fill={isNight ? '#1e293b' : '#fae8ff'} stroke={isNight ? '#a855f7' : '#9333ea'} strokeWidth="2" />
    <path d="M22 48L50 20L78 48H22Z" fill={isNight ? '#581c87' : '#7e22ce'} />
    
    {/* Three Distinct Clue Windows (Three Clues Motif) */}
    <circle cx="38" cy="58" r="4.5" fill="#fef08a" stroke="#a855f7" strokeWidth="1.5" />
    <circle cx="50" cy="58" r="4.5" fill="#fef08a" stroke="#a855f7" strokeWidth="1.5" />
    <circle cx="62" cy="58" r="4.5" fill="#fef08a" stroke="#a855f7" strokeWidth="1.5" />
    
    {/* 3 Steps at entrance */}
    <rect x="42" y="76" width="16" height="4" rx="1" fill="#c084fc" />
    <rect x="44" y="73" width="12" height="3" rx="0.8" fill="#d8b4fe" />
    
    {/* Triple Leaf/Spire Ornament */}
    <circle cx="50" cy="18" r="3" fill="#fbbf24" />
  </svg>
);

// 8. برج سرعت / حرف بعدی (Speed Tower)
export const SpeedTowerSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="32" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Tapered Dynamic Tower */}
    <path d="M38 84L43 30H57L62 84H38Z" fill={isNight ? '#1e293b' : '#ecfeff'} stroke={isNight ? '#06b6d4' : '#0891b2'} strokeWidth="2" />
    <path d="M40 30L50 10L60 30H40Z" fill={isNight ? '#164e63' : '#0e7490'} />
    
    {/* Speed Windmill / Arrow Propeller */}
    <circle cx="50" cy="38" r="3.5" fill="#22d3ee" />
    <line x1="50" y1="38" x2="35" y2="28" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="50" y1="38" x2="65" y2="48" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
    
    {/* Motion Trails / Speed Curves */}
    <path d="M22 42C26 40 30 46 34 44" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M66 54C70 52 74 58 78 56" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" />
    <path d="M26 68C30 66 34 72 38 70" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 9. بازارچه کلمات / پنج کلمه (Word Market)
export const WordMarketSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="36" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Bazaar Stall Table */}
    <rect x="24" y="60" width="52" height="22" rx="2" fill={isNight ? '#334155' : '#fed7aa'} stroke={isNight ? '#78350f' : '#ea580c'} strokeWidth="2" />
    
    {/* Striped Canopy / Awning */}
    <path d="M20 50Q50 42 80 50L76 34Q50 26 24 34Z" fill="#f97316" />
    {/* Canopy Stripes */}
    <path d="M30 48L33 32M42 46L44 30M54 46L54 30M66 48L64 32" stroke="#fff7ed" strokeWidth="3" />
    
    {/* Fruit/Word Baskets on Display */}
    <circle cx="34" cy="62" r="5" fill="#ef4444" />
    <circle cx="44" cy="62" r="5" fill="#f59e0b" />
    <circle cx="54" cy="62" r="5" fill="#10b981" />
    <circle cx="64" cy="62" r="5" fill="#8b5cf6" />
    
    {/* Market Banner Tag */}
    <rect x="42" y="70" width="16" height="7" rx="1.5" fill="#ea580c" />
    <circle cx="50" cy="73.5" r="1.5" fill="#ffffff" />
  </svg>
);

// 10. ایستگاه پرونده‌های داستانی (Detective Archive / Case Office)
export const CaseOfficeSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="36" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    
    {/* Brick Wall Building */}
    <rect x="25" y="42" width="50" height="38" rx="3" fill={isNight ? '#1e293b' : '#cbd5e1'} stroke={isNight ? '#475569' : '#64748b'} strokeWidth="2" />
    
    {/* Flat Victorian Roof with Cornice */}
    <rect x="21" y="38" width="58" height="6" rx="2" fill={isNight ? '#0f172a' : '#475569'} />
    
    {/* Warm Glowing Office Window (Late night 23:47) */}
    <rect x="36" y="48" width="28" height="18" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
    <line x1="50" y1="48" x2="50" y2="66" stroke="#ca8a04" strokeWidth="1" />
    <line x1="36" y1="57" x2="64" y2="57" stroke="#ca8a04" strokeWidth="1" />
    
    {/* Detective Desk Lamp Silhouette */}
    <path d="M42 62C42 58 46 58 46 62Z" fill="#713f12" />
    
    {/* Doorway with Case Dossier Folder */}
    <rect x="42" y="70" width="16" height="10" fill={isNight ? '#0f172a' : '#334155'} />
    <rect x="45" y="72" width="10" height="6" rx="1" fill="#f59e0b" />
    
    {/* Clock 23:47 sign on rooftop */}
    <rect x="38" y="24" width="24" height="11" rx="2" fill={isNight ? '#0f172a' : '#1e293b'} stroke="#f59e0b" strokeWidth="1" />
    <text x="50" y="32" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="bold" fontFamily="monospace">23:47</text>
  </svg>
);

// 11. آزمایشگاه رنگ استروپ (Stroop Prism Lab)
export const StroopLabSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    <rect x="28" y="50" width="44" height="30" rx="3" fill={isNight ? '#1e293b' : '#f8fafc'} stroke={isNight ? '#6366f1' : '#4f46e5'} strokeWidth="2" />
    <path d="M22 50L50 24L78 50H22Z" fill={isNight ? '#312e81' : '#4338ca'} />
    {/* Color Spectrum Discs */}
    <circle cx="38" cy="62" r="5" fill="#ef4444" />
    <circle cx="46" cy="62" r="5" fill="#3b82f6" />
    <circle cx="54" cy="62" r="5" fill="#10b981" />
    <circle cx="62" cy="62" r="5" fill="#eab308" />
  </svg>
);

// 12. میدان بادکنک (Balloon Carnival)
export const BalloonCarnivalSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    <rect x="34" y="60" width="32" height="20" rx="2" fill={isNight ? '#1e293b' : '#ffe4e6'} stroke="#e11d48" strokeWidth="2" />
    {/* Big floating balloon over pavilion */}
    <path d="M50 20C40 20 34 28 34 38C34 48 48 54 50 56C52 54 66 48 66 38C66 28 60 20 50 20Z" fill="#f43f5e" />
    <ellipse cx="44" cy="30" rx="4" ry="7" fill="#ffffff" opacity="0.3" transform="rotate(-20 44 30)" />
    <line x1="50" y1="56" x2="50" y2="60" stroke="#e11d48" strokeWidth="1.5" />
  </svg>
);

// 13. خزانه‌ی حافظه و ارقام (Memory Vault / Archive)
export const MemoryVaultSvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    {/* Vault Structure */}
    <rect x="26" y="44" width="48" height="36" rx="4" fill={isNight ? '#1e293b' : '#ede9fe'} stroke={isNight ? '#8b5cf6' : '#7c3aed'} strokeWidth="2" />
    {/* Vault Door (Round Dial) */}
    <circle cx="50" cy="62" r="14" fill={isNight ? '#0f172a' : '#ddd6fe'} stroke="#8b5cf6" strokeWidth="2" />
    <circle cx="50" cy="62" r="5" fill="#a78bfa" />
    <line x1="50" y1="50" x2="50" y2="54" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
    <line x1="50" y1="70" x2="50" y2="74" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
    <line x1="38" y1="62" x2="42" y2="62" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
    <line x1="58" y1="62" x2="62" y2="62" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" />
    {/* Digits 1 2 3 floating above */}
    <g className="animate-pulse">
      <text x="32" y="36" fill="#a78bfa" fontSize="9" fontWeight="bold" fontFamily="monospace">7</text>
      <text x="48" y="32" fill="#c4b5fd" fontSize="10" fontWeight="bold" fontFamily="monospace">9</text>
      <text x="64" y="36" fill="#a78bfa" fontSize="9" fontWeight="bold" fontFamily="monospace">4</text>
    </g>
  </svg>
);

// 14. رصدخانه ادراک و خطای دید (Perception Observatory)
export const PerceptionObservatorySvg: React.FC<SvgProps> = ({ className = 'w-16 h-16', isNight = false }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="50" cy="88" rx="34" ry="7" fill={isNight ? '#090d16' : '#cbd5e1'} opacity="0.6" />
    {/* Base Building */}
    <rect x="28" y="52" width="44" height="28" rx="3" fill={isNight ? '#1e293b' : '#ecfdf5'} stroke={isNight ? '#10b981' : '#059669'} strokeWidth="2" />
    {/* Observatory Dome */}
    <path d="M28 52C28 36 38 24 50 24C62 24 72 36 72 52H28Z" fill={isNight ? '#064e3b' : '#10b981'} stroke={isNight ? '#10b981' : '#047857'} strokeWidth="1.5" />
    {/* Telescope Slit & Lens */}
    <rect x="47" y="24" width="6" height="28" fill={isNight ? '#022c22' : '#047857'} />
    <circle cx="50" cy="38" r="4.5" fill="#34d399" />
    {/* Optical Eye Symbol */}
    <path d="M42 66C45 63 55 63 58 66C55 69 45 69 42 66Z" stroke="#059669" strokeWidth="1.5" fill="none" />
    <circle cx="50" cy="66" r="1.5" fill="#10b981" />
  </svg>
);

// Cozy Nature / Landscape Elements
export const CozyTreeSvg: React.FC<{ x: number; y: number; scale?: number; isNight?: boolean }> = ({
  x,
  y,
  scale = 1,
  isNight = false,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Shadow */}
    <ellipse cx="0" cy="8" rx="9" ry="2.5" fill={isNight ? '#050a12' : '#94a3b8'} opacity="0.4" />
    {/* Trunk */}
    <rect x="-2" y="-4" width="4" height="12" rx="1" fill={isNight ? '#451a03' : '#78350f'} />
    {/* Foliage */}
    <circle cx="0" cy="-10" r="10" fill={isNight ? '#064e3b' : '#10b981'} />
    <circle cx="-5" cy="-8" r="8" fill={isNight ? '#047857' : '#059669'} />
    <circle cx="4" cy="-12" r="7" fill={isNight ? '#065f46' : '#34d399'} />
  </g>
);

export const CozyBushSvg: React.FC<{ x: number; y: number; isNight?: boolean }> = ({
  x,
  y,
  isNight = false,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx="0" cy="2" rx="7" ry="2" fill={isNight ? '#050a12' : '#94a3b8'} opacity="0.3" />
    <circle cx="-3" cy="-1" r="5" fill={isNight ? '#064e3b' : '#10b981'} />
    <circle cx="3" cy="-2" r="4.5" fill={isNight ? '#047857' : '#34d399'} />
  </g>
);

export const CozyStreetLampSvg: React.FC<{ x: number; y: number; isNight?: boolean }> = ({
  x,
  y,
  isNight = false,
}) => (
  <g transform={`translate(${x}, ${y})`}>
    <line x1="0" y1="0" x2="0" y2="-18" stroke={isNight ? '#94a3b8' : '#64748b'} strokeWidth="1.8" />
    <rect x="-3" y="-22" width="6" height="5" rx="1.5" fill={isNight ? '#fef08a' : '#cbd5e1'} />
    {isNight && (
      <circle cx="0" cy="-20" r="12" fill="#fef08a" opacity="0.3" filter="blur(4px)" />
    )}
  </g>
);
