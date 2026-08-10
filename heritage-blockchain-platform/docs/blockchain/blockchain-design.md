# Blockchain Design

Smart contract `HeritageRegistry` chỉ lưu dữ liệu cần bất biến:

- `heritageId`
- `dataHash`
- `version`
- `verifier`
- `timestamp`

Contract chuẩn bị các hàm:

- `registerHeritage`
- `updateHeritage`
- `verifyHeritage`
- `getHeritage`

Không lưu toàn bộ hồ sơ trên chain. Không triển khai NFT, token, marketplace hoặc payment trong Phase 1.

