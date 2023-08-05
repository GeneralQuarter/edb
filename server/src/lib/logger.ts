import colors from 'colors/safe';

export function dateLog(msg: string) {
  const date = new Date();
  const dateStr = `${date.toLocaleTimeString()}.${date.getMilliseconds().toString().padEnd(3, '0')}`;
  console.log(`${colors.gray(dateStr)} ${msg}`);
}
