'use client'

import { useEffect, useRef, useState } from 'react'
import { PAGE_LABELS } from './constants'

export default function NavMenu({ page, setPage, staffName, role, logoutAction }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  return (
    <div className="nav-menu-wrap" ref={wrapRef}>
      <button className="menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Menu">
        ☰
      </button>
      {open && (
        <div className="menu-dropdown">
          <button
            className={`menu-item${page === 'admin' ? ' active' : ''}`}
            onClick={() => {
              setPage('admin')
              setOpen(false)
            }}
          >
            Admin
          </button>
          <div className="menu-divider" />
          {Object.entries(PAGE_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`menu-item${page === key ? ' active' : ''}`}
              onClick={() => {
                setPage(key)
                setOpen(false)
              }}
            >
              {label}
            </button>
          ))}
          <div className="menu-divider" />
          <div style={{ padding: '8px 11px', fontSize: '12px', color: 'var(--text-faint)' }}>
            {staffName} · {role === 'admin' ? 'Admin' : 'View only'}
          </div>
          <form action={logoutAction}>
            <button type="submit" className="menu-item">
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
