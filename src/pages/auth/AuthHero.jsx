import { Car } from "lucide-react"
import { Link } from "react-router-dom"

const AuthHero = () => {
    return (
        <div className="hidden lg:flex flex-col relative overflow-hidden bg-slate-900">
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&auto=format&fit=crop"
                    alt=""
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </div>

            <div className="relative z-10 flex flex-col h-full p-14 justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group w-fit">
                    <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center">
                        <Car size={18} className="text-white" />
                    </div>
                    <span className="font-display font-black text-xl text-white tracking-tighter">
                        Drive<span className="text-brand-400">Easy</span>
                    </span>
                </Link>

                {/* Tagline */}
                <div>
                    <h2 className="font-display text-5xl font-black text-white leading-tight tracking-tight mb-6">
                        The key to your<br />
                        <span className="text-brand-400 italic">extraordinary</span><br />
                        journey.
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-sm">
                        Secure access to our global fleet of premium vehicles and white-glove concierge service.
                    </p>

                    <div className="flex gap-3 flex-wrap">
                        {['Executive', 'Seamless', 'Verified'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-white/10 border border-white/10 rounded-full text-white text-xs font-bold uppercase tracking-wider">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <p className="text-slate-600 text-sm">© {new Date().getFullYear()} DriveEasy Global</p>
            </div>
        </div>
    )
}

export default AuthHero