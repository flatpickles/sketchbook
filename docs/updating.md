# Updating Sketchbook

Sketchbook is an active project, and it will continue improving over time via ongoing work in the [GitHub repo](https://github.com/flatpickles/sketchbook). You will likely want to keep your own copy of Sketchbook up to date, so you can take advantage of new features, bug fixes, and other improvements. Read on to learn how you can stay up-to-date!

### Notes on Versioning

Sketchbook development adheres to [Semantic Versioning ](https://semver.org/), whereby each successive update is given a `[major].[minor].[patch]` version number, e.g. `1.2.36`. Minor & patch version increments will be backwards compatible, i.e. updating to a new version of Sketchbook with the same major version number shouldn't break anything you've built (please [file an issue](https://github.com/flatpickles/sketchbook/issues/new) if it does). You can see the latest version on the [GitHub repo](https://github.com/flatpickles/sketchbook).

[todo: easy way to compare local with upstream version number before syncing?]

**Note:** as of this writing, Sketchbook is still in a 0.x version, which means any part of the project may be subject to breaking changes. Keep an eye out for a 1.0 release, coming soon!

### Syncing Your Fork

Presuming you're working from a fork of Sketchbook (as described in the [quick start guide](quick-start.md)), you can absorb recent changes by "syncing" your fork with the main repo. The following notes assume your changes have been committed in your local repository, and pushed up to your fork's "origin" on github.com (YOUR_USERNAME/sketchbook.git). We'll refer to the main Sketchbook repository (flatpickles/sketchbook.git) as the "upstream" repository, which is consistent with GitHub's documentation.

You'll know if you need to sync your fork with the upstream if you see an "X commits behind" message in the GitHub web UI for your fork:

<img src="media/gh-sync-needed.png" style="width: 500px" />

### Syncing Without Conflicts

If your changes are contained only within your `src/art` directory, you should be able to sync your fork easily from the GitHub web UI. to the right of the message shown above is a "Sync fork" option, and this should pull in the latest changes from the upstream repository. After you do this, you can `git pull` in your local Sketchbook directory, and get right back to work.

However, if you've changed code files elsewhere within Sketchbook, or in some cases when you've changed values in `src/config`, you may need to resolve conflicts with upstream changes in the same files. If "Sync repo" presents this dropdown, and you don't want to discard the conflicting commits, you'll need to resolve these conflicts locally.

<img src="media/gh-conflicts.png" style="width: 300px" />

### Syncing With Conflicts

GitHub has some solid documentation on the matter.

https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork

To configure your local Sketchbook repo to pull in changes from the upstream Sketchbook repo, add a new upstream remote for your fork as described [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork). You'll only need to do this once.

```
git remote add upstream https://github.com/flatpickles/sketchbook.git
```

https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork

### For Private Sketchbooks

todo: notes for private copies [here](https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274).
