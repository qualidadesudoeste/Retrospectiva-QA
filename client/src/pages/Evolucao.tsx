import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Target, Settings, TestTube2, BarChart3, Users, TrendingUp, Hourglass, Award } from "lucide-react";

export default function Evolucao() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Grid 2x3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Estratégia */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('estrategia')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Estratégia</h3>
            </div>
            
            <div className="space-y-5">
              {/* ANTES */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">QA reativo, "testa no fim"</p>
              </div>
              
              {/* AGORA */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Qualidade como sistema integrado. Critérios claros, risco mapeado, participação ativa</p>
              </div>
            </div>
          </div>

          {/* Card 2: Processos */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('processos')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Processos</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">Manual, sem critério definido</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Baseado em risco, automação estratégica, processos documentados</p>
              </div>
            </div>
          </div>

          {/* Card 3: Testes */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('testes')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TestTube2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Testes</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">Manual, pouco critério</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Automatizado, baseado em risco, cobertura estratégica</p>
              </div>
            </div>
          </div>

          {/* Card 4: Métricas */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('metricas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Métricas</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">Sensação térmica, subjetividade</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Indicadores objetivos, dados confiáveis, decisões baseadas em evidências</p>
              </div>
            </div>
          </div>

          {/* Card 5: Maturidade */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('maturidade')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Maturidade</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">QA como gargalo, processos ad-hoc</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Times autônomos, processos otimizados, melhoria contínua</p>
              </div>
            </div>
          </div>

          {/* Card 6: Cultura */}
          <div 
            className="group bg-card/30 border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setHoveredCard('cultura')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Cultura</h3>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-destructive/80 tracking-wide">ANTES</div>
                <p className="text-sm text-muted-foreground">Erro escondido, improdutivo, evitar erro</p>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-semibold text-primary tracking-wide">AGORA</div>
                <p className="text-sm text-foreground font-medium">Estratégico, análise de erro, melhoria contínua, aprendizado</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
