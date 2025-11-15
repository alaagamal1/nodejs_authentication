import sqlClient from '../../sqlClient.js';
export const listNotifications = async (req, res) => {
    const { id } = req.user;
    if(!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const [rows] = await sqlClient.query('SELECT * FROM notifications WHERE user_id = ?', [id]);
    return res.status(200).json({ message: 'Notifications listed successfully', data: rows });
};