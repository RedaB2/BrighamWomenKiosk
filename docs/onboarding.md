# Onboarding Guide

## Environment Description

### Remote Repository
- `main` branch - active development branch. All code contribution to this branch must happen through pull requests. Requires at least two approvals before a pull request can be merged.
- `feature` branches - short-lived branches for programmers to save their work in progress and culminate in pull requests to `main`.

## Workflows

### Code Contribution
1. Clone the repository `main` branch on GitHub to your local development environment. This assumes that you have [Git](https://git-scm.com/) installed.
```bash
git clone git@github.com:CS3733-C24-Team-C/Team-C-Production.git
```
2. Check out to the local `main` branch.
```bash
git checkout main
```
3. From the local `main` branch, create a new branch for each ticket you work on. Branch names should be descriptive of the ticket you are working on.
```bash
git checkout -b <branch-name>
```
4. Implement the desired feature or fix the issue specified in the ticket.
5. Write relevant tests to validate your changes.
6. Commit your changes to your local branch.
```bash
git add .
git commit -m "<commit-message>"
```
7. Push your local branch to the remote repository. This can be done before you are finished with your changes in case you need to collaborate save your progress remotely. `-u` flag stands for `upstream` and is only needed the first time you push a branch to the remote repository. Git will remember the upstream branch for subsequent pushes.
```bash
git push -u origin <branch-name> # first time
git push origin <branch-name> # subsequent times
```
8. When you are ready to merge your changes into the `main` branch, create a pull request on GitHub. This can be done at any time, but it is recommended to do so when you are finished with your changes. Pull requests can be created from the GitHub UI. Provide a clear title and description of the changes you made. Assign at least two reviewers to the pull request. Once the pull request is approved by at least two reviewers, it can be merged into the `main` branch.
9. Engage in discussion with reviewers and make any necessary changes to your code, essentially repeating steps 4-7 until the pull request is approved.

### Code Review
1. Check out a pull request locally, replace <pull-request-id> with the number, URL, or head branch of the pull request. This assumes that you have [GitHub CLI](https://cli.github.com/) installed.
```bash
gh pr checkout <pull-request-id>
```
2. Test and review the code changes and provide feedback on the pull request.
3. Once the changes are approved by at least two reviewers, squash and merge the pull request to the `main` branch for a linear commit history.
