import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTableRefreshToken1787154760112 implements MigrationInterface {
    name = 'AddNewTableRefreshToken1787154760112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`token\` varchar(512) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`device_id\` varchar(128) NOT NULL DEFAULT 'default', \`expires_at\` timestamp NOT NULL, \`is_revoked\` tinyint NOT NULL DEFAULT 0, \`replaced_by\` varchar(255) NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refresh_token\` ADD CONSTRAINT \`FK_6bbe63d2fe75e7f0ba1710351d4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_6bbe63d2fe75e7f0ba1710351d4\``);
        await queryRunner.query(`DROP INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` ON \`refresh_token\``);
        await queryRunner.query(`DROP TABLE \`refresh_token\``);
    }

}
