import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1787121448031 implements MigrationInterface {
    name = 'InitDatabase1787121448031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`organizations\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`organizationId\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`role\` enum ('ADMIN', 'DATA_PROVIDER', 'REVIEWER', 'USER') NOT NULL DEFAULT 'USER', \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`heritage_versions\` (\`id\` varchar(36) NOT NULL, \`heritageId\` varchar(255) NOT NULL, \`version\` int NOT NULL, \`canonicalData\` json NOT NULL, \`dataHash\` varchar(64) NOT NULL, \`createdBy\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blockchain_records\` (\`id\` varchar(36) NOT NULL, \`heritageId\` varchar(255) NOT NULL, \`dataHash\` varchar(64) NOT NULL, \`version\` int NOT NULL, \`verifier\` varchar(255) NOT NULL, \`transactionHash\` varchar(255) NULL, \`blockNumber\` int NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`heritages\` (\`id\` varchar(36) NOT NULL, \`heritageCode\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`category\` varchar(255) NOT NULL, \`source\` varchar(255) NOT NULL, \`sourceOrganization\` varchar(255) NOT NULL, \`sourceReference\` text NOT NULL, \`status\` enum ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT', \`createdBy\` varchar(255) NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_709b9e88800dee372e03e9e2c4\` (\`heritageCode\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verifications\` (\`id\` varchar(36) NOT NULL, \`heritageId\` varchar(255) NOT NULL, \`reviewerId\` varchar(255) NULL, \`status\` enum ('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING', \`notes\` text NULL, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD CONSTRAINT \`FK_f3d6aea8fcca58182b2e80ce979\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organizations\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`heritage_versions\` ADD CONSTRAINT \`FK_7811f2b6938c4bbcc9af7b2e1c2\` FOREIGN KEY (\`heritageId\`) REFERENCES \`heritages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`heritage_versions\` ADD CONSTRAINT \`FK_c6285223d8ea33e0f408eb61723\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`blockchain_records\` ADD CONSTRAINT \`FK_0ea62522c2a23b5865a31648994\` FOREIGN KEY (\`heritageId\`) REFERENCES \`heritages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`heritages\` ADD CONSTRAINT \`FK_39cd568e83e08fc6908dcb26d66\` FOREIGN KEY (\`createdBy\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verifications\` ADD CONSTRAINT \`FK_bcc966deaad09ea5667ef911e06\` FOREIGN KEY (\`heritageId\`) REFERENCES \`heritages\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verifications\` ADD CONSTRAINT \`FK_ebf3a6d613aba620801fb712f88\` FOREIGN KEY (\`reviewerId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verifications\` DROP FOREIGN KEY \`FK_ebf3a6d613aba620801fb712f88\``);
        await queryRunner.query(`ALTER TABLE \`verifications\` DROP FOREIGN KEY \`FK_bcc966deaad09ea5667ef911e06\``);
        await queryRunner.query(`ALTER TABLE \`heritages\` DROP FOREIGN KEY \`FK_39cd568e83e08fc6908dcb26d66\``);
        await queryRunner.query(`ALTER TABLE \`blockchain_records\` DROP FOREIGN KEY \`FK_0ea62522c2a23b5865a31648994\``);
        await queryRunner.query(`ALTER TABLE \`heritage_versions\` DROP FOREIGN KEY \`FK_c6285223d8ea33e0f408eb61723\``);
        await queryRunner.query(`ALTER TABLE \`heritage_versions\` DROP FOREIGN KEY \`FK_7811f2b6938c4bbcc9af7b2e1c2\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_f3d6aea8fcca58182b2e80ce979\``);
        await queryRunner.query(`DROP TABLE \`verifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_709b9e88800dee372e03e9e2c4\` ON \`heritages\``);
        await queryRunner.query(`DROP TABLE \`heritages\``);
        await queryRunner.query(`DROP TABLE \`blockchain_records\``);
        await queryRunner.query(`DROP TABLE \`heritage_versions\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`organizations\``);
    }

}
