import { getUserList } from '@clerk/clerk-sdk-node';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const users = await getUserList();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
