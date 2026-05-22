import { useState } from 'react'
import { Globe, Play } from 'lucide-react'
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
        active
          ? 'bg-gray-100 text-gray-800'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LogoIcon() {
  return (
    <></>
    // <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm select-none">
    //   <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    //     <path d="M7 0.5L1 8.5H5.5L4.5 14.5L11 6.5H6.5L7 0.5Z" fill="white" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round"/>
    //   </svg>
    // </div>
  )
}

function DesignIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="5" height="5" rx="1"/>
      <rect x="9" y="2" width="5" height="5" rx="1"/>
      <rect x="2" y="9" width="5" height="5" rx="1"/>
      <rect x="9" y="9" width="5" height="5" rx="1"/>
    </svg>
  )
}

function CMSIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="3" width="12" height="10" rx="1"/>
      <line x1="2" y1="6" x2="14" y2="6"/>
      <line x1="5" y1="3" x2="5" y2="6"/>
    </svg>
  )
}



export default function HeaderBar() {
  const [activeNav, setActiveNav] = useState('design')

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 select-none">
      {/* Left section */}
      <div className="flex items-center gap-2">
        {/* Logo */}
        <div className="flex items-center justify-center mr-3 cursor-pointer">
          <LogoIcon />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5">
          <NavItem
            icon={<DesignIcon />}
            label="Design"
            active={activeNav === 'design'}
            onClick={() => setActiveNav('design')}
          />
          <NavItem
            icon={<CMSIcon />}
            label="CMS"
            active={activeNav === 'cms'}
            onClick={() => setActiveNav('cms')}
          />
        </nav>
      </div>

      {/* Center section */}
      <div className="hidden lg:flex items-center gap-4">
       
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-600 transition-colors flex items-center justify-center text-white text-xs font-semibold shadow-xs cursor-pointer">
          VI
        </div>

        <button className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors">
          Invite
        </button>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 select-none">
          <span>Ready</span>
          <div className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors">
            <Play className="w-3.5 h-3.5 fill-gray-500 stroke-gray-500" />
          </div>
        </div>

        <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm active:scale-98 transition-all">
          Publish
        </button>
      </div>
    </header>
  )
}
