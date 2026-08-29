import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import type { ProjectItem } from "@/data/projects";

interface Props {
  projects: ProjectItem[];
}

function LinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 7L7 17M8 7h9v9"
      />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6m-7 1l9-9m-5 0h5v5"
      />
    </svg>
  );
}

export default function ProjectModal({ projects }: Props) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<ProjectItem | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startY: 0, delta: 0, dragging: false });

  const byName = (name: string) => projects.find((p) => p.name === name);

  const openProject = (p: ProjectItem) => {
    setCurrent(p);
    setOpen(true);
  };

  // Wire the (server-rendered) project cards to this island.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a")) return;
      const card = target.closest<HTMLElement>("[data-project-name]");
      if (!card) return;
      const p = byName(card.dataset.projectName || "");
      if (p) openProject(p);
    };
    const onKey = (e: KeyboardEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-project-name]",
      );
      if (!card) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const p = byName(card.dataset.projectName || "");
        if (p) openProject(p);
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  const onHandleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { startY: e.clientY, delta: 0, dragging: true };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging) return;
    drag.current.delta = Math.max(0, e.clientY - drag.current.startY);
    if (popupRef.current)
      popupRef.current.style.transform = `translateY(${drag.current.delta}px)`;
  };
  const onHandleUp = () => {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    if (drag.current.delta > 90) setOpen(false);
    if (popupRef.current) popupRef.current.style.transform = "";
    drag.current.delta = 0;
  };

  const hasLinks = Boolean(current?.link || current?.website);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay className="project-modal-overlay" />
        <DialogContent
          ref={popupRef}
          className="project-modal"
          showCloseButton={false}
        >
          <div
            className="project-modal-handle"
            aria-hidden="true"
            onPointerDown={onHandleDown}
            onPointerMove={onHandleMove}
            onPointerUp={onHandleUp}
            onPointerCancel={onHandleUp}
          />
          <div className="project-modal-bar">
            <p className="project-modal-title">{current?.name ?? ""}</p>
            <button
              type="button"
              className="project-modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close project details"
            >
              ✕
            </button>
          </div>
          <div className="project-modal-body">
            <p
              className="project-modal-tagline"
              style={{ display: current?.tagline ? "" : "none" }}
            >
              {current?.tagline}
            </p>
            <ul className="project-modal-points">
              {current?.points.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
            <div className="project-modal-gallery">
              {current?.images?.map((img, i) => (
                <figure key={i}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  {img.caption ? <figcaption>{img.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
            <p className="project-modal-stack">{current?.stack ?? ""}</p>
          </div>
          <div
            className="project-modal-links"
            style={{ display: hasLinks ? "" : "none" }}
          >
            {current?.link ? (
              <a
                className="project-modal-link"
                href={current.link}
                target="_blank"
                rel="noopener"
              >
                {current.linkLabel ?? "Link"} <LinkIcon />
              </a>
            ) : null}
            {current?.website ? (
              <a
                className="project-modal-link"
                href={current.website}
                target="_blank"
                rel="noopener"
              >
                {current.websiteLabel ?? "Website"} <ExternalIcon />
              </a>
            ) : null}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
