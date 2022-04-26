export default function formatTime(time: Date) {
  return `${time.getHours()}:${time.getMinutes()}`;
}

export function formatTimeRange(timeRange: [Date, Date]) {
  return `${formatTime(timeRange[0])} - ${formatTime(timeRange[1])}`;
}
