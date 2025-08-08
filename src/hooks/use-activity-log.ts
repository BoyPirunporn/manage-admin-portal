import { logger } from "@/lib/utils";

export function useActivityLog() {
    const log = async (action: string, target: string, metadata: any = {}) => {
        try {
            await fetch("/api/activity-log", {
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