export const projects = [
  {
    slug: "calgary-whole-home-carpet-cleaning",
    title: "Calgary Whole-Home Carpet Cleaning",
    category: "carpet-cleaning",
    city: "Calgary",
    description:
      "A whole-home deep steam cleaning concept restoring high-traffic carpet throughout the main living areas and stairs.",
    beforeImage: "/images/services/carpet-cleaning.webp",
    afterImage: "/images/services/carpet-cleaning.webp",
    gallery: ["/images/services/carpet-cleaning.webp"],
  },
  {
    slug: "airdrie-post-renovation-cleanup",
    title: "Airdrie Post-Renovation Cleanup",
    category: "renovation-cleaning",
    city: "Airdrie",
    description:
      "A full post-construction cleaning concept clearing dust and debris after a kitchen renovation, ready for move-in.",
    beforeImage: "/images/services/renovation-cleaning.webp",
    afterImage: "/images/services/renovation-cleaning.webp",
    gallery: ["/images/services/renovation-cleaning.webp"],
  },
  {
    slug: "calgary-basement-drywall-install",
    title: "Calgary Basement Drywall Install",
    category: "drywall",
    city: "Calgary",
    description:
      "A full drywall hang, tape, and finish concept for a newly framed basement space.",
    beforeImage: "/images/services/drywall.webp",
    afterImage: "/images/services/drywall.webp",
    gallery: ["/images/services/drywall.webp"],
  },
  {
    slug: "cochrane-roof-replacement",
    title: "Cochrane Roof Replacement",
    category: "roofing",
    city: "Cochrane",
    description:
      "A full asphalt shingle roof replacement concept following storm damage, including ventilation upgrades.",
    beforeImage: "/images/services/roofing.webp",
    afterImage: "/images/services/roofing.webp",
    gallery: ["/images/services/roofing.webp"],
  },
  {
    slug: "chestermere-siding-replacement",
    title: "Chestermere Siding Replacement",
    category: "siding",
    city: "Chestermere",
    description:
      "A full exterior siding replacement concept improving curb appeal and weatherproofing on a two-story home.",
    beforeImage: "/images/services/siding.webp",
    afterImage: "/images/services/siding.webp",
    gallery: ["/images/services/siding.webp"],
  },
];

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByCategory(category) {
  if (!category || category === "all") return projects;
  return projects.filter((project) => project.category === category);
}
