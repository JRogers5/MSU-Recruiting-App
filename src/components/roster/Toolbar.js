'use client'

export default function Toolbar({ view, setView, isAdmin, onAdd, onSettings }) {
  return (
    <div className="toolbar">
      <div className="tabs">
        {['board', 'table', 'forecast'].map((v) => (
          <button
            key={v}
            className={`tab-btn${view === v ? ' active' : ''}`}
            onClick={() => setView(v)}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="actions-right">
        <button className="btn icon-only-btn" onClick={onSettings} aria-label="Settings" title="Settings">
          ⚙
        </button>
        {isAdmin && (
          <button className="btn btn-primary" onClick={onAdd}>
            + Add player
          </button>
        )}
      </div>
    </div>
  )
}
