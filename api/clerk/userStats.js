import { query } from 'convex-dev/server';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const stats = await query("userStats");
      res.status(200).json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: 'Error fetching user stats' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
