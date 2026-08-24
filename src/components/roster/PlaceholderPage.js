'use client'

export default function PlaceholderPage({ label }) {
  return (
    <div className="empty-state">
      <h3>{label}</h3>
      <p>This section hasn&apos;t been built yet.</p>
    </div>
  )
}
