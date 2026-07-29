import { supabase } from "../utils/supabase.ts";
import type { AuthError, User } from "@supabase/supabase-js";

export interface AuthUserResponse {
    data: { user: User | null };
    error: AuthError | null;
}

export interface ResetPasswordResponse {
    data: Record<string, unknown> | null;
    error: AuthError | null;
}

export interface LogoutResponse {
    data: null;
    error: AuthError | null;
}

export interface GetUserResponse {
    user: User | null;
    userId: string | null;
    error: AuthError | null;
}

const Client = {
    async createClient(email: string, password: string): Promise<AuthUserResponse> {
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            return { data: { user: null }, error };
        }

        return { data: { user }, error: null };
    },

    async login(email: string, password: string): Promise<AuthUserResponse> {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { data: { user: null }, error };
        }

        return { data: { user }, error: null };
    },

    async resetPassword(email: string): Promise<ResetPasswordResponse> {
        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/update`
            : "http://localhost:5173/update";

        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) {
            return { data: null, error };
        }

        return { data: (data as Record<string, unknown>) ?? {}, error: null };
    },

    async update(password: string): Promise<AuthUserResponse> {
        const { data: { user }, error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            return { data: { user: null }, error };
        }

        return { data: { user }, error: null };
    },

    async logout(): Promise<LogoutResponse> {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return { data: null, error };
        }

        return { data: null, error: null };
    },

    async getUser(): Promise<GetUserResponse> {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            return { user: null, userId: null, error };
        }
        const userId = user?.id ?? null;
        return { user, userId, error: null };
    }
};

export default Client;