import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ProjectImage } from "@/data/projects";

interface Props {
  images: ProjectImage[];
  index: number;
  onClose: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const clampedScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

type Transform = { scale: number; x: number; y: number };
const IDENTITY: Transform = { scale: 1, x: 0, y: 0 };

export default function ProjectLightbox({ images, index, onClose }: Props) {
  const [idx, setIdx] = useState(index);
  const [dir, setDir] = useState(1);
  const [zoomMap, setZoomMap] = useState<Record<number, Transform>>({});
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const panStart = useRef<{
    x: number;
    y: number;
    tx: number;
    ty: number;
  } | null>(null);
  const swipeStart = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const t: Transform = zoomMap[idx] ?? IDENTITY;

  const setT = useCallback(
    (nt: Transform) => {
      setZoomMap((m) => ({ ...m, [idx]: clampPan(nt) }));
    },
    [idx],
  );

  const clampPan = (nt: Transform): Transform => {
    if (nt.scale <= 1) return { scale: nt.scale, x: 0, y: 0 };
    const el = imgRef.current;
    if (!el) return nt;
    const maxX = (el.offsetWidth * (nt.scale - 1)) / 2;
    const maxY = (el.offsetHeight * (nt.scale - 1)) / 2;
    return {
      scale: nt.scale,
      x: Math.min(maxX, Math.max(-maxX, nt.x)),
      y: Math.min(maxY, Math.max(-maxY, nt.y)),
    };
  };

  const go = useCallback(
    (direction: number) => {
      setDir(direction);
      setIdx((i) => (i + direction + images.length) % images.length);
    },
    [images.length],
  );
  const close = useCallback(() => onClose(), [onClose]);
  const zoomTo = useCallback(
    (s: number) => setT({ scale: clampedScale(s), x: 0, y: 0 }),
    [setT],
  );

  // Keyboard: Esc close, arrows navigate (capture phase so the modal's own
  // key handling doesn't swallow these while the lightbox is open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        go(-1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [close, go]);

  // Reset per-image pan/zoom whenever the image changes.
  useEffect(() => {
    if (t.scale !== 1 || t.x !== 0 || t.y !== 0) {
      // keep stored zoom per image; do nothing on navigate so zoom persists
    }
  }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: t.scale,
      };
      panStart.current = null;
      swipeStart.current = null;
    } else if (pointers.current.size === 1) {
      if (t.scale > 1) {
        panStart.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
      } else {
        swipeStart.current = e.clientX;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist > 0) {
        const scale = clampedScale(
          pinchStart.current.scale * (dist / pinchStart.current.dist),
        );
        setT({ scale, x: 0, y: 0 });
      }
    } else if (pointers.current.size === 1 && panStart.current) {
      const p = panStart.current;
      setT({
        scale: t.scale,
        x: p.tx + (e.clientX - p.x),
        y: p.ty + (e.clientY - p.y),
      });
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size === 0) {
      if (swipeStart.current !== null && t.scale <= 1) {
        const dx = e.clientX - swipeStart.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }
      pinchStart.current = null;
      panStart.current = null;
      swipeStart.current = null;
    }
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    zoomTo(t.scale * (e.deltaY < 0 ? 1.15 : 0.85));
  };

  const image = images[idx];

  if (!image) return null;

  return createPortal(
    <div
      className="project-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      <div
        className="project-lightbox-viewport"
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          key={image.src}
          className={`project-lightbox-stage ${dir === 1 ? "stage-next" : "stage-prev"}`}
        >
          <img
            ref={imgRef}
            src={image.src}
            alt={image.alt}
            className="project-lightbox-img"
            style={{
              transform: `translate(${t.x}px, ${t.y}px) scale(${t.scale})`,
            }}
            draggable={false}
          />
        </div>
      </div>

      <button
        type="button"
        className="project-lightbox-close"
        onClick={close}
        aria-label="Close image"
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="project-lightbox-nav nav-prev"
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="project-lightbox-nav nav-next"
            onClick={() => go(1)}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div className="project-lightbox-controls">
        <button
          type="button"
          onClick={() => zoomTo(t.scale / 1.25)}
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setT(IDENTITY)}
          aria-label="Reset zoom"
        >
          {Math.round(t.scale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => zoomTo(t.scale * 1.25)}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      <p className="project-lightbox-counter">
        {idx + 1} / {images.length}
      </p>
    </div>,
    document.body,
  );
}
