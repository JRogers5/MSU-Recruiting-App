export function initials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] || ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function filteredSortedPlayers(players, filters, sortKey, sortDir) {
  let list = players.filter((p) => {
    if (filters.pos !== 'all' && p.position !== filters.pos) return false
    if (filters.cls !== 'all' && p.class !== filters.cls) return false
    if (filters.q) {
      const q = filters.q.toLowerCase()
      const hay = [p.name, p.hometown, p.prior_school].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  list = [...list].sort((a, b) => {
    let av = a[sortKey]
    let bv = b[sortKey]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av == null) av = ''
    if (bv == null) bv = ''
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  return list
}

export function forecastFor(players, positions, yearsOut) {
  const stillHere = players.filter((p) => (p.elig_remaining ?? 0) - yearsOut >= 1)
  const leavingAfter = players.filter((p) => (p.elig_remaining ?? 0) - yearsOut === 1)
  const byPos = positions.map((pos) => ({
    pos,
    count: stillHere.filter((p) => p.position === pos).length,
  }))
  return { stillHere, leavingAfter, byPos }
}

export function rosterCountedCount(players) {
  return players.filter((p) => !p.exempt).length
}
