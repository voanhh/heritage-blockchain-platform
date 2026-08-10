# System Architecture

Hệ thống sử dụng kiến trúc monorepo gồm frontend, backend, blockchain, storage và docs.

Luồng chính:

```text
Nguồn dữ liệu
      |
Hồ sơ di sản
      |
Kiểm duyệt
      |
Canonicalization
      |
SHA-256
      |
Blockchain
      |
Verification
      |
Đánh giá tính toàn vẹn
```

Backend áp dụng phân lớp:

```text
Route -> Controller -> Service -> Model -> Database
```

Blockchain integration áp dụng:

```text
Controller -> Service -> BlockchainService -> ethers.js -> Smart Contract
```

