import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import ProjectLightbox from "./ProjectLightbox";
import type { ProjectItem } from "@/data/projects";

interface Props {
  projects: ProjectItem[];
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const byName = (name: string) => projects.find((p) => p.name === name);

  const openProject = (p: ProjectItem) => {
    setCurrent(p);
    setOpen(true);
  };

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
  }, [projects, isMobile]);

  const hasLinks = Boolean(current?.link || current?.website);

  const content = (
    <>
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
          {current?.points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
        <div className="project-modal-gallery">
          {current?.images?.map((img, i) => (
            <button
              type="button"
              key={i}
              className="project-modal-gallery-item"
              onClick={() => setLightbox(i)}
              aria-label={`Open ${img.alt}`}
            >
              <img
                src={img.src}
                srcSet={img.srcset}
                sizes={img.sizes}
                width={img.width}
                height={img.height}
                alt={img.alt}
                loading="lazy"
                decoding="async"
              />
              {img.caption ? (
                <span className="project-modal-gallery-caption">{img.caption}</span>
              ) : null}
            </button>
          ))}
        </div>
        <p className="project-modal-stack">{current?.stack ?? ""}</p>
      </div>
      <div
        className="project-modal-links"
        style={{ display: hasLinks ? "" : "none" }}
      >
        {" "}
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
      {lightbox !== null && current?.images && (
        <ProjectLightbox
          images={current.images}
          index={lightbox}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );

  return isMobile ? (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        if (lightbox === null) setOpen(next);
      }}
      swipeDirection="down"
      showSwipeHandle
    >
      <DrawerContent className="project-drawer">{content}</DrawerContent>
    </Drawer>
  ) : (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (lightbox === null) setOpen(next);
      }}
    >
      <DialogPortal>
        <DialogOverlay className="project-modal-overlay" />
        <DialogContent className="project-modal" showCloseButton={false}>
          {content}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
