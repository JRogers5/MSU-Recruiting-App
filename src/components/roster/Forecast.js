'use client'

import { POSITIONS } from './constants'
import { forecastFor } from './utils'

const CARDS = [
  { yearsOut: 0, title: 'This season', sub: 'Current roster' },
  { yearsOut: 1, title: 'Next season', sub: 'Projected, before any additions' },
  { yearsOut: 2, title: 'Season after', sub: 'Projected, before any additions' },
]

function ForecastCard({ title, sub, players }) {
  const { leavingAfter, byPos } = players
  const max = Math.max(1, ...byPos.map((b) => b.count))

  return (
    <div className="forecast-card">
      <h3>{title}</h3>
      <div className="sub">{sub}</div>
      <div className="fc-bars">
        {byPos.map((b) => (
          <div className="fc-bar-row" key={b.pos}>
            <span className="fc-bar-label">{b.pos}</span>
            <div className="fc-bar-track">
              <div
                className="fc-bar-fill"
                style={{ width: `${(b.count / max) * 100}%` }}
              />
            </div>
            <span className="fc-bar-count">{b.count}</span>
          </div>
        ))}
      </div>
      <div className="fc-leaving">
        <div className="lbl">Won&apos;t be back after this</div>
        {leavingAfter.length === 0 ? (
          <div className="fc-none">Nobody currently projected to leave.</div>
        ) : (
          leavingAfter.map((p) => (
            <div className="fc-player-row" key={p.id}>
              <span>{p.name}</span>
              <span>
                {p.position} · {p.class}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function Forecast({ players }) {
  return (
    <div className="forecast-grid">
      {CARDS.map((card) => (
        <ForecastCard
          key={card.yearsOut}
          title={card.title}
          sub={card.sub}
          players={forecastFor(players, POSITIONS, card.yearsOut)}
        />
      ))}
    </div>
  )
}
