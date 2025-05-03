export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dateDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24); // difference in days
  const dayOfWeekNow = now.getDay(); // 0 (Sun) to 6 (Sat)
  const dayOfWeekDate = date.getDay();

  const isSameDay = date.toDateString() === now.toDateString();
  const isYesterday = dateDiff >= 1 && dateDiff < 2 && now.getDate() - date.getDate() === 1;
  const isThisWeek = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && date > startOfWeek(now);
  const isLastWeek = now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth() && date <= startOfWeek(now) && date > startOfWeek(addDays(now, -7));

  if (isSameDay) {
    return `Today • ${timeFormatted}`;
  }

  if (isYesterday) {
    return `Yesterday • ${timeFormatted}`;
  }

  if (isThisWeek) {
    return `This Week • ${timeFormatted}`;
  }

  if (isLastWeek) {
    return `Last Week • ${timeFormatted}`;
  }

  // fallback: show full date
  return date.toLocaleDateString() + " • " + timeFormatted;
};

// Helper functions
function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay(); // Sunday = 0, Monday = 1, etc
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(date.setDate(diff));
}

function addDays(d: Date, days: number): Date {
  const date = new Date(d);
  date.setDate(date.getDate() + days);
  return date;
}
