// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract DocumentCertifier is Ownable {
    mapping(string => bool) public certifiedDocuments;

    event DocumentCertified(string hash);

    function certifyDocument(string memory documentHash) public onlyOwner {
        certifiedDocuments[documentHash] = true;
        emit DocumentCertified(documentHash);
    }

    function isDocumentCertified(string memory documentHash) public view returns (bool) {
        return certifiedDocuments[documentHash];
    }
}
