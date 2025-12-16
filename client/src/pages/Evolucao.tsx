import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Target, Settings, TestTube2, BarChart3, Users, Sparkles, TrendingUp, Hourglass } from "lucide-react";

export default function Evolucao() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Grid 2x3 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LINHA 1 - Card 1: Estratégia */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Estratégia</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* ANTES */}
              <div className="text-center">
                <div className="text-sm font-bold text-red-400 mb-3">ANTES</div>
                <div className="relative w-32 h-32 mx-auto">
                  {/* Velocímetro Vermelho */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 10 90 A 40 40 0 0 1 90 90"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Ponteiro */}
                    <line x1="50" y1="50" x2="30" y2="70" stroke="#666" strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="#666" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0</div>
                  <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">H</div>
                </div>
              </div>
              
              {/* AGORA */}
              <div className="text-center">
                <div className="text-sm font-bold text-blue-400 mb-3">AGORA</div>
                <div className="relative w-32 h-32 mx-auto">
                  {/* Velocímetro Azul */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 10 90 A 40 40 0 0 1 90 90"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Ponteiro */}
                    <line x1="50" y1="50" x2="75" y2="65" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="#3b82f6" />
                  </svg>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-center text-blue-400 w-full px-1">
                    Critérios claros, risco mapeado
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LINHA 1 - Card 2: Processos */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Processos</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* ANTES */}
              <div className="text-center">
                <div className="text-sm font-bold text-red-400 mb-3">ANTES</div>
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 10 90 A 40 40 0 0 1 90 90"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line x1="50" y1="50" x2="25" y2="75" stroke="#666" strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="#666" />
                  </svg>
                  <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0</div>
                  <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">H</div>
                </div>
              </div>
              
              {/* AGORA */}
              <div className="text-center">
                <div className="text-sm font-bold text-blue-400 mb-3">AGORA</div>
                <div className="relative w-32 h-32 mx-auto">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path
                      d="M 10 90 A 40 40 0 0 1 90 90"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <line x1="50" y1="50" x2="80" y2="60" stroke="#3b82f6" strokeWidth="2" />
                    <circle cx="50" cy="50" r="3" fill="#3b82f6" />
                  </svg>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-center text-blue-400 w-full px-1">
                    Baseado em risco, automação estratégica
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LINHA 1 - Card 3: Testes */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-4 text-foreground">Testes</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-muted-foreground">Manual/Pouco Critério</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-muted-foreground">Automatizado/Baseado em Risco</span>
              </div>
              
              {/* Gráfico de Barras Empilhadas */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Manual/Pouco Critério</div>
                  <div className="h-32 bg-gradient-to-t from-red-500 to-red-400 rounded-t flex items-end justify-center pb-2">
                    <span className="text-white font-bold text-lg">60</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">Automatizado/Baseado em Risco</div>
                  <div className="h-32 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t flex items-end justify-center pb-2">
                    <span className="text-white font-bold text-lg">58</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LINHA 2 - Card 4: Métricas */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-4 text-foreground">Métricas</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 border-t-2 border-dashed border-red-400"></div>
                <span className="text-muted-foreground">Sensação Térmica</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-8 border-t-2 border-blue-500"></div>
                <span className="text-muted-foreground">Indicadores Objetivos</span>
              </div>
              
              {/* Gráfico de Linha */}
              <div className="relative h-40 mt-4">
                <svg viewBox="0 0 200 80" className="w-full h-full">
                  {/* Grid */}
                  <line x1="0" y1="60" x2="200" y2="60" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke="#333" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="200" y2="20" stroke="#333" strokeWidth="0.5" />
                  
                  {/* Linha Vermelha (Sensação Térmica) */}
                  <polyline
                    points="10,50 50,45 90,65 130,55 170,60"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                  />
                  
                  {/* Linha Azul (Indicadores Objetivos) */}
                  <polyline
                    points="10,60 50,55 90,45 130,35 170,25"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>T1</span>
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                </div>
              </div>
            </div>
          </div>

          {/* LINHA 2 - Card 5: Maturidade da Qualidade (MAIOR) */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Maturidade da Qualidade</h3>
            
            {/* Diagrama de Escada */}
            <div className="relative h-48">
              <svg viewBox="0 0 300 180" className="w-full h-full">
                {/* Linha de progresso */}
                <polyline
                  points="20,160 60,140 100,120 140,100 180,80 220,60"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  markerEnd="url(#arrowhead)"
                />
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
                    <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
                  </marker>
                </defs>
                
                {/* Pontos dos milestones */}
                <circle cx="20" cy="160" r="4" fill="#666" />
                <circle cx="60" cy="140" r="4" fill="#666" />
                <circle cx="100" cy="120" r="4" fill="#888" />
                <circle cx="140" cy="100" r="4" fill="#aaa" />
                <circle cx="180" cy="80" r="4" fill="#f59e0b" />
                <circle cx="220" cy="60" r="6" fill="#f59e0b" />
              </svg>
              
              {/* Labels */}
              <div className="absolute bottom-0 left-0 text-[8px] text-muted-foreground">Inicial</div>
              <div className="absolute bottom-8 left-12 text-[8px] text-muted-foreground">Definido</div>
              <div className="absolute bottom-16 left-24 text-[8px] text-muted-foreground">Gerenciado</div>
              <div className="absolute bottom-24 left-36 text-[8px] text-muted-foreground">Medido</div>
              <div className="absolute bottom-32 right-24 text-[8px] text-yellow-400">Otimizado</div>
            </div>
            
            {/* Ícones */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-center">
                <Hourglass className="w-8 h-8 text-red-400 mx-auto mb-1" />
                <div className="text-[9px] text-muted-foreground">QA como<br/>Gargalo</div>
              </div>
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-1" />
                <div className="text-[9px] text-muted-foreground">Times<br/>Autônomos</div>
              </div>
            </div>
          </div>

          {/* LINHA 2 - Card 6: Cultura */}
          <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-6">
            <h3 className="text-xl font-bold text-center mb-6 text-foreground">Cultura</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* ANTES */}
              <div className="text-center">
                <div className="text-sm font-bold text-red-400 mb-3">ANTES</div>
                <div className="h-32 flex flex-col items-center justify-center space-y-1">
                  <span className="text-red-400 text-lg font-bold">Erro Escondido</span>
                  <span className="text-red-300 text-sm">Improdutivo</span>
                  <span className="text-red-400 text-xs">Erro Evita</span>
                  <span className="text-red-300 text-[10px]">Imitreitusto</span>
                </div>
              </div>
              
              {/* AGORA */}
              <div className="text-center relative">
                <div className="text-sm font-bold text-blue-400 mb-3">AGORA</div>
                <div className="h-32 flex flex-col items-center justify-center space-y-1">
                  <span className="text-blue-400 text-lg font-bold">Estratégico</span>
                  <span className="text-blue-300 text-sm">Análise de Erro</span>
                  <span className="text-blue-400 text-xs">Melhoria Contínua</span>
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute bottom-2 right-2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
