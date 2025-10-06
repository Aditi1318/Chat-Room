import { formatDistanceToNow, parseISO } from 'date-fns';

export const timeAgo = (timeStamp) => {
  // Return a default value if the timestamp is missing
  if (!timeStamp) {
    return 'just now';
  }

  try {
    const date = parseISO(timeStamp);

    // formatDistanceToNow() calculates the time difference from now
    // and adds the "ago" suffix.
    return formatDistanceToNow(date, { addSuffix: true });
    
  } catch (error) {
    console.error("Error parsing timestamp:", timeStamp, error);
    // Fallback for any unexpected format
    return 'a while ago';
  }
};