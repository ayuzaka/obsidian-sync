# obsidian-sync

A Deno-based CLI tool to periodically back up and sync your Obsidian Vault to a
remote Git repository (like GitHub).

## Overview

This tool monitors your specified Obsidian Vault directory for any file changes.
When changes are detected, it automatically performs the following Git
operations:

- `git add .`
- `git commit -m "vault backup: {current date and time}"`
- `git pull`
- `git push`

This process runs automatically every minute, ensuring your work in Obsidian is
consistently backed up and kept in sync with your remote repository.

## How to Use

### Prerequisites

- [Deno](https://deno.com/) must be installed.
- [Git](https://git-scm.com/) must be installed.
- Your target Obsidian Vault must be initialized as a Git repository, and a
  remote repository must be configured.

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
  "LOG_FILE_PATH": "/path/to/your/sync.log"
}
```

- `OBSIDIAN_VAULT_PATH`: Specify the absolute path to the Obsidian Vault you
  want to sync.
- `LOG_FILE_PATH` (Optional): Specify the path for the log file. If omitted,
  `sync.log` will be created in the project's root directory.

### 2. Run the Tool

You can run the synchronization process in either the foreground or the
background.

#### Foreground

To run the process in the foreground and see the output directly, use the
following command:

```sh
deno task run
```

#### Background

To run the process in the background, so it continues to run after you close the
terminal, use `nohup`:

```sh
nohup deno task run &
```

This will start the sync process, which will run periodically to keep your vault
backed up.
