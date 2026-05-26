# Consumer-Provider Handshake

## Thong tin chung

- Lab: FIT4110 Lab 03
- Ngay: 2026-05-26
- Provider team: `team-vision`
- Consumer team: `team-iot`
- Provider service: AI Vision API
- Consumer service: IoT Ingestion API

## Contract

- Contract file: `contracts/ai-vision.openapi.yaml`
- Mock base URL: `{{aiVisionMockUrl}}` = `http://localhost:4011`
- Auth method: Bearer token from Postman environment `{{authToken}}`
- Endpoint duoc test: `POST /detect`

## Smoke test

### Success request

```http
POST /detect
Authorization: Bearer {{authToken}}
Content-Type: application/json
```

```json
{
  "camera_id": "CAM01",
  "image_url": "https://example.com/frame.jpg"
}
```

### Expected success response

```json
{
  "detection_id": "DET001",
  "camera_id": "CAM01",
  "label": "person",
  "confidence": 0.91,
  "risk_level": "medium"
}
```

### Error request

```http
POST /detect
Authorization: Bearer {{authToken}}
Content-Type: application/json
Prefer: code=400
```

```json
{
  "camera_id": "CAM01"
}
```

### Expected error response

```json
{
  "type": "https://smart-campus.local/problems/invalid-image",
  "title": "Invalid image",
  "status": 400,
  "detail": "image_url or image_base64 is required",
  "instance": "/detect"
}
```

## Ket qua

- [x] Consumer goi mock thanh cong.
- [x] Consumer parse duoc `detection_id`, `camera_id`, `label`, `confidence`, `risk_level`.
- [x] Consumer hieu loi 4xx provider tra ve qua ProblemDetails.
- [x] Co Newman report: `reports/newman-report.xml` va `reports/newman-report.html`.

## Ghi chu thay doi hop dong

| Noi dung | Truoc | Sau | Nguoi dong y |
|---|---|---|---|
| Detection request image input | Chi mo ta trong description | Them `anyOf` yeu cau `image_url` hoac `image_base64` | team-iot, team-vision |
| Detection response required fields | `camera_id` chua bat buoc | Them `camera_id` vao `required` | team-iot, team-vision |
| Provider overload behavior | Chua co 429 | Them response `429 Too Many Requests` | team-iot, team-vision |

## Xac nhan

- Provider representative: team-vision representative
- Consumer representative: team-iot representative
