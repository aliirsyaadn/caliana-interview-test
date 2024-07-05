import { test } from 'tap';
import Fastify from 'fastify';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import routes from '../src/routes.js';

// Helpers to manage paths and temporary files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'uploads');

// Create a Fastify instance for testing
async function build() {
  const fastify = Fastify();
  fastify.register(multipart);
  fastify.register(fastifyStatic, {
    root: uploadDir,
    prefix: '/uploads/',
  });
  fastify.register(cors);
  fastify.register(routes);
  return fastify;
}

test('POST /upload - should upload a file', async (t) => {
  const fastify = await build();
  t.teardown(() => fastify.close());

  const formData = new FormData();
  formData.append('file', new Blob(['test file content']), 'test.txt');

  const response = await fastify.inject({
    method: 'POST',
    url: '/upload',
    headers: formData.getHeaders ? formData.getHeaders() : {},
    payload: formData,
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.body), { status: 'File uploaded' });

  // Cleanup
  const filePath = path.join(uploadDir, 'test.txt');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

test('GET /download/:filename - should download a file', async (t) => {
  const fastify = await build();
  t.teardown(() => fastify.close());

  // Create a file to download
  const filePath = path.join(uploadDir, 'download_test.txt');
  fs.writeFileSync(filePath, 'download test content');

  const response = await fastify.inject({
    method: 'GET',
    url: '/download/download_test.txt',
  });

  t.equal(response.statusCode, 200);
  t.equal(response.body, 'download test content');

  // Cleanup
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

test('POST /input - should store text in the database', async (t) => {
  const fastify = await build();
  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: 'POST',
    url: '/input',
    payload: { text: 'sample text' },
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.body), { status: 'Text saved' });
});

test('POST /findDuplicates - should find duplicate numbers', async (t) => {
  const fastify = await build();
  t.teardown(() => fastify.close());

  const response = await fastify.inject({
    method: 'POST',
    url: '/findDuplicates',
    payload: { numbers: [1, 2, 3, 2, 4, 3] },
  });

  t.equal(response.statusCode, 200);
  t.same(JSON.parse(response.body), { duplicates: [2, 3] });
});
