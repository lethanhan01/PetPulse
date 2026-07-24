# PetPulse

Static frontend PetPulse được xây dựng bằng React, TypeScript, Vite và Tailwind CSS. Đây hiện là bản demo: dữ liệu và đăng nhập đều là mock, không có API hay secret runtime.

## Yêu cầu

- [Node.js](https://nodejs.org/) 22.x (xem `.nvmrc`)
- npm, đi kèm Node.js

## Phát triển local

```bash
npm ci
npm run dev
```

Vite mặc định chạy tại [http://localhost:5173](http://localhost:5173). Chạy `npm install` chỉ khi chủ động cập nhật dependency; dùng `npm ci` cho môi trường sạch và CI.

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Admin | `admin@petpulse.vn` | `paw123` |
| User | `an@example.com` | `paw123` |

## Quality gate

```bash
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run ci
```

`npm run ci` chạy lint, typecheck, test và build theo đúng thứ tự. CI cũng chạy `npm audit --omit=dev --audit-level=high`; chỉ vulnerability high/critical trong dependency runtime mới chặn merge.

## Biến môi trường

Client chỉ đọc biến có tiền tố `VITE_`. Những giá trị này được đóng gói vào JavaScript gửi đến trình duyệt, vì vậy không được đặt token, password, API secret hoặc credential trong chúng. Xem `.env.example` để biết mẫu cấu hình public.

## Triển khai Vercel

1. Kết nối repository `lethanhan01/PetPulse` trong Vercel qua Git Integration.
2. Chọn `main` là **Production Branch** và Node.js 22.x trong Project Settings.
3. Vercel dùng `npm run build` và deploy thư mục `dist`; commit ngoài `main` tạo Preview Deployment, commit vào `main` tạo Production Deployment.
4. Nếu sau này có public API base URL, khai báo biến `VITE_*` riêng cho Preview/Production trong Vercel rồi redeploy. Không khai báo secret phía client.

## Bảo vệ nhánh

Repository administrator cần bảo vệ `main` và bắt buộc status check `CI / quality` trước khi merge. Thiết lập này cùng Git Integration là cấu hình quản trị bên ngoài repository, không thể áp dụng chỉ bằng code.
