const fs = require('fs');
const { promisify } = require('util');
const { generateKeyPairSync } = require('crypto');
const mkdirp = promisify(require('mkdirp'));

async function generateCert() {
  try {
    await mkdirp('../cert');
    
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // 生成CA证书
const caCert = require('node-forge').pki.createCertificate();
caCert.publicKey = require('node-forge').pki.publicKeyFromPem(publicKey);
caCert.serialNumber = 'CA' + new Date().getTime().toString(16);
caCert.validity.notBefore = new Date();
caCert.validity.notAfter = new Date();
caCert.validity.notAfter.setFullYear(caCert.validity.notBefore.getFullYear() + 10);
caCert.setSubject([{ name: 'commonName', value: 'Homemoney CA' }]);
caCert.setIssuer([{ name: 'commonName', value: 'Homemoney CA' }]);
caCert.sign(require('node-forge').pki.privateKeyFromPem(privateKey));

const cert = require('node-forge').pki.createCertificate();
    cert.publicKey = require('node-forge').pki.publicKeyFromPem(publicKey);
    cert.serialNumber = '01' + new Date().getTime().toString(16);
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    const attrs = [{ name: 'commonName', value: 'localhost' }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(require('node-forge').pki.privateKeyFromPem(privateKey));

    fs.writeFileSync('../cert/key.pem', privateKey);
    fs.writeFileSync('../cert/ca.pem', require('node-forge').pki.certificateToPem(caCert));
fs.writeFileSync('../cert/cert.pem', require('node-forge').pki.certificateToPem(cert));
    console.log('SSL证书生成成功');
  } catch (error) {
    console.error('证书生成失败:', error);
    process.exit(1);
  }
}

generateCert();