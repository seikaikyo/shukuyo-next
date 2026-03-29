// ICS 日曆內容的多語翻譯字典
// 獨立於 vue-i18n，因為 ics-generator 不在 Vue component 內

type Lang = 'zh-TW' | 'ja' | 'en'

interface IcsTranslations {
  calendarName: string
  fortuneLabel: string
  relationLabel: string
  mansionLabel: string
  sankiLabel: string
  specialDayLabel: string
  ryouhanWarn: string
  ryouhanReverse: string
  darkWeekLabel: string
  ryouhanLabel: string

  darkWeekFallback: string
  levelNames: Record<string, string>
  tips: {
    kanro: string
    kanroReversed: string
    kongou: string
    kongouReversed: string
    rasetsu: string
    rasetsuReversed: string
    ryouhan: string
    darkWeekDefault: string
    darkWeekEi: string
    darkWeekAn: string
    darkWeekSei: string
    darkWeekKai: string
    darkWeekGyou: string
    darkWeekSui: string
    darkWeekKi: string
    darkWeekMei: string
    darkWeekTai: string
    daikichi: string
    kichi: string
    shokyo: string
    kyo: string
    normal: string
  }
}

const translations: Record<Lang, IcsTranslations> = {
  'zh-TW': {
    calendarName: '{mansion}({element}) {year} 年運勢',
    fortuneLabel: '運勢',
    relationLabel: '關係',
    mansionLabel: '宿',
    sankiLabel: '三期',
    specialDayLabel: '特殊日',
    ryouhanWarn: '凌犯期間: 吉凶逆轉注意',
    ryouhanReverse: '逆轉',
    darkWeekLabel: '二九前半七宿',
    ryouhanLabel: '凌犯',
    darkWeekFallback: '二九前半',
    levelNames: {
      daikichi: '大吉', kichi: '吉',
      shokyo: '小凶', kyo: '凶',
    },
    tips: {
      kanro: '甘露日：難得的大吉日，適合開始新計畫、簽約、重要面談',
      kanroReversed: '甘露日但在凌犯期間，吉凶逆轉。宜靜觀待時',
      kongou: '金剛峯日：氣場強勢的一天，適合處理棘手的事、談判、下決心',
      kongouReversed: '金剛峯日但在凌犯期間，吉凶逆轉。強勢能量易生阻力',
      rasetsu: '羅刹日：百事宜慎重，能延就延',
      rasetsuReversed: '羅刹日但凌犯逆轉，凶象減弱。保持平常心即可',
      ryouhan: '凌犯期間：吉凶可能相反，宜修福，穩住心態',
      darkWeekDefault: '二九前半七宿：不要把這段直接視為固定凶週，仍要按當日宿位逐日判讀',
      darkWeekEi: '二九前半逢栄日，原典仍記載諸吉事並大吉，可正常行動',
      darkWeekAn: '二九前半逢安日，原典仍記載移徙與造作並吉，屬穩定踏實的一天',
      darkWeekSei: '二九前半逢成日，原典仍記載修道學問與成就法並吉，適合學習精進',
      darkWeekKai: '二九前半壊日，原典記載宜作鎮壓、降伏怨讎，餘並不堪',
      darkWeekGyou: '二九前半業日，原典記載所作善惡亦不成就。低調收斂為上',
      darkWeekSui: '二九前半衰日，原典記載唯宜解除諸惡、療病。保守度過',
      darkWeekKi: '二九前半危日，原典記載宜結交、歡宴聚會並吉。社交可行',
      darkWeekMei: '二九前半命日，原典記載宜靜守本分',
      darkWeekTai: '二九前半胎日，原典記載宜靜心準備',
      daikichi: '運勢很好的一天，想做什麼就行動吧',
      kichi: '不錯的一天，適合推進計畫、見重要的人',
      shokyo: '稍微注意一下，穩穩來就沒問題',
      kyo: '運勢偏低，適合休息充電',
      normal: '平穩的一天',
    },
  },
  ja: {
    calendarName: '{mansion}({element}) {year}年運勢',
    fortuneLabel: '運勢',
    relationLabel: '関係',
    mansionLabel: '宿',
    sankiLabel: '三期',
    specialDayLabel: '特殊日',
    ryouhanWarn: '凌犯期間: 吉凶逆転に注意',
    ryouhanReverse: '逆転',
    darkWeekLabel: '二九前半七宿',
    ryouhanLabel: '凌犯',
    darkWeekFallback: '二九前半',
    levelNames: {
      daikichi: '大吉', kichi: '吉',
      shokyo: '小凶', kyo: '凶',
    },
    tips: {
      kanro: '甘露日：稀な大吉日。新計画の開始、契約、重要な面談に最適',
      kanroReversed: '甘露日だが凌犯期間中、吉凶逆転。静観すべし',
      kongou: '金剛峯日：気場が強い一日。難題処理、交渉、決断に適する',
      kongouReversed: '金剛峯日だが凌犯期間中、吉凶逆転。強い力が抵抗を生みやすい',
      rasetsu: '羅刹日：万事慎重に。延ばせることは延ばす',
      rasetsuReversed: '羅刹日だが凌犯逆転、凶象が弱まる。平常心でOK',
      ryouhan: '凌犯期間：吉凶が逆転する可能性あり。修福し心を落ち着けて',
      darkWeekDefault: '二九前半七宿：この区間を固定の凶週とみなさず、当日の宿位ごとに判定すること',
      darkWeekEi: '二九前半の栄日。原典どおり吉事は大吉で、通常通り行動可',
      darkWeekAn: '二九前半の安日。原典どおり移徙・造作は吉で、安定した一日',
      darkWeekSei: '二九前半の成日。原典どおり修道学問・成就法は吉で、学習精進に適す',
      darkWeekKai: '二九前半の壊日。原典どおり鎮圧・降伏のみ可、他は不向き',
      darkWeekGyou: '二九前半の業日。原典どおり善悪とも成就しにくい。低姿勢で',
      darkWeekSui: '二九前半の衰日。原典どおり解除・療病のみ宜し。控えめに',
      darkWeekKi: '二九前半の危日。原典どおり結交・聚会は吉。社交は可',
      darkWeekMei: '二九前半の命日。原典どおり静守すべし',
      darkWeekTai: '二九前半の胎日。原典どおり静心して準備を',
      daikichi: '運勢が良い一日。やりたいことがあれば行動あるのみ',
      kichi: '良い一日。計画を進める、大事な人に会うのに適する',
      shokyo: '少し注意。冒険は避けて堅実に',
      kyo: '運勢低め。休息と充電の日',
      normal: '穏やかな一日',
    },
  },
  en: {
    calendarName: '{mansion}({element}) {year} Fortune',
    fortuneLabel: 'Fortune',
    relationLabel: 'Relation',
    mansionLabel: 'Mansion',
    sankiLabel: 'Sanki Period',
    specialDayLabel: 'Special Day',
    ryouhanWarn: 'Ryouhan period: fortune reversal warning',
    ryouhanReverse: 'reversed',
    darkWeekLabel: 'Early Niku 7-day span',
    ryouhanLabel: 'Ryouhan',
    darkWeekFallback: 'Early Niku',
    levelNames: {
      daikichi: 'Great Fortune', kichi: 'Good Fortune',
      shokyo: 'Minor Caution', kyo: 'Caution',
    },
    tips: {
      kanro: 'Kanro Day: A rare auspicious day. Ideal for new plans, contracts, important meetings',
      kanroReversed: 'Kanro Day but during Ryouhan period, fortune reversed. Best to wait and observe',
      kongou: 'Kongou Day: Strong energy day. Good for tough decisions, negotiations, taking action',
      kongouReversed: 'Kongou Day but during Ryouhan period, fortune reversed. Strong energy may create resistance',
      rasetsu: 'Rasetsu Day: Proceed with caution on all matters. Postpone what you can',
      rasetsuReversed: 'Rasetsu Day but Ryouhan reversal weakens the negative. Stay calm and carry on',
      ryouhan: 'Ryouhan period: fortune may reverse. Stay centered and make merit',
      darkWeekDefault: 'Early Niku span: treat the first seven mansions of Niku individually rather than as a single fixed bad week',
      darkWeekEi: 'Early Niku Ei day — the sutra still marks office, business, and auspicious matters as favorable. Act normally',
      darkWeekAn: 'Early Niku An day — the sutra still marks relocation and construction as favorable. A stable day',
      darkWeekSei: 'Early Niku Sei day — the sutra still marks study and achievement practices as favorable. Good for learning',
      darkWeekKai: 'Early Niku Kai day — only suppression and subjugation are viable. Other matters are not advisable',
      darkWeekGyou: 'Early Niku Gyo day — neither good nor bad deeds will bear fruit. Stay low-key',
      darkWeekSui: 'Early Niku Sui day — only removing evils and healing are advisable. Keep a low profile',
      darkWeekKi: 'Early Niku Ki day — socializing and gatherings remain favorable in the sutra',
      darkWeekMei: 'Early Niku Mei day — the sutra advises staying still and guarding your position',
      darkWeekTai: 'Early Niku Tai day — the sutra advises quiet preparation',
      daikichi: 'A great day. If there is something you want to do, go for it',
      kichi: 'A good day. Suitable for advancing plans and meeting important people',
      shokyo: 'Take some care. Avoid risky decisions, play it steady',
      kyo: 'Fortune is low. A good day to rest and recharge',
      normal: 'A calm, ordinary day',
    },
  },
}

export function getIcsTranslations(lang: string): IcsTranslations {
  return translations[lang as Lang] || translations['zh-TW']
}
