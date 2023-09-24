# Updating Sketchbook

Sketchbook is an active project, and it will continue improving over time via ongoing work in the [GitHub repo](https://github.com/flatpickles/sketchbook). You will likely want to keep your own copy of Sketchbook up to date, so you can take advantage of new features, bug fixes, and other improvements. Read on to learn how you can stay up-to-date!

### Notes on Versioning

Sketchbook development adheres to [Semantic Versioning ](https://semver.org/), whereby each successive update is given a `[major].[minor].[patch]` version number, e.g. `1.2.36`. Minor & patch version increments will be backwards compatible, i.e. updating to a new version of Sketchbook with the same major version number shouldn't break anything you've built (please [file an issue](https://github.com/flatpickles/sketchbook/issues/new) if it does).

Each major and minor release will be accompanied by [release notes](https://github.com/flatpickles/sketchbook/releases). The current Sketchbook version number is noted in [package.json](https://github.com/flatpickles/sketchbook/blob/main/package.json), and you can compare this to the same file in your local Sketchbook.

_**Note:** As of this writing, Sketchbook is still in a 0.x version, which means any part of the project may be subject to breaking changes. Keep an eye out for a 1.0 release, coming soon!_

### Syncing Your Fork

If you're working from a fork of Sketchbook (as described in the [quick start guide](quick-start.md)), you can absorb recent changes by "syncing" your fork with the main repo. Before continuing, make sure that any local changes have been committed and pushed up to your fork's "origin" on GitHub (YOUR_USERNAME/sketchbook.git). We'll refer to the main Sketchbook repository (flatpickles/sketchbook.git) as the "upstream" repository, which is consistent with GitHub's documentation.

You'll know if you need to sync your fork with the upstream if you see an "X commits behind" message in the GitHub web UI for your fork:

<img src="media/gh-sync-needed.png" style="width: 500px" />

### Syncing Without Conflicts

If your changes are contained only within your `src/art` directory, you should be able to sync your fork easily from the GitHub web UI. to the right of the message shown above is a "Sync fork" option, and this should pull in the latest changes from the upstream repository. After you do this, you can `git pull` in your local Sketchbook directory, and get right back to work.

### Syncing With Conflicts

If you've changed code files elsewhere within Sketchbook, or in some cases when you've changed values in `src/config`, you may need to resolve conflicts with upstream changes in the same files. If "Sync repo" presents the following dropdown, and you don't want to discard the conflicting commits, you'll need to resolve these conflicts locally.

<img src="media/gh-conflicts.png" style="width: 300px" />

To configure your local Sketchbook repo to pull in changes from the upstream Sketchbook repo, add a new upstream remote for your fork as described [here](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork). You'll only need to do this once.

```
git remote add upstream https://github.com/flatpickles/sketchbook.git
```

Once you have the upstream repository listed as a remote (i.e. flatpickles/sketchbook.git appears in `git remote -v`), you can pull down the upstream changes, and resolve local conflicts. First, fetch the upstream changes, and check out your main branch:

```
git fetch upstream
git checkout main
```

When resolving conflicts, you can use either a rebase or a merge. The differences between the two are out of scope for this document, but suffice it to say that either will work, and each offers its own benefits and drawbacks. To preserve the distinction between your commits and those in the upstream repo, we'll prefer a rebase workflow here.

```
git rebase upstream/main
git mergetool
[resolve conflicts as you see fit]
git add .
git rebase --continue
git push --force
```

GitHub's [documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) on fork syncing may also be a helpful reference. Please [file an issue](https://github.com/flatpickles/sketchbook/issues/new) if you're having trouble updating your Sketchbook!

### For Private Sketchbooks

The process for updating a private Sketchbook mirror is similar to the above. GitHub's [setup](https://docs.github.com/en/repositories/creating-and-managing-repositories/duplicating-a-repository) documentation is helpful, as is [this gist](https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274), which includes helpful notes on updating a private fork.
