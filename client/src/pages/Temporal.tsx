import { useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { AnaliseMensal, ProgressaoAcumulada, AnaliseMensalCliente, MetricasQualidadeProjeto } from '@/types/data';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, Activity, Zap, ChevronDown, ChevronUp, Search, Target, Award, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
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

interface CiclosPorSprint {
  Projeto: string;
  Sprint: string;
  Mes: string;
  Ciclos: number;
}

export default function Temporal() {
  const { data: mensalData, loading: mensalLoading } = useCSVData<AnaliseMensal>('/analise_mensal.csv');
  const { data: progressaoData, loading: progressaoLoading } = useCSVData<ProgressaoAcumulada>('/progressao_acumulada.csv');
  const { data: mensalClienteData, loading: mensalClienteLoading } = useCSVData<AnaliseMensalCliente>('/analise_mensal_cliente.csv');
  const { data: dadosNovembro, loading: novembroLoading } = useCSVData<DadosNovembro>('/analise_mensal_novembro.csv');
  const { data: ciclosPorProjeto, loading: ciclosProjetoLoading } = useCSVData<CiclosPorProjeto>('/ciclos_por_projeto_mes.csv');
  const { data: ciclosPorSprint, loading: ciclosSprintLoading } = useCSVData<CiclosPorSprint>('/ciclos_por_sprint.csv');
  const { data: metricasData, loading: metricasLoading } = useCSVData<MetricasQualidadeProjeto>('/metricas_qualidade_projeto.csv');

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRetrabalho, setFilterRetrabalho] = useState<string | null>(null);
  const [filterClassificacao, setFilterClassificacao] = useState<string | null>(null);
  const [isTableExpanded, setIsTableExpanded] = useState(false);
  const [viewMode, setViewMode] = useState<'mensal' | 'sprint'>('mensal');

  const isLoading = mensalLoading || progressaoLoading || mensalClienteLoading || novembroLoading || ciclosProjetoLoading || ciclosSprintLoading || metricasLoading;

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

  // Processar dados de ciclos por projeto: converter 0 em null para não renderizar barras vazias
  const ciclosPorProjetoProcessado = useMemo(() => {
    return ciclosPorProjeto.map(mes => {
      const mesProcessado: any = { Mes: mes.Mes };
      Object.keys(mes).forEach(key => {
        if (key !== 'Mes') {
          // Converter 0 em null para que o Recharts não renderize a barra
          mesProcessado[key] = mes[key] === 0 || mes[key] === '0' ? null : mes[key];
        }
      });
      return mesProcessado;
    });
  }, [ciclosPorProjeto]);

  // Função para obter cor do projeto
  const getCorProjeto = (projeto: string) => {
    const cores: Record<string, string> = {
      'SEMGE-CONTRATOS': '#3b82f6',
      'CMS-FOLHA DE PAGAMENTO': '#8b5cf6',
      'CODECON-FISCALIZAÇÃO': '#ec4899',
      'SEDUR-LICENCIAMENTO': '#10b981',
      'SEDUR-FISCALIZAÇÃO': '#f59e0b',
      'LIVE-SIGSUAS': '#06b6d4',
      'SEMPRE-SIGSUAS': '#6366f1',
      'SEFAZ-CONTRATOS': '#84cc16',
      'SEFAZ-GESTÃO DE PROJETOS': '#0ea5e9',
      'SEFAZ-RHWEB': '#d946ef',
      'SEFAZ-AGENDAMENTO': '#f43f5e',
      'SEDUR-CONTRATOS': '#14b8a6',
      'SMED-ALIMENTAÇÃO': '#fb923c',
      'SEDUR-SAUSE': '#38bdf8',
      'TRANSALVADOR-SINALIZAÇÃO': '#a855f7',
      'SEDUR-INTELIGÊNCIA ARTIFICIAL': '#22c55e',
      'SMED-SISTEMA DE ELEIÇÕES': '#f97316',
      'SEDUR-INTRANET': '#8b5cf6'
    };
    return cores[projeto] || '#888';
  };

  // Transformar dados para gráficos individuais por projeto (mensal)
  const dadosPorProjeto = useMemo(() => {
    if (ciclosPorProjeto.length === 0) return [];
    
    const projetos = Object.keys(ciclosPorProjeto[0]).filter(k => k !== 'Mes');
    
    return projetos.map(projeto => ({
      nome: projeto,
      dados: ciclosPorProjeto.map(mes => ({
        mes: mes.Mes,
        ciclos: mes[projeto] === 0 || mes[projeto] === '0' ? null : mes[projeto]
      })),
      cor: getCorProjeto(projeto)
    }));
  }, [ciclosPorProjeto]);

  // Transformar dados para visualização por sprint (dados reais do CSV)
  const dadosPorProjetoSprint = useMemo(() => {
    if (ciclosPorSprint.length === 0) return [];
    
    // Ordem dos projetos (mesma ordem da visualização mensal)
    const ordemProjetos = [
      'CODECON-FISCALIZAÇÃO',
      'SEFAZ-CONTRATOS',
      'CMS-FOLHA DE PAGAMENTO',
      'SEFAZ-GESTÃO DE PROJETOS',
      'SEDUR-LICENCIAMENTO',
      'SEDUR-FISCALIZAÇÃO',
      'SEDUR-SAUSE',
      'SEFAZ-AGENDAMENTO',
      'SEFAZ-RHWEB',
      'SEMGE-CONTRATOS',
      'LIVE-SIGSUAS',
      'SEMPRE-SIGSUAS',
      'SEDUR-CONTRATOS',
      'SMED-ALIMENTAÇÃO',
      'TRANSALVADOR-SINALIZAÇÃO',
      'SEDUR-INTELIGÊNCIA ARTIFICIAL',
      'SMED-SISTEMA DE ELEIÇÕES',
      'SEDUR-INTRANET'
    ];
    
    // Agrupar sprints por projeto
    const projetoMap = new Map<string, Array<{sprint: string, ciclos: number}>>(); 
    
    ciclosPorSprint.forEach(item => {
      if (!projetoMap.has(item.Projeto)) {
        projetoMap.set(item.Projeto, []);
      }
      projetoMap.get(item.Projeto)!.push({
        sprint: item.Sprint,
        ciclos: Number(item.Ciclos)
      });
    });
    
    // Converter para formato do gráfico e ordenar conforme ordem definida
    const resultado = Array.from(projetoMap.entries()).map(([projeto, sprints]) => ({
      nome: projeto,
      dados: sprints,
      cor: getCorProjeto(projeto)
    }));
    
    // Ordenar baseado na ordem definida
    resultado.sort((a, b) => {
      const indexA = ordemProjetos.indexOf(a.nome);
      const indexB = ordemProjetos.indexOf(b.nome);
      return indexA - indexB;
    });
    
    return resultado;
  }, [ciclosPorSprint]);

  // Filtrar projetos e remover duplicatas
  const projetosFiltrados = useMemo(() => {
    let filtered = metricasData;
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.Projeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.Cliente.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterClassificacao) {
      filtered = filtered.filter(p => p.Classificacao === filterClassificacao);
    }
    
    // Remover duplicatas baseado em Cliente + Projeto
    const uniqueProjects = new Map();
    filtered.forEach(projeto => {
      const key = `${projeto.Cliente}-${projeto.Projeto}`;
      if (!uniqueProjects.has(key)) {
        uniqueProjects.set(key, projeto);
      }
    });
    
    return Array.from(uniqueProjects.values());
  }, [metricasData, searchTerm, filterClassificacao]);

  // Estatísticas para filtros de projetos
  const stats = useMemo(() => {
    if (metricasData.length === 0) return null;
    
    // Remover duplicatas para estatísticas
    const uniqueProjects = new Map();
    metricasData.forEach(projeto => {
      const key = `${projeto.Cliente}-${projeto.Projeto}`;
      if (!uniqueProjects.has(key)) {
        uniqueProjects.set(key, projeto);
      }
    });
    const uniqueData = Array.from(uniqueProjects.values());
    
    return {
      totalProjetos: uniqueData.length,
      excelentes: uniqueData.filter(p => p.Classificacao === 'Excelente').length,
      bons: uniqueData.filter(p => p.Classificacao === 'Bom').length,
      regulares: uniqueData.filter(p => p.Classificacao === 'Regular').length,
      criticos: uniqueData.filter(p => p.Classificacao === 'Crítico').length,
      scoreMedia: (uniqueData.reduce((sum, p) => sum + p.ScoreQualidade, 0) / uniqueData.length).toFixed(1),
      retrabalhoMedio: (uniqueData.reduce((sum, p) => sum + p.MediaRetrabalho, 0) / uniqueData.length).toFixed(1)
    };
  }, [metricasData]);

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'Excelente':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'Bom':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Regular':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'Crítico':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-muted/10 text-foreground border-border';
    }
  };

  const getClassificacaoIcon = (classificacao: string) => {
    switch (classificacao) {
      case 'Excelente':
        return <Award className="w-4 h-4" />;
      case 'Bom':
        return <CheckCircle className="w-4 h-4" />;
      case 'Regular':
        return <AlertCircle className="w-4 h-4" />;
      case 'Crítico':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

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
        {/* Toggle de Visualização */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => setViewMode('mensal')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'mensal'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visualização Mensal
            </button>
            <button
              onClick={() => setViewMode('sprint')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'sprint'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Visualização por Sprint
            </button>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grid de gráficos individuais por projeto */}
          {(viewMode === 'mensal' ? dadosPorProjeto : dadosPorProjetoSprint).map((projeto) => (
            <Card key={projeto.nome} className="border-border shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  {projeto.nome}
                  {viewMode === 'sprint' && projeto.dados.length > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">({projeto.dados.length} sprints)</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={projeto.dados}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.3} />
                    <XAxis 
                      dataKey={viewMode === 'mensal' ? 'mes' : 'sprint'}
                      stroke="#888" 
                      tick={{ fontSize: 10 }}
                      height={30}
                      interval={viewMode === 'sprint' ? 'preserveStartEnd' : 0}
                    />
                    <YAxis 
                      stroke="#888" 
                      tick={{ fontSize: 10 }}
                      width={30}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                        border: `2px solid ${projeto.cor}`, 
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      labelStyle={{ color: '#fff', fontWeight: '600', fontSize: '12px' }}
                      itemStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ciclos" 
                      stroke={projeto.cor}
                      strokeWidth={2.5}
                      dot={{ fill: projeto.cor, r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ))}

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

          {/* Filtros Rápidos de Projetos */}
          <Card className="bg-card/40 backdrop-blur-sm border-border/40">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Filtros de Classificação</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => { setSearchTerm(''); setFilterClassificacao(null); setIsTableExpanded(true); }}
              className="p-3 bg-background/50 border border-border/40 rounded-lg hover:border-primary/30 hover:bg-background/70 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-foreground">Todos</span>
              <span className="text-lg font-bold text-foreground">{stats?.totalProjetos}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Excelente'); setIsTableExpanded(true); }}
              className="p-3 bg-primary/5 border border-primary/30 rounded-lg hover:border-primary hover:bg-primary/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-primary">Excelentes</span>
              <span className="text-lg font-bold text-primary">{stats?.excelentes}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Bom'); setIsTableExpanded(true); }}
              className="p-3 bg-blue-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-blue-400">Bons</span>
              <span className="text-lg font-bold text-blue-400">{stats?.bons}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Regular'); setIsTableExpanded(true); }}
              className="p-3 bg-yellow-500/5 border border-yellow-500/30 rounded-lg hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-yellow-400">Regulares</span>
              <span className="text-lg font-bold text-yellow-400">{stats?.regulares}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Crítico'); setIsTableExpanded(true); }}
              className="p-3 bg-red-500/5 border border-red-500/30 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-red-400">Críticos</span>
              <span className="text-lg font-bold text-red-400">{stats?.criticos}</span>
            </button>
          </CardContent>
        </Card>
        </div>

        {/* Busca e Toggle */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar projeto ou cliente..."
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

          {/* Tabela de Projetos */}
          {isTableExpanded && (
            <div className="bg-card/40 backdrop-blur-sm border border-border/40 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Projeto</th>
                      <th className="text-left p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Classificação</th>
                      <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Retrabalho</th>
                      <th className="text-center p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duração Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projetosFiltrados.map((projeto, index) => (
                      <tr key={index} className="border-b border-border/20 hover:bg-primary/5 transition-colors duration-200 cursor-pointer">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md ${getClassificacaoColor(projeto.Classificacao)}`}>
                              {getClassificacaoIcon(projeto.Classificacao)}
                            </div>
                            <div>
                              <div className="font-semibold text-sm text-foreground">{projeto.Cliente}</div>
                              <div className="text-xs text-muted-foreground">{projeto.Projeto}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold border ${getClassificacaoColor(projeto.Classificacao)}`}>
                            {projeto.Classificacao}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm font-semibold text-foreground">{projeto.MediaRetrabalho?.toFixed(1) || '0.0'}%</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-sm font-semibold text-foreground">
                            {projeto.NumCiclos && projeto.DuracaoDias ? (projeto.DuracaoDias / projeto.NumCiclos).toFixed(1) : '0'} dias
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {projetosFiltrados.length === 0 && (
                <div className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">Nenhum projeto encontrado</p>
                  <p className="text-sm text-muted-foreground mt-2">Tente ajustar os filtros ou a busca</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
