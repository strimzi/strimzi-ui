/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
const core = require("@actions/core");
const github = require("@actions/github");

const pull_request_number = github.context.payload.pull_request.number;
const repo = github.context.repo;
const github_token = core.getInput("GITHUB_TOKEN");
const octokit = new github.GitHub(github_token);

async function getCommentID() {
  let { data: comments } = await octokit.issues.listComments({
    ...repo,
    issue_number: pull_request_number,
  });

  let res = comments.filter((comment) => {
    return comment.user.login === "github-actions[bot]";
  });

  if (res.length > 0) {
    return res[0].id;
  } else {
    return null;
  }
}

async function comment(message) {
  try {
    const commentID = await getCommentID();

    if (commentID) {
      octokit.issues.updateComment({
        ...repo,
        issue_number: pull_request_number,
        comment_id: commentID,
        body: message,
      });
    } else {
      octokit.issues.createComment({
        ...repo,
        issue_number: pull_request_number,
        body: message,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function createComment() {
  try {
    const bundleReportContent = core.getInput("BUNDLE_REPORT") ? JSON.parse(core.getInput("BUNDLE_REPORT")) : {};
    const testCoverageClient = core.getInput("TEST_COVERAGE_CLIENT");
    const testCoverageServer = core.getInput("TEST_COVERAGE_SERVER");

    const title = '# PR Report';
    const bundleText = `## Bundle Sizes\n${Object.entries(bundleReportContent).reduce((acc, [codeArea, {bundle_report, overall_bundle_size_change}]) => `${acc}<details><summary>View bundle sizes for '${codeArea}'</summary><br>\n\n${bundle_report}\n##### Overall bundle size change: ${overall_bundle_size_change}\n</details>`, '')}`;
    const testText = `## Test Coverage\n<details><summary>View test coverage</summary><br>\n\n${testCoverageClient}\n\n\n${testCoverageServer}\n</details>`;
    const footer = `Triggered by commit: ${github.context.sha}`;

    const commentText = [title, bundleText, testText, footer];

    await comment(commentText.join('\n\n'));
  } catch (error) {
    core.setFailed(error.message);
  }
}

createComment();
