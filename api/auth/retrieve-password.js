import sqlClient from '../../sqlClient.js';
import bcrypt from 'bcrypt';
export const retrievePassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if(!email || !otp || !newPassword) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const [rows] = await sqlClient.query('SELECT * FROM users WHERE useremail = ?', [email]);
    if(rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email' });
    }else{
        const user = rows[0];
        const expiresAt = user.retrieve_pass_token_expiry;
        if(expiresAt < Date.now()) {
            return res.status(401).json({ message: 'OTP expired' });
        }
        const isOtpValid = await bcrypt.compare(otp, user.retrieve_pass_token);
        if(!isOtpValid) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }else{
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const [updateQuery] = await sqlClient.query('UPDATE users SET userpassword = ? WHERE user_id = ?', [hashedPassword, user.user_id]);
            if(updateQuery.affectedRows === 1) {
                return res.status(200).json({ message: 'Password reset successfully' });
            }else{
                return res.status(400).json({ message: 'Failed to reset password' });
            }
        }
    }
};