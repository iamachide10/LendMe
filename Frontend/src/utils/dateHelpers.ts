export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const calcRentalPrice = (
  dailyPrice: number,
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return parseFloat((days * dailyPrice).toFixed(2));
};

export const toISODate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};