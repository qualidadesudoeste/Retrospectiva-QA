import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { AnaliseMensal, ProgressaoAcumulada, AnaliseMensalCliente } from '@/types/data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity, Zap, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DadosNovembro {
  mes: string;
  mes_num: number;
  total_sprints: number;
  liberadas: number;
  retrabalho_medio: number;
  score_medio: number;
  duracao_media: number;
  total_ciclos: number;
}

interface CiclosPorProjeto {
  Mes: string;
  [projeto: string]: string | number;
}

export default function Temporal() {
  const { data: mensalData, loading: mensalLoading } = useCSVData<AnaliseMensal>('/analise_mensal.csv');
  const { data: progressaoData, loading: progressaoLoading } = useCSVData<ProgressaoAcumulada>('/progressao_acumulada.csv');
  const { data: mensalClienteData, loading: mensalClienteLoading } = useCSVData<AnaliseMensalCliente>('/analise_mensal_cliente.csv');
  const { data: dadosNovembro, loading: novembroLoading } = useCSVData<DadosNovembro>('/analise_mensal_novembro.csv');
  const { data: ciclosPorProjeto, loading: ciclosProjetoLoading } = useCSVData<CiclosPorProjeto>('/ciclos_por_projeto_mes.csv');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRetrabalho, setFilterRetrabalho] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);

  const isLoading = mensalLoading || progressaoLoading || mensalClienteLoading || novembroLoading || ciclosProjetoLoading;

  // Preparar dados para gráfico de evolução mensal (excluindo dezembro)
  const evolucaoMensal = useMemo(() => {
    return mensalData
      .filter(m => m.MesNome !== 'Dezembro' && m.MesNome !== 'dezembro' && m.MesNome !== 'Dez')
      .map(m => ({
        mes: m.MesNome,
        ciclos: m.Ciclos,
        retrabalho: m.MediaRetrabalho,
        corretivas: m.Corretivas
      }));
  }, [mensalData]);

  // Filtrar dados da tabela
  const dadosFiltrados = useMemo(() => {
    let filtered = evolucaoMensal;
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.mes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRetrabalho) {
      filtered = filtered.filter(m => {
        if (filterRetrabalho === 'Excelente') return m.retrabalho < 15;
        if (filterRetrabalho === 'Bom') return m.retrabalho >= 15 && m.retrabalho < 25;
        if (filterRetrabalho === 'Alto') return m.retrabalho >= 25;
        return true;
      });
    }
    
    return filtered;
  }, [evolucaoMensal, searchTerm, filterRetrabalho]);

  // Estatísticas para filtros
  const stats = useMemo(() => {
    return {
      total: evolucaoMensal.length,
      excelente: evolucaoMensal.filter(m => m.retrabalho < 15).length,
      bom: evolucaoMensal.filter(m => m.retrabalho >= 15 && m.retrabalho < 25).length,
      alto: evolucaoMensal.filter(m => m.retrabalho >= 25).length
    };
  }, [evolucaoMensal]);

  // Calcular tendências
  const tendencias = useMemo(() => {
    if (evolucaoMensal.length < 2) return { ciclos: 0, retrabalho: 0 };
    
    const ultimo = evolucaoMensal[evolucaoMensal.length - 1];
    const penultimo = evolucaoMensal[evolucaoMensal.length - 2];
    
    return {
      ciclos: ((ultimo.ciclos - penultimo.ciclos) / penultimo.ciclos) * 100,
      retrabalho: ultimo.retrabalho - penultimo.retrabalho
    };
  }, [evolucaoMensal]);

  // Calcular estatísticas gerais
  const stats_gerais = useMemo(() => {
    if (evolucaoMensal.length === 0) return { ciclosUltimoMes: 0, mediaMensal: 0, retrabalhoUltimoMes: 0, totalAcumulado: 0 };
    
    const ultimo = evolucaoMensal[evolucaoMensal.length - 1];
    const totalCiclos = evolucaoMensal.reduce((sum, m) => sum + m.ciclos, 0);
    
    return {
      ciclosUltimoMes: ultimo.ciclos,
      mediaMensal: Math.round(totalCiclos / evolucaoMensal.length),
      retrabalhoUltimoMes: ultimo.retrabalho,
      totalAcumulado: totalCiclos
    };
  }, [evolucaoMensal]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados temporais...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border shadow-lg lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Evolução Mensal de Ciclos por Projeto</CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Distribuição detalhada de ciclos de teste por projeto ao longo dos meses</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={ciclosPorProjeto}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="Mes" 
                    stroke="#888" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#888" 
                    tick={{ fontSize: 12 }}
                    label={{ value: 'Ciclos', angle: -90, position: 'insideLeft', style: { fill: '#888' } }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                      border: '1px solid rgba(75, 85, 99, 0.5)', 
                      borderRadius: '12px',
                      padding: '12px 16px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
                    }}
                    labelStyle={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '8px' }}
                    itemStyle={{ fontSize: '13px' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px' }}
                    iconType="rect"
                    iconSize={10}
                  />
                  {/* Barras empilhadas para cada projeto - cores distintas */}
                  <Bar dataKey="SEMGE-CONTRATOS" stackId="a" fill="#3b82f6" />
                  <Bar dataKey="CMS-FOLHA DE PAGAMENTO" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="CODECON-FISCALIZAÇÃO" stackId="a" fill="#ec4899" />
                  <Bar dataKey="SEDUR-LICENCIAMENTO" stackId="a" fill="#10b981" />
                  <Bar dataKey="SEDUR-FISCALIZAÇÃO" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="LIVE-SIGSUAS" stackId="a" fill="#06b6d4" />
                  <Bar dataKey="SEMPRE-SIGSUAS" stackId="a" fill="#6366f1" />
                  <Bar dataKey="SEFAZ-CONTRATOS" stackId="a" fill="#84cc16" />
                  <Bar dataKey="SEFAZ-FROTAS" stackId="a" fill="#eab308" />
                  <Bar dataKey="SEFAZ-GESTÃO DE PROJETOS" stackId="a" fill="#0ea5e9" />
                  <Bar dataKey="SEFAZ-RHWEB" stackId="a" fill="#d946ef" />
                  <Bar dataKey="SEFAZ-AGENDAMENTO" stackId="a" fill="#f43f5e" />
                  <Bar dataKey="SEDUR-CONTRATOS" stackId="a" fill="#14b8a6" />
                  <Bar dataKey="SMED-ALIMENTAÇÃO" stackId="a" fill="#fb923c" />
                  <Bar dataKey="SEDUR-SAUSE" stackId="a" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Taxa de Retrabalho Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value: number) => `${value.toFixed(2)}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="retrabalho" 
                    stroke="#f97316" 
                    strokeWidth={3} 
                    dot={{ fill: '#f97316', r: 6, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filtros Rápidos */}
        <Card className="bg-card/40 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Filtros de Retrabalho</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => { setSearchTerm(''); setFilterRetrabalho(null); setIsTableExpanded(true); }}
              className="p-3 bg-background/50 border border-border/40 rounded-lg hover:border-primary/30 hover:bg-background/70 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-foreground">Todos</span>
              <span className="text-lg font-bold text-foreground">{stats.total}</span>
            </button>

            <button
              onClick={() => { setFilterRetrabalho('Excelente'); setIsTableExpanded(true); }}
              className="p-3 bg-green-500/5 border border-green-500/30 rounded-lg hover:border-green-500 hover:bg-green-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-green-400">Excelente (&lt;15%)</span>
              <span className="text-lg font-bold text-green-400">{stats.excelente}</span>
            </button>

            <button
              onClick={() => { setFilterRetrabalho('Bom'); setIsTableExpanded(true); }}
              className="p-3 bg-yellow-500/5 border border-yellow-500/30 rounded-lg hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-yellow-400">Bom (15-25%)</span>
              <span className="text-lg font-bold text-yellow-400">{stats.bom}</span>
            </button>

            <button
              onClick={() => { setFilterRetrabalho('Alto'); setIsTableExpanded(true); }}
              className="p-3 bg-red-500/5 border border-red-500/30 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-red-400">Alto (&gt;25%)</span>
              <span className="text-lg font-bold text-red-400">{stats.alto}</span>
            </button>
          </CardContent>
        </Card>

        {/* Busca e Toggle */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar mês..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value) setIsTableExpanded(true); }}
                className="pl-10 h-10 bg-card/40 backdrop-blur-sm border-border/40 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setIsTableExpanded(!isTableExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-card/40 backdrop-blur-sm border border-border/40 rounded-lg hover:bg-card/60 hover:border-primary/30 transition-all duration-200"
            >
              {isTableExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Recolher</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span className="text-sm font-medium">Expandir</span>
                </>
              )}
            </button>
          </div>

          {/* Tabela Detalhada */}
          {isTableExpanded && (
            <Card className="border-border/40 shadow-lg">
              
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/10 border-b border-border/20">
                        <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Mês</th>
                        <th className="text-center py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Ciclos</th>
                        <th className="text-center py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Retrabalho</th>
                        <th className="text-center py-4 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Corretivas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosFiltrados.map((mes, index) => (
                        <tr 
                          key={index} 
                          className="border-b border-border/10 hover:bg-card/60 transition-all duration-200 group"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 group-hover:bg-primary group-hover:scale-125 transition-all duration-200"></div>
                              <span className="font-medium text-foreground text-sm group-hover:text-primary transition-colors duration-200">{mes.mes}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold text-sm border border-primary/20 group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-200">
                              {mes.ciclos}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center justify-center min-w-[4rem] px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                              mes.retrabalho < 15 ? 'bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500/15 group-hover:border-green-500/30' :
                              mes.retrabalho < 25 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 group-hover:bg-yellow-500/15 group-hover:border-yellow-500/30' :
                              'bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-500/15 group-hover:border-red-500/30'
                            }`}>
                              {mes.retrabalho.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 font-semibold text-sm border border-red-500/20 group-hover:bg-red-500/15 group-hover:border-red-500/30 transition-all duration-200">
                              {mes.corretivas}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {dadosFiltrados.length === 0 && (
                  <div className="p-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg text-muted-foreground">Nenhum mês encontrado</p>
                    <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros ou a busca</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
