'use client'

import { useMemo, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { POSITIONS, PAGE_LABELS } from './constants'
import {
  insertPlayer,
  updatePlayer,
  deletePlayerRow,
  deleteAllPlayers,
  bulkInsertPlayers,
  reorderColumn,
  updateSettingsRow,
  uploadPlayerPhoto,
  insertContact,
  updateContact,
  deleteContactRow,
  bulkInsertContacts,
} from './api'
import NavMenu from './NavMenu'
import Header from './Header'
import Toolbar from './Toolbar'
import Board from './Board'
import Table from './Table'
import Forecast from './Forecast'
import PlayerModal from './PlayerModal'
import SettingsModal from './SettingsModal'
import QuickLinks from './QuickLinks'
import RecruitingServices from './RecruitingServices'
import Toast from './Toast'
import EmptyState from './EmptyState'
import PlaceholderPage from './PlaceholderPage'
import ContactsPage from './ContactsPage'
import AddContactChoiceModal from './AddContactChoiceModal'
import ContactModal from './ContactModal'
import ImportContactsModal from './ImportContactsModal'

const SAMPLE_PLAYERS = [
  { position: 'PG', name: 'Jalen Carter', class: 'Jr', elig_remaining: 2, height: '6\'1"', weight: 180, hometown: 'Jackson, MS', prior_school: '', exempt: false },
  { position: 'SG', name: 'Marcus Reed', class: 'So', elig_remaining: 3, height: '6\'4"', weight: 195, hometown: 'Memphis, TN', prior_school: '', exempt: false },
  { position: 'SF', name: 'DeAndre Wallace', class: 'Sr', elig_remaining: 1, height: '6\'7"', weight: 210, hometown: 'Atlanta, GA', prior_school: 'Georgia Tech', exempt: false },
  { position: 'PF', name: 'Isaiah Brooks', class: 'RS-Jr', elig_remaining: 2, height: '6\'9"', weight: 230, hometown: 'Birmingham, AL', prior_school: '', exempt: false },
  { position: 'C', name: 'Malik Thompson', class: 'Grad', elig_remaining: 1, height: '6\'11"', weight: 250, hometown: 'New Orleans, LA', prior_school: 'Tulane', exempt: false },
  { position: 'SG', name: 'Trey Williams', class: 'Fr', elig_remaining: 4, height: '6\'3"', weight: 185, hometown: 'Starkville, MS', prior_school: '', exempt: false },
]

export default function RosterApp({
  initialPlayers,
  initialSettings,
  initialContacts,
  role,
  staffName,
  logoutAction,
}) {
  const supabase = useMemo(() => createClient(), [])
  const isAdmin = role === 'admin'

  const [players, setPlayers] = useState(initialPlayers)
  const [settings, setSettings] = useState(initialSettings)
  const [contacts, setContacts] = useState(initialContacts)
  const [addChoiceOpen, setAddChoiceOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [editingContactId, setEditingContactId] = useState(null)
  const [importOpen, setImportOpen] = useState(false)
  const [page, setPage] = useState('admin')
  const [view, setView] = useState('board')
  const [filters, setFilters] = useState({ q: '', pos: 'all', cls: 'all' })
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [presetPosition, setPresetPosition] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [saveFailed, setSaveFailed] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const toastTimer = useRef(null)

  function showToast(msg) {
    setToastMsg(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastMsg(''), 2600)
  }

  function openModal(id, pos) {
    setEditingId(id || null)
    setPresetPosition(pos || null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingId(null)
    setPresetPosition(null)
  }

  async function savePlayer({ id, isNew, values, photoResult }) {
    try {
      const playerId = id || crypto.randomUUID()
      let photo_url
      if (photoResult?.blob) {
        photo_url = await uploadPlayerPhoto(supabase, playerId, photoResult.blob)
      } else if (photoResult?.removed) {
        photo_url = null
      }

      if (isNew) {
        const order = players.filter((p) => p.position === values.position).length
        const inserted = await insertPlayer(supabase, {
          id: playerId,
          ...values,
          sort_order: order,
          photo_url: photo_url ?? null,
        })
        setPlayers((prev) => [...prev, inserted])
        showToast('Player added')
      } else {
        const patch = { ...values }
        if (photo_url !== undefined) patch.photo_url = photo_url
        const updated = await updatePlayer(supabase, id, patch)
        setPlayers((prev) => prev.map((p) => (p.id === id ? updated : p)))
        showToast('Player updated')
      }
      setSaveFailed(false)
      closeModal()
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not save — check your connection and try again')
    }
  }

  async function deletePlayer(player) {
    if (!confirm(`Remove ${player.name} from the roster?`)) return
    try {
      await deletePlayerRow(supabase, player.id)
      setPlayers((prev) => prev.filter((p) => p.id !== player.id))
      showToast('Player removed')
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not remove player')
    }
  }

  function reorderWithinColumn(pos, draggedId, targetId, before) {
    const colIds = players
      .filter((p) => p.position === pos)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name))
      .map((p) => p.id)
      .filter((id) => id !== draggedId)

    let insertAt = colIds.length
    if (targetId) {
      const idx = colIds.indexOf(targetId)
      insertAt = before ? idx : idx + 1
    }
    colIds.splice(insertAt, 0, draggedId)
    const updates = colIds.map((id, i) => ({ id, sort_order: i }))

    setPlayers((prev) =>
      prev.map((p) => {
        const u = updates.find((u) => u.id === p.id)
        return u ? { ...p, sort_order: u.sort_order } : p
      })
    )

    reorderColumn(supabase, updates)
      .then(() => setSaveFailed(false))
      .catch((err) => {
        console.error(err)
        setSaveFailed(true)
        showToast('Could not save new order')
      })
  }

  async function updateTeamName(name) {
    try {
      const updated = await updateSettingsRow(supabase, { team_name: name })
      setSettings(updated)
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not save team name')
    }
  }

  async function updateSettings(patch) {
    try {
      const updated = await updateSettingsRow(supabase, patch)
      setSettings(updated)
      setSaveFailed(false)
      showToast('Settings saved')
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not save settings')
    }
  }

  function exportRoster() {
    const payload = { exportedAt: new Date().toISOString(), settings, players }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roster-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Backup exported')
  }

  async function importRosterFile(file) {
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      if (!Array.isArray(data.players)) {
        showToast('That file doesn\'t look like a roster backup')
        return
      }
      if (players.length > 0 && !confirm('Importing will replace the current roster. Continue?')) {
        return
      }
      await deleteAllPlayers(supabase)
      const toInsert = data.players
        .filter((p) => p.name && POSITIONS.includes(p.position))
        .map((p, i) => ({
          id: crypto.randomUUID(),
          name: p.name,
          position: p.position,
          class: p.class || p.cls || null,
          elig_remaining: Number(p.elig_remaining ?? p.eligRemaining) || 0,
          height: p.height || '',
          weight: p.weight ? Number(p.weight) : null,
          hometown: p.hometown || '',
          prior_school: p.prior_school || p.priorSchool || '',
          exempt: !!p.exempt,
          photo_url: p.photo_url || null,
          sort_order: p.sort_order ?? p.order ?? i,
        }))
      const inserted = toInsert.length ? await bulkInsertPlayers(supabase, toInsert) : []
      setPlayers(inserted)
      if (data.settings) {
        const patch = {}
        if (data.settings.team_name || data.settings.teamName)
          patch.team_name = data.settings.team_name || data.settings.teamName
        if (data.settings.roster_limit || data.settings.rosterLimit)
          patch.roster_limit = data.settings.roster_limit || data.settings.rosterLimit
        if (Object.keys(patch).length) {
          const updated = await updateSettingsRow(supabase, patch)
          setSettings(updated)
        }
      }
      showToast('Roster imported')
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not import that file')
    }
  }

  async function clearRoster() {
    try {
      await deleteAllPlayers(supabase)
      setPlayers([])
      showToast('Roster cleared')
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not clear roster')
    }
  }

  async function loadSampleData() {
    try {
      const toInsert = SAMPLE_PLAYERS.map((p, i) => ({
        id: crypto.randomUUID(),
        ...p,
        photo_url: null,
        sort_order: 0,
      }))
      const inserted = await bulkInsertPlayers(supabase, toInsert)
      setPlayers(inserted)
      showToast('Sample roster loaded')
    } catch (err) {
      console.error(err)
      showToast('Could not load sample roster')
    }
  }

  function openManualAdd() {
    setEditingContactId(null)
    setAddChoiceOpen(false)
    setContactModalOpen(true)
  }

  function openEditContact(contact) {
    setEditingContactId(contact.id)
    setContactModalOpen(true)
  }

  function closeContactModal() {
    setContactModalOpen(false)
    setEditingContactId(null)
  }

  async function saveContact({ id, isNew, values }) {
    try {
      if (isNew) {
        const inserted = await insertContact(supabase, values)
        setContacts((prev) => [...prev, inserted])
        showToast('Contact added')
      } else {
        const updated = await updateContact(supabase, id, values)
        setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)))
        showToast('Contact updated')
      }
      setSaveFailed(false)
      closeContactModal()
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not save contact')
    }
  }

  async function deleteContact(contact) {
    if (!confirm(`Remove ${contact.name} from contacts?`)) return
    try {
      await deleteContactRow(supabase, contact.id)
      setContacts((prev) => prev.filter((c) => c.id !== contact.id))
      showToast('Contact removed')
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not remove contact')
    }
  }

  async function importContacts(rows) {
    try {
      const inserted = await bulkInsertContacts(supabase, rows)
      setContacts((prev) => [...prev, ...inserted])
      showToast(`Imported ${inserted.length} contact${inserted.length === 1 ? '' : 's'}`)
      setImportOpen(false)
      setSaveFailed(false)
    } catch (err) {
      console.error(err)
      setSaveFailed(true)
      showToast('Could not import contacts')
    }
  }

  const editingPlayer = editingId ? players.find((p) => p.id === editingId) : null
  const editingContact = editingContactId
    ? contacts.find((c) => c.id === editingContactId)
    : null

  return (
    <div className="roster-root">
      <div id="app">
        <NavMenu page={page} setPage={setPage} staffName={staffName} role={role} logoutAction={logoutAction} />

        {page === 'admin' ? (
          <>
            <Header
              teamName={settings.team_name}
              isAdmin={isAdmin}
              onChangeTeamName={updateTeamName}
            />

            {saveFailed && (
              <div className="save-warning">
                <span>Could not save — export a backup now to avoid losing changes.</span>
                <button className="btn" onClick={exportRoster}>
                  Export backup
                </button>
              </div>
            )}

            <Toolbar
              view={view}
              setView={setView}
              isAdmin={isAdmin}
              onAdd={() => openModal(null, null)}
              onSettings={() => setSettingsOpen(true)}
            />

            {players.length === 0 ? (
              <EmptyState
                isAdmin={isAdmin}
                onAdd={() => openModal(null, null)}
                onLoadSample={loadSampleData}
              />
            ) : view === 'board' ? (
              <Board
                players={players}
                isAdmin={isAdmin}
                onEdit={openModal}
                onDelete={deletePlayer}
                onReorder={reorderWithinColumn}
              />
            ) : view === 'table' ? (
              <Table
                players={players}
                filters={filters}
                setFilters={setFilters}
                sortKey={sortKey}
                sortDir={sortDir}
                setSort={(k, d) => {
                  setSortKey(k)
                  setSortDir(d)
                }}
                isAdmin={isAdmin}
                onEdit={openModal}
                onDelete={deletePlayer}
              />
            ) : (
              <Forecast players={players} />
            )}

            <RecruitingServices />
            <QuickLinks />
            <p className="footer-note">
              Roster data is shared with all signed-in staff. Only admins can make changes.
            </p>
          </>
        ) : page === 'contacts' ? (
          <ContactsPage
            contacts={contacts}
            isAdmin={isAdmin}
            onAdd={() => setAddChoiceOpen(true)}
            onEdit={openEditContact}
            onDelete={deleteContact}
          />
        ) : (
          <PlaceholderPage label={PAGE_LABELS[page]} />
        )}
      </div>

      {modalOpen && (
        <PlayerModal
          player={editingPlayer}
          presetPosition={presetPosition}
          onSave={savePlayer}
          onClose={closeModal}
          onToast={showToast}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          settings={settings}
          isAdmin={isAdmin}
          onSave={updateSettings}
          onClose={() => setSettingsOpen(false)}
          onExport={exportRoster}
          onImport={importRosterFile}
          onClear={clearRoster}
        />
      )}

      {addChoiceOpen && (
        <AddContactChoiceModal
          onManual={openManualAdd}
          onImport={() => {
            setAddChoiceOpen(false)
            setImportOpen(true)
          }}
          onClose={() => setAddChoiceOpen(false)}
        />
      )}

      {contactModalOpen && (
        <ContactModal
          contact={editingContact}
          onSave={saveContact}
          onClose={closeContactModal}
          onToast={showToast}
        />
      )}

      {importOpen && (
        <ImportContactsModal
          onImport={importContacts}
          onClose={() => setImportOpen(false)}
          onToast={showToast}
        />
      )}

      <Toast message={toastMsg} />
    </div>
  )
}
