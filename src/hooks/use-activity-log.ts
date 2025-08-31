import logger from "@/lib/logger";

export function useActivityLog() {
    const log = async (action: string, target: string, metadata: any = {}) => {
        try {
            await fetch("/api/v1/activity-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action,
                    target,
                    metadata: JSON.stringify(metadata),

                })
            });
        } catch (error) {
            logger.error("Log failed", error);
        }
    };

    return { log };
}