import sqlClient from '../../sqlClient.js';
import bcrypt from 'bcrypt';
/*
1- check if the email is valid
2- create otp 
3- update the otp in the databaase
4- send the otp to the email
*/

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const [rows] = await sqlClient.query('SELECT * FROM users WHERE useremail = ?', [email]);
    if(rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email' });
    }
    else{
        const user = rows[0];
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const [updateQuery] = await sqlClient.query('UPDATE users SET retrieve_pass_token = ?, retrieve_pass_token_expiry = ? WHERE user_id = ?', [hashedOtp, expiresAt, user.user_id]);
        if(updateQuery.affectedRows === 1) {
            console.log(otp)
            return res.status(200).json({ message: 'Password reset email sent' });
        }else{
            return res.status(400).json({ message: 'Failed to send password reset email' });
        }
    }
};