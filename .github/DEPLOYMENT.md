# GitHub Actions Deployment Guide

This repository includes GitHub Actions workflows for automated building, testing, and deployment.

## Available Workflows

### 1. Simple Build & Test (`simple-build.yml`)
- **Triggers**: Push to `develop`, `main`, or `master` branches, or pull requests
- **What it does**:
  - Installs dependencies
  - Builds the play frontend
  - Optionally builds Docker images for `play` and `back` services

### 2. CI/CD Pipeline (`ci-cd.yml`)
- **Triggers**: Push, pull requests, or manual dispatch
- **What it does**:
  - Full build and test suite
  - Builds Docker images for all services
  - Creates releases on tag pushes

## Setting Up GitHub Actions

### Prerequisites
1. Your repository is already on GitHub at: `git@github.com:eyaskin/workadventure.git`
2. GitHub Actions are enabled by default (no setup needed)

### Publishing Docker Images

To publish Docker images to GitHub Container Registry (ghcr.io):

1. **Images will be automatically published** when you push to the `develop` branch
2. Images will be available at:
   - `ghcr.io/eyaskin/workadventure-play:latest`
   - `ghcr.io/eyaskin/workadventure-back:latest`

3. **To use the images**:
   ```bash
   docker pull ghcr.io/eyaskin/workadventure-play:latest
   docker pull ghcr.io/eyaskin/workadventure-back:latest
   ```

### Manual Deployment

You can manually trigger workflows:

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. Select the workflow you want to run
4. Click **Run workflow** button

### Viewing Workflow Results

1. Go to the **Actions** tab in your GitHub repository
2. Click on any workflow run to see detailed logs
3. Green checkmark = success, red X = failure

## Customizing Workflows

### Change Docker Image Names

Edit `.github/workflows/simple-build.yml` and update:
```yaml
tags: ghcr.io/${{ github.repository_owner }}/workadventure-${{ matrix.service }}:latest
```

### Add More Services

Edit the `matrix.service` array:
```yaml
matrix:
  service: [play, back, map-storage, uploader, maps]
```

### Deploy to Other Platforms

You can add deployment steps to push to:
- Docker Hub
- AWS ECR
- Azure Container Registry
- Google Container Registry

Example for Docker Hub:
```yaml
- name: Log in to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKER_USERNAME }}
    password: ${{ secrets.DOCKER_PASSWORD }}

- name: Build and push
  uses: docker/build-push-action@v5
  with:
    push: true
    tags: docker.io/yourusername/workadventure-play:latest
```

**Note**: You'll need to add `DOCKER_USERNAME` and `DOCKER_PASSWORD` as secrets in your repository settings.

## Repository Secrets

To add secrets for deployments:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add your secrets (e.g., API keys, passwords)

Common secrets you might need:
- `DOCKER_USERNAME` - Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub password/token
- `AWS_ACCESS_KEY_ID` - For AWS deployments
- `AWS_SECRET_ACCESS_KEY` - For AWS deployments

## Troubleshooting

### Workflows not running?
- Check that GitHub Actions are enabled in repository Settings → Actions → General
- Ensure you're pushing to the correct branch (develop, main, or master)

### Docker build failing?
- Check that Dockerfiles exist in the service directories
- Verify the build context is correct in the workflow file
- Check workflow logs for specific error messages

### Permission denied errors?
- Ensure `GITHUB_TOKEN` secret is available (automatically provided)
- For private registries, add the required secrets

## Next Steps

1. **Commit and push your changes** to trigger workflows:
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions workflows"
   git push origin develop
   ```

2. **Check the Actions tab** to see workflows running

3. **Pull Docker images** after successful builds:
   ```bash
   docker pull ghcr.io/eyaskin/workadventure-play:latest
   ```

4. **Customize workflows** based on your deployment needs

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

