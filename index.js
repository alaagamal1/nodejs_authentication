import express from 'express';
import dotenv from 'dotenv';
import { register } from './api/auth/register.js';
import { login } from './api/auth/login.js';
import { forgotPassword } from './api/auth/forgot-password.js';
import { retrievePassword } from './api/auth/retrieve-password.js';
import { auth } from './middleware/auth.js';
import { listNotifications } from './api/notifications/list.js';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/register', register);
app.use('/login', login);
app.use('/forgot-password', forgotPassword);
app.use('/retrieve-password', retrievePassword);
app.use('/list-notifications', auth, listNotifications);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});