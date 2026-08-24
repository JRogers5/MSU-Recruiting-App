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
          <div className="pc-meta">{prospect.hometown}</div>
          <div className="pc-chips">
            {(prospect.height || prospect.weight) && (
              <span className="chip mono">
                {prospect.height || ''}
                {prospect.height && prospect.weight ? ' · ' : ''}
                {prospect.weight ? `${prospect.weight}lb` : ''}
              </span>
            )}
            {prospect.high_school && <span className="chip">{prospect.high_school}</span>}
            {prospect.aau_team && <span className="chip">{prospect.aau_team}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
