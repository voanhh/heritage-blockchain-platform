// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract HeritageRegistry {
    struct HeritageRecord {
        string heritageId;
        bytes32 dataHash;
        uint256 version;
        address verifier;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => HeritageRecord) private records;

    event HeritageRegistered(
        string indexed heritageId,
        bytes32 dataHash,
        uint256 version,
        address indexed verifier,
        uint256 timestamp
    );

    event HeritageUpdated(
        string indexed heritageId,
        bytes32 dataHash,
        uint256 version,
        address indexed verifier,
        uint256 timestamp
    );

    event HeritageVerified(
        string indexed heritageId,
        bytes32 dataHash,
        uint256 version,
        address indexed verifier,
        uint256 timestamp
    );

    function registerHeritage(string calldata heritageId, bytes32 dataHash, uint256 version) external {
        require(bytes(heritageId).length > 0, "heritageId is required");
        require(!records[heritageId].exists, "heritage already registered");

        records[heritageId] = HeritageRecord({
            heritageId: heritageId,
            dataHash: dataHash,
            version: version,
            verifier: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit HeritageRegistered(heritageId, dataHash, version, msg.sender, block.timestamp);
    }

    function updateHeritage(string calldata heritageId, bytes32 dataHash, uint256 version) external {
        require(records[heritageId].exists, "heritage is not registered");
        require(version > records[heritageId].version, "version must increase");

        records[heritageId] = HeritageRecord({
            heritageId: heritageId,
            dataHash: dataHash,
            version: version,
            verifier: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit HeritageUpdated(heritageId, dataHash, version, msg.sender, block.timestamp);
    }

    function verifyHeritage(string calldata heritageId, bytes32 dataHash, uint256 version) external {
        require(records[heritageId].exists, "heritage is not registered");
        HeritageRecord memory current = records[heritageId];
        require(current.dataHash == dataHash, "data hash mismatch");
        require(current.version == version, "version mismatch");

        emit HeritageVerified(heritageId, dataHash, version, msg.sender, block.timestamp);
    }

    function getHeritage(string calldata heritageId)
        external
        view
        returns (string memory, bytes32, uint256, address, uint256)
    {
        require(records[heritageId].exists, "heritage is not registered");
        HeritageRecord memory record = records[heritageId];
        return (record.heritageId, record.dataHash, record.version, record.verifier, record.timestamp);
    }
}

