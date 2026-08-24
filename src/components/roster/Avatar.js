'use client'

import { initials } from './utils'

export default function Avatar({ player, className = '' }) {
  if (player.photo_url) {
    return (
      <div
        className={`avatar ${className}`}
        style={{
          backgroundImage: `url('${player.photo_url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    )
  }
  return <div className={`avatar ${className}`}>{initials(player.name)}</div>
}
