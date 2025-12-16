import { ReactNode, useState } from 'react';
import { BarChart3, Calendar, Trophy, FolderKanban, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useFilter } from '@/contexts/FilterContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  collapsed: boolean;
}

function NavLink({ href, icon: Icon, children, collapsed }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;
  
  return (
    <Link 
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        isActive 
          ? 'bg-primary/10 text-primary border-l-4 border-primary' 
          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
      }`}
      title={collapsed ? children as string : undefined}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{children}</span>}
    </Link>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { selectedYear, setSelectedYear } = useFilter();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${collapsed ? 'w-20' : 'w-64'} bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300`}>
        {/* Espaçador superior reduzido */}
        <div className="h-4"></div>
        
        {/* Botão Recolher/Expandir */}
        <div className="px-4 pb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground transition-colors"
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {/* Filtro de Ano */}
        {!collapsed && (
          <div className="p-4 border-b border-sidebar-border">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Ano
            </label>
            <Select value="2025" disabled>
              <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border">
                <SelectValue placeholder="2025" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink href="/" icon={BarChart3} collapsed={collapsed}>Visão Geral</NavLink>
          <NavLink href="/temporal" icon={Calendar} collapsed={collapsed}>Análise Anual</NavLink>
          <NavLink href="/rankings" icon={Trophy} collapsed={collapsed}>Rankings</NavLink>
          <NavLink href="/evolucao" icon={TrendingUp} collapsed={collapsed}>Evolução</NavLink>
        </nav>
        
        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-muted-foreground text-center">
              Retrospectiva Qualidade
            </p>
          </div>
        )}
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
