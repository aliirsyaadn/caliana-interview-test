import fs from 'fs';
import path from 'path';
import db from './db.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (fastify, opts, done) => {
    // File Upload
    fastify.post('/upload', async (req, reply) => {
        const data = await req.file();

        // Sanitize the filename to prevent directory traversal or script injection
        const filename = data.filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

        // Ensure the directory exists
        const uploadDir = path.join(__dirname, '..', 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Validate file type or extension
        const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.pdf|\.txt)$/i;
        if (!allowedExtensions.test(path.extname(filename))) {
            return reply.status(400).send({ error: 'Unsupported file type' });
        }

        // Set a maximum file size (e.g., 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (data.file.size > maxSize) {
            fs.unlinkSync(data.file.tempFilePath); // Delete the temporary file
            return reply.status(400).send({ error: 'File size exceeds limit' });
        }

        const writableStream = fs.createWriteStream(filePath);
        data.file.pipe(writableStream);

        writableStream.on('finish', () => {
            reply.send({ status: 'File uploaded' });
        });

        writableStream.on('error', (err) => {
            console.error('File upload error:', err);
            reply.status(500).send({ error: 'Error uploading file' });
        });

        return reply;
    });

    // File Download
    fastify.get('/download/:filename', async (req, reply) => {
        const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);
        if (fs.existsSync(filePath)) {
            reply.sendFile(req.params.filename);
        } else {
            reply.status(404).send({ error: 'File not found' });
        }

        return reply;
    });

    // Input Text
    fastify.post('/input', async (req, reply) => {
        const { text } = req.body;
        if (!text) {
            reply.status(400).send({ error: 'Text is required' });
        } else {
            const stmt = db.prepare('INSERT INTO texts (content) VALUES ($content)');
            stmt.run({ $content: text });
            reply.send({ status: 'Text saved' });
        }

        return reply;
    });

    // Find Duplicates
    fastify.post('/findDuplicates', async (req, reply) => {
        const { numbers } = req.body;
        if (!Array.isArray(numbers)) {
            reply.status(400).send({ error: 'Numbers array is required' });
        } else {
            const duplicates = numbers.filter((item, index) => numbers.indexOf(item) !== index);
            reply.send({ duplicates: [...new Set(duplicates)] });
        }

        return reply;
    });

    done();
}
