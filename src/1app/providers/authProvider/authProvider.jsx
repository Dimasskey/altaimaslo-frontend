    import React, {createContext, useContext, useEffect, useState} from 'react';
    import {getUser} from "@/4features/auth/api/getUser";
    import {logoutUser} from "@/4features/auth/api/logout";

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {

        const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const fetchUser = async () => {
                try {
                    const data = await getUser();
                    setUser(data?.data || null);
                } catch {
                    setUser(null)
                } finally {
                    setLoading(false)
                }
            }
            fetchUser();

        }, [])

        const logout = async () => {
           try {
               await logoutUser();
           } catch (error) {
               console.log('ошибка', error)
           } finally {
               setUser(null)
           }
        }

        return (
            <AuthContext.Provider value={{user, setUser, logout, loading}}>
                {children}
            </AuthContext.Provider>
        )

    };

    export const useAuth = () => useContext(AuthContext)
