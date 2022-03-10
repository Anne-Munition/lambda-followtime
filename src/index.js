const axios = require('axios');
const AWS = require('aws-sdk');
const notFollowingResponse = require('./notFollowingResponse');
const invalidUserResponse = require('./invalidUserResponse');
const followingResponse = require('./followingResponse');

const region = process.env.SECRETS_REGION;
const secretName = process.env.SECRETS_ARN;

const secretsManager = new AWS.SecretsManager({ region });

let client_id, access_token;

// Gets credentials for the twitch api calls from our secret store
function getSecret() {
  return new Promise((resolve, reject) => {
    secretsManager.getSecretValue(
      { SecretId: secretName },
      function (err, data) {
        if (err) reject(err);
        else resolve(JSON.parse(data.SecretString));
      },
    );
  });
}

function headers() {
  return {
    Authorization: `Bearer ${access_token}`,
    'Client-ID': client_id,
  };
}

function getName(userData) {
  return userData.display_name || userData.login;
}

async function getUser(user) {
  return axios
    .get('https://api.twitch.tv/helix/users', {
      headers: headers(),
      params: {
        login: user,
      },
    })
    .then(({ data }) => data.data[0] || null);
}

async function getFollow(id) {
  return axios
    .get('https://api.twitch.tv/helix/users/follows', {
      headers: headers(),
      params: {
        from_id: id,
        to_id: '51533859',
      },
    })
    .then(({ data }) => data.data);
}

async function handler(event) {
  const { u: user } = event.queryStringParameters;
  if (!user)
    return {
      statusCode: 400,
      body: 'Bad Request',
    };

  console.log('followtime for:', user);

  let userData, followData;

  try {
    ({ client_id, access_token } = await getSecret());
    userData = await getUser(user);
    if (userData) followData = await getFollow(userData.id);
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }

  let html;

  if (!userData) {
    console.log('invalid user');
    html = invalidUserResponse(user);
  } else if (!followData.length) {
    console.log('not following');
    html = notFollowingResponse(getName(userData));
  } else {
    const followDate = followData[0].followed_at;
    console.log('followed at: ', followDate);
    html = followingResponse(getName(userData), followDate);
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };
}

module.exports = {
  getSecret,
  getUser,
  getFollow,
  handler,
  headers,
};
