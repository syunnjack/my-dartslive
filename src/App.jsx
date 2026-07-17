import { useMemo, useState } from 'react'
import './App.css'

const postKey = 'amuse-spot-finder.ugc'
const saveKey = 'amuse-spot-finder.saved'

const spots = [
  {
    id: 'nagoya-darts-live',
    name: '名駅ダーツライブラウンジ',
    area: '名古屋',
    station: '名古屋',
    category: 'ダーツ',
    price: 900,
    walk: 5,
    rating: 4.4,
    status: '営業中',
    checked: '2026-07-18',
    event: true,
    coupon: true,
    late: true,
    group: true,
    tags: ['DARTSLIVE', '大会あり', '深夜営業', '飲食あり'],
    note: 'ダーツ設置店検索を起点に、大会告知、グループ予約、飲食クーポンへつなげやすい施設。',
  },
  {
    id: 'sakae-bowling',
    name: '栄ボウリングアリーナ',
    area: '名古屋',
    station: '栄',
    category: 'ボウリング',
    price: 1600,
    walk: 6,
    rating: 4.2,
    status: '営業中',
    checked: '2026-07-18',
    event: true,
    coupon: true,
    late: true,
    group: true,
    tags: ['大会', 'スコア投稿', '学生割', '団体予約'],
    note: 'Rankseeker風の大会情報、スコア投稿、週末ボウラー日記へ広げられる。',
  },
  {
    id: 'shizuoka-karaoke',
    name: '静岡駅前カラオケボックス',
    area: '静岡',
    station: '静岡',
    category: 'カラオケ',
    price: 780,
    walk: 3,
    rating: 4.1,
    status: '営業中',
    checked: '2026-07-18',
    event: false,
    coupon: true,
    late: true,
    group: true,
    tags: ['駅近', '深夜', 'ひとりカラオケ', 'クーポン'],
    note: '高速バス到着後や終電後の滞在にも使える。クーポン導線が作りやすい。',
  },
  {
    id: 'akihabara-prize',
    name: '秋葉原プライズハブ',
    area: '東京',
    station: '秋葉原',
    category: 'プライズ',
    price: 500,
    walk: 4,
    rating: 4.3,
    status: '営業中',
    checked: '2026-07-18',
    event: false,
    coupon: false,
    late: true,
    group: false,
    tags: ['景品入荷', 'クレーンゲーム', '写真投稿', '在庫確認'],
    note: 'キャラ広場のような景品情報と、現地UGCの入荷・獲得レビューを組み合わせる。',
  },
  {
    id: 'umeda-purikura',
    name: '梅田プリクラスタジオ',
    area: '大阪',
    station: '梅田',
    category: 'プリクラ',
    price: 500,
    walk: 5,
    rating: 4.0,
    status: '営業中',
    checked: '2026-07-18',
    event: false,
    coupon: true,
    late: false,
    group: true,
    tags: ['最新機種', '学割', '混雑投稿', 'SNS向け'],
    note: '最新機種、盛れる機種、混雑時間、学割クーポンでUGCとSNS拡散を狙う。',
  },
  {
    id: 'closed-game-store',
    name: '閉店アーカイブ: 駅前ゲームコーナー',
    area: '東京',
    station: '新宿',
    category: '閉店アーカイブ',
    price: 0,
    walk: 2,
    rating: 3.7,
    status: '閉店',
    checked: '2026-07-18',
    event: false,
    coupon: false,
    late: false,
    group: false,
    tags: ['閉店情報', '思い出投稿', '代替店舗'],
    note: '閉店店の記録を残し、近隣の代替スポットへ送客する。ゲーセン閉店bot的な拡散にも使える。',
  },
]

const revenuePlans = [
  ['店舗送客広告', '駅名、遊び方、人数、深夜利用に合わせて店舗広告や優先掲載を配置。'],
  ['予約・クーポン', 'カラオケ、ボウリング、ダーツ、プリクラの割引クーポンや団体予約へ誘導。'],
  ['イベント告知', '大会、リーグ戦、景品入荷、コラボイベントを有料告知枠にする。'],
  ['UGC確認済み掲載', '店舗が設置機種、料金、営業時間、閉店情報を更新できる有料プラン。'],
  ['物販・アフィリエイト', 'ダーツ用品、ボウリング用品、推し活グッズ、電子チケットへ送客。'],
]

const buzzIdeas = [
  '今日行ける駅近ダーツ・ボウリングランキング',
  '景品入荷速報と獲得レビュー投稿キャンペーン',
  'ひとりカラオケしやすい店マップ',
  '閉店したゲームコーナーの思い出レビュー募集',
  '学生割・深夜営業・団体予約の条件別まとめ',
]

const faq = [
  ['AIに引用されやすくするには？', '店名、駅、徒歩分、ジャンル、料金、営業状況、確認日、設備、イベント、UGC状態を同じ形式で表示します。'],
  ['UGCの投稿対象は？', '設置機種、混雑、料金、景品入荷、クーポン、大会、閉店、メンテナンス情報です。'],
  ['収益化の中心は？', '店舗送客、予約、クーポン、イベント告知、確認済み掲載、物販アフィリエイトです。'],
]

function readArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

function yen(value) {
  return value === 0
    ? '無料'
    : new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(value)
}

function App() {
  const [query, setQuery] = useState('名古屋')
  const [category, setCategory] = useState('すべて')
  const [filters, setFilters] = useState({ event: false, coupon: true, late: false, group: false })
  const [posts, setPosts] = useState(() => readArray(postKey))
  const [saved, setSaved] = useState(() => readArray(saveKey))
  const [form, setForm] = useState({ name: '', area: '', type: '設置情報', memo: '' })

  const categories = ['すべて', ...new Set(spots.map((spot) => spot.category))]
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase()
    return spots
      .filter((spot) => category === 'すべて' || spot.category === category)
      .filter((spot) => !filters.event || spot.event)
      .filter((spot) => !filters.coupon || spot.coupon)
      .filter((spot) => !filters.late || spot.late)
      .filter((spot) => !filters.group || spot.group)
      .filter((spot) => !text || `${spot.name} ${spot.area} ${spot.station} ${spot.category} ${spot.tags.join(' ')} ${spot.note}`.toLowerCase().includes(text))
      .sort((a, b) => Number(b.status === '営業中') - Number(a.status === '営業中') || b.rating - a.rating || a.walk - b.walk)
  }, [category, filters, query])
  const display = filtered.length ? filtered : spots

  const submitPost = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.memo.trim()) return
    const next = [{ ...form, id: crypto.randomUUID(), status: '確認待ち', date: new Date().toLocaleDateString('ja-JP') }, ...posts].slice(0, 8)
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ name: '', area: '', type: '設置情報', memo: '' })
  }

  const toggleSaved = (id) => {
    const next = saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(saveKey, JSON.stringify(next))
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="brand">My Dartslive</span>
          <h1>ダーツ設置店を中心に、今日遊べる店を横断検索。</h1>
          <p>
            ダーツ設置店を中心に、ボウリング、カラオケ、プリクラ、プライズ、ゲームセンターまで駅近・設備・イベント・口コミで比較。UGCで現地情報を集め、予約、クーポン、大会告知へつなげます。
          </p>
        </div>
        <aside className="answer-box">
          <span>AI向け即答</span>
          <strong>駅、徒歩分、ジャンル、料金、イベント、クーポン、確認日を1カードで提示</strong>
          <p>検索エンジンとAI回答が引用しやすいよう、施設情報と投稿状態を短く構造化します。</p>
        </aside>
      </section>

      <section className="search-panel" aria-label="アミューズ施設検索">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="駅名・地域・遊び方で検索" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
      </section>

      <section className="filter-row" aria-label="条件フィルター">
        {Object.entries({ event: '大会・イベント', coupon: 'クーポン', late: '深夜営業', group: '団体向け' }).map(([key, label]) => (
          <button key={key} type="button" className={filters[key] ? 'active' : ''} onClick={() => setFilters({ ...filters, [key]: !filters[key] })}>
            {label}
          </button>
        ))}
      </section>

      <section className="summary-grid">
        <article><span>掲載候補</span><strong>{spots.length}</strong><p>営業中・要確認・閉店を管理</p></article>
        <article><span>検索結果</span><strong>{display.length}</strong><p>用途と条件で絞り込み</p></article>
        <article><span>保存済み</span><strong>{saved.length}</strong><p>遊びに行く候補を保存</p></article>
      </section>

      <section className="content-grid">
        {display.map((spot) => (
          <article className={spot.status === '閉店' ? 'card closed' : 'card'} key={spot.id}>
            <div className="card-topline">
              <span>{spot.area} / {spot.station}</span>
              <span>{spot.status}</span>
            </div>
            <h2>{spot.name}</h2>
            <p>{spot.note}</p>
            <div className="tag-row">{spot.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="metric-row">
              <span>徒歩{spot.walk}分</span>
              <span>{yen(spot.price)}</span>
              <strong>{spot.rating}</strong>
            </div>
            <small>確認日: {spot.checked}</small>
            <button type="button" onClick={() => toggleSaved(spot.id)}>{saved.includes(spot.id) ? '保存済み' : '候補に保存'}</button>
          </article>
        ))}
      </section>

      <section className="ugc-section">
        <div>
          <span className="brand">UGC</span>
          <h2>設置機種・混雑・大会・閉店情報を投稿</h2>
          <p>投稿をランキング、イベント記事、景品速報、確認済み掲載枠へ展開します。</p>
        </div>
        <form className="ugc-form" onSubmit={submitPost}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="店舗名" />
          <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="駅・地域" />
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>設置情報</option>
            <option>大会・イベント</option>
            <option>混雑・料金</option>
            <option>景品入荷</option>
            <option>閉店情報</option>
          </select>
          <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="機種・混雑・クーポン・イベント内容" />
          <button type="submit">投稿する</button>
        </form>
        <div className="post-grid">
          {posts.length === 0 && <p className="empty-text">まだ投稿はありません。最初の現地情報を投稿できます。</p>}
          {posts.map((post) => (
            <article key={post.id}>
              <span>{post.type} / {post.status}</span>
              <h3>{post.name}</h3>
              <p>{post.memo}</p>
              <small>{post.area || 'エリア未入力'} / {post.date}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-grid">
        <div className="revenue-panel">
          <h2>収益導線</h2>
          {revenuePlans.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}
        </div>
        <div className="buzz-panel">
          <h2>バズ施策</h2>
          <ul>{buzzIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul>
        </div>
      </section>

      <section className="seo-section">
        <div className="answer-box">
          <span className="brand">SEO / AIO / LLMO</span>
          <h2>アミューズ施設は、ジャンル、駅、設備、イベント、口コミを同じ形式で出すと検索にもAI回答にも強くなります。</h2>
          <p>施設名、駅、徒歩分、料金、営業状況、確認日、投稿状態をそろえ、AIが引用しやすい情報単位にしています。</p>
        </div>
        <div className="faq-grid">
          {faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}
        </div>
      </section>
    </main>
  )
}

export default App
