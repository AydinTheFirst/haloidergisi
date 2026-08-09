export const DASHBOARD_STATS_QUERY = `
  query DashboardStats($from: String, $to: String) {
    dashboardStats(from: $from, to: $to) {
      totalVisits
      totalUsers
      totalMessages
      totalArticles
      totalPosts
      totalLikes
      totalDislikes
      articlesByStatus {
        status
        count
      }
      postsByStatus {
        status
        count
      }
      visitsOverTime {
        date
        count
      }
      usersOverTime {
        date
        count
      }
      messagesOverTime {
        date
        count
      }
      articlesOverTime {
        date
        count
      }
    }
  }
`;

export interface StatusCount {
  status: string;
  count: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface DashboardStatsData {
  totalVisits: number;
  totalUsers: number;
  totalMessages: number;
  totalArticles: number;
  totalPosts: number;
  totalLikes: number;
  totalDislikes: number;
  articlesByStatus: StatusCount[];
  postsByStatus: StatusCount[];
  visitsOverTime: TimeSeriesPoint[];
  usersOverTime: TimeSeriesPoint[];
  messagesOverTime: TimeSeriesPoint[];
  articlesOverTime: TimeSeriesPoint[];
}
