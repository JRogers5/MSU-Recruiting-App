'use client'

import { useState } from 'react'

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'organization', label: 'Organization' },
  { key: 'phone', label: 'Phone' },
]

export default function ContactsPage({ contacts, isAdmin, onAdd, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...contacts].sort((a, b) => {
    const av = (a[sortKey] || '').toLowerCase()
    const bv = (b[sortKey] || '').toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  return (
    <div>
      <div className="toolbar">
        <span className="section-title">Contacts</span>
        {isAdmin && (
          <div className="actions-right">
            <button className="btn btn-primary" onClick={onAdd}>
              + Add
            </button>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <h3>No contacts yet</h3>
          <p>Add HS coaches, AAU coaches, family, and other recruiting contacts.</p>
          {isAdmin && (
            <button className="btn btn-primary" onClick={onAdd}>
              + Add
            </button>
          )}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {COLUMNS.map((col) => (
                  <th key={col.key} onClick={() => toggleSort(col.key)}>
                    {col.label}
                    {sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                  </th>
                ))}
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.category || '—'}</td>
                  <td>{c.organization || '—'}</td>
                  <td className="mono">
                    {c.phone ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {c.phone}
                        <a
                          className="icon-btn"
                          href={`tel:${c.phone}`}
                          aria-label={`Call ${c.name}`}
                          title={`Call ${c.name}`}
                        >
                          📞
                        </a>
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={() => onEdit(c)} aria-label="Edit">
                          ✎
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => onDelete(c)}
                          aria-label="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
