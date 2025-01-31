import { Navigate, Outlet } from "react-router-dom"

const Protect = (
    { user, redirect = '/' }
        :
        {
            user: {
                _id: string,
                username: string
            } | null,
            redirect?: string
        }
) => {
    if (!user) return <Navigate to={redirect} />
    return <Outlet />
}

export default Protect