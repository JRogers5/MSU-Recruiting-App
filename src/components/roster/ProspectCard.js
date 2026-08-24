'use client'

import Avatar from './Avatar'

export default function ProspectCard({
  prospect,
  isAdmin,
  isDragging,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className={`player-card${isDragging ? ' dragging' : ''}`}
      draggable={isAdmin}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {isAdmin && (
        <div className="pc-actions">
          <button className="icon-btn" onClick={() => onEdit(prospect.id)} aria-label="Edit">
            ✎
          </button>
          <button className="icon-btn" onClick={() => onDelete(prospect)} aria-label="Remove">
            ✕
          </button>
        </div>
      )}
      <div className="pc-row">
        <div className="pc-photo">
          <Avatar player={{ name: prospect.name, photo_url: prospect.photo_url }} className="card-photo" />
        </div>
        <div className="pc-info">
          <div className="pc-name">{prospect.name}</div>
          <div className="pc-meta">
            {prospect.high_school}
            {prospect.hometown ? ` · ${prospect.hometown}` : ''}
          </div>
          {prospect.aau_team && <div className="pc-meta">{prospect.aau_team}</div>}
          <div className="pc-chips">
            {(prospect.height || prospect.weight) && (
              <span className="chip mono">
                {prospect.height || ''}
                {prospect.height && prospect.weight ? ' · ' : ''}
                {prospect.weight ? `${prospect.weight}lb` : ''}
              </span>
            )}
            {prospect.synergy_link && (
              <a
                className="chip"
                href={prospect.synergy_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Synergy
              </a>
            )}
            {prospect.highlight_link && (
              <a
                className="chip"
                href={prospect.highlight_link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                Highlights
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
