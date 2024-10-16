require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;  // Backend port

// Reddit API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

// Function to get a Reddit token
async function getRedditToken() {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const tokenResponse = await axios.post('https://www.reddit.com/api/v1/access_token', 
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  return tokenResponse.data.access_token;
}

// Example API route
app.get('/reddit-data', async (req, res) => {
  try {
    const token = await getRedditToken();
    const redditResponse = await axios.get('https://oauth.reddit.com/r/popular', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    res.json(redditResponse.data);
  } catch (error) {
    res.status(500).send('Error retrieving data from Reddit');
  }
});

app.listen(port, () => {
  console.log(`Backend service running on port ${port}`);
});
