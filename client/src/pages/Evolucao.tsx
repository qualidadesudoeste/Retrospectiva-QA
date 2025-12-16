import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Target, Settings, TestTube2, BarChart3, Users, Sparkles, TrendingUp, Hourglass, Zap, Award, CheckCircle } from "lucide-react";

export default function Evolucao() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        
        {/* Header com destaque */}
        <div className="text-center space-y-3 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-500 bg-clip-text text-transparent">
            Evolução da Qualidade 2025
          </h1>
          <p className="text-muted-foreground text-lg">
            Transformação de processos, cultura e resultados
          </p>
        </div>

        {/* Grid 2x3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LINHA 1 - Card 1: Estratégia */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('estrategia')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-6">
              <Target className={`w-6 h-6 text-primary transition-transform duration-500 ${hoveredCard === 'estrategia' ? 'rotate-180 scale-110' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Estratégia</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* ANTES */}
              <div className="text-center space-y-3">
                <div className="text-xs font-bold text-red-400 tracking-wider">ANTES</div>
                <div className="relative w-full aspect-square">
                  {/* Velocímetro Vermelho com animação */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#dc2626" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 15 85 A 35 35 0 0 1 85 85"
                      fill="none"
                      stroke="url(#redGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    {/* Ponteiro */}
                    <line 
                      x1="50" y1="50" x2="30" y2="75" 
                      stroke="#991b1b" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={hoveredCard === 'estrategia' ? 'animate-bounce' : ''}
                    />
                    <circle cx="50" cy="50" r="4" fill="#991b1b" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-[10px] text-muted-foreground font-bold">0</div>
                  <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground font-bold">100</div>
                </div>
                <div className="text-xs text-muted-foreground italic">QA reativo, "testa no fim"</div>
              </div>
              
              {/* AGORA */}
              <div className="text-center space-y-3">
                <div className="text-xs font-bold text-blue-400 tracking-wider">AGORA</div>
                <div className="relative w-full aspect-square">
                  {/* Velocímetro Azul com animação */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 15 85 A 35 35 0 0 1 85 85"
                      fill="none"
                      stroke="url(#blueGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Ponteiro */}
                    <line 
                      x1="50" y1="50" x2="75" y2="65" 
                      stroke="#1e40af" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      className={hoveredCard === 'estrategia' ? 'animate-pulse' : ''}
                    />
                    <circle cx="50" cy="50" r="4" fill="#1e40af" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-yellow-400 animate-pulse" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-[10px] text-muted-foreground font-bold">0</div>
                  <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground font-bold">100</div>
                </div>
                <div className="text-xs text-blue-400 font-semibold">Critérios claros, risco mapeado</div>
              </div>
            </div>
            
            {/* Badge de melhoria */}
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+85% de maturidade</span>
            </div>
          </div>

          {/* LINHA 1 - Card 2: Processos */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-secondary/50 hover:shadow-2xl hover:shadow-secondary/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('processos')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-6">
              <Settings className={`w-6 h-6 text-secondary transition-transform duration-500 ${hoveredCard === 'processos' ? 'rotate-180' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Processos</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* ANTES */}
              <div className="text-center space-y-3">
                <div className="text-xs font-bold text-red-400 tracking-wider">ANTES</div>
                <div className="relative w-full aspect-square">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 15 85 A 35 35 0 0 1 85 85"
                      fill="none"
                      stroke="url(#redGradient)"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    <line x1="50" y1="50" x2="25" y2="78" stroke="#991b1b" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4" fill="#991b1b" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-[10px] text-muted-foreground font-bold">0</div>
                  <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground font-bold">100</div>
                </div>
                <div className="text-xs text-muted-foreground italic">Manual, sem critério</div>
              </div>
              
              {/* AGORA */}
              <div className="text-center space-y-3">
                <div className="text-xs font-bold text-blue-400 tracking-wider">AGORA</div>
                <div className="relative w-full aspect-square">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 15 85 A 35 35 0 0 1 85 85"
                      fill="none"
                      stroke="url(#blueGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <line x1="50" y1="50" x2="80" y2="60" stroke="#1e40af" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="4" fill="#1e40af" />
                    <CheckCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-pulse" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-[10px] text-muted-foreground font-bold">0</div>
                  <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground font-bold">100</div>
                </div>
                <div className="text-xs text-blue-400 font-semibold">Baseado em risco, automatizado</div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm font-bold">
              <TrendingUp className="w-4 h-4" />
              <span>+90% de eficiência</span>
            </div>
          </div>

          {/* LINHA 1 - Card 3: Testes */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('testes')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-4">
              <TestTube2 className={`w-6 h-6 text-purple-400 transition-transform duration-500 ${hoveredCard === 'testes' ? 'scale-125' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Testes</h3>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                <span className="text-muted-foreground">Manual/Pouco Critério</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                <span className="text-muted-foreground">Automatizado/Baseado em Risco</span>
              </div>
            </div>
            
            {/* Gráfico de Barras Comparativo Melhorado */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="text-center space-y-2">
                <div className="text-[10px] text-muted-foreground font-semibold">ANTES</div>
                <div className="relative h-40 bg-gradient-to-t from-red-600 via-red-500 to-red-400 rounded-lg flex flex-col items-center justify-end pb-3 hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl drop-shadow-lg">60</span>
                  <span className="text-white/80 text-[10px]">testes</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-[10px] text-muted-foreground font-semibold">AGORA</div>
                <div className="relative h-40 bg-gradient-to-t from-blue-600 via-blue-500 to-blue-400 rounded-lg flex flex-col items-center justify-end pb-3 hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-bold text-2xl drop-shadow-lg">58</span>
                  <span className="text-white/80 text-[10px]">testes</span>
                  <Sparkles className="absolute top-2 right-2 w-4 h-4 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center text-xs text-green-400 font-bold">
              Mesma cobertura, +200% de velocidade
            </div>
          </div>

          {/* LINHA 2 - Card 4: Métricas */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('metricas')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className={`w-6 h-6 text-cyan-400 transition-transform duration-500 ${hoveredCard === 'metricas' ? 'scale-125' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Métricas</h3>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 border-t-2 border-dashed border-red-400"></div>
                <span className="text-muted-foreground">Sensação Térmica</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 border-t-2 border-blue-500"></div>
                <span className="text-muted-foreground">Indicadores Objetivos</span>
              </div>
            </div>
            
            {/* Gráfico de Linha Melhorado */}
            <div className="relative h-48 mt-4 bg-gradient-to-b from-transparent to-card/20 rounded-lg p-4">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Grid de fundo */}
                <line x1="0" y1="80" x2="200" y2="80" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="60" x2="200" y2="60" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="40" x2="200" y2="40" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="20" x2="200" y2="20" stroke="#333" strokeWidth="0.5" opacity="0.3" />
                
                {/* Área sob a linha azul */}
                <polygon
                  points="10,80 50,75 90,65 130,55 170,45 170,100 10,100"
                  fill="url(#blueGradientArea)"
                  opacity="0.2"
                />
                
                <defs>
                  <linearGradient id="blueGradientArea" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                
                {/* Linha Vermelha (Sensação Térmica) */}
                <polyline
                  points="10,60 50,55 90,75 130,65 170,70"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  className={hoveredCard === 'metricas' ? 'animate-pulse' : ''}
                />
                
                {/* Linha Azul (Indicadores Objetivos) */}
                <polyline
                  points="10,80 50,75 90,65 130,55 170,45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  className={hoveredCard === 'metricas' ? 'animate-pulse' : ''}
                />
                
                {/* Pontos na linha azul */}
                <circle cx="10" cy="80" r="3" fill="#3b82f6" />
                <circle cx="50" cy="75" r="3" fill="#3b82f6" />
                <circle cx="90" cy="65" r="3" fill="#3b82f6" />
                <circle cx="130" cy="55" r="3" fill="#3b82f6" />
                <circle cx="170" cy="45" r="4" fill="#3b82f6">
                  <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </svg>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-2">
                <span>Jan</span>
                <span>Mar</span>
                <span>Jun</span>
                <span>Set</span>
                <span>Dez</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm font-bold">
              <Award className="w-4 h-4" />
              <span>Dados confiáveis</span>
            </div>
          </div>

          {/* LINHA 2 - Card 5: Maturidade da Qualidade */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('maturidade')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className={`w-6 h-6 text-yellow-400 transition-transform duration-500 ${hoveredCard === 'maturidade' ? 'scale-125 rotate-12' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Maturidade da Qualidade</h3>
            </div>
            
            {/* Diagrama de Escada Melhorado */}
            <div className="relative h-56 bg-gradient-to-b from-transparent to-card/20 rounded-lg p-4">
              <svg viewBox="0 0 300 200" className="w-full h-full">
                {/* Linha de progresso com gradiente */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#666" />
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>
                
                <polyline
                  points="30,180 70,150 110,120 150,90 190,60 230,30"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                  className={hoveredCard === 'maturidade' ? 'animate-pulse' : ''}
                />
                
                <defs>
                  <marker id="arrowhead" markerWidth="12" markerHeight="12" refX="6" refY="4" orient="auto">
                    <polygon points="0 0, 12 4, 0 8" fill="#fbbf24" />
                  </marker>
                </defs>
                
                {/* Pontos dos milestones com animação */}
                <circle cx="30" cy="180" r="5" fill="#666">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0s" />
                </circle>
                <circle cx="70" cy="150" r="5" fill="#888">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.4s" />
                </circle>
                <circle cx="110" cy="120" r="5" fill="#aaa">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.8s" />
                </circle>
                <circle cx="150" cy="90" r="5" fill="#d97706">
                  <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="1.2s" />
                </circle>
                <circle cx="190" cy="60" r="6" fill="#f59e0b">
                  <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" begin="1.6s" />
                </circle>
                <circle cx="230" cy="30" r="8" fill="#fbbf24">
                  <animate attributeName="r" values="8;12;8" dur="1.5s" repeatCount="indefinite" />
                </circle>
                
                {/* Estrela no topo */}
                <Sparkles className="absolute top-2 right-8 w-6 h-6 text-yellow-400 animate-pulse" />
              </svg>
              
              {/* Labels dos níveis */}
              <div className="absolute bottom-2 left-2 text-[9px] text-muted-foreground">Inicial</div>
              <div className="absolute bottom-10 left-14 text-[9px] text-muted-foreground">Definido</div>
              <div className="absolute bottom-20 left-24 text-[9px] text-muted-foreground">Gerenciado</div>
              <div className="absolute bottom-32 left-36 text-[9px] text-yellow-600">Medido</div>
              <div className="absolute top-16 right-20 text-[10px] text-yellow-400 font-bold">Otimizado</div>
            </div>
            
            {/* Ícones de transformação */}
            <div className="flex justify-between items-center mt-6 px-4">
              <div className="text-center space-y-1">
                <Hourglass className="w-10 h-10 text-red-400 mx-auto" />
                <div className="text-[8px] text-muted-foreground leading-tight">QA como<br/>Gargalo</div>
              </div>
              
              <div className="flex-1 flex justify-center">
                <TrendingUp className="w-8 h-8 text-yellow-400 animate-bounce" />
              </div>
              
              <div className="text-center space-y-1">
                <Users className="w-10 h-10 text-blue-400 mx-auto" />
                <div className="text-[8px] text-muted-foreground leading-tight">Times<br/>Autônomos</div>
              </div>
            </div>
          </div>

          {/* LINHA 2 - Card 6: Cultura */}
          <div 
            className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border border-border/40 rounded-xl p-6 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 cursor-pointer"
            onMouseEnter={() => setHoveredCard('cultura')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className={`w-6 h-6 text-green-400 transition-transform duration-500 ${hoveredCard === 'cultura' ? 'rotate-180 scale-125' : ''}`} />
              <h3 className="text-xl font-bold text-foreground">Cultura</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* ANTES */}
              <div className="text-center space-y-3">
                <div className="text-xs font-bold text-red-400 tracking-wider">ANTES</div>
                <div className="h-40 flex flex-col items-center justify-center space-y-2 bg-red-950/20 rounded-lg p-3 border border-red-900/30">
                  <span className="text-red-400 text-xl font-bold animate-pulse">Erro Escondido</span>
                  <span className="text-red-300 text-base">Improdutivo</span>
                  <span className="text-red-400/80 text-sm">Erro Evita</span>
                  <span className="text-red-300/60 text-xs">Imitreitusto</span>
                </div>
              </div>
              
              {/* AGORA */}
              <div className="text-center space-y-3 relative">
                <div className="text-xs font-bold text-blue-400 tracking-wider">AGORA</div>
                <div className="h-40 flex flex-col items-center justify-center space-y-2 bg-blue-950/20 rounded-lg p-3 border border-blue-900/30 relative overflow-hidden">
                  <span className="text-blue-400 text-xl font-bold">Estratégico</span>
                  <span className="text-blue-300 text-base">Análise de Erro</span>
                  <span className="text-blue-400/80 text-sm">Melhoria Contínua</span>
                  <Sparkles className="absolute bottom-2 right-2 w-8 h-8 text-yellow-400 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-green-400 text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Transformação cultural completa</span>
            </div>
          </div>

        </div>
        
        {/* Footer com estatísticas gerais */}
        <div className="bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">288</div>
              <div className="text-sm text-muted-foreground">Sprints Analisadas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-400">66,9%</div>
              <div className="text-sm text-muted-foreground">Maker Express</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-400">18</div>
              <div className="text-sm text-muted-foreground">Projetos Ativos</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-400">20.814,8</div>
              <div className="text-sm text-muted-foreground">Pontos de Função (SIG)</div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
