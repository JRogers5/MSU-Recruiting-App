'use client'

import { useState } from 'react'
import ProspectCard from './ProspectCard'

export default function RecruitingBoard({
  title,
  positions,
  prospects,
  isAdmin,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
}) {
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverPos, setDragOverPos] = useState(null)

  function columnProspects(pos) {
    return prospects
      .filter((p) => p.position_group === pos)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
  }

  function handleCardDrop(e, pos, targetProspect) {
    e.preventDefault()
    e.stopPropagation()
    setDragOverPos(null)
    if (!draggedId || !isAdmin) return
    const dragged = prospects.find((p) => p.id === draggedId)
    if (!dragged || dragged.position_group !== pos || dragged.id === targetProspect.id) return
    const rect = e.currentTarget.getBoundingClientRect()
    const before = e.clientY < rect.top + rect.height / 2
    onReorder(pos, draggedId, targetProspect.id, before)
    setDraggedId(null)
  }

  function handleColumnDrop(e, pos) {
    e.preventDefault()
    setDragOverPos(null)
    if (!draggedId || !isAdmin) return
    const dragged = prospects.find((p) => p.id === draggedId)
    if (!dragged || dragged.position_group !== pos) return
    onReorder(pos, draggedId, null, false)
    setDraggedId(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => onAdd(null, null)}>
            + Add prospect
          </button>
        )}
      </div>
      <h2
        className="display"
        style={{
          textAlign: 'center',
          fontSize: '32px',
          fontWeight: 700,
          letterSpacing: '.03em',
          color: 'var(--text)',
          margin: '4px 0 22px',
        }}
      >
        {title}
      </h2>

      <div className="board">
        {positions.map((pos) => {
          const colProspects = columnProspects(pos)
          return (
            <div className="board-col" key={pos}>
              <div className="board-col-head">
                <span className="pos" style={{ fontSize: '18px' }}>
                  {pos}
                </span>
                <span className="cnt mono">{colProspects.length}</span>
              </div>
              <div
                className={`card-stack${dragOverPos === pos ? ' drag-over' : ''}`}
                data-pos={pos}
                onDragOver={(e) => {
                  e.preventDefault()
                  if (isAdmin) setDragOverPos(pos)
                }}
                onDragLeave={() => setDragOverPos((p) => (p === pos ? null : p))}
                onDrop={(e) => handleColumnDrop(e, pos)}
              >
                {colProspects.length === 0 && (
                  <div className="col-empty">
                    No prospects yet
                    {isAdmin && <button onClick={() => onAdd(null, pos)}>+ Add</button>}
                  </div>
                )}
                {colProspects.map((prospect) => (
                  <ProspectCard
                    key={prospect.id}
                    prospect={prospect}
                    isAdmin={isAdmin}
                    isDragging={draggedId === prospect.id}
                    onDragStart={() => setDraggedId(prospect.id)}
                    onDragEnd={() => {
                      setDraggedId(null)
                      setDragOverPos(null)
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleCardDrop(e, pos, prospect)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
