'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const WEBAPI_URL =
  'https://script.google.com/macros/s/AKfycbxVSyEB63hVPDxZzebsS_rshZYQeBNxl1F16PRCUJYVmCqrcfUXz7nZGLvUSafwFoj4UA/exec'

type Lead = {
  id: number
  sirket: string
  sektor: string
  karar_verici: string
  rol: string
  eposta: string
  calisanlar: number
  oncelik: string
  asama: string
  son_temas: string
  fu1: string
  fu2: string
  yanit: boolean
  otomasyon: string
  gozlem: string
  not_: string
}

const STAGE_STYLES: Record<string, { color: string; bg: string }> = {
  Araştırılıyor: { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  Email1:        { color: '#2563EB', bg: 'rgba(37,99,235,0.10)' },
  Followup1:     { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  Followup2:     { color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  Pozitif:       { color: '#16A34A', bg: 'rgba(22,163,74,0.10)' },
  Arşiv:         { color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)' },
}

const PRIO_STYLES: Record<string, { color: string; bg: string }> = {
  Yüksek: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
  Orta:   { color: '#D97706', bg: 'rgba(217,119,6,0.08)' },
  Düşük:  { color: '#6B7280', bg: 'rgba(107,114,128,0.08)' },
}

const STAGES = ['Araştırılıyor', 'Email1', 'Followup1', 'Followup2', 'Pozitif', 'Arşiv']
const PRIORITIES = ['Yüksek', 'Orta', 'Düşük']

function initials(name: string) {
  return name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' })
}

function daysAgo(iso: string) {
  if (!iso) return null
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  return diff
}


export default function CRMPage() {
  const [data, setData] = useState<Lead[]>([])
  const [filtered, setFiltered] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [prioFilter, setPrioFilter] = useState('')
  const [sortKey, setSortKey] = useState<keyof Lead>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')
  const [toast, setToast] = useState('')
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 3000)
  }, [])

  const applyFilters = useCallback(
    (rows: Lead[], q: string, stage: string, prio: string, sk: keyof Lead, sd: 'asc' | 'desc') => {
      let out = [...rows]
      if (q) {
        const lq = q.toLowerCase()
        out = out.filter(r =>
          r.sirket.toLowerCase().includes(lq) ||
          r.karar_verici.toLowerCase().includes(lq) ||
          r.sektor.toLowerCase().includes(lq) ||
          r.eposta.toLowerCase().includes(lq)
        )
      }
      if (stage) out = out.filter(r => r.asama === stage)
      if (prio) out = out.filter(r => r.oncelik === prio)
      out.sort((a, b) => {
        const av = a[sk] ?? ''
        const bv = b[sk] ?? ''
        const cmp = String(av).localeCompare(String(bv), 'tr', { numeric: true })
        return sd === 'asc' ? cmp : -cmp
      })
      setFiltered(out)
    },
    []
  )

  const loadData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setSyncMsg('● Güncelleniyor…')
    try {
      const res = await fetch(WEBAPI_URL)
      const json = await res.json()
      if (json.ok && Array.isArray(json.data) && json.data.length) {
        setData(json.data)
        applyFilters(json.data, search, stageFilter, prioFilter, sortKey, sortDir)
        setSyncMsg('● Güncellendi')
        showToast(`${json.data.length} kayıt ${silent ? 'güncellendi' : 'yüklendi'}`)
      } else {
        setSyncMsg('● Bağlantı hatası')
        showToast('Veri alınamadı')
      }
    } catch {
      setSyncMsg('● Bağlantı hatası')
      showToast('API bağlantı hatası')
    }
    setLoading(false)
  }, [search, stageFilter, prioFilter, sortKey, sortDir, applyFilters, showToast])

  useEffect(() => { loadData() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    applyFilters(data, search, stageFilter, prioFilter, sortKey, sortDir)
  }, [data, search, stageFilter, prioFilter, sortKey, sortDir, applyFilters])

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData(true)
    setRefreshing(false)
  }

  const handleSort = (key: keyof Lead) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const stats = {
    total: data.length,
    pozitif: data.filter(r => r.asama === 'Pozitif').length,
    yuksek: data.filter(r => r.oncelik === 'Yüksek').length,
    email1: data.filter(r => r.asama === 'Email1').length,
  }

  return (
    <>
      <style>{`
        .crm-app{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;
          background-color:#FAFAFA;
          background-image:linear-gradient(#F0F0F1 1px,transparent 1px),linear-gradient(90deg,#F0F0F1 1px,transparent 1px);
          background-size:20px 20px;
          font-family:'Inter',system-ui,sans-serif;font-size:14px;color:#111827;-webkit-font-smoothing:antialiased}
        .crm-topbar{display:flex;align-items:center;gap:16px;padding:0 24px;height:52px;
          background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0;z-index:10}
        .crm-logo{display:flex;align-items:center;gap:8px;font-weight:700;font-size:15px;
          letter-spacing:-0.02em;color:#111827;text-decoration:none}
        .crm-logo-dot{width:7px;height:7px;background:#C22C2F;flex-shrink:0}
        .crm-divider{width:1px;height:20px;background:#E5E7EB}
        .crm-title{color:#374151;font-size:13px}
        .crm-spacer{flex:1}
        .crm-stats{display:flex;gap:20px}
        .crm-stat{display:flex;align-items:center;gap:5px;font-size:12px;color:#9CA3AF}
        .crm-stat strong{color:#111827;font-weight:600;font-size:13px}
        .crm-sync{font-size:11px;color:#9CA3AF;transition:color 0.3s}
        .crm-sync.ok{color:#16A34A}.crm-sync.err{color:#DC2626}
        .crm-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;
          font:500 13px/1 'Inter',system-ui;cursor:pointer;border:1px solid transparent;
          transition:all 0.15s;background:transparent}
        .crm-btn-ghost{color:#374151;border-color:#E5E7EB}
        .crm-btn-ghost:hover{background:#F3F4F6;color:#111827;border-color:#9CA3AF}
        .crm-btn-ghost:disabled{opacity:0.5;cursor:not-allowed}
        .crm-toolbar{display:flex;align-items:center;gap:10px;padding:10px 24px;
          background:#fff;border-bottom:1px solid #E5E7EB;flex-shrink:0}
        .crm-search-wrap{position:relative;flex:0 0 240px}
        .crm-search-icon{position:absolute;left:9px;top:50%;transform:translateY(-50%);
          color:#9CA3AF;pointer-events:none}
        .crm-search{width:100%;padding:6px 10px 6px 30px;background:#FAFAFA;
          border:1px solid #E5E7EB;color:#111827;font:13px 'Inter',system-ui;outline:none;
          transition:border-color 0.15s}
        .crm-search::placeholder{color:#9CA3AF}
        .crm-search:focus{border-color:#C22C2F}
        .crm-select{padding:6px 28px 6px 10px;background:#FAFAFA;border:1px solid #E5E7EB;
          color:#374151;font:13px 'Inter',system-ui;outline:none;cursor:pointer;appearance:none;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 8px center}
        .crm-select:focus,.crm-select:hover{border-color:#9CA3AF}
        .crm-count{padding:2px 8px;background:#F3F4F6;border:1px solid #E5E7EB;
          font-size:12px;color:#9CA3AF}
        .crm-main{flex:1;overflow:auto;padding:20px 24px}
        .crm-table-wrap{background:#fff;border:1px solid #E5E7EB;overflow:hidden}
        table{width:100%;border-collapse:collapse}
        thead{background:#FAFAFA}
        th{padding:10px 14px;text-align:left;font-size:11px;font-weight:600;color:#9CA3AF;
          letter-spacing:0.06em;text-transform:uppercase;border-bottom:1px solid #E5E7EB;
          white-space:nowrap;cursor:pointer;user-select:none}
        th:hover{color:#374151}
        th.sorted{color:#C22C2F}
        tbody tr{border-bottom:1px solid #E5E7EB;transition:background 0.1s;cursor:pointer}
        tbody tr:last-child{border-bottom:none}
        tbody tr:hover{background:#F3F4F6}
        tbody tr.selected{background:rgba(194,44,47,0.05)}
        td{padding:11px 14px;vertical-align:middle}
        .company-cell{display:flex;align-items:center;gap:10px}
        .company-avatar{width:30px;height:30px;display:flex;align-items:center;
          justify-content:center;font-weight:700;font-size:11px;flex-shrink:0;letter-spacing:0}
        .company-name{font-weight:500;font-size:13px;color:#111827}
        .company-sector{font-size:11px;color:#9CA3AF;margin-top:1px}
        .contact-name{font-size:13px;color:#111827}
        .contact-role{font-size:11px;color:#9CA3AF;margin-top:1px}
        .contact-email{font-size:11px;color:#C22C2F;margin-top:1px}
        .stage-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;
          font-size:11px;font-weight:500;white-space:nowrap}
        .stage-badge::before{content:'';width:5px;height:5px;border-radius:50%;
          background:currentColor;flex-shrink:0}
        .prio-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;
          font-weight:500;padding:2px 7px}
        .date-cell{font-size:12px;color:#374151;white-space:nowrap}
        .date-cell.overdue{color:#DC2626;font-weight:500}
        .date-cell.soon{color:#D97706}
        .date-cell.empty{color:#9CA3AF}
        .row-actions{display:flex;gap:4px;opacity:0;transition:opacity 0.15s}
        tbody tr:hover .row-actions{opacity:1}
        .row-act-btn{padding:4px 8px;border:1px solid #E5E7EB;background:#F3F4F6;
          color:#374151;font:11px 'Inter',system-ui;cursor:pointer;transition:all 0.12s}
        .row-act-btn:hover{border-color:#C22C2F;color:#C22C2F;background:rgba(194,44,47,0.05)}
        .crm-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;
          gap:12px;padding:60px 20px;color:#9CA3AF;text-align:center;font-size:13px}
        .crm-loading{display:flex;align-items:center;justify-content:center;padding:60px;
          color:#9CA3AF;font-size:13px;gap:10px}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spinning{animation:spin 0.7s linear infinite}
        .detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:60;
          display:flex;align-items:flex-start;justify-content:flex-end}
        .detail-panel{width:420px;height:100vh;overflow-y:auto;background:#fff;
          border-left:1px solid #E5E7EB;display:flex;flex-direction:column;
          transform:translateX(100%);transition:transform 0.2s cubic-bezier(0.16,1,0.3,1)}
        .detail-panel.open{transform:translateX(0)}
        .detail-header{display:flex;align-items:center;gap:12px;padding:16px 20px;
          border-bottom:1px solid #E5E7EB;position:sticky;top:0;background:#fff;z-index:1}
        .detail-close{margin-left:auto;padding:6px 10px;border:1px solid #E5E7EB;
          background:transparent;color:#9CA3AF;cursor:pointer;transition:all 0.12s;
          font:13px 'Inter',system-ui}
        .detail-close:hover{background:#F3F4F6;color:#111827}
        .detail-body{padding:20px;flex:1}
        .detail-section{margin-bottom:24px}
        .detail-section-title{font-size:10px;font-weight:600;color:#9CA3AF;letter-spacing:0.08em;
          text-transform:uppercase;margin-bottom:10px}
        .detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .detail-field label{font-size:11px;color:#9CA3AF;display:block;margin-bottom:3px}
        .detail-field span{font-size:13px;color:#111827}
        .detail-field.full{grid-column:1/-1}
        .detail-note{background:#FAFAFA;border:1px solid #E5E7EB;padding:12px;
          font-size:13px;color:#374151;line-height:1.6;white-space:pre-wrap}
        .toast{position:fixed;bottom:24px;right:24px;padding:10px 16px;background:#111827;
          color:#FAFAFA;font-size:13px;font-weight:500;transform:translateY(12px);opacity:0;
          transition:all 0.2s cubic-bezier(0.16,1,0.3,1);pointer-events:none;z-index:200}
        .toast.show{transform:translateY(0);opacity:1}
        @media(max-width:900px){
          .crm-stats{display:none}
          .crm-toolbar{flex-wrap:wrap}
          .crm-search-wrap{flex:1 1 200px}
          .detail-panel{width:100vw}
          .hide-sm{display:none}
        }
        ::-webkit-scrollbar{width:6px;height:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#E5E7EB}
        ::-webkit-scrollbar-thumb:hover{background:#9CA3AF}
      `}</style>

      <div className="crm-app">
        {/* Topbar */}
        <header className="crm-topbar">
          <a href="/" className="crm-logo">
            <div className="crm-logo-dot" />
            AI Automation Agent
          </a>
          <div className="crm-divider" />
          <span className="crm-title">Pipeline CRM</span>
          <div className="crm-spacer" />
          <div className="crm-stats">
            <span className="crm-stat"><strong>{stats.total}</strong> toplam</span>
            <span className="crm-stat"><strong>{stats.pozitif}</strong> pozitif</span>
            <span className="crm-stat"><strong>{stats.yuksek}</strong> yüksek öncelik</span>
            <span className="crm-stat"><strong>{stats.email1}</strong> email gönderildi</span>
          </div>
          <span className={`crm-sync ${syncMsg.includes('Güncellendi') ? 'ok' : syncMsg.includes('hata') ? 'err' : ''}`}>
            {syncMsg}
          </span>
          <button
            className="crm-btn crm-btn-ghost"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Verileri güncelle"
            style={{ padding: '6px 10px' }}
          >
            <svg
              className={refreshing ? 'spinning' : ''}
              width="14" height="14" viewBox="0 0 24 24" fill="none"
            >
              <path d="M1 4v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* Toolbar */}
        <div className="crm-toolbar">
          <div className="crm-search-wrap">
            <svg className="crm-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="crm-search"
              placeholder="Şirket, kişi veya e-posta ara…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="crm-select" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
            <option value="">Tüm aşamalar</option>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="crm-select" value={prioFilter} onChange={e => setPrioFilter(e.target.value)}>
            <option value="">Tüm öncelikler</option>
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="crm-spacer" />
          <span className="crm-count">{filtered.length} kayıt</span>
        </div>

        {/* Table */}
        <main className="crm-main">
          <div className="crm-table-wrap">
            {loading ? (
              <div className="crm-loading">
                <svg className="spinning" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Veriler yükleniyor…
              </div>
            ) : filtered.length === 0 ? (
              <div className="crm-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" opacity="0.3">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p>Kayıt bulunamadı</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('sirket')} className={sortKey === 'sirket' ? 'sorted' : ''}>
                      Şirket <span style={{ opacity: sortKey === 'sirket' ? 1 : 0.4, color: sortKey === 'sirket' ? '#C22C2F' : undefined }}>
                        {sortKey === 'sirket' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                      </span>
                    </th>
                    <th onClick={() => handleSort('karar_verici')} className={sortKey === 'karar_verici' ? 'sorted' : ''}>
                      İletişim
                    </th>
                    <th onClick={() => handleSort('asama')} className={sortKey === 'asama' ? 'sorted' : ''}>
                      Aşama
                    </th>
                    <th onClick={() => handleSort('oncelik')} className={sortKey === 'oncelik' ? 'sorted' : ''}>
                      Öncelik
                    </th>
                    <th onClick={() => handleSort('son_temas')} className={`hide-sm ${sortKey === 'son_temas' ? 'sorted' : ''}`}>
                      Son Temas
                    </th>
                    <th className="hide-sm">Sonraki Adım</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => {
                    const [avatarBg, avatarFg] = avatarColor2(lead.sirket)
                    const stageStyle = STAGE_STYLES[lead.asama] ?? { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' }
                    const prioStyle = PRIO_STYLES[lead.oncelik] ?? PRIO_STYLES['Orta']
                    const days = daysAgo(lead.son_temas)
                    const dateClass = days === null ? 'empty' : days > 14 ? 'overdue' : days > 7 ? 'soon' : ''
                    const fu = lead.fu1 || lead.fu2
                    return (
                      <tr
                        key={lead.id}
                        className={selected?.id === lead.id ? 'selected' : ''}
                        onClick={() => setSelected(lead)}
                      >
                        <td>
                          <div className="company-cell">
                            <div className="company-avatar" style={{ background: avatarBg, color: avatarFg }}>
                              {initials(lead.sirket)}
                            </div>
                            <div>
                              <div className="company-name">{lead.sirket}</div>
                              <div className="company-sector">{lead.sektor}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-name">{lead.karar_verici}</div>
                          <div className="contact-role">{lead.rol}</div>
                          <div className="contact-email">{lead.eposta}</div>
                        </td>
                        <td>
                          <span className="stage-badge" style={{ color: stageStyle.color, background: stageStyle.bg }}>
                            {lead.asama}
                          </span>
                        </td>
                        <td>
                          <span className="prio-badge" style={{ color: prioStyle.color, background: prioStyle.bg }}>
                            {lead.oncelik}
                          </span>
                        </td>
                        <td className={`date-cell ${dateClass} hide-sm`}>
                          {formatDate(lead.son_temas) || '—'}
                        </td>
                        <td className="date-cell hide-sm">
                          {formatDate(fu) || '—'}
                        </td>
                        <td>
                          <div className="row-actions">
                            <button
                              className="row-act-btn"
                              onClick={e => { e.stopPropagation(); setSelected(lead) }}
                            >
                              Detay
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </main>

        {/* Detail panel */}
        {selected && (
          <div className="detail-overlay" onClick={() => setSelected(null)}>
            <div className={`detail-panel open`} onClick={e => e.stopPropagation()}>
              <div className="detail-header">
                <div className="company-avatar" style={{
                  width: 36, height: 36,
                  background: avatarColor2(selected.sirket)[0],
                  color: avatarColor2(selected.sirket)[1],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                  {initials(selected.sirket)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>{selected.sirket}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF' }}>{selected.sektor}</div>
                </div>
                <button className="detail-close" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="detail-body">
                <div className="detail-section">
                  <div className="detail-section-title">Aşama & Öncelik</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="stage-badge" style={{
                      color: (STAGE_STYLES[selected.asama] ?? STAGE_STYLES['Araştırılıyor']).color,
                      background: (STAGE_STYLES[selected.asama] ?? STAGE_STYLES['Araştırılıyor']).bg,
                    }}>
                      {selected.asama}
                    </span>
                    <span className="prio-badge" style={{
                      color: (PRIO_STYLES[selected.oncelik] ?? PRIO_STYLES['Orta']).color,
                      background: (PRIO_STYLES[selected.oncelik] ?? PRIO_STYLES['Orta']).bg,
                    }}>
                      {selected.oncelik}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-section-title">İletişim</div>
                  <div className="detail-grid">
                    <div className="detail-field full">
                      <label>Ad Soyad</label>
                      <span>{selected.karar_verici}</span>
                    </div>
                    <div className="detail-field">
                      <label>Rol</label>
                      <span>{selected.rol || '—'}</span>
                    </div>
                    <div className="detail-field">
                      <label>Çalışan Sayısı</label>
                      <span>{selected.calisanlar || '—'}</span>
                    </div>
                    <div className="detail-field full">
                      <label>E-posta</label>
                      <span style={{ color: '#C22C2F' }}>{selected.eposta || '—'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-section-title">Takip Tarihleri</div>
                  <div className="detail-grid">
                    <div className="detail-field">
                      <label>Son Temas</label>
                      <span>{formatDate(selected.son_temas) || '—'}</span>
                    </div>
                    <div className="detail-field">
                      <label>Yanıt Var?</label>
                      <span>{selected.yanit ? '✓ Evet' : '—'}</span>
                    </div>
                    <div className="detail-field">
                      <label>Follow-up 1</label>
                      <span>{formatDate(selected.fu1) || '—'}</span>
                    </div>
                    <div className="detail-field">
                      <label>Follow-up 2</label>
                      <span>{formatDate(selected.fu2) || '—'}</span>
                    </div>
                  </div>
                </div>

                {selected.gozlem && (
                  <div className="detail-section">
                    <div className="detail-section-title">Gözlem</div>
                    <div className="detail-note">{selected.gozlem}</div>
                  </div>
                )}

                {selected.not_ && (
                  <div className="detail-section">
                    <div className="detail-section-title">Not</div>
                    <div className="detail-note">{selected.not_}</div>
                  </div>
                )}

                {selected.otomasyon && (
                  <div className="detail-section">
                    <div className="detail-section-title">Otomasyon Potansiyeli</div>
                    <div className="detail-note">{selected.otomasyon}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
      </div>
    </>
  )
}

function avatarColor2(name: string): [string, string] {
  const colors: [string, string][] = [
    ['#FEE2E2','#991B1B'],['#DBEAFE','#1D4ED8'],['#D1FAE5','#065F46'],
    ['#EDE9FE','#5B21B6'],['#FEF3C7','#92400E'],['#FCE7F3','#9D174D'],
    ['#E0F2FE','#075985'],['#F0FDF4','#15803D'],
  ]
  const idx = (name?.charCodeAt(0) ?? 0) % colors.length
  return colors[idx]
}
