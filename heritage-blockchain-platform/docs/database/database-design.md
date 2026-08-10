# Database Design

Phase 1 chuẩn bị các model:

- `User`
- `Organization`
- `Heritage`
- `HeritageVersion`
- `Verification`
- `BlockchainRecord`

Quan hệ nền tảng:

```text
Organization -> Users
Heritage -> HeritageVersions
Heritage -> Verifications
Heritage -> BlockchainRecords
```

`Heritage` bắt buộc có `source`, `sourceOrganization` và `sourceReference` để bảo đảm hồ sơ nghiên cứu luôn có nguồn gốc dữ liệu rõ ràng.

Database lưu dữ liệu nghiệp vụ có thể truy vấn, cập nhật, phân quyền và báo cáo. Blockchain chỉ lưu bằng chứng bất biến.

