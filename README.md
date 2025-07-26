# obsidian-sync

A Deno-based CLI tool to periodically back up and sync your Obsidian Vault to a remote Git repository (like GitHub).

## Overview

This tool monitors your specified Obsidian Vault directory for any file changes. When changes are detected, it automatically performs the following Git operations:

- `git add .`
- `git commit -m "vault backup: {current date and time}"`
- `git pull`
- `git push`

This process runs automatically at a configurable interval, ensuring your work in Obsidian is consistently backed up and kept in sync with your remote repository.

## How to Use

### Prerequisites

- [Deno](https://deno.com/) must be installed.
- [Git](https://git-scm.com/) must be installed.
- Your target Obsidian Vault must be initialized as a Git repository, and a remote repository must be configured.

### 1. Create a Configuration File

This tool reads its configuration from a `config.json` file.

First, create the configuration directory:

```sh
mkdir -p ~/.config/obsidian-sync
```

Next, create the configuration file with the following content:

**`~/.config/obsidian-sync/config.json`**

```json
{
  "OBSIDIAN_VAULT_PATH": "/path/to/your/obsidian/vault",
  "LOG_FILE_PATH": "/path/to/your/sync.log",
  "SYNC_INTERVAL_MINUTES": 15
}
```

- `OBSIDIAN_VAULT_PATH`: Specify the absolute path to the Obsidian Vault you want to sync.
- `LOG_FILE_PATH` (Optional): Specify the path for the log file. If omitted, logging will be disabled.
- `SYNC_INTERVAL_MINUTES` (Optional): The interval in minutes for the sync process. Defaults to `60` if not specified.

### 2. Run the Tool

There are three main commands to manage the synchronization process:

- `deno task start`: Starts the synchronization process in the background.
- `deno task stop`: Stops the background synchronization process.
- `deno task watch`: Starts the synchronization process in the foreground. This is useful for debugging or monitoring.

To start syncing your vault, run:

```sh
deno task start
```

This will start the sync process, which will run periodically to keep your vault backed up. To stop it, use `deno task stop`.
