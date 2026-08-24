'use client'

export default function RecruitingBoard({ title, positions }) {
  return (
    <div>
      <div className="toolbar">
        <span className="section-title">{title}</span>
      </div>
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
