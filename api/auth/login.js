import sqlClient from '../../sqlClient.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await sqlClient.query('SELECT * FROM users WHERE useremail = ?', [email]);
    if(rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email' });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.userpassword);
    if(!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.user_id, email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token: token, 
        data:{
        email: user.useremail,
        username: user.username,
        id: user.user_id
    } });
};