import { useMemo } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import MetricCard from '@/components/MetricCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCSVData } from '@/hooks/useCSVData';
import { CicloData, QAData, ClienteStats, TimelineProjeto, MetricasQualidadeCliente } from '@/types/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import { FolderKanban, CheckCircle2, TrendingUp, AlertCircle, RefreshCw, Award } from 'lucide-react';

const COLORS = ['#3b82f6', 'oklch(0.65 0.25 220)', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function Home() {
  const { data: ciclosData, loading: ciclosLoading } = useCSVData<CicloData>('/dados_ciclos.csv');
  const { data: qaData, loading: qaLoading } = useCSVData<QAData>('/dados_qa.csv');
  const { data: clienteStats, loading: clienteLoading } = useCSVData<ClienteStats>('/stats_cliente.csv');
  const { data: timelineData, loading: timelineLoading } = useCSVData<TimelineProjeto>('/timeline_projetos.csv');
  const { data: metricasCliente, loading: metricasClienteLoading } = useCSVData<MetricasQualidadeCliente>('/metricas_qualidade_cliente.csv');

  const isLoading = ciclosLoading || qaLoading || clienteLoading || timelineLoading || metricasClienteLoading;

  // Calcular métricas gerais
  const metrics = useMemo(() => {
    if (!ciclosData.length || !qaData.length) return null;

    const totalProjetos = qaData.length;
    const projetosAtivos = qaData.filter(p => p.STATUS === 'Ativo').length;
    const totalCiclos = ciclosData.length;
    const mediaRetrabalho = ciclosData.reduce((acc, c) => acc + (c['%RETRABALHO'] || 0), 0) / ciclosData.length;
    const totalCorretivas = ciclosData.reduce((acc, c) => acc + (c.CORRETIVAS || 0), 0);
    
    // Score médio de qualidade
    const scoreQualidadeMedio = metricasCliente.length > 0 
      ? metricasCliente.reduce((acc, c) => acc + c.ScoreQualidade, 0) / metricasCliente.length 
      : 0;

    return {
      totalProjetos,
      projetosAtivos,
      totalCiclos,
      mediaRetrabalho: (mediaRetrabalho * 100).toFixed(1),
      totalCorretivas,
      scoreQualidade: scoreQualidadeMedio.toFixed(1)
    };
  }, [ciclosData, qaData, metricasCliente]);

  // Preparar dados para gráfico de clientes
  const clienteChartData = useMemo(() => {
    return clienteStats
      .sort((a, b) => b.Total_Ciclos - a.Total_Ciclos)
      .slice(0, 10)
      .map(c => ({
        nome: c.CLIENTE,
        ciclos: c.Total_Ciclos,
        retrabalho: (c.Media_Retrabalho * 100).toFixed(1)
      }));
  }, [clienteStats]);

  // Preparar dados para timeline (scatter plot)
  const timelineChartData = useMemo(() => {
    return timelineData
      .filter(t => t.DuracaoDias > 0)
      .map(t => {
        const dataInicio = new Date(t.DataInicio);
        const mes = dataInicio.getMonth() + 1;
        return {
          projeto: t.Projeto,
          mes: mes,
          duracao: t.DuracaoDias,
          ciclos: t.NumCiclos,
          cliente: t.Cliente
        };
      });
  }, [timelineData]);

  // Preparar dados de qualidade por cliente
  const qualidadeClienteData = useMemo(() => {
    return metricasCliente
      .sort((a, b) => a.ScoreQualidade - b.ScoreQualidade)
      .slice(0, 10)
      .map(c => ({
        cliente: c.Cliente,
        score: c.ScoreQualidade,
        retrabalho: c.MediaRetrabalho,
        taxaCorretivas: c.TaxaCorretivas
      }));
  }, [metricasCliente]);

  // Preparar dados de retrabalho por cliente
  const retrabalhoData = useMemo(() => {
    return clienteStats
      .sort((a, b) => b.Media_Retrabalho - a.Media_Retrabalho)
      .slice(0, 8)
      .map(c => ({
        cliente: c.CLIENTE,
        retrabalho: (c.Media_Retrabalho * 100).toFixed(1)
      }));
  }, [clienteStats]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Carregando dados...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-slate-600">Erro ao carregar dados</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <MetricCard
          title="Total de Projetos"
          value={metrics.totalProjetos}
          icon={FolderKanban}
          description="Projetos cadastrados"
          iconColor="bg-blue-500"
        />
        <MetricCard
          title="Projetos Ativos"
          value={metrics.projetosAtivos}
          icon={CheckCircle2}
          description="Em desenvolvimento"
          iconColor="bg-primary"
        />
        <MetricCard
          title="Total de Ciclos"
          value={metrics.totalCiclos}
          icon={RefreshCw}
          description="Ciclos de teste realizados"
          iconColor="bg-purple-500"
        />
        <MetricCard
          title="Média de Retrabalho"
          value={`${metrics.mediaRetrabalho}%`}
          icon={TrendingUp}
          description="Taxa média de retrabalho"
          iconColor="bg-orange-500"
        />
        <MetricCard
          title="Total de Corretivas"
          value={metrics.totalCorretivas}
          icon={AlertCircle}
          description="QAs corretivas realizadas"
          iconColor="bg-red-500"
        />
        <MetricCard
          title="Score de Qualidade"
          value={metrics.scoreQualidade}
          icon={Award}
          description="Média geral (menor é melhor)"
          iconColor="bg-indigo-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ciclos por Cliente */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Ciclos por Cliente (Top 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clienteChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="ciclos" fill="#3b82f6" name="Ciclos" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score de Qualidade por Cliente */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Score de Qualidade por Cliente (Top 10 Melhores)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={qualidadeClienteData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" />
                <YAxis dataKey="cliente" type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value, name) => {
                    if (name === 'Score') return [value, 'Score de Qualidade'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="score" fill="oklch(0.65 0.25 220)" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Linha do Tempo dos Projetos */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Linha do Tempo dos Projetos 2025</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Duração e distribuição temporal dos projetos ao longo do ano</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  dataKey="mes" 
                  name="Mês" 
                  domain={[1, 10]}
                  ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                  tickFormatter={(value) => {
                    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
                    return meses[value - 1] || '';
                  }}
                />
                <YAxis 
                  type="number" 
                  dataKey="duracao" 
                  name="Duração (dias)" 
                  label={{ value: 'Duração (dias)', angle: -90, position: 'insideLeft' }}
                />
                <ZAxis type="number" dataKey="ciclos" range={[50, 400]} name="Ciclos" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value, name) => {
                    if (name === 'Mês') {
                      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'];
                      return [meses[Number(value) - 1], name];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Projeto: ${timelineChartData.find(d => d.mes === label)?.projeto || ''}`}
                />
                <Legend />
                <Scatter name="Projetos" data={timelineChartData} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Taxa de Retrabalho */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Taxa de Retrabalho por Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={retrabalhoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cliente" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => `${value}%`}
                />
                <Bar dataKey="retrabalho" fill="#f59e0b" name="Retrabalho %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Estatísticas por Cliente */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Estatísticas Detalhadas por Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Cliente</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Ciclos</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Retrabalho Médio</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700"></th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Corretivas</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700">Total Geral</th>
                </tr>
              </thead>
              <tbody>
                {clienteStats
                  .sort((a, b) => b.Total_Ciclos - a.Total_Ciclos)
                  .map((cliente, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium text-slate-800">{cliente.CLIENTE}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{cliente.Total_Ciclos}</td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          cliente.Media_Retrabalho > 0.3 ? 'bg-red-100 text-red-700' :
                          cliente.Media_Retrabalho > 0.2 ? 'bg-orange-100 text-orange-700' :
                          'bg-primary/10 text-primary'
                        }`}>
                          {(cliente.Media_Retrabalho * 100).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-600">{cliente.Total_QA.toFixed(0)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{cliente.Total_Corretivas.toFixed(0)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-800">{cliente.Total_Geral.toFixed(0)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

