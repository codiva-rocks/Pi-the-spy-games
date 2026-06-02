# Pi-the-spy-games

## Deploying to Google Cloud Run

This project contains a minimal Node/Express static server (`server.js`) and a `Dockerfile` to run on Cloud Run.

Quick local steps:

```bash
npm install
npm start
# open http://localhost:8080
```

Build & deploy with gcloud:

```bash
# set these first
gcloud config set project YOUR_PROJECT_ID
gcloud auth configure-docker

# build and push
docker build -t gcr.io/YOUR_PROJECT_ID/math-games:latest .
docker push gcr.io/YOUR_PROJECT_ID/math-games:latest

# deploy to Cloud Run
gcloud run deploy math-games --image gcr.io/YOUR_PROJECT_ID/math-games:latest --platform managed --region YOUR_REGION --allow-unauthenticated
```

Or use the included GitHub Actions workflow `.github/workflows/cloud-run.yml`. The workflow expects these repository secrets:

- `GCP_SA_KEY` — JSON service account key (base64 or literal)
- `GCP_PROJECT` — Google Cloud Project ID
- `CLOUD_RUN_SERVICE` — desired Cloud Run service name (e.g. `math-games`)
- `CLOUD_RUN_REGION` — region (e.g. `us-central1`)
