export default function formatTime(time: Date) {
  return `${time.getHours()}:${time.getMinutes()}`;
}

export function formatTimeRange(
  timeRange: [Date | undefined, Date | undefined],
) {
  if (timeRange[0] && timeRange[1])
    return `${formatTime(timeRange[0])} - ${formatTime(timeRange[1])}`;
}

export function getTZDate(date: Date) {
  return new Date(new Date(date).toISOString().slice(0, 19).replace('Z', ' '));
}
