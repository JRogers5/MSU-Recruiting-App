'use client'

import { POSITIONS, CLASS_OPTIONS } from './constants'
import { filteredSortedPlayers } from './utils'
import Avatar from './Avatar'

const SORTABLE = [
  { key: 'name', label: 'Name' },
  { key: 'position', label: 'Pos' },
  { key: 'class', label: 'Class' },
  { key: 'elig_remaining', label: 'Elig' },
]

export default function Table({
  players,
  filters,
  setFilters,
  sortKey,
  sortDir,
  setSort,
  isAdmin,
  onEdit,
  onDelete,
}) {
  const rows = filteredSortedPlayers(players, filters, sortKey, sortDir)

  function toggleSort(key) {
    if (sortKey === key) {
      setSort(key, sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(key, 'asc')
    }
  }

  return (
    <div>
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search name, hometown, prior school…"
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
        />
        <select
          value={filters.pos}
          onChange={(e) => setFilters({ ...filters, pos: e.target.value })}
        >
          <option value="all">All positions</option>
          {POSITIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={filters.cls}
          onChange={(e) => setFilters({ ...filters, cls: e.target.value })}
        >
          <option value="all">All classes</option>
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              {SORTABLE.map((col) => (
                <th key={col.key} onClick={() => toggleSort(col.key)}>
                  {col.label}
                  {sortKey === col.key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
                </th>
              ))}
              <th>Height/Weight</th>
              <th>Hometown / Prior school</th>
              {isAdmin && <th></th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>
                  <Avatar player={p} className="sm" />
                </td>
                <td>{p.name}</td>
                <td>{p.position}</td>
                <td>{p.class}</td>
                <td className="mono">{p.elig_remaining ?? 0}</td>
                <td className="mono">
                  {p.height || '—'} {p.weight ? `· ${p.weight}lb` : ''}
                </td>
                <td className="notes-cell">
                  {p.hometown || '—'}
                  {p.prior_school ? ` · ${p.prior_school}` : ''}
                </td>
                {isAdmin && (
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => onEdit(p.id)} aria-label="Edit">
                        ✎
                      </button>
                      <button className="icon-btn" onClick={() => onDelete(p)} aria-label="Remove">
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
    </div>
  )
}
