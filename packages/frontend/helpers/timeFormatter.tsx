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

export function formatTimeBracket(startDate: Date, endDate: Date) {
  return (
    startDate.toDateString() +
    ', ' +
    (startDate.getHours() < 12
      ? startDate.getHours() +
        ':' +
        startDate.getMinutes() +
        (startDate.getMinutes() == 0 ? '0' : '') +
        'am'
      : (startDate.getHours() == 12
          ? startDate.getHours()
          : startDate.getHours() - 12) +
        ':' +
        startDate.getMinutes() +
        (startDate.getMinutes() == 0 ? '0' : '') +
        'pm') +
    ' - ' +
    (endDate.getHours() < 12
      ? endDate.getHours() +
        ':' +
        endDate.getMinutes() +
        (endDate.getMinutes() == 0 ? '0' : '') +
        'am'
      : (endDate.getHours() == 12
          ? endDate.getHours()
          : endDate.getHours() - 12) +
        ':' +
        endDate.getMinutes() +
        (endDate.getMinutes() == 0 ? '0' : '') +
        'pm') +
    ' NZDT'
  );
}
