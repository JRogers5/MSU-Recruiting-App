'use client'

import { QUICK_LINKS } from './constants'

export default function QuickLinks() {
  return (
    <div className="quick-links">
      <div className="ql-title">Quick Links</div>
      {QUICK_LINKS.length === 0 ? (
        <div className="ql-empty">No links yet.</div>
      ) : (
        <div className="ql-row">
          {QUICK_LINKS.map((link) => (
            <a
              key={link.url}
              className="ql-link"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
