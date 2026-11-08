import { Car, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Company: ['About', 'Careers', 'Press', 'Contact'],
    Fleet: ['Luxury Sedan', 'Premium SUV', 'Sports Car', 'Convertible'],
    Support: ['Help Center', 'Insurance', 'Terms of Service', 'Privacy Policy'],
  };

  return (
    <footer className="bg-slate-900 dark:bg-[#060e20] text-slate-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 brand-gradient rounded-xl flex items-center justify-center">
                <Car size={18} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white font-display">
                Drive<span className="text-brand-400">Easy</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              The world's most exclusive car rental platform. Curated premium vehicles, seamless booking, concierge delivery.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-white font-bold text-sm mb-4 tracking-wide">{group}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© {year} DriveEasy Global. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Terms', 'Privacy', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
