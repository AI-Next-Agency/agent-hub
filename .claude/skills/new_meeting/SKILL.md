---
name: new_meeting
description: Create empty meeting note files for today's partner meeting in this repo's `meetings/` folder. Use this skill whenever the user invokes `/new_meeting`, or says things like "start a new meeting", "create today's meeting notes", "set up meeting files", or otherwise asks to scaffold meeting notes/transcript files — even if they don't explicitly say "new meeting".
---

# new_meeting

Scaffold two empty files for today's partner meeting so the user can start typing notes immediately and drop in a transcript later.

## What to create

In the repo's `meetings/` folder (at the repo root — this skill is repo-local, so the working directory is the correct repo), create two empty files:

- `meetings/YYYYMMDD.md` — meeting notes
- `meetings/YYYYMMDD-transcript.md` — meeting transcription

`YYYYMMDD` is today's date in **Europe/Berlin** timezone, 8 digits, no separators (e.g. `20260423`). This matches the convention documented in the repo's `AGENTS.md` / `CLAUDE.md`.

## Steps

1. Get today's date in Europe/Berlin. Run:
   ```bash
   TZ=Europe/Berlin date +%Y%m%d
   ```
   Use that exact string as `YYYYMMDD`.

2. Check whether either file already exists. If **either** exists, **stop and error out** — report which files already exist and do not overwrite. The user explicitly wants an error in this case so existing notes are never clobbered.

3. If neither exists, create both as empty files. A single `touch` call is fine:
   ```bash
   touch meetings/YYYYMMDD.md meetings/YYYYMMDD-transcript.md
   ```

4. Confirm to the user with the two created paths as clickable markdown links, e.g. `[meetings/20260423.md](meetings/20260423.md)`.

## Notes

- Don't write any content into the files. They're intentionally empty — the user fills them in.
- Don't create the `meetings/` directory if it doesn't exist; this repo already has it. If it's genuinely missing, that's unexpected — surface it to the user rather than silently creating it.
- Don't commit anything. File creation only.
