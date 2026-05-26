# GITHUB ACTIONS GUIDE — Chạy Newman trong CI

Repo này có workflow:

```text
.github/workflows/newman.yml
```

Workflow sẽ chạy khi:

- push lên nhánh `main`
- tạo pull request vào `main`

## Cách đọc kết quả

Trong GitHub:

```text
Actions → Newman Contract Tests → job test
```

Nếu test fail, sinh viên cần xem:

- request nào fail
- expected status là gì
- response thực tế là gì
- môi trường đang dùng là mock hay local

## Lưu ý

Workflow chay voi mock environment trong CI, vi service local that thuong khong duoc deploy trong GitHub Actions.
Local verification co the chay tren may dev bang:

```bash
npm run local:iot
npm run mock:vision
npx wait-on http-get://localhost:8000/health http-get://localhost:4011/health
npm run test:local
```
