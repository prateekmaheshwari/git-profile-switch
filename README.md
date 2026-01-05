# git-profile-switch

A safe, one-time CLI tool to set up **profile-based Git identity** (work / personal) on a single machine using Git’s native configuration features.

This tool helps developers avoid accidentally committing with the wrong name or email — especially on company-provided machines.

---

## The Problem

Many developers use the same machine for:
- Company work repositories
- Personal projects and open-source contributions

Git has only one global identity by default.  
This leads to common issues such as:

- Commits pushed with a personal email to a company repo
- Commits pushed with a work email to personal or open-source repos
- Violating company policies unintentionally
- Manually switching `git config` values back and forth

Git *does* support conditional configuration, but setting it up correctly is non-trivial and error-prone.

---

## What This Tool Does

`git-profile-switch` helps you **set up profile-based Git identities once**, based on repository folder paths.

Specifically, it:

- Creates separate Git config files for different profiles (e.g. work and personal)
- Configures Git’s native `includeIf` rules to apply identities by folder
- Backs up existing Git configuration before making changes
- Provides read-only commands to verify and diagnose the setup

After setup, **Git itself** handles identity resolution — this tool does not run again.

---

## What This Tool Does NOT Do

This is intentionally a **minimal and conservative tool**.

It does **not**:

- Switch Git identities dynamically at runtime
- Intercept Git commands or commits
- Run in the background
- Modify SSH keys or SSH configuration
- Interact with GitHub or any remote service
- Rewrite commit history
- Install Git hooks
- Require continuous usage after setup

You can uninstall this tool after setup and your configuration will continue to work.

---

## How It Works (High Level)

This tool uses Git’s built-in `includeIf` feature.

At a high level:

- Repositories under one folder (e.g. `~/code/work`) use one identity
- Repositories under another folder (e.g. `~/code/personal`) use another identity
- Git resolves the correct identity automatically based on repository location

No custom Git behavior is introduced.

---

## Safety & Trust Guarantees

- No data is uploaded anywhere
- No network calls are made
- No credentials are collected
- No background processes are started
- All changes are local and reversible

This tool is designed to be safe to run on company-managed machines.

---

## Status

This project is under active development.

v1 focuses on:
- Initial setup (`init`)
- Verification (`doctor`)
- Status inspection (`status`)

Advanced features may be considered later, but are intentionally out of scope for v1.

---

## Installation

This tool is designed to be used via `npx` without permanent installation.

```
npx git-profile-switch init
```

You may also install it globally if you prefer:
```
npm install -g git-profile-switch
```

---

## Usage

### Initialize profile-based identity

```
git-profile-switch init
```

This command:
- Prompts for work and personal Git identities
- Creates profile-specific Git config files
- Safely updates your global Git configuration using includeIf

You will be shown a preview and must explicitly confirm before any changes are made.


### View current configuration

```
git-profile-switch status
```

Shows a read-only summary of detected profile-based Git configuration.


### Diagnose configuration issues

```
git-profile-switch doctor
```

Performs read-only checks and reports potential problems such as:
- Missing Git installation
- Missing profile files
- Missing or invalid includeIf rules

---

## How Identity Switching Works

This tool uses Git’s built-in conditional configuration feature (`includeIf`).

At a high level:

- Repositories under a specific directory (e.g. `~/code/work/`) use a work identity
- Repositories under another directory (e.g. `~/code/personal/`) use a personal identity
- Git resolves the correct identity automatically based on repository location

No background processes, hooks, or runtime switching are involved.

---

## Safety & Corporate Use

This tool is designed to be safe to use on company-managed machines.

It:
- Does not run in the background
- Does not intercept Git commands
- Does not modify SSH configuration
- Does not communicate with GitHub or any external service
- Does not require continued usage after setup

All changes are local, transparent, and reversible.

You can uninstall the tool after setup and the configuration will continue to work.

---

## Uninstall / Rollback

To undo changes:

1. Restore your backed-up `.gitconfig` file:
    ```
    ls ~/.gitconfig.backup.*
    mv ~/.gitconfig.backup.<timestamp> ~/.gitconfig
    ```

2. Optionally remove profile files:
    ```
    rm ~/.gitconfig-work
    rm ~/.gitconfig-personal
    ```

No other cleanup is required.

---

## License

MIT
