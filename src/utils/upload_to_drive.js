import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to your service_account.json file
const serviceAccountPath = path.resolve(__dirname, 'service_account.json');
console.log('Service Account Path:', serviceAccountPath); // For debugging

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

const folderId = '1Kpk2gWAVv2zNZOAbMQoxZhtm2I8eXY_2';

const uploadToDrive = async (filePaths) => {
  try {
    const uploadedFiles = [];

    for (const filePath of filePaths) {
      await fs.promises.access(filePath, fs.constants.F_OK);

      const fileMetadata = {
        name: path.basename(filePath),
        parents: [folderId],
      };

      const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(filePath),
      };

      media.body.on('error', (err) => {
        console.error('Error reading file:', err);
      });

      const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });

      const thumbnailLink = `https://drive.google.com/thumbnail?id=${file.data.id}&sz=w1000`;

      uploadedFiles.push({
        webViewLink: thumbnailLink,
      });
    }

    return uploadedFiles;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('File not found:', error);
      throw new Error(`File not found: ${error.path}`);
    } else {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file to Google Drive');
    }
  }
};

export default uploadToDrive;
