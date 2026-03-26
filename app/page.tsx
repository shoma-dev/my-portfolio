'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

interface HistoryItem {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_REPLIES = [
  '得意なことは？',
  '料金はいくら？',
  'どんな実績がある？',
  '納期はどのくらい？',
  'どんな人向け？',
]

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: 'こんにちは！Shomaのポートフォリオへようこそ。\n依頼・スキル・料金など、なんでも気軽に聞いてください 😊',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  // ── Custom cursor ──────────────────────────────────────────────
  useEffect(() => {
    const dot  = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return

    let mx = 0, my = 0, rx = 0, ry = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
    }
    const animate = () => {
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    document.addEventListener('mousemove', onMove)

    const onEnter = () => {
      ring.style.width = '52px'; ring.style.height = '52px'
      ring.style.borderColor = 'rgba(124,106,247,0.8)'
    }
    const onLeave = () => {
      ring.style.width = '36px'; ring.style.height = '36px'
      ring.style.borderColor = 'rgba(124,106,247,0.5)'
    }
    document.addEventListener('mouseover', (e) => {
      if ((e.target as Element).closest('a, button')) onEnter()
    })
    document.addEventListener('mouseout', (e) => {
      if ((e.target as Element).closest('a, button')) onLeave()
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // ── Hero mouse-tracking gradient ───────────────────────────────
  useEffect(() => {
    const hero   = document.getElementById('hero')
    const heroBg = document.getElementById('hero-bg')
    if (!hero || !heroBg) return

    const onMove = (e: MouseEvent) => {
      const r  = hero.getBoundingClientRect()
      const xp = ((e.clientX - r.left) / r.width  * 100).toFixed(1)
      const yp = ((e.clientY - r.top)  / r.height * 100).toFixed(1)
      heroBg.style.setProperty('--mx', xp + '%')
      heroBg.style.setProperty('--my', yp + '%')
    }
    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  // ── Nav scroll shadow ──────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Scroll reveal (IntersectionObserver) ───────────────────────
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // ── Auto-scroll chat to bottom ─────────────────────────────────
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // ── Send message ───────────────────────────────────────────────
  const sendMessage = async (overrideText?: string) => {
    const text = overrideText ?? inputValue.trim()
    if (!text || isTyping) return

    setInputValue('')
    setMessages((prev) => [...prev, { role: 'user', text }])
    setIsTyping(true)

    const currentHistory = [...history]

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: currentHistory }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      const reply: string = data.reply ?? '（応答なし）'

      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
      setHistory([
        ...currentHistory,
        { role: 'user', content: text },
        { role: 'assistant', content: reply },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: '⚠️ エラーが発生しました。しばらくしてからお試しください。' },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const sendQuick = (text: string) => {
    setChatOpen(true)
    sendMessage(text)
  }

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      {/* Cursor */}
      <div id="cursor-dot" />
      <div id="cursor-ring" />

      {/* Nav */}
      <nav id="navbar">
        <div className="nav-logo">S<span>.</span>HOMA</div>
        <ul className="nav-links">
          <li><a href="#skills">Services</a></li>
          <li><a href="#works">Works</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Hero */}
      <section id="hero">
        <div id="hero-bg" />
        <div className="hero-content">
          <p className="hero-label">Data Engineer &amp; Consultant</p>
          <h1 className="hero-h1">
            <span className="accent">DATA</span><br />
            <span className="outline">×</span><br />
            <span className="accent">AI</span>
          </h1>
          <p className="hero-sub">
            Engineering the future,<br />
            <em>one pipeline at a time.</em>
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={() => scrollTo('contact')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" /><path d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
              お問い合わせ
            </button>
            <button className="btn btn-ghost" onClick={() => scrollTo('works')}>実績を見る →</button>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
          Scroll
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-num">3<span>+</span></div>
            <div className="stat-label">Projects Delivered</div>
          </div>
          <div className="stat-item">
            <div className="stat-num">4<span>×</span></div>
            <div className="stat-label">Core Skills</div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-eyebrow">services</p>
            <h2 className="section-title">
              What I Do
              <span className="jp">提供するサービス / 得意なこと</span>
            </h2>
          </div>
          <div className="skills-grid">
            <div className="skill-cell reveal from-left">
              <p className="skill-num">01</p>
              <div className="skill-icon-wrap">🌐</div>
              <p className="skill-name">Web Development</p>
              <p className="skill-name-jp">Web制作</p>
              <p className="skill-desc">LP・コーポレートサイト・ポートフォリオまで、デザインから実装まで一貫対応。レスポンシブ・高速表示にこだわります。</p>
              <div className="skill-tags">
                {['HTML/CSS','JavaScript','React','Next.js'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="skill-cell reveal from-right">
              <p className="skill-num">02</p>
              <div className="skill-icon-wrap">🤖</div>
              <p className="skill-name">RPA &amp; Automation</p>
              <p className="skill-name-jp">RPA・業務自動化</p>
              <p className="skill-desc">定型作業をロボットに任せ、コア業務に集中できる環境を構築。月次レポートや集計作業の大幅削減実績あり。</p>
              <div className="skill-tags">
                {['UiPath','Power Automate','Python'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="skill-cell reveal from-left">
              <p className="skill-num">03</p>
              <div className="skill-icon-wrap">🧠</div>
              <p className="skill-name">AI Agent Build</p>
              <p className="skill-name-jp">AIエージェント構築</p>
              <p className="skill-desc">Claude / OpenAI APIを活用した業務特化型チャットボット・AIアシスタントを設計・実装。このサイトのAIもShomaが構築。</p>
              <div className="skill-tags">
                {['Claude API','OpenAI','LangChain'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="skill-cell reveal from-right">
              <p className="skill-num">04</p>
              <div className="skill-icon-wrap">📊</div>
              <p className="skill-name">Data Analytics</p>
              <p className="skill-name-jp">データ分析</p>
              <p className="skill-desc">生データを意味ある洞察へ変換。BIダッシュボード構築から統計分析・予測モデルまで、意思決定を数値で支援。</p>
              <div className="skill-tags">
                {['Python','SQL','BigQuery','Looker Studio'].map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Works */}
      <section id="works" className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-eyebrow">works</p>
            <h2 className="section-title">
              Selected Projects
              <span className="jp">受注実績 — クラウドワークス 3件</span>
            </h2>
          </div>
          <div className="works-list">
            {[
              {
                n: '01', en: 'RPA Automation System', jp: '業務自動化RPAシステムの構築',
                desc: '月次レポート作成を完全自動化。作業時間を約80%削減し、担当者をコア業務に集中させることに成功。',
              },
              {
                n: '02', en: 'Corporate Website', jp: '企業向けコーポレートサイト制作',
                desc: 'スタートアップ企業のサイトをゼロから制作。モダンデザイン＋SEO対応でオーガニック流入を改善。',
              },
              {
                n: '03', en: 'BI Dashboard', jp: 'データ分析ダッシュボード構築',
                desc: 'BigQuery + Looker Studioで売上・顧客KPIをリアルタイム可視化。経営判断のスピードと精度を向上。',
              },
            ].map((w, i) => (
              <div key={w.n} className={`work-item reveal${i > 0 ? ` reveal-delay-${i}` : ''}`}>
                <div className="work-index">{w.n}</div>
                <div className="work-info">
                  <p className="work-title">{w.en}</p>
                  <p className="work-title-jp">{w.jp}</p>
                  <p className="work-desc">{w.desc}</p>
                </div>
                <div className="work-meta"><span className="work-platform">Crowdworks</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section">
        <div className="container">
          <div className="pricing-wrap">
            <div className="pricing-left reveal from-left">
              <p className="section-eyebrow">pricing</p>
              <h2 className="section-title">
                Let&apos;s Talk
                <span className="jp">料金 — まずはご相談ください</span>
              </h2>
              <p className="pricing-desc">
                プロジェクトの規模・要件・納期によって最適なプランをご提案します。
                小規模な自動化スクリプトから、複数フェーズにわたる大型開発まで柔軟に対応。
                まずはお気軽にお問い合わせください。
              </p>
              <button className="btn btn-primary" onClick={() => scrollTo('contact')}>
                無料相談を申し込む →
              </button>
            </div>
            <div className="pricing-right reveal from-right">
              <p className="price-display">要相談</p>
              <p className="price-note">Project-based / 案件内容に応じてお見積もり</p>
              <ul className="price-list">
                {[
                  'Web制作（LP・コーポレートサイト）',
                  'RPA・業務自動化システム開発',
                  'AIエージェント・チャットボット構築',
                  'データ分析・BIダッシュボード',
                  '継続的な保守・サポートも対応可',
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a
                href="mailto:shoma.yoshida0011@gmail.com"
                className="btn btn-ghost"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                shoma.yoshida0011@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <div className="container">
          <div className="contact-wrap">
            <div className="contact-left reveal from-left">
              <p className="section-eyebrow">contact</p>
              <h2 className="section-title">
                Get in Touch
                <span className="jp">お問い合わせ</span>
              </h2>
              <p className="section-desc">
                お仕事のご依頼・ご相談はメールにてどうぞ。
                通常2営業日以内にご返信いたします。
                <br /><br />
                「こんなこと頼めるの？」という段階でも大歓迎です。
                まずはお気軽にご連絡ください。
              </p>
            </div>
            <div className="contact-right reveal from-right">
              <a href="mailto:shoma.yoshida0011@gmail.com" className="contact-link">
                <div className="contact-link-icon">✉️</div>
                <div className="contact-link-text">
                  <p className="contact-link-label">Email</p>
                  <p className="contact-link-value">shoma.yoshida0011@gmail.com</p>
                </div>
                <span className="contact-link-arrow">→</span>
              </a>
              <a
                href="https://crowdworks.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <div className="contact-link-icon">💼</div>
                <div className="contact-link-text">
                  <p className="contact-link-label">Crowdworks</p>
                  <p className="contact-link-value">クラウドワークスでも受付中</p>
                </div>
                <span className="contact-link-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p className="footer-copy">© 2026 Shoma. All rights reserved.</p>
        <p className="footer-made">Built with <span>♥</span> &amp; Claude API</p>
      </footer>

      {/* Chat Widget */}
      <div id="chat-widget">
        <button id="chat-fab" onClick={() => setChatOpen((o) => !o)} title="AIアシスタントに質問">
          <span>{chatOpen ? '✕' : '💬'}</span>
          <span className="fab-ping" />
        </button>

        <div id="chat-panel" className={chatOpen ? 'open' : ''}>
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">🤖</div>
              <div>
                <p className="chat-hname">Shomaのアシスタント</p>
                <p className="chat-hstatus">● オンライン — Claude AI 搭載</p>
              </div>
            </div>
            <button id="chat-close" onClick={() => setChatOpen(false)}>✕</button>
          </div>

          <div id="chat-messages" ref={messagesRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                <div className="msg-ico">{msg.role === 'user' ? '👤' : '🤖'}</div>
                <div
                  className="msg-bbl"
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }}
                />
              </div>
            ))}
            {isTyping && (
              <div className="msg bot">
                <div className="msg-ico">🤖</div>
                <div className="msg-bbl">
                  <div className="typing-wrap">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div id="quick-replies">
            {QUICK_REPLIES.map((q) => (
              <button key={q} className="qr-btn" onClick={() => sendQuick(q)}>{q}</button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              id="chat-input"
              type="text"
              placeholder="メッセージを入力…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
              }}
            />
            <button id="chat-send" onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      </div>
    </>
  )
}
