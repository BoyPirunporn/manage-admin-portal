import { clsx, type ClassValue } from "clsx";
import { Children } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const EachElement = <T,> ({
  of,
  render
}:{
  of:T[];
  render:(t:T,i:number) => React.ReactNode
}) => {
  return Children.toArray(of.map(render))
}



export const logger = {
  info:(...args:any) => logger.debug(...args),
  debug:(...args:any) => process.env.NODE_ENV === "development" && console.debug(...args),
  warn:(...args:any) => process.env.NODE_ENV === "development" && console.warn(...args),
  error:(...args:any) => process.env.NODE_ENV === "development" && console.error(...args),
}