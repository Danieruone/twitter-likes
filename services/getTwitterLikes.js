const rp = require('request-promise');
const authToken = 'Bearer ' + process.env.AUTH_KEY;

function getTwitterLikes(params) {
  const paginationToken = params.paginationToken
    ? `&pagination_token=${params.paginationToken}`
    : '';

  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      uri: `https://api.twitter.com/2/tweets/${params.twitId}/liking_users?user.fields=created_at${paginationToken}`,
      headers: {
        Authorization: authToken,
      },
      json: true,
      gzip: true,
    };

    rp(requestOptions)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err.message);
      });
  });
}

module.exports = getTwitterLikes;
