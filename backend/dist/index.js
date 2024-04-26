"use strict";
// import express from 'express';
// import multer from 'multer';
// import fs from 'fs';
// import crypto from 'crypto';
// import bodyParser from 'body-parser';
// import { ethers } from 'ethers';
// import defender from 'defender-relay-client';
// import { abi, contractAddress } from './contract-info';
// import dotenv from 'dotenv';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const relayerCredentials = {
//     apiKey: process.env.RELAYER_API_KEY,
//     apiSecret: process.env.RELAYER_SECRET_KEY
//   };
// const uploadDir = 'uploads/';
// if (!fs.existsSync(uploadDir)){
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// const app = express();
// app.use(bodyParser.json());
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: storage });
// app.post('/upload', upload.single('file'), (req, res) => {
//     if (req.file) {
//         const filePath = req.file.path;
//         fs.readFile(filePath, (err, data) => {
//             if (err) throw err;
//             const hash = crypto.createHash('sha256').update(data).digest('hex');
//             res.send({ message: "Document processed", hash: hash });
//         });
//     } else {
//         res.status(400).send({ message: "No file uploaded" });
//     }
// });
// const port = 3000;
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
const defender_sdk_1 = require("@openzeppelin/defender-sdk");
const ethers_1 = require("ethers");
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const crypto_1 = __importDefault(require("crypto"));
const contract_info_1 = require("./contract-info");
const dotenv_1 = __importDefault(require("dotenv"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
dotenv_1.default.config();
const credentials = {
    relayerApiKey: process.env.RELAYER_API_KEY,
    relayerApiSecret: process.env.RELAYER_SECRET_KEY
};
const client = new defender_sdk_1.Defender(credentials);
app.post('/upload', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send({ message: "No file uploaded" });
    }
    const filePath = req.file.path;
    try {
        const dataBuffer = fs_1.default.readFileSync(filePath);
        const hash = crypto_1.default.createHash('sha256').update(dataBuffer).digest('hex');
        const data = yield (0, pdf_parse_1.default)(dataBuffer);
        const text = data.text;
        const provider = client.relaySigner.getProvider();
        const signer = yield client.relaySigner.getSigner(provider, { speed: 'fast' });
        const contract = new ethers_1.ethers.Contract(contract_info_1.contractAddress, contract_info_1.abi, signer);
        const tx = yield contract.registerDocument(hash, text);
        yield tx.wait();
        res.send({ message: "Document processed and registered on blockchain", hash: hash, transaction: tx });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error processing file:', error);
            res.status(500).send({ message: "Blockchain interaction failed", error: error.message });
        }
        else {
            console.error('Unexpected error type:', error);
            res.status(500).send({ message: "Unknown error occurred" });
        }
    }
}));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map