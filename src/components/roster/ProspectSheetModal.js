'use client'

import ProspectSheet from './ProspectSheet'

export default function ProspectSheetModal({ prospect, onClose }) {
  return (
    <div className="sheet-modal-backdrop" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="sheet-modal">
        <div className="sheet-toolbar sheet-modal-toolbar">
          <button onClick={() => window.print()}>Print / Save as PDF</button>
          <button className="ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <ProspectSheet prospect={prospect} />
      </div>
    </div>
  )
}
