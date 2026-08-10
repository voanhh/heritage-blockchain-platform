# Storage Layer

Phase 1 chi tao abstraction cho file storage.

`IFileStorageService` dinh nghia interface chung de business logic khong phu thuoc vao Local, S3 hay IPFS.

`LocalFileStorageService` la provider mau cho moi truong local. IPFS/S3 se duoc bo sung o cac phase sau neu can.

File storage luu media, PDF, audio, video va tai lieu nguon. Database chi luu metadata va reference den file.

