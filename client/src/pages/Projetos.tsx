import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { MetricasQualidadeProjeto } from '@/types/data';
import { Target, Search, TrendingUp, AlertCircle, Award, CheckCircle, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SprintNovembro {
  cliente: string;
  projeto: string;
  sprint: string;
  num_ciclos: number;
  duracao: number;
  retrabalho: number;
  score_qualidade: number;
  classificacao: string;
  status_simplificado: string;
}

export default function Projetos() {
  const [location] = useLocation();
  const { data: metricasDataRaw, loading: loadingMetricas } = useCSVData<MetricasQualidadeProjeto>('/metricas_qualidade_projeto.csv');
  const { data: sprintsDataRaw, loading: loadingSprints } = useCSVData<SprintNovembro>('/dados_novembro_filtrado.csv');
  
  // Filtrar dezembro
  const metricasData = useMemo(() => metricasDataRaw, [metricasDataRaw]);
  const sprintsData = useMemo(() => {
    return sprintsDataRaw.filter(item => {
      const inicio = item.inicio || '';
      const fim = item.fim || '';
      return !inicio.includes('12/2025') && !fim.includes('12/2025');
    });
  }, [sprintsDataRaw]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassificacao, setFilterClassificacao] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  
  const loading = loadingMetricas || loadingSprints;
  
  // Processar query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const clienteParam = params.get('cliente');
    if (clienteParam) {
      setSearchTerm(decodeURIComponent(clienteParam));
    }
  }, [location]);

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

  // Estatísticas
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Carregando projetos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <TooltipProvider>
      <DashboardLayout>
        {/* Cards de Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-slate-500/5 hover:border-slate-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase">Total de Projetos</CardTitle>
                  <Target className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stats.totalProjetos}</div>
                <p className="text-xs text-muted-foreground mt-1">Projetos analisados</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-primary/5 hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-primary uppercase">Score Médio</CardTitle>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{stats.scoreMedia}</div>
                <p className="text-xs text-primary/70 mt-1">Qualidade geral</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-yellow-500/5 hover:border-yellow-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-yellow-400 uppercase">Excelentes</CardTitle>
                  <Award className="w-4 h-4 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">{stats.excelentes}</div>
                <p className="text-xs text-yellow-400/70 mt-1">{((stats.excelentes / stats.totalProjetos) * 100).toFixed(0)}% do total</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-blue-500/5 hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-blue-400 uppercase">Bons</CardTitle>
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{stats.bons}</div>
                <p className="text-xs text-blue-400/70 mt-1">{((stats.bons / stats.totalProjetos) * 100).toFixed(0)}% do total</p>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-sm border-border/40 hover:bg-red-500/5 hover:border-red-500/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs font-medium text-red-400 uppercase">Cards Correção</CardTitle>
                  <Activity className="w-4 h-4 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{stats.retrabalhoMedio}%</div>
                <p className="text-xs text-red-400/70 mt-1">Taxa média</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filtros Rápidos */}
        <Card className="bg-card/40 backdrop-blur-sm border-border/40 mb-6">
          <CardHeader>
            <CardTitle className="text-base font-bold text-foreground">Filtros Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => { setSearchTerm(''); setFilterClassificacao(null); setIsListExpanded(true); }}
              className="p-3 bg-background/50 border border-border/40 rounded-lg hover:border-primary/30 hover:bg-background/70 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-foreground">Todos</span>
              <span className="text-lg font-bold text-foreground">{stats?.totalProjetos}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Excelente'); setIsListExpanded(true); }}
              className="p-3 bg-primary/5 border border-primary/30 rounded-lg hover:border-primary hover:bg-primary/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-primary">Excelentes</span>
              <span className="text-lg font-bold text-primary">{stats?.excelentes}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Bom'); setIsListExpanded(true); }}
              className="p-3 bg-blue-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-blue-400">Bons</span>
              <span className="text-lg font-bold text-blue-400">{stats?.bons}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Regular'); setIsListExpanded(true); }}
              className="p-3 bg-yellow-500/5 border border-yellow-500/30 rounded-lg hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-yellow-400">Regulares</span>
              <span className="text-lg font-bold text-yellow-400">{stats?.regulares}</span>
            </button>

            <button
              onClick={() => { setFilterClassificacao('Crítico'); setIsListExpanded(true); }}
              className="p-3 bg-red-500/5 border border-red-500/30 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-all duration-200 text-left flex items-center justify-between"
            >
              <span className="text-sm font-medium text-red-400">Críticos</span>
              <span className="text-lg font-bold text-red-400">{stats?.criticos}</span>
            </button>
          </CardContent>
        </Card>

        {/* Busca e Toggle da Listagem */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar projeto ou cliente..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value) setIsListExpanded(true); }}
                className="pl-10 h-10 bg-card/40 backdrop-blur-sm border-border/40 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-card/40 backdrop-blur-sm border border-border/40 rounded-lg hover:bg-card/60 hover:border-primary/30 transition-all duration-200"
            >
              {isListExpanded ? (
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
          {isListExpanded && (
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
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <tr className="border-b border-border/20 hover:bg-primary/5 transition-colors duration-200 cursor-pointer">
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
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            <p className="font-semibold">{projeto.Cliente} - {projeto.Projeto}</p>
                            <p className="text-xs">Taxa Corretivas: {projeto.TaxaCorretivas?.toFixed(1)}%</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
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
      </DashboardLayout>
    </TooltipProvider>
  );
}
