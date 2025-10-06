import { format } from 'date-fns';

export const timeAgo = (timeStamp) => {
  if (!timeStamp) return '';

  try {
    let date;

    // Auto-detect missing timezone and fix (assume UTC)
    if (!timeStamp.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(timeStamp)) {
      date = new Date(timeStamp + 'Z'); // interpret as UTC
    } else {
      date = new Date(timeStamp);
    }

    // Format output like "Oct 6, 11:44 PM"
    return format(date, 'MMM d, hh:mm a'); // 12-hour format
    // For 24-hour format: 'MMM d, HH:mm'

  } catch (error) {
    console.error('Error parsing timestamp:', timeStamp, error);
    return '';
  }
};
