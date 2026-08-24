export async function insertPlayer(supabase, player) {
  const { data, error } = await supabase.from('players').insert(player).select().single()
  if (error) throw error
  return data
}

export async function updatePlayer(supabase, id, patch) {
  const { data, error } = await supabase
    .from('players')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePlayerRow(supabase, id) {
  const { error } = await supabase.from('players').delete().eq('id', id)
  if (error) throw error
}

export async function deleteAllPlayers(supabase) {
  const { error } = await supabase.from('players').delete().not('id', 'is', null)
  if (error) throw error
}

export async function bulkInsertPlayers(supabase, players) {
  const { data, error } = await supabase.from('players').insert(players).select()
  if (error) throw error
  return data
}

export async function reorderColumn(supabase, updates) {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('players').update({ sort_order }).eq('id', id)
    )
  )
}

export async function updateSettingsRow(supabase, patch) {
  const { data, error } = await supabase
    .from('settings')
    .update(patch)
    .eq('id', true)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function insertContact(supabase, contact) {
  const { data, error } = await supabase.from('contacts').insert(contact).select().single()
  if (error) throw error
  return data
}

export async function updateContact(supabase, id, patch) {
  const { data, error } = await supabase
    .from('contacts')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteContactRow(supabase, id) {
  const { error } = await supabase.from('contacts').delete().eq('id', id)
  if (error) throw error
}

export async function bulkInsertContacts(supabase, contacts) {
  const { data, error } = await supabase.from('contacts').insert(contacts).select()
  if (error) throw error
  return data
}

export async function uploadPlayerPhoto(supabase, playerId, blob) {
  const path = `${playerId}.jpg`
  const { error } = await supabase.storage
    .from('player-photos')
    .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from('player-photos').getPublicUrl(path)
  return `${publicUrl}?v=${Date.now()}`
}

export async function insertProspect(supabase, prospect) {
  const { data, error } = await supabase.from('prospects').insert(prospect).select().single()
  if (error) throw error
  return data
}

export async function updateProspect(supabase, id, patch) {
  const { data, error } = await supabase
    .from('prospects')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProspectRow(supabase, id) {
  const { error } = await supabase.from('prospects').delete().eq('id', id)
  if (error) throw error
}

export async function reorderProspectColumn(supabase, updates) {
  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase.from('prospects').update({ sort_order }).eq('id', id)
    )
  )
}

export async function uploadProspectPhoto(supabase, prospectId, blob) {
  const path = `${prospectId}.jpg`
  const { error } = await supabase.storage
    .from('prospect-photos')
    .upload(path, blob, { upsert: true, contentType: 'image/jpeg' })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from('prospect-photos').getPublicUrl(path)
  return `${publicUrl}?v=${Date.now()}`
}

export async function uploadProspectShotChart(supabase, prospectId, file) {
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${prospectId}-shotchart.${ext}`
  const { error } = await supabase.storage
    .from('prospect-photos')
    .upload(path, file, { upsert: true })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from('prospect-photos').getPublicUrl(path)
  return `${publicUrl}?v=${Date.now()}`
}
