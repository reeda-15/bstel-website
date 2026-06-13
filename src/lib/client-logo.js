const logoClassByFile = {
  "railtel.png": "emphasis",
  "tata-communications.png": "wide emphasis",
  "tata-teleservices-limited.png": "wide",
  "tikona.png": "wide",
  "towervision.png": "wide",
  "one.png": "compact",
};

function getClientLogoClass(file) {
  const modifier = logoClassByFile[file];
  return modifier ? `client-logo ${modifier}` : "client-logo";
}

module.exports = { getClientLogoClass };
