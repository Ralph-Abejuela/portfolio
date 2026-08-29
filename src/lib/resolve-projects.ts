import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";
import type { ProjectItem } from "../data/projects";

const allImages = import.meta.glob("/src/assets/projects/*.{png,jpg,jpeg}", {
  eager: true,
  import: "default",
}) as Record<string, ImageMetadata>;

export async function resolveProjects(
  projects: ProjectItem[],
): Promise<ProjectItem[]> {
  return Promise.all(
    projects.map(async (p) => {
      if (!p.images || p.images.length === 0) return p;
      const images = await Promise.all(
        p.images.map(async (img) => {
          const mod = allImages[`/src/assets/projects/${img.src}`];
          if (!mod) return img;
          // Responsive variants for the gallery tiles.
          const gallery = await getImage({
            src: mod,
            widths: [400, 640, 828, 1080],
            sizes: "(min-width: 768px) 20rem, 80vw",
            fit: "cover",
            format: "webp",
          });
          // Full-res image for the lightbox.
          const full = await getImage({
            src: mod,
            layout: "constrained",
            fit: "cover",
            format: "webp",
          });
          return {
            ...img,
            src: full.src,
            srcset: gallery.srcSet.attribute,
            sizes: gallery.attributes.sizes,
            width: gallery.attributes.width,
            height: gallery.attributes.height,
          };
        }),
      );
      return { ...p, images };
    }),
  );
}
