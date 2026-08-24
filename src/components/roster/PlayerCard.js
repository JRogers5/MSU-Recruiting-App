'use client'

import Avatar from './Avatar'

export default function PlayerCard({ player, isAdmin, isDragging, onDragStart, onDragEnd, onDragOver, onDrop, onView, onEdit, onDelete }) {
  return (
    <div
      className={`player-card${isDragging ? ' dragging' : ''}`}
      draggable={isAdmin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => onView(player)}
      style={{ cursor: 'pointer' }}
    >
      {isAdmin && (
        <div className="pc-actions">
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(player.id)
            }}
            aria-label="Edit"
          >
            ✎
          </button>
          <button
            className="icon-btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(player)
            }}
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      )}
      <div className="pc-row">
        <div className="pc-photo">
          <Avatar player={player} className="card-photo" />
        </div>
        <div className="pc-info">
          <div className="pc-name">{player.name}</div>
          <div className="pc-meta">
            {player.class}
            {player.hometown ? ` · ${player.hometown}` : ''}
          </div>
          <div className="pc-chips">
            <span className="chip elig">{player.elig_remaining ?? 0} yr(s) left</span>
            {player.exempt && <span className="chip">Exempt</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
