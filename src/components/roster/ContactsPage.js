'use client'

export default function ContactsPage({ contacts, isAdmin, onAdd, onEdit, onDelete }) {
  const sorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name))

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
                <th>Name</th>
                <th>Category</th>
                <th>Organization</th>
                <th>Phone</th>
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
