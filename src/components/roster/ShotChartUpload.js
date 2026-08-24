'use client'

import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

const ShotChartUpload = forwardRef(function ShotChartUpload({ initialUrl }, ref) {
  const [url, setUrl] = useState(initialUrl || '')
  const [file, setFile] = useState(null)
  const [removed, setRemoved] = useState(false)
  const fileInputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    getResult() {
      if (removed) return { removed: true }
      if (file) return { file }
      return { unchanged: true }
    },
  }))

  function handleChange(e) {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    setFile(f)
    setRemoved(false)
    setUrl(URL.createObjectURL(f))
  }

  function handleRemove() {
    setFile(null)
    setUrl('')
    setRemoved(true)
  }

  return (
    <div>
      {url ? (
        <>
          <div className="crop-frame" style={{ height: 'auto', padding: '6px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="Shot chart" style={{ width: '100%', display: 'block' }} />
          </div>
          <div className="photo-controls">
            <button type="button" className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>
              Change
            </button>
            <button type="button" className="btn btn-ghost btn-danger" onClick={handleRemove}>
              Remove
            </button>
          </div>
        </>
      ) : (
        <div className="photo-placeholder" style={{ height: '120px' }}>
          <button type="button" className="btn" onClick={() => fileInputRef.current.click()}>
            + Add shot chart
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </div>
  )
})

export default ShotChartUpload
