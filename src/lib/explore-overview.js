const overviewItems = [
  {
    title: "Services",
    icon: "services",
    summary: "Plan, build, connect and protect telecom networks across four practice areas.",
    href: "/services",
  },
  {
    title: "Coverage",
    icon: "coverage",
    summary: "Explore full-state and district-level network footprint across six Indian states.",
    href: "/coverage",
  },
  {
    title: "Projects & Clients",
    icon: "projects",
    summary: "See field delivery, capability mix and operator relationships proven at scale.",
    href: "/projects",
  },
  {
    title: "About BSTEL",
    icon: "about",
    summary: "Meet the telecom infrastructure partner connecting fibre routes since 2007.",
    href: "/about",
  },
  {
    title: "Careers",
    icon: "careers",
    summary: "Join field engineering, fibre splicing and NOC teams building India's networks.",
    href: "/careers",
  },
];

function getExploreOverviewItems() {
  return overviewItems;
}

module.exports = { getExploreOverviewItems };
