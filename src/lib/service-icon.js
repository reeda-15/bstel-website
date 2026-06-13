const serviceIconByName = {
  "Fibre Optical Laying & Network Maintenance": "fibre",
  "Fibre Optic Splicing": "fibre",
  "Cable Blowing": "fibre",
  "Horizontal Directional Drilling (HDD)": "hdd",
  "Internet Leased Lines": "tower",
  "High-Speed Data": "data",
  "FTTH & FTTB": "fibre",
  "Wi-Fi Hotspot Installation & O&M": "wifi",
  "Symmetrical & Asymmetrical Bandwidth": "data",
  "Scalable & Customizable Solutions": "tower",
  "Advanced Network Security & Monitoring": "noc",
  "CCTV Installation & Maintenance": "cctv",
  "Quality Assurance & Guarantees": "shield",
  "Flexible Contract Options": "shield",
};

function getServiceIconKey(name) {
  return serviceIconByName[name] || "tower";
}

module.exports = { getServiceIconKey };
