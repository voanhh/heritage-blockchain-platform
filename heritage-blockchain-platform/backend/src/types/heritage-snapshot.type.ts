// types/interface/heritage-snapshot.ts

export interface HeritageSnapshot {
  schemaVersion: number;

  heritage: {
    id: string;
    heritageCode: string;
    name: string;
    description: string;
    location: unknown;
    source: string;
    sourceOrganization: string;
    sourceDocumentNumber: string | null;
    sourceUrl: string | null;
    sourceDocumentCid: string | null;
    recognizedAt: string | null;
  };

  field: {
    id: string;
    code: string;
    name: string;
  };

  media: {
    id: string;
    type: string;
    cid: string;
    caption: string | null;
    order: number;
    fileName: string | null;
    mimeType: string | null;
    fileSize: number | null;
  }[];
}
