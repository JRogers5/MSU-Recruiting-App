'use client'

import Avatar from './Avatar'

function Row({ label, value }) {
  return (
    <div className="settings-row">
      <span className="lbl">{label}</span>
      <span className="mono">{value || '—'}</span>
    </div>
  )
}

function LinkRow({ label, url }) {
  return (
    <div className="settings-row">
      <span className="lbl">{label}</span>
      {url ? (
        <a className="ql-link" href={url} target="_blank" rel="noopener noreferrer">
          Open link
        </a>
      ) : (
        <span className="mono">—</span>
      )}
    </div>
  )
}

export default function ProspectDetailModal({ prospect, isAdmin, onEdit, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ width: '78px', height: '78px' }}>
            <Avatar player={{ name: prospect.name, photo_url: prospect.photo_url }} className="card-photo" />
          </div>
          <h2 style={{ margin: 0, flex: 1 }}>{prospect.name}</h2>
          <a
            className="btn"
            href={`/prospects/${prospect.id}/sheet`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: 'var(--risk-high)', borderColor: 'var(--risk-high)', color: '#fff' }}
          >
            Profile Sheet
          </a>
        </div>

        <Row label="Committed" value={prospect.committed ? 'Yes' : 'No'} />
        <Row label="Position group" value={prospect.position_group} />
        <Row label="High school" value={prospect.high_school} />
        <Row label="AAU team" value={prospect.aau_team} />
        <Row label="Hometown" value={prospect.hometown} />
        <Row label="Height" value={prospect.height} />
        <Row label="Weight" value={prospect.weight ? `${prospect.weight} lb` : ''} />
        <LinkRow label="Synergy" url={prospect.synergy_link} />
        <LinkRow label="Highlights" url={prospect.highlight_link} />

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => onEdit(prospect.id)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
