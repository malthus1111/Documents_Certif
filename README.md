# Document Certification on Ethereum Blockchain

This project provides an API backend built in TypeScript for certifying documents on the Ethereum blockchain. 
The system allows users to certify documents by hashing the document data and deploying the hash to the blockchain using OpenZeppelin Defender.

## Features
- Document Hashing: Extracts data from the document to be certified and generates a hash.
- Blockchain Deployment: Deploys the hash to the Ethereum blockchain via a transaction.
- OpenZeppelin Defender Integration: Uses OpenZeppelin Defender Relayer to call the ABI of the deployed smart contract.
- Verification: Includes clear text data and hash in transaction input data on Etherscan for verification purposes.

## Workflow
1) Document Data Extraction: The API extracts data from the document to be certified.
2) Hash Generation: The extracted data is hashed using a cryptographic hashing algorithm.
3) Blockchain Transaction: The hash and clear text data of the document are sent to the smart contract deployed on the Ethereum blockchain.
4) Transaction Details: The transaction includes the clear text data and hash in the input data on Etherscan.
5) Verification: To verify the certification, the document can be hashed again, and the new hash can be compared to the hash stored on the blockchain.

## Prerequisites
- Node.js
- TypeScript
- OpenZeppelin Defender account
- Ethereum account with funds for transaction fees

## Smart Contract
The smart contract is deployed on the Ethereum blockchain and handles the storage of document hashes. It uses the OpenZeppelin library for secure and efficient smart contract development.

## How to Verify a Document
1) Hash the document data you want to verify.
2) Retrieve the transaction details from Etherscan using the transaction hash.
3) Compare the hash from the transaction input data with the newly generated hash.
4) If both hashes match, the document is certified.

## License
This project is licensed under the MIT License.



