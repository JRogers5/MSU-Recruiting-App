'use client'

export default function RecruitingBoard({ title, positions }) {
  return (
    <div>
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
        {positions.map((pos) => (
          <div className="board-col" key={pos}>
            <div className="board-col-head">
              <span className="pos" style={{ fontSize: '18px' }}>
                {pos}
              </span>
              <span className="cnt mono">0</span>
            </div>
            <div className="card-stack">
              <div className="col-empty">No prospects yet</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
