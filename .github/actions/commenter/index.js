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
    const bundleReport = core.getInput("BUNDLE_REPORT");
    const overallBundleSizeChange = core.getInput("OVERALL_BUNDLE_SIZE_CHANGE");
    const testCoverage = core.getInput("TEST_COVERAGE");

    const title = '# PR Report';
    const bundleText = `## Bundle Sizes\n<details><summary>View bundle sizes</summary><br>\n\n${bundleReport}\n</details>`;
    const bundleOverviewText = `### Overall bundle size change: ${overallBundleSizeChange}`;
    const testText = `## Test Coverage\n<details><summary>View test coverage</summary><br>\n\n${testCoverage}\n</details>`;
    const footer = `Triggered by commit: ${github.context.sha}`;

    const commentText = [title, bundleText, bundleOverviewText, testText, footer];

    await comment(commentText.join('\n\n'));
  } catch (error) {
    core.setFailed(error.message);
  }
}

createComment();
