'use client'

import { useRef, useState } from 'react'

export default function SettingsModal({
  settings,
  isAdmin,
  onSave,
  onClose,
  onExport,
  onImport,
  onClear,
}) {
  const [rosterLimit, setRosterLimit] = useState(settings.roster_limit ?? 15)
  const fileInputRef = useRef(null)

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <h2>Settings</h2>

        <div className="settings-row">
          <div>
            <div className="lbl">Roster limit</div>
            <div className="desc">Informational only — not currently enforced.</div>
          </div>
          {isAdmin ? (
            <input
              type="number"
              min="0"
              value={rosterLimit}
              onChange={(e) => setRosterLimit(e.target.value)}
              onBlur={(e) => {
                const n = Number(e.target.value) || 0
                setRosterLimit(n)
                if (n !== settings.roster_limit) onSave({ roster_limit: n })
              }}
            />
          ) : (
            <span className="mono">{rosterLimit}</span>
          )}
        </div>

        <div className="settings-row">
          <div>
            <div className="lbl">Export backup</div>
            <div className="desc">Download the full roster as a JSON file.</div>
          </div>
          <button className="btn" onClick={onExport}>
            Export
          </button>
        </div>

        {isAdmin && (
          <>
            <div className="settings-row">
              <div>
                <div className="lbl">Import roster</div>
                <div className="desc">Replaces the current roster from a JSON backup.</div>
              </div>
              <button className="btn" onClick={() => fileInputRef.current.click()}>
                Import
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files[0]
                  e.target.value = ''
                  if (file) onImport(file)
                }}
              />
            </div>

            <div className="settings-row">
              <div>
                <div className="lbl">Clear all roster data</div>
                <div className="desc">Removes every player. Cannot be undone.</div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (confirm('Remove every player from the roster? This cannot be undone.')) {
                    onClear()
                  }
                }}
              >
                Clear roster
              </button>
            </div>
          </>
        )}

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
