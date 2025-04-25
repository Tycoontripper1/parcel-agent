export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Check if the date is yesterday
    const isYesterday = now.getDate() - date.getDate() === 1 && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();
    
    if (isYesterday) {
      return `Yesterday • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  
    // For other cases, return the formatted date as 'HH:mm AM/PM'
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };