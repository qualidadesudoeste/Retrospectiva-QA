import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Target,
  Settings,
  TestTube2,
  BarChart3,
  Users,
  Sparkles,
} from "lucide-react";

export default function Evolucao() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Seção Evolução da Qualidade */}
        <div className="bg-card/30 rounded-2xl shadow-xl p-8 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Estratégia de Qualidade */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up"
              onMouseEnter={() => setHoveredCard('estrategia')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-primary/15 rounded-lg group-hover:bg-primary/25 transition-colors">
                  <Target className={`w-6 h-6 text-primary transition-all duration-300 ${hoveredCard === 'estrategia' ? 'animate-spin-slow' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Estratégia</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">QA reativo, "testa no fim"</p>
                </div>
                <div className="pl-4 border-l-3 border-primary hover:border-primary/80 transition-colors">
                  <div className="text-xs font-bold text-primary mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">Qualidade como sistema integrado. Critérios claros, risco mapeado, participação ativa</p>
                </div>
              </div>
            </div>

            {/* Processos */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-secondary/70 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up" 
              style={{animationDelay: '0.1s'}}
              onMouseEnter={() => setHoveredCard('processos')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-secondary/15 rounded-lg group-hover:bg-secondary/25 transition-colors">
                  <Settings className={`w-6 h-6 text-secondary transition-all duration-300 ${hoveredCard === 'processos' ? 'animate-spin-slow' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Processos</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Cada time com ritual próprio, inconsistência</p>
                </div>
                <div className="pl-4 border-l-3 border-secondary hover:border-secondary/80 transition-colors">
                  <div className="text-xs font-bold text-secondary mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">Fluxos padronizados, DoR/DoD alinhados, refinamento focado em risco</p>
                </div>
              </div>
            </div>

            {/* Testes */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-accent/70 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up" 
              style={{animationDelay: '0.2s'}}
              onMouseEnter={() => setHoveredCard('testes')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-accent/15 rounded-lg group-hover:bg-accent/25 transition-colors">
                  <TestTube2 className={`w-6 h-6 text-accent transition-all duration-300 ${hoveredCard === 'testes' ? 'animate-bounce' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Testes</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Muito manual, pouco critério</p>
                </div>
                <div className="pl-4 border-l-3 border-accent hover:border-accent/80 transition-colors">
                  <div className="text-xs font-bold text-accent mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">Pirâmide equilibrada, casos baseados em risco, automação estratégica</p>
                </div>
              </div>
            </div>

            {/* Métricas */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-primary/70 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up" 
              style={{animationDelay: '0.3s'}}
              onMouseEnter={() => setHoveredCard('metricas')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-primary/15 rounded-lg group-hover:bg-primary/25 transition-colors">
                  <BarChart3 className={`w-6 h-6 text-primary transition-all duration-300 ${hoveredCard === 'metricas' ? 'animate-pulse' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Métricas</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"Sensação térmica" de qualidade</p>
                </div>
                <div className="pl-4 border-l-3 border-primary hover:border-primary/80 transition-colors">
                  <div className="text-xs font-bold text-primary mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">Indicadores objetivos para decisões estratégicas, não punição</p>
                </div>
              </div>
            </div>

            {/* Pessoas */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-secondary/70 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up" 
              style={{animationDelay: '0.4s'}}
              onMouseEnter={() => setHoveredCard('pessoas')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-secondary/15 rounded-lg group-hover:bg-secondary/25 transition-colors">
                  <Users className={`w-6 h-6 text-secondary transition-all duration-300 ${hoveredCard === 'pessoas' ? 'scale-110' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Pessoas</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">QA como gargalo</p>
                </div>
                <div className="pl-4 border-l-3 border-secondary hover:border-secondary/80 transition-colors">
                  <div className="text-xs font-bold text-secondary mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">QA como facilitador, times autônomos, conversas antecipadas</p>
                </div>
              </div>
            </div>

            {/* Cultura */}
            <div 
              className="group bg-gradient-to-br from-card/50 to-card/30 rounded-xl p-6 border border-border/50 hover:border-accent/70 hover:shadow-2xl hover:shadow-accent/20 transition-all duration-500 hover:scale-[1.08] hover:-translate-y-2 cursor-pointer animate-fade-in-up" 
              style={{animationDelay: '0.5s'}}
              onMouseEnter={() => setHoveredCard('cultura')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-accent/15 rounded-lg group-hover:bg-accent/25 transition-colors">
                  <Sparkles className={`w-6 h-6 text-accent transition-all duration-300 ${hoveredCard === 'cultura' ? 'animate-pulse' : ''}`} />
                </div>
                <h4 className="text-lg font-bold text-foreground">Cultura</h4>
              </div>
              <div className="space-y-4">
                <div className="pl-4 border-l-3 border-destructive/60 hover:border-destructive transition-colors">
                  <div className="text-xs font-bold text-destructive/80 mb-1.5 tracking-wide">ANTES</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Erro escondido</p>
                </div>
                <div className="pl-4 border-l-3 border-accent hover:border-accent/80 transition-colors">
                  <div className="text-xs font-bold text-accent mb-1.5 tracking-wide">AGORA</div>
                  <p className="text-sm text-foreground leading-relaxed font-medium">Erro analisado, post-mortem construtivo, melhoria contínua real</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
