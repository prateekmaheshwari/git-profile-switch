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

## License

MIT
