import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('HeritageRegistry', function () {
  it('registers and returns a heritage hash record', async function () {
    const registry = await ethers.deployContract('HeritageRegistry');
    const hash = `0x${'a'.repeat(64)}`;

    await registry.registerHeritage('HER-001', hash, 1);
    const record = await registry.getHeritage('HER-001');

    expect(record[0]).to.equal('HER-001');
    expect(record[1]).to.equal(hash);
    expect(record[2]).to.equal(1n);
  });
});

