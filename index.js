const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

async function handleCustomMessage(sender, botId, apiKey, message) {
    const messagePayload = {
        to: sender,
        type: 'text',
        text: {
            body: message
        }
    };

    try {
        const response = await axios.post(`https://v1-api.swiftchat.ai/api/bots/${botId}/messages`, messagePayload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Message sent to chatbot:', response.data);
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
    }
}





//   async function sendTextImage(sender, botId, apiKey, text) {
//     // Generate the URL for the text image
//     const imageUrl = `https://picsum.photos/400/200?text=${encodeURIComponent(text)}`;
//     console.log('image',imageUrl)

//     const messagePayload = {
//       to: sender,
//       type: 'image',
//       image: {
//         url: imageUrl
//       }
//     };

//     try {
//       const response = await axios.post(`https://v1-api.swiftchat.ai/api/bots/${botId}/messages`, messagePayload, {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Image message sent to chatbot:', response.data);
//     } catch (error) {
//       console.error('Error sending image message to chatbot:', error);
//     }
//   }



async function sendTextImage(sender, botId, apiKey, text) {
    try {
        const imageUrl = await fetchImageFromSerpApi(text);

        await sendImageToChatbot(sender, botId, apiKey, imageUrl);

    } catch (error) {
        console.error('Error:', error);
    }
}

const API_KEY_SERP = '50661d7f50c09711bb6fe90d1d86c5dc0d6e1bd52716c48372fc45e8a12c5622'; // Your SerpApi API key

async function fetchImageFromSerpApi(text) {
    try {
        const engine = 'google_images';
        const apiUrl = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(text)}&api_key=${API_KEY_SERP}`;
        
        const response = await axios.get(apiUrl);
        const data = response.data;
    

        if (data && data.images_results && data.images_results.length > 0) {
            return data.images_results[0].original;
        } else {
            throw new Error('No image found for the given text.');
        }
    } catch (error) {
        throw error;
    }
}

async function sendImageToChatbot(sender, botId, apiKey, imageUrl) {
    const messagePayload = {
        to: sender,
        type: 'image',
        image: {
            url: imageUrl
        }
    };

    try {
        const response = await axios.post(`https://v1-api.swiftchat.ai/api/bots/${botId}/messages`, messagePayload, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Image message sent to chatbot:', response.data);
    } catch (error) {
        throw error;
    }
}



app.post('/webhook', async (req, res) => {
    const botId = '0240383727772053';
    const apiKey = '1a6acaf6-abd4-47d5-8652-45990cd74d89';
    const customMessage = req.body.text.body
    await sendTextImage(req.body.from, botId, apiKey, customMessage)
    res.sendStatus(200);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
