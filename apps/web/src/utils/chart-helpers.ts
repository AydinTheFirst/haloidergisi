import type { PageVisit, User, Message } from "@/types";

/**
 * Groups page visits by date and returns sorted time-series data
 */
export function groupVisitsByDate(visits: PageVisit[]) {
  const grouped = visits.reduce(
    (acc, visit) => {
      const dateStr = new Date(visit.date).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      });
      if (!acc[dateStr]) {
        acc[dateStr] = 0;
      }
      acc[dateStr] += visit.count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Groups users by registration date
 */
export function groupUsersByDate(users: User[]) {
  const grouped = users.reduce(
    (acc, user) => {
      const dateStr = new Date(user.createdAt).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      });
      if (!acc[dateStr]) {
        acc[dateStr] = 0;
      }
      acc[dateStr] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Groups messages by creation date
 */
export function groupMessagesByDate(messages: Message[]) {
  const grouped = messages.reduce(
    (acc, message) => {
      const dateStr = new Date(message.createdAt).toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "short",
      });
      if (!acc[dateStr]) {
        acc[dateStr] = 0;
      }
      acc[dateStr] += 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(grouped)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Gets top N visited pages
 */
export function getTopPages(visits: PageVisit[], limit = 10) {
  const pageVisits = visits.reduce(
    (acc, visit) => {
      if (!acc[visit.url]) {
        acc[visit.url] = 0;
      }
      acc[visit.url] += visit.count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(pageVisits)
    .map(([url, count]) => ({ url, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Categorizes page visits by type (posts vs other)
 */
export function categorizePageVisits(visits: PageVisit[]) {
  const categories = {
    posts: 0,
    other: 0,
  };

  visits.forEach((visit) => {
    if (visit.url.startsWith("/posts/")) {
      categories.posts += visit.count;
    } else {
      categories.other += visit.count;
    }
  });

  return [
    { name: "Yazılar", value: categories.posts },
    { name: "Diğer Sayfalar", value: categories.other },
  ];
}

/**
 * Calculate percentage change between two numbers
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

/**
 * Format large numbers with K/M suffix
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
