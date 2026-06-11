# Git Workflow Rules

## Mandatory Rule Before Every Commit

1. Complete the requested development work.
2. Run linting and fix all issues.
3. Run type checking and fix all errors.
4. Run build and ensure it succeeds.
5. Deploy the current changes to Vercel Preview.
6. Verify the deployed application works correctly.
7. Check browser console for errors.
8. Check server logs for errors.
9. Confirm all critical functionality works as expected.
10. Only after successful verification:
    - git add .
    - git commit
    - git push

## Strict Policy

- Never commit code that has not been verified on a Vercel deployment.
- Never push code before successful build and deployment verification.
- Fix all blocking errors before commit.
- Prefer small focused commits.
- Include meaningful commit messages.
- If deployment verification fails, do not commit or push until resolved.

## Token Usage & File Reading Rules

- Never scan the entire repository unless explicitly required.
- Read only the files necessary for the current task.
- Before opening files, identify the most likely relevant files.
- Prefer targeted searches over project-wide file reads.
- Minimize token consumption during analysis.
- Avoid repeatedly reading the same file.
- When investigating an issue, start with the smallest relevant scope.
- Do not load large generated files, build artifacts, lock files, or vendor directories unless absolutely necessary.
- Explain which files were inspected and why.
- Follow a "minimal context first" approach.

## Pull Request Checklist

- Build passes
- Type check passes
- Lint passes
- Vercel deployment succeeds
- Manual testing completed
- No critical console errors
- No critical server errors
