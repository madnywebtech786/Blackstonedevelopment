export const services = [
  {
    slug: "carpet-cleaning",
    title: "Carpet Cleaning",
    summary:
      "Deep steam and stain-removal carpet cleaning that lifts embedded dirt and restores fresh, healthy flooring.",
    heroDescription:
      "From high-traffic hallways to whole-home carpet refreshes, our deep-steam extraction lifts embedded dirt, allergens, and stains that vacuuming alone can't reach.",
    heroImage:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1600&q=80",
    features: [
      "Hot water steam extraction",
      "Pet stain and odor treatment",
      "High-traffic area and stair cleaning",
      "Fast-dry, low-moisture options",
    ],
    faqs: [
      {
        question: "How long does it take carpets to dry after cleaning?",
        answer:
          "Most carpets are dry to the touch within 4 to 6 hours and fully dry within 24 hours, depending on humidity and airflow.",
      },
      {
        question: "Can you remove pet stains and odors?",
        answer:
          "Yes, we use targeted enzyme treatments alongside steam extraction to break down pet stains and eliminate odors at the source, not just mask them.",
      },
      {
        question: "How often should carpets be professionally cleaned?",
        answer:
          "We recommend professional cleaning every 6 to 12 months for most homes, or more frequently in high-traffic areas or homes with pets.",
      },
    ],
  },
  {
    slug: "renovation-cleaning",
    title: "Renovation Cleaning",
    summary:
      "Post-construction cleanup that clears dust, debris, and residue so newly renovated spaces are move-in ready.",
    heroDescription:
      "Construction dust settles into every surface. We handle the full post-renovation cleanup — floors, fixtures, windowsills, and vents — so your finished space is truly move-in ready.",
    heroImage:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80",
    features: [
      "Fine dust and debris removal",
      "Window, sill, and fixture detailing",
      "Floor and surface deep clean",
      "Final walkthrough-ready finish",
    ],
    faqs: [
      {
        question: "When should renovation cleaning happen?",
        answer:
          "We typically schedule renovation cleaning immediately after the final trades finish, before you move furniture back in, so dust doesn't resettle.",
      },
      {
        question: "Do you remove construction dust from vents and fixtures?",
        answer:
          "Yes, we clean vents, light fixtures, and other surfaces where fine construction dust commonly settles, not just floors and countertops.",
      },
    ],
  },
  {
    slug: "drywall",
    title: "Drywall Installation & Repair",
    summary:
      "Drywall installation, patching, taping, and texture matching for renovations, repairs, and new construction.",
    heroDescription:
      "From small patch repairs to full-room installation, we handle drywall hanging, taping, mudding, and texture matching so new work blends seamlessly with the rest of your home.",
    heroImage:
      "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1600&q=80",
    features: [
      "Drywall installation and hanging",
      "Patch and water-damage repair",
      "Taping, mudding, and sanding",
      "Texture matching for additions and repairs",
    ],
    faqs: [
      {
        question: "Can you match my existing wall texture?",
        answer:
          "Yes, we match existing texture patterns so repaired or added drywall blends seamlessly with the rest of your walls and ceilings.",
      },
      {
        question: "Can you repair water-damaged drywall?",
        answer:
          "Yes, we remove and replace water-damaged sections, address the underlying cause where possible, and finish to match the surrounding wall.",
      },
    ],
  },
  {
    slug: "roofing",
    title: "Roofing",
    summary:
      "Roof replacement, repair, and leak detection to protect your home through Alberta's toughest weather.",
    heroDescription:
      "From storm damage repairs to full roof replacements, we protect your home with quality materials and workmanship built for Alberta's weather.",
    heroImage:
      "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=1600&q=80",
    features: [
      "Asphalt shingle roof replacement",
      "Roof repair and leak detection",
      "Storm and hail damage assessment",
      "Ventilation and insulation upgrades",
    ],
    faqs: [
      {
        question: "How long does a roof replacement take?",
        answer:
          "Most residential roof replacements are completed in 1 to 3 days, weather permitting.",
      },
      {
        question: "Do you handle insurance claims for storm damage?",
        answer:
          "Yes, we assess storm and hail damage and provide the documentation you need to support an insurance claim.",
      },
    ],
  },
  {
    slug: "siding",
    title: "Siding",
    summary:
      "Siding installation and replacement that improves curb appeal, insulation, and weather protection.",
    heroDescription:
      "New siding does more than refresh curb appeal — it tightens up insulation and protects your home's exterior from Alberta's weather year-round.",
    heroImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80",
    features: [
      "Vinyl and composite siding installation",
      "Siding repair and panel replacement",
      "Insulation and weatherproofing upgrades",
      "Soffit, fascia, and trim detailing",
    ],
    faqs: [
      {
        question: "How long does siding installation take?",
        answer:
          "A typical single-family home siding installation takes 3 to 7 days depending on size and weather conditions.",
      },
      {
        question: "Will new siding improve my home's energy efficiency?",
        answer:
          "Yes, new siding paired with proper insulation and vapor barriers reduces drafts and improves your home's overall energy efficiency.",
      },
    ],
  },
];

export function getServiceBySlug(slug) {
  return services.find((service) => service.slug === slug);
}
