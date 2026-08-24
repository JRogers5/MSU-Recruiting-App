'use client'

export default function EmptyState({ isAdmin, onAdd, onLoadSample }) {
  return (
    <div className="empty-state">
      <h3>No players yet</h3>
      <p>Add your first player to start building the roster.</p>
      {isAdmin && (
        <>
          <button className="btn btn-primary" onClick={onAdd}>
            + Add player
          </button>
          <button className="sample-link" onClick={onLoadSample}>
            or load a sample roster to see how the board looks
          </button>
        </>
      )}
    </div>
  )
}
