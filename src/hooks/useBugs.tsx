import { useEffect, useState } from "react";
import type { Bugs, Category, Filter } from "../utils/types";
import useLoading from "./useLoading.tsx";
import { useLoaderData } from "react-router-dom";
import { supabase } from "../utils/supabase.ts";
import type { User } from "@supabase/supabase-js";

export interface UserLoaderData {
    user: User;
}

export interface UseBugsState {
    bugs: Bugs[];
    setBugs: React.Dispatch<React.SetStateAction<Bugs[]>>;
    filterBugs: (filter: Category | Filter) => Promise<{ error: string | null; data: Bugs[] | null }>;
}

export default function useBugs(): UseBugsState {
    const [bugs, setBugs] = useState<Bugs[]>([]);
    const { startLoading, stopLoading } = useLoading();
    const loaderData = useLoaderData() as UserLoaderData | undefined;
    const userId = loaderData?.user?.id;

    async function getUserBugs() {
        if (!userId) return { error: "User not authenticated" };
        startLoading();
        try {
            const { data, error: supabaseError } = await supabase
                .from("Bugs")
                .select("*")
                .eq("user_id", userId);

            if (supabaseError) {
                return { error: `We couldn't get your bugs. ${supabaseError.message}` };
            }

            if (data && data.length > 0) {
                setBugs(data);
            } else {
                setBugs([]);
            }
            return { error: null };
        } catch (err: unknown) {
            setBugs([]);
            const message = err instanceof Error ? err.message : String(err);
            return { error: "Unexpected connection error occurred. " + message };
        } finally {
            stopLoading();
        }
    }

    async function refetchBugs() {
        if (!userId) return;
        startLoading();
        try {
            const { data, error: supabaseError } = await supabase
                .from("Bugs")
                .select("*")
                .eq("user_id", userId);

            if (!supabaseError && data) {
                setBugs(data);
            }
        } catch {
            setBugs([]);
            return { error: "unexpected error occurred" }
        } finally {
            stopLoading();
        }
    }

    useEffect(() => {
        if (!userId) return;
        getUserBugs();
        const bugChannel = supabase
            .channel(`bugs-realtime-${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "Bugs",
                    filter: `user_id=eq.${userId}`,
                },
                async () => {
                    await refetchBugs();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(bugChannel);
        };
    }, [userId]);

    async function filterBugs(filter: Category | Filter) {
        if (!userId) return { error: "User not authenticated", data: null };
        startLoading();
        try {
            const query = supabase
                .from("Bugs")
                .select("*")
                .eq("user_id", userId);

            if (filter !== "All") {
                query.eq("category", filter as Category);
            }

            const { data, error } = await query;

            if (error) {
                return { error: "Unable to filter bugs. Please try again. " + error.message, data: null };
            }

            return { error: null, data: data || [] };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return { error: `Unexpected connection error occurred. ${message}`, data: null };
        } finally {
            stopLoading();
        }
    }

    return { bugs, setBugs, filterBugs };
}