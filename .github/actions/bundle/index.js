/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const core = require("@actions/core");
const fs = require("fs");

const BUNDLE_LABELS = {
  'main.bundle.js': "Strimzi UI JS Bundle",
};
const TABLE_HEADINGS = ['Bundle', 'New Size', 'Original Size', 'Increase/Decrese', 'File'];

const round = (value) => Math.round(value * 100) / 100;

const getReports = () => {
  let masterReport = JSON.parse(core.getInput('MASTER_REPORT'));
  const currentReport = JSON.parse(fs.readFileSync('./generated/bundle-analyser/report.json'));
  return {masterReport, currentReport};
};

const initBundleSizeObject = (masterReport) => {
  let bundleSizes = Object.keys(BUNDLE_LABELS).reduce((sizes, file) => {
    sizes[file] = {master: 0, current: 0};
    return sizes;
  }, {});
  masterReport.forEach(bundle => {bundleSizes[bundle.label] = {master: bundle.parsedSize, current: null};});
  return bundleSizes;
};

const createTableHeader = (tableHeadings) => {
  return `|${tableHeadings.join('|')}|\n${tableHeadings.reduce(text => text + '---|', '|')}\n`;
};

const createBundleReportTable = (bundleReport, bundleSizes) => bundleReport.reduce((previousbundleText, bundle) => {
  bundleSizes[bundle.label].current = bundle.parsedSize;
  const currentSizeBytes = bundleSizes[bundle.label].current;
  const masterSizeBytes = bundleSizes[bundle.label].master;

  const currentSize = round(currentSizeBytes / 1024);
  const masterSize = round(masterSizeBytes / 1024);
  const bundleLabel = BUNDLE_LABELS[bundle.label] || bundle.label;
  const sizeDiff = round(currentSizeBytes / masterSizeBytes) - 1;
  const sizeDiffText = `${round(sizeDiff * 100)}%`;

  return `${previousbundleText} |${bundleLabel}|${currentSize}KB|${masterSize}KB|${sizeDiffText}|${bundle.label}|\n`;
}, createTableHeader(TABLE_HEADINGS));

const calculateOverallChange = (bundleSizes) => {
  const sizes = Object.values(bundleSizes).reduce(({totalMasterSize, totalCurrentSize}, bundleSize) => {
    return {
      totalMasterSize: totalMasterSize + bundleSize.master,
      totalCurrentSize: totalCurrentSize + bundleSize.current
    };
  }, {totalMasterSize: 0, totalCurrentSize: 0});

  return `${round(((sizes.totalCurrentSize / sizes.totalMasterSize) - 1) * 100)}%`;
};

async function buildBundleReport() {
  try {
    const {masterReport, currentReport} = getReports();
    const bundleSizes = initBundleSizeObject(masterReport);
    const bundleReportTable = createBundleReportTable(currentReport, bundleSizes);
    const overallBundleSizeChange = calculateOverallChange(bundleSizes);

    core.setOutput('bundle_report', bundleReportTable);
    core.setOutput('overall_bundle_size_change', overallBundleSizeChange);
  } catch (error) {
    core.setFailed(error.message);
  }
}

buildBundleReport();
