const AWS = require('aws-sdk');

const region = process.env.SECRETS_REGION;
const secretName = process.env.SECRETS_ARN;

const secretsManager = new AWS.SecretsManager({ region });

module.exports = new Promise((resolve, reject) => {
  secretsManager.getSecretValue({ SecretId: secretName }, function (err, data) {
    if (err) reject(err);
    else resolve(JSON.parse(data.SecretString));
  });
});
