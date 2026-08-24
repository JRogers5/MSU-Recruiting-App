'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import 'cropperjs/dist/cropper.css'

const PhotoUpload = forwardRef(function PhotoUpload({ initialPhotoUrl }, ref) {
  const [photoSrc, setPhotoSrc] = useState(initialPhotoUrl || '')
  const [removed, setRemoved] = useState(false)
  const [cropperReady, setCropperReady] = useState(false)
  const imgRef = useRef(null)
  const cropperRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!photoSrc || !imgRef.current) return
    let cancelled = false

    async function init() {
      const { default: Cropper } = await import('cropperjs')
      if (cancelled || !imgRef.current) return
      cropperRef.current?.destroy()
      try {
        cropperRef.current = new Cropper(imgRef.current, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 1,
          cropBoxResizable: false,
          cropBoxMovable: false,
          background: false,
          guides: false,
          center: false,
          highlight: false,
          zoomOnWheel: true,
        })
        setCropperReady(true)
      } catch {
        cropperRef.current = null
        setCropperReady(false)
      }
    }

    if (imgRef.current.complete && imgRef.current.naturalWidth) {
      init()
    } else {
      imgRef.current.addEventListener('load', init, { once: true })
    }

    return () => {
      cancelled = true
      cropperRef.current?.destroy()
      cropperRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoSrc])

  useImperativeHandle(ref, () => ({
    getResult() {
      if (removed) return Promise.resolve({ removed: true })
      if (cropperRef.current) {
        return new Promise((resolve) => {
          cropperRef.current
            .getCroppedCanvas({ width: 240, height: 240 })
            .toBlob((blob) => resolve({ blob }), 'image/jpeg', 0.85)
        })
      }
      return Promise.resolve({ unchanged: true })
    },
  }))

  function handleFileChange(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setRemoved(false)
      setPhotoSrc(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleRemove() {
    cropperRef.current?.destroy()
    cropperRef.current = null
    setCropperReady(false)
    setPhotoSrc('')
    setRemoved(true)
  }

  return (
    <div id="photo-section">
      {photoSrc ? (
        <>
          <div className="crop-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} src={photoSrc} alt="Headshot" />
          </div>
          <div className="photo-controls">
            <span className="mini-label">Zoom</span>
            <input
              type="range"
              min="100"
              max="300"
              defaultValue="100"
              onChange={(e) => cropperRef.current?.zoomTo(Number(e.target.value) / 100)}
            />
            <button type="button" className="btn btn-ghost" onClick={() => fileInputRef.current.click()}>
              Change photo
            </button>
            <button type="button" className="btn btn-ghost btn-danger" onClick={handleRemove}>
              Remove
            </button>
          </div>
          {!cropperReady && (
            <p className="photo-hint">Photo saved — crop adjustment isn&apos;t available right now.</p>
          )}
        </>
      ) : (
        <div className="photo-placeholder">
          <button type="button" className="btn" onClick={() => fileInputRef.current.click()}>
            + Add headshot
          </button>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  )
})

export default PhotoUpload
