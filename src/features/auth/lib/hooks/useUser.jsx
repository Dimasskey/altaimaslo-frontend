import {useEffect, useState} from "react";
import {getUser} from "@/features/auth/api/getUser";

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUser();
                const userData = response?.data;
                setUser(userData);
            } catch (error) {
                setError(error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    },[])

    return { user, loading , error }
}