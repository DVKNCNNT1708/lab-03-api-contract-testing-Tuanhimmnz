# Submission Checklist - Lab 03

Repo: `DVKNCNNT1708/lab-03-api-contract-testing-Tuanhimmnz`

## Required files

- [x] `contracts/iot-ingestion.openapi.yaml`
- [x] `contracts/ai-vision.openapi.yaml`
- [x] `postman/collections/FIT4110_lab03_iot_ingestion.postman_collection.json`
- [x] `postman/environments/FIT4110_lab03_mock.postman_environment.json`
- [x] `postman/environments/FIT4110_lab03_local.postman_environment.json`
- [x] `reports/newman-report.xml`
- [x] `reports/newman-report.html`
- [x] `reports/newman-report-local.xml`
- [x] `reports/newman-report-local.html`
- [x] `reports/contract-lint-report.txt`
- [x] `checklists/reliability_checklist.md`
- [x] `templates/test-case-matrix.csv`
- [x] `templates/consumer-provider-handshake.md`
- [x] `.github/workflows/newman.yml`

## Verification commands

```bash
npm ci
npm run lint:contracts
npm run lint:contracts:report
npm run mock:iot
npm run mock:vision
npm run test:mock
npm run local:iot
npm run test:local
```

## Submission note

- Mock report proves the OpenAPI contract can be exercised before the real provider is finished.
- Local report proves real auth and validation behavior using the included local IoT service on port 8000.
- GitHub Actions runs contract lint, starts both Prism mocks, waits with `wait-on`, runs Newman, and uploads reports as artifacts.
