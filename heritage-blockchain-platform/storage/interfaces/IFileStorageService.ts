export type StoredFileMetadata = {
  storageKey: string;
  originalName: string;
  mimeType: string;
  size: number;
  checksum?: string;
};

export interface IFileStorageService {
  save(file: Buffer, metadata: Omit<StoredFileMetadata, 'storageKey'>): Promise<StoredFileMetadata>;
  get(storageKey: string): Promise<Buffer>;
  remove(storageKey: string): Promise<void>;
}

