export const getNext7Days = (): Date[] => {
  const days: Date[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    days.push(date);
  }
  
  return days;
};

export const isDateInNext7Days = (targetDate: Date, suggestedDays: Date[]): boolean => {
  return suggestedDays.some(suggestedDay => 
    suggestedDay.getDate() === targetDate.getDate() &&
    suggestedDay.getMonth() === targetDate.getMonth() &&
    suggestedDay.getFullYear() === targetDate.getFullYear()
  );
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};