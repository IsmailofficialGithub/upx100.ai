import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '..', 'src', 'lib', 'agentvoices.json');
const voices = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const vapiDir = path.join(__dirname, '..', 'public', 'voices', 'Vapi');
const deepgramDir = path.join(__dirname, '..', 'public', 'voices', 'deapgram');

const vapiFiles = fs.existsSync(vapiDir) ? fs.readdirSync(vapiDir) : [];
const deepgramFiles = fs.existsSync(deepgramDir) ? fs.readdirSync(deepgramDir) : [];

const filteredVoices = [];

for (const voice of voices) {
  let matchedFile = null;
  const idLower = voice.id.toLowerCase();
  
  // Handle edge case for savanah
  const searchId = idLower === 'savanah' ? 'savannah' : idLower;

  if (voice.provider === 'vapi') {
    const file = vapiFiles.find(f => f.toLowerCase().includes(searchId));
    if (file) {
      matchedFile = `/voices/Vapi/${file}`;
    }
  } else if (voice.provider === 'deepgram') {
    const file = deepgramFiles.find(f => f.toLowerCase().includes(searchId));
    if (file) {
      matchedFile = `/voices/deapgram/${file}`;
    }
  }

  if (matchedFile) {
    voice.sample_url = matchedFile;
    filteredVoices.push(voice);
  } else {
    console.log(`Removing voice ${voice.id} because no audio file was found.`);
  }
}

fs.writeFileSync(jsonPath, JSON.stringify(filteredVoices, null, 4));
console.log(`\nUpdated agentvoices.json. Kept ${filteredVoices.length} voices.`);
