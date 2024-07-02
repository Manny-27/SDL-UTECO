import { query } from 'convex-dev/server';

export const userStats = query(async ({ db }) => {
  const stats = await db.table('documents')
    .groupBy(['userId'])
    .count()
    .select({
      userId: 'userId',
      documentCount: 'count',
      isAdmin: 'isAdmin'
    })
    .collect();
  return stats;
});
