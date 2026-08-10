import { createHash } from 'node:crypto';

export type CanonicalHeritageData = {
  heritageCode: string;
  name: string;
  description: string;
  source: string;
  version: number;
};

export class HashService {
  canonicalizeHeritageData(data: CanonicalHeritageData) {
    const canonical = {
      description: data.description.trim(),
      heritageCode: data.heritageCode.trim(),
      name: data.name.trim(),
      source: data.source.trim(),
      version: data.version
    };

    return JSON.stringify(canonical);
  }

  createSha256Hash(data: CanonicalHeritageData) {
    return createHash('sha256').update(this.canonicalizeHeritageData(data)).digest('hex');
  }

  toBytes32Hex(sha256Hex: string) {
    return `0x${sha256Hex}`;
  }
}

