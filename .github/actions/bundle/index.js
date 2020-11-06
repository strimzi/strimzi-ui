/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const core = require("@actions/core");
const fs = require("fs");

// map of nicer labels to built bundle files in the reports
const BUNDLE_LABELS = {
  'main.bundle.js': "Strimzi UI JS Bundle",
  'main.js': "Strimzi UI Server JS Bundle",
};
const TABLE_HEADINGS = ['Bundle', 'New Size', 'Original Size', 'Increase/Decrease', 'File'];

const round = (value) => Math.round(value * 100) / 100;
const percentageValueOrNa = value => value === Infinity ? 'N/A' : `${value}%`;

const CLIENT_REPORT_CONFIG = {
  reportFor: 'client',
  masterReportEnvvar: 'CLIENT_MASTER_REPORT',
  branchReportFile: './generated/bundle-analyser/client-report.json',
};

const SERVER_REPORT_CONFIG = {
  reportFor: 'server',
  masterReportEnvvar: 'SERVER_MASTER_REPORT',
  branchReportFile: './generated/bundle-analyser/server-report.json',
};

const getReports = (currentMasterReportEnvvar, branchReportFile) => {
  let masterReport = core.getInput(currentMasterReportEnvvar) ? JSON.parse(core.getInput(currentMasterReportEnvvar)) : [];
  const currentReport = fs.existsSync(branchReportFile) ? JSON.parse(fs.readFileSync(branchReportFile)) : [];
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
  const bundleSize = bundleSizes[bundle.label] || {master: 0};
  bundleSize.current = bundle.parsedSize;
  const currentSizeBytes = bundleSize.current;
  const masterSizeBytes = bundleSize.master;

  const currentSize = round(currentSizeBytes / 1024);
  const masterSize = round(masterSizeBytes / 1024);
  const bundleLabel = BUNDLE_LABELS[bundle.label] || bundle.label;
  const sizeDiff = round(currentSizeBytes / masterSizeBytes) - 1;
  const sizeDiffText = percentageValueOrNa(round(sizeDiff * 100));

  return `${previousbundleText} |${bundleLabel}|${currentSize}KB|${masterSize}KB|${sizeDiffText}|${bundle.label}|\n`;
}, createTableHeader(TABLE_HEADINGS));

const calculateOverallChange = (bundleSizes) => {
  const sizes = Object.values(bundleSizes).reduce(({totalMasterSize, totalCurrentSize}, bundleSize) => {
    return {
      totalMasterSize: totalMasterSize + bundleSize.master,
      totalCurrentSize: totalCurrentSize + bundleSize.current
    };
  }, {totalMasterSize: 0, totalCurrentSize: 0});

  return percentageValueOrNa(round(((sizes.totalCurrentSize / sizes.totalMasterSize) - 1) * 100));
};

async function buildBundleReport() {
  try {

    const actionOutput = [CLIENT_REPORT_CONFIG, SERVER_REPORT_CONFIG].map(reportToProcess => {
      const {reportFor, masterReportEnvvar, branchReportFile} = reportToProcess;
      const {masterReport, currentReport} = getReports(masterReportEnvvar, branchReportFile);
      const bundleSizes = initBundleSizeObject(masterReport);
      const bundleReportTable = createBundleReportTable(currentReport, bundleSizes);
      const overallBundleSizeChange = calculateOverallChange(bundleSizes);

      return {
        reportFor,
        'bundle_report': bundleReportTable,
        'overall_bundle_size_change': overallBundleSizeChange
      };
    }).reduce((acc, {reportFor, bundle_report, overall_bundle_size_change}) => ({...acc, [reportFor]: {bundle_report, overall_bundle_size_change}}), {});

    core.setOutput(`bundle_report`, JSON.stringify(actionOutput));

  } catch (error) {
    core.setFailed(error.message);
  }
}

buildBundleReport();
