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

export default function PlayerDetailModal({ player, isAdmin, onEdit, onClose }) {
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
            <Avatar player={player} className="card-photo" />
          </div>
          <h2 style={{ margin: 0 }}>{player.name}</h2>
        </div>

        <Row label="Position" value={player.position} />
        <Row label="Class" value={player.class} />
        <Row label="Eligibility remaining" value={`${player.elig_remaining ?? 0} yr(s)`} />
        <Row label="Height" value={player.height} />
        <Row label="Weight" value={player.weight ? `${player.weight} lb` : ''} />
        <Row label="Hometown" value={player.hometown} />
        <Row label="Prior school" value={player.prior_school} />
        <Row label="Exempt from roster limit" value={player.exempt ? 'Yes' : 'No'} />

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => onEdit(player.id)}>
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
