import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { MetricasQualidadeProjeto } from '@/types/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FolderKanban, Calendar, TrendingUp, AlertCircle, RefreshCw, Award, Clock, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const { data: metricasData, loading: loadingMetricas } = useCSVData<MetricasQualidadeProjeto>('/metricas_qualidade_projeto.csv');
  const { data: sprintsData, loading: loadingSprints } = useCSVData<SprintNovembro>('/dados_novembro_filtrado.csv');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassificacao, setFilterClassificacao] = useState<string | null>(null);
  
  const loading = loadingMetricas || loadingSprints;
  
  // Processar query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const clienteParam = params.get('cliente');
    if (clienteParam) {
      setSearchTerm(decodeURIComponent(clienteParam));
    }
  }, [location]);

  // Filtrar projetos por busca e classificação
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
    
    return filtered;
  }, [metricasData, searchTerm, filterClassificacao]);

  // Ordenar por score de qualidade
  const projetosOrdenados = useMemo(() => {
    return [...projetosFiltrados].sort((a, b) => a.ScoreQualidade - b.ScoreQualidade);
  }, [projetosFiltrados]);

  const getClassificacaoColor = (classificacao: string) => {
    switch (classificacao) {
      case 'Excelente':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'Bom':
        return 'bg-secondary/10 text-secondary border-secondary/30';
      case 'Regular':
        return 'bg-accent/10 text-accent border-accent/30';
      case 'Crítico':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted/10 text-foreground border-border';
    }
  };

  const getClassificacaoIcon = (classificacao: string) => {
    switch (classificacao) {
      case 'Excelente':
        return <Award className="w-5 h-5 text-primary" />;
      case 'Bom':
        return <CheckCircle className="w-5 h-5 text-secondary" />;
      case 'Regular':
        return <AlertCircle className="w-5 h-5 text-accent" />;
      case 'Crítico':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <FolderKanban className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Estatísticas gerais
  const stats = useMemo(() => {
    if (metricasData.length === 0) return null;
    
    const totalProjetos = metricasData.length;
    const excelentes = metricasData.filter(p => p.Classificacao === 'Excelente').length;
    const bons = metricasData.filter(p => p.Classificacao === 'Bom').length;
    const regulares = metricasData.filter(p => p.Classificacao === 'Regular').length;
    const criticos = metricasData.filter(p => p.Classificacao === 'Crítico').length;
    
    return { totalProjetos, excelentes, bons, regulares, criticos };
  }, [metricasData]);

  // Dados para gráfico de distribuição
  const distribuicaoData = useMemo(() => {
    if (!stats) return [];
    return [
      { classificacao: 'Excelente', quantidade: stats.excelentes, cor: 'oklch(0.65 0.25 220)' },
      { classificacao: 'Bom', quantidade: stats.bons, cor: '#3b82f6' },
      { classificacao: 'Regular', quantidade: stats.regulares, cor: '#f59e0b' },
      { classificacao: 'Crítico', quantidade: stats.criticos, cor: '#ef4444' }
    ];
  }, [stats]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando métricas dos projetos...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Métricas Detalhadas por Projeto</h2>
        <p className="text-muted-foreground">Análise completa de qualidade, performance e timeline de cada projeto</p>
      </div>

      {/* Estatísticas Gerais */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card 
            className="border-border shadow-sm cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => { setSearchTerm(''); setFilterClassificacao(null); }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats.totalProjetos}</div>
            </CardContent>
          </Card>

          <Card 
            className="border-border shadow-sm bg-card neon-border-ocean cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setFilterClassificacao('Excelente')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary">Excelentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.excelentes}</div>
              <p className="text-xs text-primary mt-1">{((stats.excelentes / stats.totalProjetos) * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>

          <Card 
            className="border-border shadow-sm bg-card cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setFilterClassificacao('Bom')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-secondary">Bons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.bons}</div>
              <p className="text-xs text-secondary mt-1">{((stats.bons / stats.totalProjetos) * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>

          <Card 
            className="border-border shadow-sm bg-card neon-border-gold cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setFilterClassificacao('Regular')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-accent">Regulares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{stats.regulares}</div>
              <p className="text-xs text-accent mt-1">{((stats.regulares / stats.totalProjetos) * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>

          <Card 
            className="border-border shadow-sm bg-card neon-border-red cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => setFilterClassificacao('Crítico')}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-destructive">Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{stats.criticos}</div>
              <p className="text-xs text-destructive mt-1">{((stats.criticos / stats.totalProjetos) * 100).toFixed(0)}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico de Distribuição */}
      <div className="grid grid-cols-1 mb-8">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Distribuição por Classificação</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distribuicaoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="classificacao" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.85)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    borderRadius: '12px',
                    color: '#fff',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                  }}
                />
                <Legend />
                <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade de Projetos">
                  {distribuicaoData.map((entry, index) => (
                    <Bar key={index} dataKey="quantidade" fill={entry.cor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Busca e Filtro Ativo */}
      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Buscar projeto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {filterClassificacao && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
            <span className="font-medium">Classificação: {filterClassificacao}</span>
            <button 
              onClick={() => setFilterClassificacao(null)}
              className="ml-2 text-secondary hover:text-blue-800 font-bold"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Cards de Projetos */}
      <div className="grid grid-cols-1 gap-6">
        {projetosOrdenados.map((projeto, index) => (
          <Card key={index} className={`border-2 shadow-sm ${getClassificacaoColor(projeto.Classificacao)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getClassificacaoIcon(projeto.Classificacao)}
                  <div>
                    <CardTitle className="text-xl font-bold text-foreground">{projeto.Projeto}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getClassificacaoColor(projeto.Classificacao)}`}>
                        {projeto.Classificacao}
                      </span>
                      <span className="text-sm text-slate-500">Score: {projeto.ScoreQualidade}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Métricas de Qualidade */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Métricas de Qualidade</h4>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Média Retrabalho</p>
                      <p className={`text-lg font-bold ${
                        projeto.MediaRetrabalho > 30 ? 'text-destructive' :
                        projeto.MediaRetrabalho > 20 ? 'text-accent' :
                        'text-primary'
                      }`}>
                        {projeto.MediaRetrabalho ? projeto.MediaRetrabalho.toFixed(1) : '0.0'}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Taxa Corretivas</p>
                      <p className="text-lg font-bold text-foreground">{projeto.TaxaCorretivas ? projeto.TaxaCorretivas.toFixed(1) : '0.0'}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Score Qualidade</p>
                      <p className="text-lg font-bold text-secondary">{projeto.ScoreQualidade ? projeto.ScoreQualidade.toFixed(1) : '0.0'}</p>
                    </div>
                  </div>
                </div>

                {/* Métricas de Volume */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Volume de Trabalho</h4>
                  
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Número de Ciclos</p>
                      <p className="text-lg font-bold text-foreground">{projeto.NumCiclos || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Total QAs</p>
                      <p className="text-lg font-bold text-foreground">{projeto.TotalQA ? projeto.TotalQA.toFixed(0) : '0'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Total Corretivas</p>
                      <p className="text-lg font-bold text-destructive">{projeto.TotalCorretivas ? projeto.TotalCorretivas.toFixed(0) : '0'}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Timeline</h4>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Data Início</p>
                      <p className="text-sm font-semibold text-foreground">{formatDate(projeto.DataInicio)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Data Fim</p>
                      <p className="text-sm font-semibold text-foreground">{formatDate(projeto.DataFim)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Duração</p>
                      <p className="text-lg font-bold text-purple-600">{projeto.DuracaoDias || 0} dias</p>
                    </div>
                  </div>
                </div>

                {/* Indicadores */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Indicadores</h4>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Eficiência (ciclos/dia)</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-card0 h-2 rounded-full" 
                          style={{ width: `${projeto.DuracaoDias > 0 ? Math.min((projeto.NumCiclos / projeto.DuracaoDias) * 100, 100) : 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{projeto.DuracaoDias > 0 ? (projeto.NumCiclos / projeto.DuracaoDias).toFixed(2) : '0.00'} ciclos/dia</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Qualidade (inverso do retrabalho)</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            projeto.MediaRetrabalho > 30 ? 'bg-card neon-border-red0' :
                            projeto.MediaRetrabalho > 20 ? 'bg-card neon-border-gold0' :
                            'bg-card neon-border-ocean0'
                          }`}
                          style={{ width: `${projeto.MediaRetrabalho ? Math.max(100 - projeto.MediaRetrabalho, 0) : 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{projeto.MediaRetrabalho ? (100 - projeto.MediaRetrabalho).toFixed(1) : '100.0'}% qualidade</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500 mb-1">Taxa de Sucesso</p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${projeto.TaxaCorretivas ? (100 - projeto.TaxaCorretivas) : 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{projeto.TaxaCorretivas ? (100 - projeto.TaxaCorretivas).toFixed(1) : '100.0'}% sucesso</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projetosOrdenados.length === 0 && (
        <Card className="border-border shadow-sm">
          <CardContent className="py-12 text-center">
            <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Nenhum projeto encontrado</p>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}

