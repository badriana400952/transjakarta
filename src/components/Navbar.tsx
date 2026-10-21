import type React from 'react'
import { Bus, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'

interface NavbarProps {
  onRefresh: () => void
  isRefreshing: boolean
  lastFetchedAt: Date | null
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isRefreshing, lastFetchedAt }) => {
  return (
    <header className="sticky top-0 z-30 bg-[#005DA6] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2 border border-blue-100 flex-shrink-0">
              <Bus className="w-6 h-6 sm:w-7 sm:h-7 text-[#005DA6]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white">
                  trans<span className="text-[#F39200]">jakarta</span>
                </span>
              </div>
              <p className="text-xs text-blue-100/90 font-medium hidden sm:block">
                Sistem Pemantauan & Manajemen Armada
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            <Button
              type="button"
              variant="tjOrange"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              title={lastFetchedAt ? `Update data terakhir: ${lastFetchedAt.toLocaleTimeString('id-ID')}` : 'Segarkan Data'}
              className="text-xs sm:text-sm font-semibold"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan Data</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
