const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingSid = process.env.MESSAGING_SERVICE_SID;
const client = require('twilio')(accountSid, authToken);
const errorData = require('./error');
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
	res.status(200).json({ message: 'server is working' });
});

app.post('/sendmessage', async (req, res) => {
	try {
		const { message, sendTo } = req.body;

		const data = await client.messages.create({
			body: message,
			messagingServiceSid: messagingSid,
			to: `+${sendTo}`
		});

		res.status(200).json(data);
	} catch (error) {
		let message = errorData.filter(value => {
			return value.code === error.code;
		});

		res.status(400).json({ errorMessage: message[0].message });
	}
});

app.listen(4000, () => {
	console.log('server is runing');
});
