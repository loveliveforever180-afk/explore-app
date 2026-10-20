
import { useEffect, useState } from 'react'

type Screen =
  | 'home' | 'quest' | 'reflection' | 'journal'
  | 'collection' | 'categoryDetail' | 'growth'
  | 'pet' | 'customize' | 'fed' | 'empty'

type PetKind = '兔子' | '貓咪' | '小熊'
type GrowthStage = '幼年期' | '成長期' | '成熟期'
type Category =
  | '自我認識' | '學習成長' | '生活日常'
  | '人際關係' | '興趣探索' | '情緒練習'

type Entry = {
  id: string
  task: string
  category: Category
  mood: number
  interest: number
  note: string
  date: string
}

const categories: {
  name: Category
  goal: number
  art: string
}[] = [
  { name: '自我認識', goal: 10, art: 'mountains' },
  { name: '學習成長', goal: 8, art: 'books' },
  { name: '生活日常', goal: 10, art: 'home' },
  { name: '人際關係', goal: 6, art: 'trees' },
  { name: '興趣探索', goal: 8, art: 'camera' },
  { name: '情緒練習', goal: 8, art: 'flower-card' },
]

const taskPool: {
  text: string
  category: Category
}[] = [
  { text: '到沒走過的巷子散步 10 分鐘', category: '生活日常' },
  { text: '挑一間沒去過的小店，看看裡面', category: '興趣探索' },
  { text: '問一位朋友最近喜歡的事', category: '人際關係' },
  { text: '寫下三件讓自己有成就感的事', category: '自我認識' },
  { text: '學一個從來沒接觸過的小知識', category: '學習成長' },
  { text: '留五分鐘記錄今天的心情', category: '情緒練習' },
]

const careerIdeas: Record<
  Category,
  { title: string; reason: string; tryIt: string }[]
> = {
  自我認識: [
    {
      title: '職涯諮詢相關工作',
      reason: '喜歡探索個人價值與成長歷程',
      tryIt: '整理一份自己的興趣與能力地圖',
    },
    {
      title: '內容企劃',
      reason: '擅長觀察、整理想法與表達',
      tryIt: '寫一篇介紹自己喜歡主題的短文',
    },
  ],
  學習成長: [
    {
      title: '教育內容設計',
      reason: '願意學習並將知識整理給別人',
      tryIt: '把一個新知識做成三張教學卡片',
    },
    {
      title: '研究助理',
      reason: '對蒐集資訊與探索問題感興趣',
      tryIt: '選一個問題，查找三種不同觀點',
    },
  ],
  生活日常: [
    {
      title: '生活風格編輯',
      reason: '善於留意日常細節與生活體驗',
      tryIt: '記錄一間店的空間與服務體驗',
    },
    {
      title: '服務設計',
      reason: '從生活觀察發現可以改善的事',
      tryIt: '找出一個生活不便並畫出改善草圖',
    },
  ],
  人際關係: [
    {
      title: '使用者研究員',
      reason: '對理解不同人的想法感興趣',
      tryIt: '訪談一位朋友使用 App 的經驗',
    },
    {
      title: '社群企劃',
      reason: '願意聆聽與建立人際連結',
      tryIt: '規劃一個讓陌生人交流的小活動',
    },
  ],
  興趣探索: [
    {
      title: '體驗設計師',
      reason: '喜歡嘗試新事物與觀察體驗',
      tryIt: '設計一個讓朋友探索新興趣的小活動',
    },
    {
      title: '創意企劃',
      reason: '願意接觸不同領域、發想新點子',
      tryIt: '用兩種不相關的興趣組合一個企劃',
    },
  ],
  情緒練習: [
    {
      title: '療癒內容企劃',
      reason: '願意關注感受與情緒表達',
      tryIt: '設計一張幫助整理心情的紀錄卡',
    },
    {
      title: '健康促進企劃',
      reason: '關心身心感受與日常照顧',
      tryIt: '設計一個五分鐘的放鬆練習',
    },
  ],
}

// 期中展示用的歷史紀錄
const demoExamples: Record<
  Category,
  { task: string; note: string }[]
> = {
  自我認識: [
    {
      task: '寫下三件讓自己有成就感的事',
      note: '發現自己其實很擅長把想法整理成作品。',
    },
    {
      task: '列出自己最在意的三個價值',
      note: '我希望未來能做有創意、也能幫助人的事。',
    },
    {
      task: '回想一次讓自己投入的經驗',
      note: '畫圖的時候很容易忘記時間。',
    },
  ],
  學習成長: [
    {
      task: '學一個從來沒接觸過的小知識',
      note: '今天學會了新的排版技巧，很有成就感。',
    },
    {
      task: '看一支陌生領域的教學影片',
      note: '發現原來使用者研究這麼有趣。',
    },
    {
      task: '嘗試用新方法整理筆記',
      note: '用心智圖整理資訊變得很清楚。',
    },
    {
      task: '向朋友請教一項新技能',
      note: '學到一個很實用的小技巧。',
    },
  ],
  生活日常: [
    {
      task: '到沒走過的巷子散步 10 分鐘',
      note: '意外發現一間安靜的小書店。',
    },
    {
      task: '觀察平常通勤路上的小細節',
      note: '注意到平常沒有看見的街景。',
    },
    {
      task: '換一條路回家',
      note: '新的路線有很多有趣的招牌。',
    },
    {
      task: '嘗試自己準備一份早餐',
      note: '原來簡單的料理也能帶來滿足感。',
    },
    {
      task: '記錄今天最喜歡的生活片刻',
      note: '傍晚的陽光讓我心情很好。',
    },
  ],
  人際關係: [
    {
      task: '問一位朋友最近喜歡的事',
      note: '聊到了以前不知道的興趣。',
    },
    {
      task: '主動關心一位久未聯絡的朋友',
      note: '很開心重新聊起來。',
    },
  ],
  興趣探索: [
    {
      task: '挑一間沒去過的小店，看看裡面',
      note: '很喜歡店裡的陳列設計。',
    },
    {
      task: '嘗試畫一張不同風格的小插畫',
      note: '比想像中更喜歡這種配色。',
    },
    {
      task: '拍下三個吸引自己的畫面',
      note: '發現自己偏愛復古、溫暖的風格。',
    },
  ],
  情緒練習: [
    {
      task: '留五分鐘記錄今天的心情',
      note: '把感受寫下來後比較清楚了。',
    },
    {
      task: '找到一件讓自己放鬆的小事',
      note: '聽音樂的時候很平靜。',
    },
    {
      task: '練習用一句話表達自己的感受',
      note: '試著不急著否定自己的情緒。',
    },
    {
      task: '給今天的自己一句鼓勵',
      note: '即使進度不快，我也有在前進。',
    },
  ],
}

const demoEntries: Entry[] = categories.flatMap(
  (category, categoryIndex) =>
    demoExamples[category.name].map((example, index) => ({
      id: `demo-${categoryIndex}-${index}`,
      task: example.task,
      category: category.name,
      mood: index % 3,
      interest: [4, 5, 3, 4, 5][index % 5],
      note: example.note,
      date: `2026/10/${String(
        8 + index + categoryIndex
      ).padStart(2, '0')}`,
    }))
)

const readEntries = (): Entry[] => {
  try {
    const data = JSON.parse(
      localStorage.getItem('explore-entries-v1') || '[]'
    )
    const existing: Entry[] = Array.isArray(data) ? data : []
    const ids = new Set(existing.map(entry => entry.id))

    return [
      ...existing,
      ...demoEntries.filter(entry => !ids.has(entry.id)),
    ]
  } catch {
    return [...demoEntries]
  }
}

const PET_PALETTES: Record<
  PetKind,
  { name: string; value: string }[]
> = {
  兔子: [
    { name: '原色', value: '#ead1a6' },
    { name: '粉色', value: '#e7b7ad' },
    { name: '米色', value: '#d9bd8f' },
    { name: '灰色', value: '#9f9a91' },
    { name: '黑白花', value: '#655b54' },
  ],
  貓咪: [
    { name: '原色', value: '#b7a79d' },
    { name: '橘貓', value: '#c98955' },
    { name: '灰白', value: '#989591' },
    { name: '黑貓', value: '#544d49' },
    { name: '三花', value: '#c39b77' },
  ],
  小熊: [
    { name: '原色', value: '#b9855e' },
    { name: '粉茶', value: '#d2a181' },
    { name: '白熊', value: '#e8dfcd' },
    { name: '灰熊', value: '#9b8a7b' },
    { name: '巧克力', value: '#7d5944' },
  ],
}

const PET_ASSETS: Record<
  PetKind,
  Partial<Record<string, Partial<Record<GrowthStage, string>>>>
> = {
  兔子: {
    '#ead1a6': {
      幼年期: '/assets/rabbit.png',
      成長期: '/assets/rabbit.png',
      成熟期: '/assets/rabbit.png',
    },
  },
  貓咪: {
    '#b7a79d': {
      幼年期: '/assets/cat.png',
      成長期: '/assets/cat.png',
      成熟期: '/assets/cat.png',
    },
  },
  小熊: {
    '#b9855e': {
      幼年期: '/assets/bear.png',
      成長期: '/assets/bear.png',
      成熟期: '/assets/bear.png',
    },
  },
}

type IconName = 'leaf' | 'book' | 'grid' | 'chart' | 'paw' | 'spark'

const Icon = ({ name }: { name: IconName }) => {
  const paths = {
    leaf: (
      <>
        <path d="M20 4C11 4 5 9 5 17c7 1 13-2 15-13Z" />
        <path d="M5 20c3-5 7-8 13-12" />
      </>
    ),
    book: (
      <>
        <path d="M4 5c4-1 7 0 8 2v13c-1-2-4-3-8-2V5Z" />
        <path d="M20 5c-4-1-7 0-8 2v13c1-2 4-3 8-2V5Z" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="2" />
        <rect x="14" y="4" width="6" height="6" rx="2" />
        <rect x="4" y="14" width="6" height="6" rx="2" />
        <rect x="14" y="14" width="6" height="6" rx="2" />
      </>
    ),
    chart: <path d="M5 20V11M12 20V4M19 20v-6" />,
    paw: (
      <>
        <circle cx="7" cy="8" r="2" />
        <circle cx="17" cy="8" r="2" />
        <circle cx="4.5" cy="13" r="2" />
        <circle cx="19.5" cy="13" r="2" />
        <path d="M12 11c-4 0-6 4-5 7 1 3 4 1 5 1s4 2 5-1c1-3-1-7-5-7Z" />
      </>
    ),
    spark: (
      <path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" />
    ),
  }

  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

const recolorPet = (
  image: HTMLImageElement,
  targetHex: string,
  kind: PetKind
): string => {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return image.src

  ctx.drawImage(image, 0, 0)

  const imageData = ctx.getImageData(
    0, 0, canvas.width, canvas.height
  )
  const pixels = imageData.data

  const target = [1, 3, 5].map(i =>
    parseInt(targetHex.slice(i, i + 2), 16)
  )

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i]
    const g = pixels[i + 1]
    const b = pixels[i + 2]
    const alpha = pixels[i + 3]

    if (alpha < 20) continue

    let isFur = false
    let strength = 0.65
    let referenceBrightness = 230

    if (kind === '兔子') {
      isFur =
        r > 195 && g > 165 && b > 145 &&
        r >= g && g >= b * 0.88
    } else if (kind === '小熊') {
      const warm = r > g * 1.08 && g > b * 1.04
      const notPink = !(r > g * 1.42 && g < 175)

      isFur =
        r > 105 && g > 65 && b > 40 &&
        warm && notPink

      strength = 0.72
      referenceBrightness = 170
    } else {
      const warm = r >= g * 1.035 && g >= b * 0.98
      const notPink = !(r > g * 1.4 && g < 185)

      isFur =
        r > 140 && g > 95 && b > 70 &&
        warm && notPink

      strength = 0.68
      referenceBrightness = 205
    }

    if (!isFur) continue

    const brightness = Math.min(
      1.18,
      (r + g + b) / 3 / referenceBrightness
    )

    pixels[i] = Math.max(
      0,
      Math.min(255, Math.round(
        r * (1 - strength) +
        target[0] * brightness * strength
      ))
    )

    pixels[i + 1] = Math.max(
      0,
      Math.min(255, Math.round(
        g * (1 - strength) +
        target[1] * brightness * strength
      ))
    )

    pixels[i + 2] = Math.max(
      0,
      Math.min(255, Math.round(
        b * (1 - strength) +
        target[2] * brightness * strength
      ))
    )
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

const Pet = ({
  kind = '兔子',
  color = '#ead1a6',
  stage = '幼年期',
}: {
  kind?: PetKind
  happy?: boolean
  color?: string
  stage?: GrowthStage
}) => {
  const originalColor = PET_PALETTES[kind][0].value

  const asset =
    PET_ASSETS[kind][color]?.[stage] ??
    PET_ASSETS[kind][originalColor]?.[stage]

  const needsRecolor =
    color !== originalColor &&
    !PET_ASSETS[kind][color]?.[stage]

  const [recolored, setRecolored] = useState<{
    key: string
    src: string
  } | null>(null)

  const recolorKey =
    `${kind}|${color}|${stage}|${asset ?? ''}`

  useEffect(() => {
    if (!asset || !needsRecolor) return

    let cancelled = false
    const img = new Image()

    img.onload = () => {
      if (cancelled) return

      try {
        setRecolored({
          key: recolorKey,
          src: recolorPet(img, color, kind),
        })
      } catch (error) {
        console.warn('寵物換色失敗：', error)
      }
    }

    img.onerror = () =>
      console.warn('無法載入寵物圖片：', asset)

    img.src = asset

    return () => {
      cancelled = true
    }
  }, [asset, color, kind, needsRecolor, recolorKey])

  if (asset) {
    const petClass =
      kind === '兔子' ? 'rabbit' :
      kind === '貓咪' ? 'cat' : 'bear'

    const src =
      needsRecolor && recolored?.key === recolorKey
        ? recolored.src
        : asset

    return (
      <img
        className={`pet-art pet-image pet-${petClass}`}
        src={src}
        alt={`${kind}${stage}手繪寵物`}
      />
    )
  }

  return (
    <div
      className="pet-art pet-placeholder"
      role="img"
      aria-label={`${kind}素材待替換`}
    >
      <Icon name="paw" />
      <strong>{kind}</strong>
      <small>透明角色素材待補</small>
    </div>
  )
}

const Header = ({
  title, back, action,
}: {
  title: string
  back?: () => void
  action?: React.ReactNode
}) => (
  <div className="header">
    <button
      className="icon-button"
      onClick={back}
      aria-label="返回"
    >
      {back ? '‹' : ''}
    </button>
    <div className="header-title">{title}</div>
    <div className="header-action">{action}</div>
  </div>
)

const Forest = ({
  children,
  small = false,
}: {
  children?: React.ReactNode
  small?: boolean
}) => (
  <div className={`forest ${small ? 'small' : ''}`}>
    <div className="sun" />
    <div className="far-hill h1" />
    <div className="far-hill h2" />
    <div className="mountain m1" />
    <div className="mountain m2" />
    <div className="mountain m3" />
    <div className="tree t1" />
    <div className="tree t2" />
    <div className="tree t3" />
    <div className="tree t4" />
    <div className="tree t5" />
    <div className="bush b1" />
    <div className="bush b2" />
    <div className="bush b3" />
    <div className="stump">
      <i /><i /><i />
    </div>
    <div className="flowers f1">
      <i /><i /><i />
    </div>
    <div className="flowers f2">
      <i /><i />
    </div>
    {children}
  </div>
)

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [taskIndex, setTaskIndex] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [mood, setMood] = useState(1)
  const [note, setNote] = useState('')
  const [interest, setInterest] = useState(3)

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null)

  const [entries, setEntries] =
    useState<Entry[]>(readEntries)

  const [collectionTab, setCollectionTab] =
    useState<'done' | 'todo'>('done')

  const [detailCategory, setDetailCategory] =
    useState<Category>('學習成長')

  const [showCareer, setShowCareer] = useState(false)

  const [pet, setPet] = useState<PetKind>('兔子')
  const [petName, setPetName] = useState('芽芽')
  const [petColor, setPetColor] = useState('#ead1a6')
  const [food, setFood] = useState(3)
  const [xp, setXp] = useState(40)

  useEffect(() => {
    try {
      localStorage.setItem(
        'explore-entries-v1',
        JSON.stringify(entries)
      )
    } catch (error) {
      console.warn('探索紀錄儲存失敗：', error)
    }
  }, [entries])

  const currentTask = taskPool[taskIndex]

  const counts = categories.map(cat => {
    const matching = entries.filter(
      entry => entry.category === cat.name
    )

    return {
      ...cat,
      count: matching.length,
      score: matching.reduce(
        (sum, entry) => sum + entry.interest, 0
      ),
    }
  })

  const totalInterest = counts.reduce(
    (sum, cat) => sum + cat.score, 0
  )

  const ranked = [...counts].sort(
    (a, b) => b.score - a.score || b.count - a.count
  )

  const suggestions = ranked
    .filter(cat => cat.score > 0)
    .slice(0, 2)
    .flatMap(cat => careerIdeas[cat.name].slice(0, 1))

  const growthStage: GrowthStage =
    xp < 100 ? '幼年期' :
    xp < 200 ? '成長期' : '成熟期'

  const feed = () => {
    if (food < 1) return
    setFood(value => value - 1)
    setXp(value => Math.min(value + 20, 100))
    setScreen('fed')
  }

  const saveReflection = () => {
    if (!accepted) return

    const entry: Entry = {
      id: `${Date.now()}-${Math.random()}`,
      task: currentTask.text,
      category: selectedCategory ?? currentTask.category,
      mood,
      interest,
      note: note.trim(),
      date: new Date().toLocaleDateString('zh-TW'),
    }

    setEntries(old => [entry, ...old])
    setFood(value => value + 1)
    setAccepted(false)
    setNote('')
    setInterest(3)
    setSelectedCategory(null)
    setShowCareer(false)
    setScreen('journal')
  }

  const Home = () => (
    <div className="page home-page">
      <div className="welcome">
        <span>WELCOME BACK</span>
        <strong>今天想探索什麼？</strong>
      </div>

      <Forest>
        <button
          className="quest-paper quest-paper-button"
          onClick={() => setScreen('quest')}
          aria-label="查看每日探索任務"
        >
          <span>
            {accepted ? 'CURRENT QUEST' : 'TODAY’S QUEST'}
          </span>
          <strong>
            {accepted ? currentTask.text : '每日探索'}
          </strong>
          <small>
            {accepted
              ? '進行中 · 點擊查看任務'
              : '點擊抽取今天的小挑戰！'}
          </small>
        </button>
      </Forest>

      <main className="home-content">
        <button
          className="primary hero-button"
          disabled={!accepted}
          onClick={() => setScreen('reflection')}
        >
          我完成了！ <span>✓</span>
        </button>

        <div className="feature-grid">
          {[
            ['pet', 'paw', '寵物養成', '陪伴你長大'],
            ['journal', 'book', '探索日誌', '記錄每日瞬間'],
            ['collection', 'leaf', '探索收集', '回顧完成任務'],
            ['growth', 'chart', '我的成長', '看看探索足跡'],
          ].map(([to, icon, title, sub]) => (
            <button
              className="feature-card"
              key={to}
              onClick={() => setScreen(to as Screen)}
            >
              <Icon name={icon as IconName} />
              <strong>{title}</strong>
              <small>{sub}</small>
            </button>
          ))}
        </div>

        <p className="gentle-note">
          每一次嘗試，都是一點點成長
        </p>
      </main>
    </div>
  )

  const Quest = () => (
    <div className="page quest-page">
      <Header
        title="每日探索"
        back={() => setScreen('home')}
      />

      <Forest small>
        <div className="notice-board">
          <div className="board-date">
            {new Date().toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>

          <div className="board-paper">
            <small>今天的小挑戰</small>
            <strong>{currentTask.text}</strong>
            <p>
              不需要做到完美，
              <br />
              只要開始，就是很棒的進步！
            </p>
          </div>
        </div>
      </Forest>

      <div className="quest-actions">
        {!accepted ? (
          <>
            <button
              className="secondary"
              onClick={() =>
                setTaskIndex(
                  (taskIndex + 1) % taskPool.length
                )
              }
            >
              換一個任務
            </button>

            <button
              className="primary"
              onClick={() => setAccepted(true)}
            >
              接受今日任務
            </button>
          </>
        ) : (
          <>
            <div className="accepted-note">
              <Icon name="leaf" />
              今日任務已保留，慢慢完成就好
            </div>
            <button
              className="primary"
              onClick={() => setScreen('reflection')}
            >
              我完成了！
            </button>
          </>
        )}
      </div>
    </div>
  )

  const Reflection = () => (
    <div className="page">
      <Header
        title="完成探索"
        back={() => setScreen('quest')}
      />

      <main className="padded">
        <div className="reward-card">
          <Icon name="spark" />
          <div>
            <small>完成可獲得</small>
            <strong>一份寵物飼料</strong>
          </div>
        </div>

        <div className="section-title">
          今天感覺如何？
        </div>

        <div className="mood-row">
          {[
            '很開心', '還不錯', '普通', '有點累',
          ].map((label, index) => (
            <button
              key={label}
              className={mood === index ? 'selected' : ''}
              onClick={() => setMood(index)}
            >
              <span className={`mood-face mood-${index}`} />
              <small>{label}</small>
            </button>
          ))}
        </div>

        <label className="field">
          <span>留下一點心得</span>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="今天發現了什麼？一句話也很好…"
          />
        </label>

        <div className="section-title">
          加上標籤
        </div>

        <div className="tags">
          {categories.map(cat => (
            <button
              key={cat.name}
              className={
                (selectedCategory ?? currentTask.category) ===
                cat.name ? 'selected' : ''
              }
              onClick={() => setSelectedCategory(cat.name)}
            >
              ＃{cat.name}
            </button>
          ))}
        </div>

        <div className="section-title">
          這次探索有多喜歡？
        </div>

        <div className="interest-options">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              className={interest === n ? 'selected' : ''}
              onClick={() => setInterest(n)}
              aria-label={`喜歡程度 ${n} 分`}
            >
              {n} ★
            </button>
          ))}
        </div>

        <p className="hint-note">
          分數越高，代表越想再次嘗試；
          將用於探索分析。
        </p>

        <button
          className="primary full"
          onClick={saveReflection}
        >
          儲存探索日誌
        </button>
      </main>
    </div>
  )

  const Journal = () => (
    <div className="page">
      <Header
        title="探索日誌"
        back={() => setScreen('home')}
        action={
          <button
            className="round-button"
            onClick={() => setScreen('empty')}
          >
            ＋
          </button>
        }
      />

      <main className="padded journal">
        <div className="month">
          我的探索紀錄 · {entries.length} 篇
        </div>

        {entries.length === 0 ? (
          <div className="growth-card">
            <p>還沒有探索紀錄，先去完成一個小任務吧！</p>
            <button
              className="secondary"
              onClick={() => setScreen('quest')}
            >
              去抽今日任務
            </button>
          </div>
        ) : (
          entries.map(entry => (
            <article className="journal-card" key={entry.id}>
              <div className="journal-meta">
                <span>{entry.date}</span>
                <span>
                  {[
                    '很開心', '還不錯',
                    '普通', '有點累',
                  ][entry.mood]}
                </span>
              </div>
              <strong>{entry.task}</strong>
              <p>
                {entry.note ||
                  '今天又完成了一次新的探索！'}
              </p>
              <div className="tags compact">
                <span>＃{entry.category}</span>
                <span>
                  興趣程度 {entry.interest} / 5 ★
                </span>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  )

  const Collection = () => (
    <div className="page">
      <Header
        title="探索收集"
        back={() => setScreen('home')}
      />

      <main className="padded">
        <p className="hint-note">
          點擊分類卡片，就能回顧這個領域曾經完成的探索。
        </p>
        <p className="demo-note">
          ✦ 已放入示範歷史紀錄，方便展示功能；
          新完成的任務也會一起累積。
        </p>

        <div className="segmented">
          <button
            className={collectionTab === 'done' ? 'active' : ''}
            onClick={() => setCollectionTab('done')}
          >
            已完成
          </button>
          <button
            className={collectionTab === 'todo' ? 'active' : ''}
            onClick={() => setCollectionTab('todo')}
          >
            未完成
          </button>
        </div>

        <div className="collection-grid">
          {counts
            .filter(cat =>
              collectionTab === 'done'
                ? cat.count > 0
                : cat.count === 0
            )
            .map(cat => (
              <button
                type="button"
                className="collection-card collection-card-button"
                key={cat.name}
                onClick={() => {
                  setDetailCategory(cat.name)
                  setScreen('categoryDetail')
                }}
                aria-label={`查看${cat.name}的探索紀錄`}
              >
                <div className={`mini-art ${cat.art}`}>
                  <Icon
                    name={
                      cat.art === 'books'
                        ? 'book'
                        : cat.art === 'camera'
                          ? 'spark'
                          : 'leaf'
                    }
                  />
                </div>
                <strong>{cat.name}</strong>
                <small>{cat.count}/{cat.goal}</small>
                <div className="tiny-progress">
                  <i
                    style={{
                      width: `${Math.min(
                        100,
                        cat.count / cat.goal * 100
                      )}%`,
                    }}
                  />
                </div>
              </button>
            ))}
        </div>

        {collectionTab === 'todo' &&
          counts.every(cat => cat.count > 0) && (
            <p className="gentle-note">
              目前六種分類都有完成紀錄！
            </p>
          )}
      </main>
    </div>
  )

  const CategoryDetail = () => {
    const categoryEntries = entries.filter(
      entry => entry.category === detailCategory
    )

    return (
      <div className="page">
        <Header
          title={detailCategory}
          back={() => setScreen('collection')}
        />

        <main className="padded">
          <div className="category-summary">
            <span>EXPLORATION ARCHIVE</span>
            <strong>{detailCategory}</strong>
            <small>
              已完成 {categoryEntries.length} 次探索
            </small>
          </div>

          <p className="hint-note">
            這些是你曾經完成的任務與當時的感受。
          </p>

          {categoryEntries.length === 0 ? (
            <div className="growth-card">
              這個分類還沒有完成紀錄，
              從今天開始探索吧！
            </div>
          ) : (
            categoryEntries.map(entry => (
              <article
                className="journal-card"
                key={entry.id}
              >
                <div className="journal-meta">
                  <span>{entry.date}</span>
                  <span>
                    {entry.id.startsWith('demo-')
                      ? '示範紀錄'
                      : '我的紀錄'}
                  </span>
                </div>

                <strong>{entry.task}</strong>
                <p>
                  {entry.note || '完成了一次新的探索！'}
                </p>

                <div className="tags compact">
                  <span>＃{entry.category}</span>
                  <span>
                    喜歡程度 {entry.interest}/5 ★
                  </span>
                </div>
              </article>
            ))
          )}
        </main>
      </div>
    )
  }

  const Growth = () => (
    <div className="page">
      <Header
        title="我的成長"
        back={() => setScreen('home')}
      />

      <main className="padded growth">
        <section className="footprint">
          <div>
            <small>探索足跡</small>
            <strong>{entries.length}</strong>
            <span>次探索</span>
          </div>
          <Forest small />
          <p>
            包含示範探索紀錄
            <br />
            每一次嘗試都在幫你認識自己
          </p>
        </section>

        <section className="growth-card">
          <div className="section-title">
            我的興趣傾向
          </div>

          <p className="hint-note">
            依照各分類的完成次數與喜好評分計算，
            不只是完成量。
          </p>

          {counts.map((cat, i) => {
            const value = totalInterest
              ? Math.round(cat.score / totalInterest * 100)
              : 0

            return (
              <div className="bar-row" key={cat.name}>
                <span>{cat.name}</span>
                <div>
                  <i
                    className={`c${i}`}
                    style={{
                      width: `${value}%`,
                      minWidth: value ? 8 : 0,
                    }}
                  />
                </div>
                <small>{value}%</small>
              </div>
            )
          })}
        </section>

        <section className="career-panel">
          <div className="career-eyebrow">
            ✦ CAREER EXPLORATION
          </div>

          <h3>你的職涯靈感</h3>

          <p>
            從你喜歡的探索經驗出發，
            看看有哪些方向值得親自試試。
          </p>

          <button
            className="primary career-button"
            disabled={entries.length === 0}
            onClick={() => setShowCareer(true)}
          >
            ✦ 一鍵生成職涯靈感
          </button>

          {entries.length === 0 && (
            <small>
              先完成至少一次任務，
              才有紀錄可以分析喔！
            </small>
          )}

          {showCareer && suggestions.length > 0 && (
            <div className="career-results">
              <div className="career-results-title">
                依照你的探索偏好，推薦認識：
              </div>

              {suggestions.map(job => (
                <article
                  className="career-result"
                  key={job.title}
                >
                  <strong>{job.title}</strong>
                  <p>{job.reason}</p>
                  <div className="career-try">
                    🌱 試試看：{job.tryIt}
                  </div>
                </article>
              ))}

              <small>
                這是依探索分類與喜好評分產生的
                規則式靈感，不是 AI 評估，
                也不是職涯定論。
              </small>
            </div>
          )}
        </section>

        <p className="gentle-note">
          你不需要現在就決定未來，
          <br />
          先從有點好奇的事情開始吧。
        </p>
      </main>
    </div>
  )

  const PetPage = () => (
    <div className="page pet-page">
      <Header
        title="我的小夥伴"
        back={() => setScreen('home')}
        action={
          <button
            className="icon-button"
            onClick={() => setScreen('customize')}
          >
            ⌘
          </button>
        }
      />

      <Forest>
        <Pet
          kind={pet}
          color={petColor}
          stage={growthStage}
        />
      </Forest>

      <main className="pet-panel">
        <button
          className="pet-name"
          onClick={() => setScreen('customize')}
        >
          {petName} <span>編輯</span>
        </button>

        <small>
          {growthStage} · 成長階段{' '}
          {growthStage === '幼年期'
            ? 1
            : growthStage === '成長期'
              ? 2
              : 3}{' '}
          / 3
        </small>

        <div className="stat-card">
          <div className="stat-title">
            <span>成長進度</span>
            <span>{xp} / 100 EXP</span>
          </div>

          <div className="progress">
            <i style={{ width: `${xp}%` }} />
          </div>

          <div className="food-row">
            <span>飼料 × {food}</span>
            <span>每次餵食 +20 EXP</span>
          </div>

          <button
            className="primary full"
            disabled={food < 1}
            onClick={feed}
          >
            餵食小夥伴
          </button>
        </div>
      </main>
    </div>
  )

  const Customize = () => (
    <div className="page">
      <Header
        title="外觀自訂"
        back={() => setScreen('pet')}
        action={
          <button
            className="text-button"
            onClick={() => setScreen('pet')}
          >
            完成
          </button>
        }
      />

      <main className="padded customize">
        <label className="field">
          <span>寵物名字</span>
          <input
            value={petName}
            maxLength={8}
            onChange={e => setPetName(e.target.value)}
          />
        </label>

        <div className="section-title">
          選擇動物
        </div>

        <div className="pet-options">
          {(
            ['兔子', '貓咪', '小熊'] as PetKind[]
          ).map(kind => (
            <button
              className={pet === kind ? 'selected' : ''}
              onClick={() => {
                setPet(kind)
                setPetColor(
                  PET_PALETTES[kind][0].value
                )
              }}
              key={kind}
            >
              <Pet
                kind={kind}
                color={PET_PALETTES[kind][0].value}
                stage={growthStage}
              />
              <span>{kind}</span>
            </button>
          ))}
        </div>

        <div className="section-title">
          選擇顏色
        </div>

        <div className="color-options">
          {PET_PALETTES[pet].map(({ name, value }) => (
            <button
              aria-label={`選擇${name}`}
              title={name}
              className={
                petColor === value ? 'selected' : ''
              }
              style={{ background: value }}
              onClick={() => setPetColor(value)}
              key={value}
            />
          ))}
        </div>

        {!PET_ASSETS[pet][petColor]?.[growthStage] && (
          <div className="asset-note">
            此配色使用程式模擬換色，
            花紋與實際色彩可能略有不同。
          </div>
        )}

        <div className="custom-preview">
          <Pet
            kind={pet}
            color={petColor}
            stage={growthStage}
          />
        </div>
      </main>
    </div>
  )

  const Fed = () => (
    <div className="page fed-page">
      <Header
        title="我的小夥伴"
        back={() => setScreen('pet')}
      />

      <Forest>
        <div className="speech">
          好好吃！
          <br />
          謝謝你～
        </div>
        <Pet
          kind={pet}
          color={petColor}
          stage={growthStage}
          happy
        />
      </Forest>

      <div className="xp-reward">
        <Icon name="spark" />
        <strong>EXP + 20</strong>
        <Icon name="spark" />
      </div>

      <button
        className="primary fed-done"
        onClick={() => setScreen('pet')}
      >
        太棒了
      </button>
    </div>
  )

  const Empty = () => (
    <div className="page">
      <Header
        title="探索日誌"
        back={() => setScreen('journal')}
      />

      <main className="empty-state">
        <div className="empty-illustration">
          <Icon name="book" />
          <span className="sprout" />
        </div>

        <strong>還沒有日誌記錄</strong>
        <p>
          試著記下今天的小發現，
          <br />
          這些都是成長的足跡！
        </p>

        <button
          className="primary"
          onClick={() => setScreen('quest')}
        >
          開始每日探索
        </button>
      </main>
    </div>
  )

  const screens: Record<Screen, React.ReactNode> = {
    home: <Home />,
    quest: <Quest />,
    reflection: <Reflection />,
    journal: <Journal />,
    collection: <Collection />,
    categoryDetail: <CategoryDetail />,
    growth: <Growth />,
    pet: <PetPage />,
    customize: <Customize />,
    fed: <Fed />,
    empty: <Empty />,
  }

  return (
    <div className="app-shell">
      {screens[screen]}
    </div>
  )
}
