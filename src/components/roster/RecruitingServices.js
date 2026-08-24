'use client'

import { RECRUITING_SERVICES } from './constants'

export default function RecruitingServices() {
  return (
    <div className="quick-links">
      <div className="ql-title">Recruiting Services</div>
      <div className="service-row">
        {RECRUITING_SERVICES.map((svc) => (
          <a
            key={svc.name}
            className="service-tile logo-tile"
            href={svc.url}
            target="_blank"
            rel="noopener noreferrer"
            title={svc.sub}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="stw-logo" src={svc.logo} alt={svc.name} />
          </a>
        ))}
      </div>
      <div className="ql-empty" style={{ marginTop: '10px', textAlign: 'center' }}>
        Want another service added (Synergy, Front Rush, JumpForward, Rivals)? Let us know.
      </div>
    </div>
  )
}
