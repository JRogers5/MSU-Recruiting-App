'use client'

import { useEffect } from 'react'

export default function PrintTrigger() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="sheet-toolbar">
      <button onClick={() => window.print()}>Print / Save as PDF</button>
      <button className="ghost" onClick={() => window.close()}>
        Close
      </button>
    </div>
  )
}
