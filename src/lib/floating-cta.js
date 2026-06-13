function shouldShowFloatingCta(pathname) {
  return !String(pathname || "").startsWith("/contact");
}

module.exports = { shouldShowFloatingCta };
