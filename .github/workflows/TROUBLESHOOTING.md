# Troubleshooting GitHub Actions

## Artifact Conflict Errors

If you see an error like:
```
Error: Failed to CreateArtifact: Received non-retryable error: Failed request: (409) Conflict: an artifact with this name already exists on the workflow run
```

This typically happens when:
1. **Multiple workflows run simultaneously** - Fixed with concurrency control
2. **Workflow is re-run** - Artifacts from previous run conflict
3. **Cache artifacts conflict** - Fixed with unique cache scopes

### Solutions

1. **Wait for workflows to complete** before re-running
2. **Cancel in-progress workflows** if you push new changes
3. **Delete old artifacts** from previous workflow runs if needed

## Cache Issues

The workflows use GitHub Actions cache (`type=gha`) to speed up Docker builds. Each workflow and service combination has a unique cache scope to prevent conflicts:

- `simple-build-play` for the simple-build workflow, play service
- `simple-build-back` for the simple-build workflow, back service
- `CI-CD Pipeline-play` for the ci-cd workflow, play service
- etc.

If cache causes issues, you can:
- Remove the `cache-from` and `cache-to` lines (builds will be slower but won't conflict)
- Clear caches: Go to Actions → Caches → Delete caches

## Workflow Conflicts

Both `simple-build.yml` and `ci-cd.yml` run on the same triggers. To avoid conflicts:

1. **Disable one workflow** by commenting out triggers
2. **Use different branch triggers** - e.g., `simple-build.yml` on `develop`, `ci-cd.yml` on `main`
3. **Use workflow_dispatch only** for one of them

## Build Failures

If builds fail:
1. Check the workflow logs in the Actions tab
2. Ensure Dockerfiles exist in the service directories
3. Verify build context is correct
4. Check that all dependencies are properly installed

## Docker Registry Issues

If Docker images fail to push:
1. Verify `GITHUB_TOKEN` is available (automatically provided)
2. Check that package permissions are set correctly
3. Ensure the repository owner matches `${{ github.repository_owner }}`

## Need Help?

- Check workflow logs for detailed error messages
- Review [GitHub Actions documentation](https://docs.github.com/en/actions)
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide

