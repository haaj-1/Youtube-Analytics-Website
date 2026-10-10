import { useRef, useState } from 'react';
import { FiImage, FiLink, FiUploadCloud, FiX } from 'react-icons/fi';
import { Input } from '../../ui';
import { cx } from '../../../lib/cx';

const MAX_BYTES = 5 * 1024 * 1024;

export default function ThumbnailInput({ file, url, previewUrl, onFile, onUrl, onError }) {
  const [mode, setMode] = useState(url ? 'url' : 'upload');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const accept = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) return onError('Thumbnail must be an image file.');
    if (f.size > MAX_BYTES) return onError('Thumbnail must be under 5 MB.');
    onFile(f);
  };

  const hasImage = !!(file || url);

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-white/10 bg-ink-850 p-0.5 text-xs" role="tablist" aria-label="Thumbnail source">
        {[
          { id: 'upload', label: 'Upload', icon: FiUploadCloud },
          { id: 'url', label: 'Paste URL', icon: FiLink },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cx('flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-colors', mode === id ? 'bg-white/10 text-white' : 'text-ink-300 hover:text-white')}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {hasImage ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-850 p-2.5">
          <img src={previewUrl} alt="" className="h-12 w-20 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">{file ? file.name : url}</p>
            <p className="text-xs text-ink-400">{file ? `${(file.size / 1024).toFixed(0)} KB · uploaded` : 'from URL'}</p>
          </div>
          <button type="button" onClick={() => { onFile(null); onUrl(''); }} aria-label="Remove thumbnail" className="rounded-lg p-2 text-ink-300 hover:bg-white/[0.06] hover:text-white">
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ) : mode === 'upload' ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); accept(e.dataTransfer.files?.[0]); }}
          className={cx(
            'flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-7 text-center transition-colors',
            dragging ? 'border-brand-500/70 bg-brand-500/[0.06]' : 'border-white/15 bg-ink-850/50 hover:border-white/25 hover:bg-ink-850',
          )}
        >
          <FiImage className="mb-2 h-5 w-5 text-ink-300" />
          <span className="text-sm text-white">Drop an image or <span className="text-brand-400">browse</span></span>
          <span className="mt-1 text-xs text-ink-400">PNG or JPG, 1280×720 recommended, up to 5 MB</span>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => accept(e.target.files?.[0])} tabIndex={-1} />
        </button>
      ) : (
        <Input
          type="url"
          inputMode="url"
          placeholder="https://i.ytimg.com/vi/…/maxresdefault.jpg"
          aria-label="Thumbnail URL"
          onBlur={(e) => e.target.value && onUrl(e.target.value.trim())}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
        />
      )}
      <p className="mt-2 text-xs text-ink-400">Optional — the CNN scores colour, contrast and composition. Without one, thumbnail impact is neutral.</p>
    </div>
  );
}
