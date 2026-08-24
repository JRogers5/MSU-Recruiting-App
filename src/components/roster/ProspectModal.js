'use client'

import { useRef, useState } from 'react'
import { RECRUITING_POSITION_GROUPS } from './constants'
import PhotoUpload from './PhotoUpload'

export default function ProspectModal({ prospect, presetPositionGroup, onSave, onClose, onToast }) {
  const isNew = !prospect
  const [saving, setSaving] = useState(false)
  const photoRef = useRef(null)

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name')?.trim()
    if (!name) {
      onToast('Name is required')
      return
    }
    const values = {
      name,
      position_group: fd.get('position_group'),
      high_school: fd.get('high_school')?.trim() || '',
      aau_team: fd.get('aau_team')?.trim() || '',
      hometown: fd.get('hometown')?.trim() || '',
      height: fd.get('height') || '',
      weight: fd.get('weight') ? Number(fd.get('weight')) : null,
      synergy_link: fd.get('synergy_link')?.trim() || '',
      highlight_link: fd.get('highlight_link')?.trim() || '',
    }
    setSaving(true)
    const photoResult = await photoRef.current.getResult()
    await onSave({ id: prospect?.id, isNew, values, photoResult })
    setSaving(false)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <h2>{isNew ? 'Add prospect' : 'Edit prospect'}</h2>
        <form onSubmit={handleSubmit}>
          <PhotoUpload ref={photoRef} initialPhotoUrl={prospect?.photo_url} />

          <div className="form-grid" style={{ marginTop: '18px' }}>
            <div className="field full">
              <label>Name *</label>
              <input name="name" required defaultValue={prospect?.name || ''} />
            </div>

            <div className="field">
              <label>Position group *</label>
              <select
                name="position_group"
                defaultValue={prospect?.position_group || presetPositionGroup || RECRUITING_POSITION_GROUPS[0]}
              >
                {RECRUITING_POSITION_GROUPS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>High school</label>
              <input name="high_school" defaultValue={prospect?.high_school || ''} />
            </div>

            <div className="field">
              <label>AAU team</label>
              <input name="aau_team" defaultValue={prospect?.aau_team || ''} />
            </div>

            <div className="field">
              <label>Height</label>
              <input name="height" placeholder="6'5&quot;" defaultValue={prospect?.height || ''} />
            </div>

            <div className="field">
              <label>Weight (lb)</label>
              <input type="number" name="weight" defaultValue={prospect?.weight ?? ''} />
            </div>

            <div className="field full">
              <label>Hometown</label>
              <input name="hometown" defaultValue={prospect?.hometown || ''} />
            </div>

            <div className="field full">
              <label>Film links</label>
            </div>

            <div className="field">
              <label>Synergy link</label>
              <input
                type="url"
                name="synergy_link"
                placeholder="https://…"
                defaultValue={prospect?.synergy_link || ''}
              />
            </div>

            <div className="field">
              <label>Highlight link</label>
              <input
                type="url"
                name="highlight_link"
                placeholder="https://…"
                defaultValue={prospect?.highlight_link || ''}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
