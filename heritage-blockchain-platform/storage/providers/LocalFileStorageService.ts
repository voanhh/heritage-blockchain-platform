import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { IFileStorageService, StoredFileMetadata } from '../interfaces/IFileStorageService';

export class LocalFileStorageService implements IFileStorageService {
  constructor(private readonly basePath: string) {}

  async save(file: Buffer, metadata: Omit<StoredFileMetadata, 'storageKey'>): Promise<StoredFileMetadata> {
    await mkdir(this.basePath, { recursive: true });
    const storageKey = `${Date.now()}-${metadata.originalName}`;
    await writeFile(join(this.basePath, storageKey), file);
    return { ...metadata, storageKey };
  }

  async get(storageKey: string): Promise<Buffer> {
    return readFile(join(this.basePath, storageKey));
  }

  async remove(storageKey: string): Promise<void> {
    await rm(join(this.basePath, storageKey), { force: true });
  }
}

