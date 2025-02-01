import { cn } from "@/lib/utils"

const NotFound = ({ className }: { className: string }) => (
    <div className={cn(`flex items-center justify-center`, className)}>
        <h1 className="text-3xl font-bold">
            Oops. Page not Found
        </h1>
    </div>
)

export default NotFound