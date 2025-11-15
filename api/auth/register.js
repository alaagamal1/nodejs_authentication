import sqlClient from '../../sqlClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
    const { email, password, username } = req.body;

    if(!email || !password || !username) {
        return res.status(400).json({ message: 'Email, password and username are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await sqlClient.query('INSERT INTO users (useremail, username, userpassword) VALUES (?, ?, ?)', [email, username, hashedPassword]);
    if(rows.affectedRows === 1) {
        const token = jwt.sign({ email, username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ 
            response_type:'success',
            message: 'User registered successfully',
            data: { email, username },
            token: token
        });
    }
    return res.status(400).json({ message: 'User not registered' });
};

