import { isAxiosError } from "axios";
import logger from "./logger";

export default function(error: unknown){
  if (isAxiosError(error)) {
    logger.debug("Axios Error " + error);
  } else {
    logger.debug("Exception Error " + error);
  }
  return isAxiosError(error) ? (error.response?.data.message ?? error.message) : (error as Error).message;
};