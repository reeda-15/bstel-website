const coveragePreview = {
  metrics: [
    ["6", "States"],
    ["130+", "Districts"],
    ["3", "Full-State Regions"],
  ],
  chips: [
    { name: "Maharashtra", detail: "Mumbai, Pune, Nagpur, Nashik", status: "HQ: Nagpur", tone: "full" },
    { name: "Madhya Pradesh", detail: "Bhopal, Indore, Jabalpur", status: "Full coverage", tone: "full" },
    { name: "Chhattisgarh", detail: "Raipur, Bilaspur, Durg", status: "Full coverage", tone: "full" },
    { name: "Goa", detail: "North Goa and South Goa", status: "Full coverage", tone: "full" },
    { name: "Uttar Pradesh", detail: "Varanasi, Lucknow, Prayagraj", status: "Key districts", tone: "partial" },
    { name: "Gujarat", detail: "Ahmedabad, Rajkot, Surat", status: "Key districts", tone: "partial" },
  ],
};

function getCoveragePreview() {
  return coveragePreview;
}

module.exports = { getCoveragePreview };
