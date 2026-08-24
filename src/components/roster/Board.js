'use client'

import { useState } from 'react'
import { POSITIONS } from './constants'
import PlayerCard from './PlayerCard'

export default function Board({ players, isAdmin, onEdit, onDelete, onReorder }) {
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverPos, setDragOverPos] = useState(null)

  function columnPlayers(pos) {
    return players
      .filter((p) => p.position === pos)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
  }

  function handleCardDrop(e, pos, targetPlayer) {
    e.preventDefault()
    e.stopPropagation()
    setDragOverPos(null)
    if (!draggedId || !isAdmin) return
    const dragged = players.find((p) => p.id === draggedId)
    if (!dragged || dragged.position !== pos || dragged.id === targetPlayer.id) return
    const rect = e.currentTarget.getBoundingClientRect()
    const before = e.clientY < rect.top + rect.height / 2
    onReorder(pos, draggedId, targetPlayer.id, before)
    setDraggedId(null)
  }

  function handleColumnDrop(e, pos) {
    e.preventDefault()
    setDragOverPos(null)
    if (!draggedId || !isAdmin) return
    const dragged = players.find((p) => p.id === draggedId)
    if (!dragged || dragged.position !== pos) return
    onReorder(pos, draggedId, null, false)
    setDraggedId(null)
  }

  return (
    <div className="board">
      {POSITIONS.map((pos) => {
        const colPlayers = columnPlayers(pos)
        return (
          <div className="board-col" key={pos}>
            <div className="board-col-head">
              <span className="pos">{pos}</span>
              <span className="cnt mono">{colPlayers.length}</span>
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
              {colPlayers.length === 0 && (
                <div className="col-empty">
                  No {pos} yet
                  {isAdmin && <button onClick={() => onEdit(null, pos)}>+ Add {pos}</button>}
                </div>
              )}
              {colPlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isAdmin={isAdmin}
                  isDragging={draggedId === player.id}
                  onDragStart={() => setDraggedId(player.id)}
                  onDragEnd={() => {
                    setDraggedId(null)
                    setDragOverPos(null)
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleCardDrop(e, pos, player)}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
