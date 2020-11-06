/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const core = require("@actions/core");
const fs = require("fs");

async function formatCoverage(testType) {
  try {
    const coverage = JSON.parse(
      fs.readFileSync(`./coverage/${testType}/coverage-summary.json`)
    );

    core.setOutput(`test_coverage_${testType}`, coverageTable(coverage));
  } catch (error) {
    core.setFailed(error.message);
  }
}

const coverageTable = (coverage) => {
  let coverageText =
    "| File | Lines | Statement | Functions | Branches |\n| --- | --- | --- | --- | --- |\n";

  const regex = /^(.+)strimzi-ui\/(.+)$/;

  coverageText += Object.entries(coverage).reduce((text, [key, value]) => {
    console.log(key);

    return `${text}| ${key != "total" ? key.match(regex)[2] : "Total"} | ${
      value.lines.pct
    }% | ${value.statements.pct}% | ${value.functions.pct}% | ${
      value.branches.pct
    }% |\n`;
  }, '');

  return coverageText;
};

return Promise.all([formatCoverage("client"),
  formatCoverage("server")]);
