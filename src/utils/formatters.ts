export function formatUsd(amount: number): string {
  return `$${new Intl.NumberFormat('en-US').format(amount)}`;
}

export function formatCountdown(millisecondsRemaining: number): {
  hours: string;
  minutes: string;
  seconds: string;
} {
  if (millisecondsRemaining <= 0) {
    return { hours: '00', minutes: '00', seconds: '00' };
  }
  const totalSeconds = Math.floor(millisecondsRemaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  };
}

