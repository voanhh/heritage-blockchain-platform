import { AppDataSource } from '../config/database.js';
import { Organization } from '../models/organization.model.js';
import { CreateOrganizationDto } from '../types/dto/create-organization.dto.js';
import { RequestStatus } from '../types/enums/organization.enum.js';

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
}
