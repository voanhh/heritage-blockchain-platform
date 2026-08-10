import { BlockchainRecord } from './blockchain-record.model.js';
import { Heritage } from './heritage.model.js';
import { HeritageVersion } from './heritage-version.model.js';
import { Organization } from './organization.model.js';
import { User } from './user.model.js';
import { Verification } from './verification.model.js';

Organization.hasMany(User, { foreignKey: 'organizationId' });
User.belongsTo(Organization, { foreignKey: 'organizationId' });

Heritage.hasMany(HeritageVersion, { foreignKey: 'heritageId' });
HeritageVersion.belongsTo(Heritage, { foreignKey: 'heritageId' });

Heritage.hasMany(Verification, { foreignKey: 'heritageId' });
Verification.belongsTo(Heritage, { foreignKey: 'heritageId' });

Heritage.hasMany(BlockchainRecord, { foreignKey: 'heritageId' });
BlockchainRecord.belongsTo(Heritage, { foreignKey: 'heritageId' });

export { BlockchainRecord, Heritage, HeritageVersion, Organization, User, Verification };

