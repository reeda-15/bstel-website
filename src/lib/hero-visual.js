const heroVisualConfigs = {
  home: {
    variant: "home",
    label: "Fibre network routes",
  },
  services: {
    variant: "services",
    label: "Technical infrastructure",
  },
  coverage: {
    variant: "coverage",
    label: "India coverage footprint",
  },
  projects: {
    variant: "projects",
    label: "Project delivery collage",
  },
  careers: {
    variant: "careers",
    label: "Field engineering team",
  },
};

function getHeroVisualConfig(variant) {
  return heroVisualConfigs[variant] || heroVisualConfigs.home;
}

module.exports = { getHeroVisualConfig };
