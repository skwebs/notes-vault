# Gemini Instructions

## Core Mandates

All operations must strictly follow the [Git Workflow and Token Efficiency Rules](docs/git-rules.md).

### Verification Workflow
1. Complete task.
2. `npm run lint`
3. `npm run build`
4. Verify deployment on Vercel Preview.
5. Only then `git commit` and `git push`.

### Efficiency
- Use targeted `grep_search` and `read_file` with line limits.
- Avoid full repository scans.
- Do not repeat file reads.
