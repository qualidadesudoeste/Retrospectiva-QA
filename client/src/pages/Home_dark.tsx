import { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { AnaliseMensal } from '@/types/data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Bug, Trophy, CheckCircle, FileText, MessageSquare, Sparkles, Target } from 'lucide-react';

export default function Home() {
  const { data: mensalData, loading } = useCSVData<AnaliseMensal>('/analise_mensal.csv');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-2xl font-bold text-slate-300 animate-pulse">Carregando retrospectiva...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Preparar dados para gráfico de evolução
  const evolucaoData = mensalData.map(m => ({
    mes: m.MesNome.substring(0, 3),
    bugs: Math.round(m.Corretivas / 10), // Simulando bugs críticos
  }));

  // Calcular métricas principais
  const totalCiclos = mensalData.reduce((sum, m) => sum + m.Ciclos, 0);
  const totalCorretivas = mensalData.reduce((sum, m) => sum + m.Corretivas, 0);
  const mediaRetrabalho = mensalData.reduce((sum, m) => sum + m.MediaRetrabalho, 0) / mensalData.length;
  
  // Simular uptime (baseado em qualidade)
  const uptime = (100 - (mediaRetrabalho / 2)).toFixed(2);
  
  // Simular NPS (baseado em qualidade)
  const nps = Math.round(100 - mediaRetrabalho * 2);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-5xl font-bold text-foreground">
            Retrospectiva 2025: Equipe de Qualidade de Software
          </h1>
          <p className="text-xl text-slate-400">
            Análise de Desempenho, Conquistas e Lições Aprendidas. Jan - Dez 2025.
          </p>
        </div>

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Uptime do Sistema */}
          <Card className="bg-slate-800/50 border-2 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-400">Uptime do Sistema:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-green-400">{uptime}%</span>
                  <span className="text-sm text-green-400">(+0.5%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Satisfação (NPS Interno) */}
          <Card className="bg-slate-800/50 border-2 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-400">Satisfação (NPS Interno):</div>
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold text-green-400">{nps}</span>
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-slate-700"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${(nps / 100) * 175.93} 175.93`}
                        className="text-green-400"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bugs Resolvidos */}
          <Card className="bg-slate-800/50 border-2 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-400">Bugs Resolvidos:</div>
                <div className="flex items-center gap-4">
                  <Bug className="w-12 h-12 text-blue-400" />
                  <span className="text-5xl font-bold text-foreground">{totalCorretivas.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Automações Criadas */}
          <Card className="bg-slate-800/50 border-2 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="text-sm font-medium text-slate-400">Automações Criadas:</div>
                <div className="flex items-center gap-4">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                  <span className="text-5xl font-bold text-yellow-400">35+</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico e Top 3 Conquistas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Evolução de Bugs Críticos e Deploys */}
          <Card className="lg:col-span-2 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Evolução de Bugs Críticos e Deploys</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    stroke="#4b5563"
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    stroke="#4b5563"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #475569',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bugs" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Maio: Migração Legacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>Nov: Nova Pipeline IA</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top 3 Conquistas */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Top 3 Conquistas</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-foreground font-medium">Certificação ISO 9001 Obtida</div>
                    <div className="text-sm text-slate-400 mt-1">Reconhecimento internacional de qualidade</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-foreground font-medium">Zero Incidentes Críticos na Black Friday</div>
                    <div className="text-sm text-slate-400 mt-1">100% de disponibilidade no período</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-foreground font-medium">Redução de 40% no tempo de Testes de Regressão</div>
                    <div className="text-sm text-slate-400 mt-1">Automação e otimização de processos</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seções Finais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* O Que Funcionou */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                O Que Funcionou
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div className="text-slate-300">Integração Contínua</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div className="text-slate-300">Programas de Mentoria</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lições Aprendidas */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-400" />
                Lições Aprendidas
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div className="text-slate-300">Documentação de APIs legadas</div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  <div className="text-slate-300">Comunicação em incidentes</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foco para 2026 */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Foco para 2026
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-300">Implementar Testes com IA Generativa</div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-300">Expansão de Testes de Performance</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
