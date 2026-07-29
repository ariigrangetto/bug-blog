import { useState } from "react";

export default function useLoading() {
    const [loading, setLoading] = useState<boolean>(false);

    function startLoading() {
        setLoading(true);
    }

    function stopLoading() {
        setLoading(false);
    }

    return { loading, startLoading, stopLoading };
} 