const fs = require('fs');
require('dotenv').config();

// services
const getTwitterLikes = require('./services/getTwitterLikes');

const twitId = '1576732047862734848';
const file = fs.createWriteStream(`./logs/liked-people-${twitId}.txt`);

let requestsCount = 0;
let currentPageToken = null;
let totalUsers = 0;

const getLikes = () => {
  requestsCount++;
  console.log(
    `Number of requests: ${requestsCount}, with token: ${currentPageToken}`
  );
  getTwitterLikes({
    twitId,
    paginationToken: currentPageToken,
  })
    .then((res) => {
      if (res.data) {
        totalUsers += res.meta.result_count;
        res.data.forEach((user) => {
          const yearOfCreationAccount = new Date(user.created_at);
          if (
            // user.name.toLowerCase().includes('t') &&
            yearOfCreationAccount.getFullYear() >= 2022
          ) {
            file.write(
              `username: ${user.username}, name: ${
                user.name
              }, created_at: ${yearOfCreationAccount.toLocaleDateString(
                'en-US'
              )}` + '\n'
            );
          }
        });
      }
      if (res.meta.next_token && res.meta.next_token !== currentPageToken) {
        currentPageToken = res.meta.next_token;
        setTimeout(getLikes, 3000);
      } else {
        file.write(
          `Twit ID: ${twitId} - Last Token: ${currentPageToken}` + '\n'
        );
        file.write(`Total users: ${totalUsers}`);
        file.end();
        console.log('File created with liked users');
      }
    })
    .catch((err) => {
      file.write(`Twit ID: ${twitId} - Last Token: ${currentPageToken}` + '\n');
      file.write(`Total users: ${totalUsers}`);
      file.end();
      console.log(err);
    });
};

getLikes();
