"use client";

import { useMemo, useState } from "react";
import { ProjectGridCard } from "@/components/shared/ProjectGridCard";
import { ProjectLightbox } from "@/components/shared/ProjectLightbox";
import { projects } from "@/lib/projects-data";

// Row layouts keyed by how many projects share the row. Each item carries the
// Tailwind width class it takes at sm+ (full width below that, stacked).
// Widths within a layout always sum to 100%, so a row completely fills the
// container with no leftover gap on either side. Rows of 2 alternate between
// a plain 50/50 and a 70/30-ish lead split for rhythm variety across the
// gallery.
const ROW_LAYOUTS = {
  1: [["sm:w-full"]],
  2: [
    ["sm:w-1/2", "sm:w-1/2"],
    ["sm:w-[68%]", "sm:w-[32%]"],
    ["sm:w-[32%]", "sm:w-[68%]"],
  ],
  3: [["sm:w-1/3", "sm:w-1/3", "sm:w-1/3"]],
};

// Row height, mobile first then sm+ — narrower rows (3-up) get a shorter
// desktop height so tiles don't turn near-square.
const ROW_HEIGHT = {
  1: "h-64 sm:h-110",
  2: "h-64 sm:h-90",
  3: "h-56 sm:h-70",
};

// Decomposes a project count into a sequence of row sizes (1-3 projects per
// row) that sum to exactly `count`, preferring 2s and 3s over a trail of lone
// singles — a single leftover project only ever becomes its own row when the
// count is odd after 2s/3s are exhausted, and it always gets the full-width
// row rather than being stranded next to empty space.
function planRowSizes(count) {
  if (count <= 3) return [count];
  if (count % 2 === 0) return [2, ...planRowSizes(count - 2)];
  return [3, ...planRowSizes(count - 3)];
}

function buildRows(items) {
  const sizes = planRowSizes(items.length);
  const layoutCursor = {};
  const rows = [];
  let cursor = 0;

  for (const size of sizes) {
    const layoutOptions = ROW_LAYOUTS[size];
    const layoutIndex = layoutCursor[size] ?? 0;
    layoutCursor[size] = layoutIndex + 1;
    const widths = layoutOptions[layoutIndex % layoutOptions.length];

    rows.push({
      heightClass: ROW_HEIGHT[size],
      items: items
        .slice(cursor, cursor + size)
        .map((project, i) => ({ project, width: widths[i] })),
    });
    cursor += size;
  }

  return rows;
}

function projectImages(project) {
  return project.gallery.length > 0 ? project.gallery : [project.afterImage];
}

export function ProjectGallery() {
  const rows = useMemo(() => buildRows(projects), []);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Every project's images flattened into one continuous sequence, so
  // next/prev in the lightbox browses the whole gallery rather than being
  // scoped to whichever project tile was clicked.
  const allImages = useMemo(
    () => projects.flatMap((project) => projectImages(project)),
    []
  );

  // Starting index of each project's images within the flattened sequence,
  // so clicking a tile opens the viewer at that project's first image.
  const startIndexByProject = useMemo(() => {
    const map = {};
    let cursor = 0;
    for (const project of projects) {
      map[project.slug] = cursor;
      cursor += projectImages(project).length;
    }
    return map;
  }, []);

  function openProject(project) {
    setLightboxIndex(startIndexByProject[project.slug]);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  return (
    <div>
      <div className="flex flex-col gap-3">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col gap-3 sm:flex-row">
            {row.items.map(({ project, width }) => (
              <ProjectGridCard
                key={project.slug}
                project={project}
                onClick={() => openProject(project)}
                className={`w-full shrink-0 ${width} ${row.heightClass}`}
              />
            ))}
          </div>
        ))}
      </div>

      <ProjectLightbox
        images={allImages}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={closeLightbox}
      />
    </div>
  );
}
