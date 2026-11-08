import { Car } from "lucide-react"
import { Link } from "react-router-dom"

const AuthMobileLogo = () => {
    return (
        <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 brand-gradient rounded-lg flex items-center justify-center">
                <Car size={15} className="text-white" />
            </div>
            <span className="font-display font-black tracking-tighter text-slate-900 dark:text-white">
                Drive<span className="text-brand-600 dark:text-brand-400">Easy</span>
            </span>
        </Link>
    )
}

export default AuthMobileLogo