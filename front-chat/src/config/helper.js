import { parseISO, format } from 'date-fns';

export const timeAgo = (timeStamp) => {
  if (!timeStamp) return '';

  try {
    let date = parseISO(timeStamp);

    // Auto-fix timezone mismatch (if needed)
    if (date.getTime() > Date.now() + 60000) {
      date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    }

    // Format the time in local timezone (e.g., "08:45 PM")
    return format(date, 'hh:mm a'); // 12-hour format
    // use 'HH:mm' for 24-hour format (e.g., "20:45")

  } catch (error) {
    console.error('Error parsing timestamp:', timeStamp, error);
    return '';
  }
};
