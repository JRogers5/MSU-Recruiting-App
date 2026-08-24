'use client'

import { useRef, useState } from 'react'
import { POSITIONS, CLASS_OPTIONS } from './constants'
import PhotoUpload from './PhotoUpload'

export default function PlayerModal({ player, presetPosition, onSave, onClose, onToast }) {
  const isNew = !player
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
      position: fd.get('position'),
      class: fd.get('class'),
      elig_remaining: Number(fd.get('elig_remaining')) || 0,
      height: fd.get('height') || '',
      weight: fd.get('weight') ? Number(fd.get('weight')) : null,
      hometown: fd.get('hometown') || '',
      prior_school: fd.get('prior_school') || '',
      exempt: fd.get('exempt') === 'on',
    }
    setSaving(true)
    const photoResult = await photoRef.current.getResult()
    await onSave({ id: player?.id, isNew, values, photoResult })
    setSaving(false)
  }

  return (
    <div
      className="modal-backdrop"
      id="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target.id === 'modal-backdrop') onClose()
      }}
    >
      <div className="modal">
        <h2>{isNew ? 'Add player' : 'Edit player'}</h2>
        <form onSubmit={handleSubmit}>
          <PhotoUpload ref={photoRef} initialPhotoUrl={player?.photo_url} />

          <div className="form-grid" style={{ marginTop: '18px' }}>
            <div className="field full">
              <label>Name *</label>
              <input name="name" required defaultValue={player?.name || ''} />
            </div>

            <div className="field">
              <label>Position *</label>
              <select name="position" defaultValue={player?.position || presetPosition || POSITIONS[0]}>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Class</label>
              <select name="class" defaultValue={player?.class || CLASS_OPTIONS[0]}>
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Eligibility years remaining</label>
              <input
                type="number"
                min="0"
                max="5"
                name="elig_remaining"
                defaultValue={player?.elig_remaining ?? 0}
              />
            </div>

            <div className="field">
              <label>Height</label>
              <input name="height" placeholder="6'5&quot;" defaultValue={player?.height || ''} />
            </div>

            <div className="field">
              <label>Weight (lb)</label>
              <input type="number" name="weight" defaultValue={player?.weight ?? ''} />
            </div>

            <div className="field">
              <label>Hometown</label>
              <input name="hometown" defaultValue={player?.hometown || ''} />
            </div>

            <div className="field full">
              <label>Prior school (if transfer)</label>
              <input name="prior_school" defaultValue={player?.prior_school || ''} />
            </div>

            <div className="field full checkbox-field">
              <input
                type="checkbox"
                id="exempt-check"
                name="exempt"
                defaultChecked={player?.exempt || false}
              />
              <label htmlFor="exempt-check">
                Exempt from roster limit (e.g. DSA-protected)
              </label>
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
