# dummy-web-app

Minimal static web app for Azure Static Web Apps deployments.

## Build

```bash
pnpm --filter dummy-web-app build
```

The build copies the static assets from `public/` to `dist/`.

## Release

Use the GitHub Actions workflow in `.github/workflows/deploy_static_web_app.yaml`.

Preview deployments are triggered by pull requests targeting `main` when the
dummy app or its release workflow changes.

Production deployments are triggered only by tags matching
`dummy-web-app@<semver>`.

For automatic runs, configure these repository variables:

- `DUMMY_WEB_APP_STATIC_WEB_APP_NAME` required
- `DUMMY_WEB_APP_RESOURCE_GROUP_NAME` optional, defaults to `dx-d-itn-playground-rg-01`
- `DUMMY_WEB_APP_ENVIRONMENT` optional, defaults to `app-dev`
- `DUMMY_WEB_APP_USE_PRIVATE_AGENT` optional, defaults to `true`
- `DUMMY_WEB_APP_USE_LABELS` optional, defaults to `false`
- `DUMMY_WEB_APP_OVERRIDE_LABELS` optional