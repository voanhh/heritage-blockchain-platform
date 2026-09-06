import { AppDataSource } from '../config/database.js';
import { Organization } from '../models/organization.model.js';
import { User } from '../models/user.model.js';
import { CreateOrganizationDto, UpdateOrgStatusDto } from '../types/dto/organization.dto.js';
import { RequestStatus } from '../types/enums/organization.enum.js';
import { UserRole } from '../types/enums/rbac.js';

export class OrganizationService {
  private static get orgRepository() {
    return AppDataSource.getRepository(Organization);
  }

  static async createOrganizationRequest(userId: string, dto: CreateOrganizationDto) {
    const existingOrg = await this.orgRepository.findOne({
      where: [
        { name: dto.name.trim() },
        { contactEmail: dto.contactEmail.trim() }
      ]
    });

    if (existingOrg) {
      throw new Error('ORGANIZATION_OR_EMAIL_ALREADY_EXISTS');
    }
    console.log(userId)
    const newOrg = this.orgRepository.create({
      name: dto.name.trim(),
      description: dto.description.trim(),
      contactEmail: dto.contactEmail.trim(),
      legalDocumentUrls: dto.legalDocumentUrls,
      status: RequestStatus.PENDING,
      requesterId: userId
    });

    return this.orgRepository.save(newOrg);
  }

  //lay danh sach cho duyet
  static async getPendingOrganizations() {
    return this.orgRepository.find({
      where: { status: RequestStatus.PENDING },
      order: { createdAt: 'DESC' }
    });
  }

  static async updateOrganizationStatus(orgId: string, dto: UpdateOrgStatusDto) {
    const org = await this.orgRepository.findOne({ where: { id: orgId } });
    if (!org) throw new Error('ORGANIZATION_NOT_FOUND');

    if (org.status !== RequestStatus.PENDING) {
      throw new Error('ORGANIZATION_ALREADY_PROCESSED');
    }

    // Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu
    return await AppDataSource.transaction(async (transactionalEntityManager) => {
      org.status = dto.status;

      if (dto.status === RequestStatus.APPROVED) {
        // Nâng quyền người nộp hồ sơ thành ORG_ADMIN của tổ chức này
        await transactionalEntityManager.update(User, org.requesterId, {
          role: UserRole.ORG_ADMIN,
          organizationId: org.id
        });
      }

      return await transactionalEntityManager.save(Organization, org);
    });
  }

  static async getApprovedOrganizations() {
    return this.orgRepository.find({
      where: { status: RequestStatus.APPROVED },
      select: ['id', 'name', 'description', 'contactEmail', 'createdAt'],
      order: { createdAt: 'DESC' }
    });
  }

  // 2. Lấy chi tiết 1 tổ chức theo ID
  static async getOrganizationById(id: string) {
    const org = await this.orgRepository.findOne({ where: { id } });
    if (!org) throw new Error('ORGANIZATION_NOT_FOUND');
    return org;
  }
}
