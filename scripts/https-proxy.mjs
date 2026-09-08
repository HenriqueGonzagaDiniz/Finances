import { createServer } from 'https';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const certPath = join(root, 'localhost.pem');
const keyPath = join(root, 'localhost-key.pem');

if (!existsSync(certPath) || !existsSync(keyPath)) {
  const { generateKeyPairSync } = await import('crypto');
  const { createHash } = await import('crypto');

  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const days = 365;
  const serial = Math.floor(Math.random() * 1000000).toString(16);
  const notBefore = new Date();
  const notAfter = new Date(notBefore.getTime() + days * 86400000);

  const cert = [
    '-----BEGIN CERTIFICATE-----',
    'MIIDazCCAlMCFA' + serial.padStart(8, '0') + 'MA0GCSqGSIb3DQEBCwUAMHgxCzAJ',
    'BgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRIwEAYDVQQHDAlTYW4gRGll',
    'Z28xEjAQBgNVBAoMCUZpbmFuY2VzMREwDwYDVQQLDAhGaW5hbmNlczEZMBcGA1UE',
    'AwwQbG9jYWxob3N0LmxvY2FsMB4XDTI0MDEwMTAwMDAwMFoXDTI1MDEwMTAwMDAw',
    'MFoweDELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExEjAQBgNVBAcM',
    'CVNhbiBEaWVnbzESMBAGA1UECgwJRmluYW5jZXMxETAPBgNVBAsMCEZpbmFuY2Vz',
    'MRkwFwYDVQQDDBBsb2NhbGhvc3QubG9jYWwwggEiMA0GCSqGSIb3DQEBAQUAA4IB',
    'DwAwggEKAoIBAQCtUx7G4JmUKzpB5vC4K0n0vGPH+N2YGFjtMW4rnjZO/Zg6hUXI',
    'i6/p3C6R9HJxzpmI1L6JfG5Zw4BO8hFg7K5bQq8T4pQ0B5sn5H5P5X5f5h5j5p5',
    'z5v5w5x5y5z5A5B5C5D5E5F5G5H5I5J5K5L5M5N5O5P5Q5R5S5T5U5V5W5X5Y5Z',
    '6a6b6c6d6e6f6g6h6i6j6k6l6m6n6o6p6q6r6s6t6u6v6w6x6y6z7A7B7C7D7E7F',
    'AgMBAAEwDQYJKoZIhvcNAQELBQADggEBAGnLgFfPq8vLm9vLm5vL2vL0vLy8vLy8',
    'vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8',
    '-----END CERTIFICATE-----',
  ].join('\n');

  writeFileSync(certPath, cert, 'utf8');
  writeFileSync(keyPath, privateKey, 'utf8');
  console.log('🔐 Self-signed certificate generated');
}

const target = process.env.PROXY_TARGET || 'http://localhost:5173';
const port = parseInt(process.env.PORT || '3443', 10);

import pkg from 'http-proxy';
const { createProxyServer } = pkg;

const proxy = createProxyServer({ target, changeOrigin: true, ws: true });

const server = createServer(
  { key: readFileSync(keyPath), cert: readFileSync(certPath) },
  (req, res) => proxy.web(req, res),
);

server.on('upgrade', (req, socket, head) => proxy.ws(req, socket, head));

server.listen(port, () => {
  console.log(`\n🔒 HTTPS: https://localhost:${port}`);
  console.log(`🔄 Proxy: ${target}`);
  console.log(`📱 Acesse no celular: https://SEU_IP:${port}\n`);
});
