'use client'

export default function AddContactChoiceModal({ onManual, onImport, onClose }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" style={{ maxWidth: '380px' }}>
        <h2>Add contact</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="btn btn-primary" onClick={onManual}>
            Manually Add
          </button>
          <button className="btn" onClick={onImport}>
            Import Contacts
          </button>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
