# Reliability Checklist - FIT4110 Lab 03

Team/service: `team-iot` / `iot-ingestion`

## 1. Functional tests

- [x] Co test cho endpoint health: `GET /health`.
- [x] Co test happy path cho endpoint chinh: `POST /readings`.
- [x] Co kiem tra status code 2xx: 200 va 201.
- [x] Co kiem tra field quan trong trong response: `reading_id`, `accepted`, `items`, `service`.
- [x] Co test doc danh sach moi nhat: `GET /readings/latest`.

## 2. Auth tests

- [x] Co test thieu token: `POST /readings - missing token`.
- [x] Co test sai token: `POST /readings - invalid token`.
- [x] Endpoint public duoc khai bao ro: `GET /health` co `security: []`.
- [x] Local service kiem tra expected status 401/403. Mock Prism chi ghi nhan gioi han vi khong enforce auth that.

## 3. Negative tests

- [x] Co test thieu field bat buoc: thieu `device_id`.
- [x] Co test sai kieu du lieu: `value` la string.
- [x] Co test sai enum: `metric=temp_hot`.
- [x] Co test sai query parameter: `limit=abc`.
- [x] Loi tra ve theo ProblemDetails-compatible model.

## 4. Boundary tests

- [x] Co test max boundary: `value=80`.
- [x] Co test ngoai nguong: `value=81`.
- [x] Co test pagination/list boundary: `limit=101`.
- [x] Boundary test kiem tra response status/body, khong chi kiem request body.

## 5. Reliability tests co ban

- [x] Co kiem tra response time trong folder `06_Local_only_NonFunctional`.
- [x] Timeout/Newman readiness duoc xu ly bang `wait-on`, khong dung `sleep`.
- [x] Co rate limit test: `POST /readings - rate limit returns 429`.
- [x] Co consumer-side smoke test voi AI Vision mock: `POST {{aiVisionMockUrl}}/detect`.

## 6. Evidence

- [x] Collection export JSON: `postman/collections/FIT4110_lab03_iot_ingestion.postman_collection.json`.
- [x] Environment mock export JSON: `postman/environments/FIT4110_lab03_mock.postman_environment.json`.
- [x] Environment local export JSON: `postman/environments/FIT4110_lab03_local.postman_environment.json`.
- [x] Newman report XML/HTML: `reports/newman-report.xml`, `reports/newman-report.html`.
- [x] Local Newman report XML/HTML: `reports/newman-report-local.xml`, `reports/newman-report-local.html`.
- [x] Contract lint report: `reports/contract-lint-report.txt`.
- [x] Test-case matrix da dien: `templates/test-case-matrix.csv`.
- [x] Consumer-provider handshake da dien: `templates/consumer-provider-handshake.md`.

## Notes

- Mock environment validates contract examples and response shapes with Prism.
- Local environment runs against `npm run local:iot` on `http://localhost:8000` to prove auth, validation, boundary and rate-limit behavior beyond Prism examples.
