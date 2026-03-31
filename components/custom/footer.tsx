import { cn } from '@/lib/utils'

// cspell: disable
export const CustomFooter = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn('bg-slate-950 mx-auto px-4 sm:pb-5 pt-5 w-full', className)}
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex gap-6 text-sm">
          <a
            href="/policyPages/legalNotice"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Mentions légales
          </a>
          <a
            href="/policyPages/privacyPolicy"
            className="text-slate-400 hover:text-white transition-colors"
          >
            Politique de confidentialité
          </a>
          <a
            href="/policyPages/GCU"
            className="text-slate-400 hover:text-white transition-colors"
          >
            CGU
          </a>
        </div>

        <div>
          <div className="hidden md:flex items-center">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src="/logo_bg_black.png"
                alt="OCM Tennis Logo"
                className="w-20 h-14 mr-3"
              />
            }
            <h2 className="text-xl font-bold text-white">MONTAUBAN OC</h2>
          </div>
          <span className="text-slate-400 text-sm text-center w-full mx-auto block">
            Club affilié FFT depuis 1979 : 52350227
          </span>
        </div>
        <p className="text-slate-400 text-sm">
          © 2026 OCM Tennis. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
