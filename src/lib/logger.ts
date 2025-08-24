export default {
  info: (...args: any) => console.info(...args),
  debug: (...args: any) => process.env.NODE_ENV === "development" && console.debug(...args),
  warn: (...args: any) => process.env.NODE_ENV === "development" && console.warn(...args),
  error: (...args: any) => process.env.NODE_ENV === "development" && console.error(...args),
};