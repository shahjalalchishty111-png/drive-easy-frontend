import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
            <div className="w-24 h-24 rounded-3xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto">
                <span className="text-5xl">🚗</span>
            </div>
            <div>
                <h1 className="font-display text-6xl font-black text-slate-900 dark:text-white mb-2">404</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">This road leads nowhere.</p>
            </div>
            <Link to="/" className="btn-primary px-8 py-3">Back to Home</Link>
        </div>
    );
}

export default NotFound