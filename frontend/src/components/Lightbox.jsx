import { useEffect } from 'react'

// Affiche une image en grand par-dessus la page.
// images : liste d'adresses, index : image affichée, onChange : change d'image
function Lightbox({ images, index, alt, labels, onClose, onChange }) {
  const total = images.length

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && total > 1) onChange((index - 1 + total) % total)
      else if (e.key === 'ArrowRight' && total > 1) onChange((index + 1) % total)
    }

    window.addEventListener('keydown', onKey)

    // La page derrière ne défile plus tant que l'image est ouverte
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [index, total, onClose, onChange])

  const buttonClass =
    'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/25'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={labels.dialog}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label={labels.close}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className={buttonClass + ' absolute right-4 top-4'}
      >
        ✕
      </button>

      {total > 1 && (
        <button
          type="button"
          aria-label={labels.previous}
          onClick={(e) => {
            e.stopPropagation()
            onChange((index - 1 + total) % total)
          }}
          className={buttonClass + ' absolute left-4 top-1/2 -translate-y-1/2'}
        >
          ‹
        </button>
      )}

      <img
        src={images[index]}
        alt={alt + ' (' + (index + 1) + '/' + total + ')'}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-lg object-contain"
      />

      {total > 1 && (
        <button
          type="button"
          aria-label={labels.next}
          onClick={(e) => {
            e.stopPropagation()
            onChange((index + 1) % total)
          }}
          className={buttonClass + ' absolute right-4 top-1/2 -translate-y-1/2'}
        >
          ›
        </button>
      )}

      {total > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {total}
        </p>
      )}
    </div>
  )
}

export default Lightbox