import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import RootLayout from "./RootLayout.tsx";
import Client from "./services/clients.ts";
import type { User } from "@supabase/supabase-js";

const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Login = lazy(() => import("./pages/Auth/Login.tsx"));
const Register = lazy(() => import("./pages/Auth/Register.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const Landing = lazy(() => import("./pages/Landing.tsx"));
const ResetPw = lazy(() => import("./pages/Auth/ResetPw.tsx"));
const Update = lazy(() => import("./pages/Auth/Update.tsx"));
const Form = lazy(() => import("./features/Form.tsx"));

const getUser = async (): Promise<User | null> => {
    const { user, error } = await Client.getUser();
    if (error) { return null; }
    return user;
};

export const Router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Landing />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (user) {
                        return redirect("/home");
                    }
                    return null;
                }
            },
            {
                path: "/home",
                element: <Dashboard />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (!user) {
                        return redirect("/login");
                    }
                    return { user };
                },
            },
            {
                path: "/new",
                element: <Form />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (!user) {
                        return redirect("/login");
                    }
                    return { user };
                },
            },
            {
                path: "/login",
                element: <Login />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (user) {
                        return redirect("/home");
                    }
                    return null;
                },
            },
            {
                path: "/register",
                element: <Register />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (user) {
                        return redirect("/home");
                    }
                    return null;
                }
            },
            {
                path: "/edit/:id",
                element: <Form />,
                errorElement: <ErrorPage />,
                loader: async () => {
                    const user = await getUser();
                    if (!user) {
                        return redirect("/login");
                    }
                    return { user };
                },
            },
            {
                path: "/reset",
                element: <ResetPw />,
                errorElement: <ErrorPage />
            },
            {
                path: "/update",
                element: <Update />,
                errorElement: <ErrorPage />
            },
            {
                path: "*",
                element: <NotFound />,
                errorElement: <ErrorPage />,
            }
        ]
    }
], { basename: "/" });