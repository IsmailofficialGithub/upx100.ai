import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiKey = '2813e8b3c4e312788f157582f22e2776a8831602';
const voicesPath = path.join(__dirname, '..', 'src', 'lib', 'agentvoices.json');
const voices = JSON.parse(fs.readFileSync(voicesPath, 'utf8'));
const deepgramVoices = voices.filter(v => v.provider === 'deepgram');

const publicVoicesDir = path.join(__dirname, '..', 'public', 'voices');
if (!fs.existsSync(publicVoicesDir)) {
  fs.mkdirSync(publicVoicesDir, { recursive: true });
}

async function downloadVoice(voice) {
  return new Promise((resolve) => {
    const text = `Hi, I am ${voice.name}. This is my voice.`;
    const data = JSON.stringify({ text });
    const options = {
      hostname: 'api.deepgram.com',
      path: `/v1/speak?model=aura-${voice.id}-en`,
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, res => {
      if (res.statusCode !== 200) {
        console.error(`Failed to download ${voice.id}: HTTP ${res.statusCode}`);
        res.resume();
        return resolve();
      }
      const file = fs.createWriteStream(path.join(publicVoicesDir, `${voice.id}.mp3`));
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${voice.id}.mp3`);
        resolve();
      });
    });
    
    req.on('error', e => {
      console.error(e);
      resolve();
    });
    
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const voice of deepgramVoices) {
    await downloadVoice(voice);
  }
  console.log('Done!');
})();
