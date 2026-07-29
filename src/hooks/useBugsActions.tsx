import { supabase } from "../utils/supabase.ts";
import type { Bugs, Category, CodeLang, Severity, Status } from "../utils/types";
import useLoading from "./useLoading.tsx";
import { useLoaderData, useParams } from "react-router-dom";
import type { UserLoaderData } from "./useBugs.tsx";

export interface UseBugsActionsState {
    deleteBug: (id: string) => Promise<{ error: string | null }>;
    updateBug: (
        code: string,
        description: string,
        solution: string,
        status: Status,
        category: Category,
        severity: Severity,
        title: string,
        language: CodeLang,
    ) => Promise<{ error: string | null }>;
    createBug: (
        code: string,
        description: string,
        solution: string,
        status: Status,
        category: Category,
        severity: Severity,
        title: string,
        language: CodeLang
    ) => Promise<{ error: string | null }>;
    findBugById: () => Promise<{ error: string | null; data: Bugs[] | null }>;
}

export default function useBugsActions(): UseBugsActionsState {
    const { startLoading, stopLoading } = useLoading();
    const { id } = useParams<{ id?: string }>();
    const loaderData = useLoaderData() as UserLoaderData | undefined;
    const userId = loaderData?.user?.id;

    async function deleteBug(bugId: string) {
        if (!userId) return { error: "User not authenticated" };
        startLoading();
        try {
            const { error } = await supabase
                .from("Bugs")
                .delete()
                .eq("user_id", userId)
                .eq("id", bugId);

            if (error) {
                return { error: "Unable to delete your bug. Please try again. " + error.message };
            }

            return { error: null };
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : String(err);
            return { error: "Unexpected connection error occurred. " + message };
        } finally {
            stopLoading();
        }
    }

    async function updateBug(
        code: string,
        description: string,
        solution: string,
        status: Status,
        category: Category,
        severity: Severity,
        title: string,
        language: CodeLang
    ) {
        if (!userId || !id) return { error: "Missing user or bug identifier" };
        startLoading();
        try {
            const { error } = await supabase
                .from("Bugs")
                .update({
                    status,
                    code,
                    solution,
                    description,
                    category,
                    severity,
                    title,
                    language
                })
                .eq("user_id", userId)
                .eq("id", id);

            if (error) {
                return { error: "Unable to update your bug. Please try again. " + error.message };
            }

            return { error: null };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return { error: "Unexpected connection error occurred. " + message };
        } finally {
            stopLoading();
        }
    }

    async function createBug(
        code: string,
        description: string,
        solution: string,
        status: Status,
        category: Category,
        severity: Severity,
        title: string,
        language: CodeLang
    ) {
        if (!userId) return { error: "User not authenticated" };
        startLoading();
        try {
            const { error } = await supabase
                .from("Bugs")
                .insert({
                    user_id: userId,
                    status,
                    code,
                    solution,
                    description,
                    category,
                    severity,
                    title,
                    language
                });

            if (error) {
                return { error: "Unable to create your bug. Please try again. " + error.message };
            }

            return { error: null };
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            return { error: "Unexpected connection error occurred. " + message };
        } finally {
            stopLoading();
        }
    }

    async function findBugById() {
        if (!userId || !id) return { error: "Missing user or bug identifier", data: null };
        startLoading();
        try {
            const { data, error } = await supabase
                .from("Bugs")
                .select("*")
                .eq("user_id", userId)
                .eq("id", id);

            if (error) {
                return { error: "Unable to find bug. Please try again. " + error.message, data: null };
            }
            return { error: null, data: data || [] };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            return { error: `Unexpected connection error occurred. ${message}`, data: null };
        } finally {
            stopLoading();
        }
    }

    return { deleteBug, updateBug, createBug, findBugById };
}