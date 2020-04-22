const axios = require("axios");
const groupBy = require("lodash.groupby");

async function getAuthoritySetStats() {
  const { data } = await axios.get(
    "https://fct.tools/get_json.php?data_key=6adf3f70acf1e128380fdbdda9577598"
  );

  // Use Luciap node as reference for the authority set composition
  const refNode = data.find((d) => d.owner === "Luciap-Testnet3");
  const refAuthoritySet = JSON.parse(refNode.fd_authset);
  const leaderIds = new Set(refAuthoritySet.leaders.map((l) => l.id));
  const auditIds = new Set(refAuthoritySet.audits.map((a) => a.id));

  // Get versions of authority set
  const auditVersions = [],
    leaderVersions = [],
    notFound = new Set([...leaderIds, ...auditIds]);
  data.forEach(function (d) {
    if (leaderIds.has(d.fd_id)) {
      notFound.delete(d.fd_id);
      leaderVersions.push(d.version);
    } else if (auditIds.has(d.fd_id)) {
      notFound.delete(d.fd_id);
      auditVersions.push(d.version);
    }
  });

  if (notFound.size > 0) {
    console.log(`Identities not found:`, notFound);
  }

  const mainVersion = Object.entries(
    groupBy([...auditVersions, ...leaderVersions])
  ).sort((a, b) => b[1].length - a[1].length)[0][0];

  // Compute stats of versions
  const auditVersionsStats = [],
    leaderVersionsStats = [];
  for (let [version, value] of Object.entries(groupBy(auditVersions))) {
    auditVersionsStats.push({ version, count: value.length });
  }
  for (let [version, value] of Object.entries(groupBy(leaderVersions))) {
    leaderVersionsStats.push({ version, count: value.length });
  }

  // Add missing nodes as unknown
  const missingLeaders = leaderIds.size - leaderVersions.length;
  const missingAudits = auditIds.size - auditVersions.length;
  if (missingLeaders > 0) {
    leaderVersionsStats.push({ version: "unknown", count: missingLeaders });
  }
  if (missingAudits > 0) {
    auditVersionsStats.push({ version: "unknown", count: missingAudits });
  }

  // Result
  return {
    leaders: leaderIds.size,
    audits: auditIds.size,
    mainVersion,
    auditVersions: auditVersionsStats,
    leaderVersions: leaderVersionsStats,
    identitiesNotFound: [...notFound],
  };
}

module.exports = {
  getAuthoritySetStats,
};
