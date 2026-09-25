import { AppDataSource } from "../config/database.js";
import { HeritageVersionMedia } from "../models/heritage-version-media.model.js";
import { HeritageVersion } from "../models/heritage-version.model.js";
import { Heritage } from "../models/heritage.model.js";
import { HeritageStatus } from "../types/enums/heritage.enum.js";
import { HeritageSnapshot } from "../types/interface/heritage-snapshot.type.js";
import { sha256 } from "../utils/hash.until.js";
import { BlockchainService } from "./blockchain.service.js";
export class HeritageVersionService {
  static async publish(
    heritageId: string,
    adminId: string
  ): Promise<HeritageVersion> {
    const savedVersion = await AppDataSource.transaction(async (manager) => {
      const heritageRepo = manager.getRepository(Heritage);
      const versionRepo = manager.getRepository(HeritageVersion);
      const versionMediaRepo = manager.getRepository(HeritageVersionMedia);

      const heritage = await heritageRepo
        .createQueryBuilder('heritage')
        .leftJoinAndSelect('heritage.field', 'field')
        .leftJoinAndSelect('heritage.media', 'media')
        .where('heritage.id = :heritageId', { heritageId })
        .setLock('pessimistic_write')
        .getOne();

      if (!heritage) {
        throw new Error('Không tìm thấy Heritage');
      }

      if (heritage.status !== HeritageStatus.VERIFIED) {
        throw new Error('Chỉ Heritage đã được VERIFIED mới được Publish');
      }

      if (!heritage.sourceDocumentCid) {
        throw new Error('Heritage chưa có SourceDocumentId');
      }

      //get next version
      const latestVersion = await versionRepo
        .createQueryBuilder('version')
        .select('MAX(version.version)', 'max')
        .where('version.heritageId = :heritageId', { heritageId })
        .getRawOne<{ max: number | null }>();

      const nextVersion = (latestVersion?.max ?? 0) + 1;

      const media = [...(heritage.media ?? [])]
        .sort((a, b) => {
          if (a.order !== b.order) {
            return a.order - b.order;
          }

          return a.id.localeCompare(b.id);
        });

      const snapshot: HeritageSnapshot = {
        schemaVersion: 1,

        heritage: {
          heritageCode: heritage.heritageCode,
          name: heritage.name,
          description: heritage.description,
          location: heritage.location,

          source: heritage.source,
          sourceOrganization: heritage.sourceOrganization,

          sourceDocumentNumber:
            heritage.sourceDocumentNumber ?? null,

          sourceUrl: heritage.sourceUrl ?? null,

          sourceDocumentCid:
            heritage.sourceDocumentCid ?? null,

          recognizedAt: heritage.recognizedAt
            ? heritage.recognizedAt.toISOString()
            : null,
        },

        field: {
          code: heritage.field.code,
          name: heritage.field.name,
        },

        media: media.map(item => ({
          type: item.type,
          cid: item.cid,
          caption: item.caption as string | null,
          order: item.order
        }))
      }

      //hash snapshot
      const dataHash = sha256(snapshot);

      //create heritage version
      const version = versionRepo.create({
        heritageId: heritage.id,
        version: nextVersion,
        canonicalData: snapshot,
        dataHash,
        createdBy: adminId
      })

      const saved = await versionRepo.save(version);

      //copy media ---> version Media
      if (media.length > 0) {
        const versionMediaEntities = media.map((item) => {
          return versionMediaRepo.create({
            versionId: saved.id!,
            type: item.type,
            url: item.url,
            cid: item.cid,
            caption: item.caption,
            order: item.order,
            fileName: item.fileName,
            mimeType: item.mimeType,
            fileSize: item.fileSize,
            thumbnailUrl: item.thumbnailUrl
          });
        });

        await versionMediaRepo.save(versionMediaEntities);
      }

      return versionRepo.findOneOrFail({
        where: {
          id: saved.id,
        },
        relations: [
          'heritage',
          'heritage.field',
          'media',
          'media.media',
        ],
      });
    })

    const blockchainResult = await BlockchainService.publishVersion(
      savedVersion.heritageId,
      savedVersion.version,
      savedVersion.dataHash
    );

    // PHASE 3: UPDATE DATABASE SAU KHI BLOCKCHAIN SUCCESS
    // =========================================================

    const versionRepo =
      AppDataSource.getRepository(HeritageVersion);

    const heritageRepo =
      AppDataSource.getRepository(Heritage);

    // ---------------------------------------------------------
    // 12. Lưu transaction hash
    // ---------------------------------------------------------

    savedVersion.blockchainTxHash =
      blockchainResult.txHash;

    await versionRepo.save(savedVersion);

    // ---------------------------------------------------------
    // 13. Đổi Heritage -> PUBLISHED
    // ---------------------------------------------------------

    await heritageRepo.update(
      savedVersion.heritageId,
      {
        status: HeritageStatus.PUBLISHED,
      }
    );

    // ---------------------------------------------------------
    // 14. Return version cuối cùng
    // ---------------------------------------------------------

    return versionRepo.findOneOrFail({
      where: {
        id: savedVersion.id,
      },
      relations: [
        "heritage",
        "heritage.field",
        "media",
        "media.media",
      ],
    });

  }

}
