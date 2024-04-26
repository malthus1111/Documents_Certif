import { Defender } from '@openzeppelin/defender-sdk';
import { ethers } from 'ethers';
import fs from 'fs';
import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import { abi, contractAddress } from './contract-info';
import dotenv from 'dotenv';
import pdf from 'pdf-parse';

const app = express();
const upload = multer({ dest: 'uploads/' });
dotenv.config();

const credentials = {
  relayerApiKey: process.env.RELAYER_API_KEY,
  relayerApiSecret: process.env.RELAYER_SECRET_KEY
};

const client = new Defender(credentials);

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(dataBuffer).digest('hex');

    const data = await pdf(dataBuffer);
    const text = data.text;

    const provider = client.relaySigner.getProvider();
    const signer = await client.relaySigner.getSigner(provider, { speed: 'fast' });
    const contract = new ethers.Contract(contractAddress, abi, signer as ethers.Signer);

    const tx = await contract.registerDocument(hash, text);
    await tx.wait();
    res.send({ message: "Document processed and registered on blockchain", hash: hash, transaction: tx });
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error('Error processing file:', error);
        res.status(500).send({ message: "Blockchain interaction failed", error: error.message });
    } else {
        console.error('Unexpected error type:', error);
        res.status(500).send({ message: "Unknown error occurred" });
    }
}
});
    
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


