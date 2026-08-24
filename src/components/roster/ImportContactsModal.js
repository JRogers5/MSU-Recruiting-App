'use client'

import { useRef, useState } from 'react'
import { parseCSV } from '@/lib/csv'

const NAME_KEYS = ['name']
const CATEGORY_KEYS = ['category', 'role', 'type']
const ORG_KEYS = ['organization', 'org', 'school', 'company']
const PHONE_KEYS = ['phone', 'phone number', 'phone#', 'number', 'mobile']

function pick(row, keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== '') return row[k]
  }
  return ''
}

export default function ImportContactsModal({ onImport, onClose, onToast }) {
  const [rows, setRows] = useState(null)
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef(null)

  async function handleFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    setFileName(file.name)
    try {
      const text = await file.text()
      const parsed = parseCSV(text)
      const mapped = parsed
        .map((row) => ({
          name: pick(row, NAME_KEYS),
          category: pick(row, CATEGORY_KEYS),
          organization: pick(row, ORG_KEYS),
          phone: pick(row, PHONE_KEYS),
        }))
        .filter((c) => c.name)
      if (mapped.length === 0) {
        onToast('No contacts found — make sure the CSV has a "Name" column')
        setRows(null)
        return
      }
      setRows(mapped)
    } catch (err) {
      console.error(err)
      onToast('Could not read that file')
      setRows(null)
    }
  }

  async function handleImport() {
    setImporting(true)
    await onImport(rows)
    setImporting(false)
  }

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal">
        <h2>Import contacts</h2>
        <p className="desc" style={{ marginBottom: '14px' }}>
          Upload a CSV file with a header row. Recognized columns: Name, Category,
          Organization, Phone.
        </p>

        {!rows ? (
          <button className="btn" onClick={() => fileInputRef.current.click()}>
            Choose CSV file
          </button>
        ) : (
          <>
            <p className="desc" style={{ marginBottom: '10px' }}>
              {fileName} — {rows.length} contact{rows.length === 1 ? '' : 's'} found
            </p>
            <div className="table-wrap" style={{ maxHeight: '260px', overflowY: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Organization</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 50).map((r, i) => (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.category || '—'}</td>
                      <td>{r.organization || '—'}</td>
                      <td className="mono">{r.phone || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn btn-ghost"
              style={{ marginTop: '10px' }}
              onClick={() => {
                setRows(null)
                setFileName('')
              }}
            >
              Choose a different file
            </button>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          style={{ display: 'none' }}
          onChange={handleFile}
        />

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={importing}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleImport}
            disabled={!rows || importing}
          >
            {importing ? 'Importing…' : `Import${rows ? ` ${rows.length}` : ''}`}
          </button>
        </div>
      </div>
    </div>
  )
}
