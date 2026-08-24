'use client'

import { useState } from 'react'

export default function ContactModal({ contact, onSave, onClose, onToast }) {
  const isNew = !contact
  const [saving, setSaving] = useState(false)

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
      category: fd.get('category')?.trim() || '',
      organization: fd.get('organization')?.trim() || '',
      phone: fd.get('phone')?.trim() || '',
    }
    setSaving(true)
    await onSave({ id: contact?.id, isNew, values })
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
        <h2>{isNew ? 'Add contact' : 'Edit contact'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field full">
              <label>Name *</label>
              <input name="name" required defaultValue={contact?.name || ''} />
            </div>
            <div className="field">
              <label>Category</label>
              <input
                name="category"
                placeholder="HS Coach, AAU Coach, Parent…"
                defaultValue={contact?.category || ''}
              />
            </div>
            <div className="field">
              <label>Organization</label>
              <input name="organization" defaultValue={contact?.organization || ''} />
            </div>
            <div className="field full">
              <label>Phone number</label>
              <input name="phone" type="tel" defaultValue={contact?.phone || ''} />
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
