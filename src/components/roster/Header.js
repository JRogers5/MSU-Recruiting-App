'use client'

import { useState } from 'react'
import { DEFAULT_SETTINGS } from './constants'

export default function Header({ teamName, isAdmin, onChangeTeamName }) {
  const [value, setValue] = useState(teamName)

  return (
    <div className="header">
      <input
        className="team-name-input"
        value={value}
        readOnly={!isAdmin}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          const next = e.target.value.trim() || DEFAULT_SETTINGS.teamName
          setValue(next)
          if (isAdmin && next !== teamName) onChangeTeamName(next)
        }}
      />
    </div>
  )
}
