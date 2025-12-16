import { useEffect, useState } from "react";
import Papa from "papaparse";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Clock, Bug, Award, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RankingEficiencia {
  cliente: string;
  projeto: string;
  sprint: string;
  duracao: number;
  retrabalho: number;
  score_eficiencia: number;
}

export default function Rankings() {
  const [rankings, setRankings] = useState<RankingEficiencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Papa.parse("/ranking_eficiencia_melhores.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        setRankings(results.data as RankingEficiencia[]);
        setLoading(false);
      },
    });
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-2xl font-bold text-foreground animate-pulse">Carregando rankings...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderPodiumCard = (item: RankingEficiencia, position: number) => {
    const getHoverColor = (pos: number) => {
      switch(pos) {
        case 1: return 'hover:border-yellow-500/40';
        case 2: return 'hover:border-slate-400/40';
        case 3: return 'hover:border-orange-600/40';
        case 4: return 'hover:border-blue-500/40';
        case 5: return 'hover:border-purple-500/40';
        default: return 'hover:border-primary/30';
      }
    };
    
    return (
      <div className={`relative bg-card/40 backdrop-blur-sm border border-border/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${getHoverColor(position)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Badge de posição mais suave */}
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 border-2 border-primary/30 rounded-xl">
              <span className="text-2xl font-bold text-primary">{position}</span>
            </div>
            
            <div>
              {/* Cliente e Projeto */}
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-4 h-4 text-primary/60" />
                <span className="text-xl font-bold text-foreground">{item.cliente}</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium mb-3">{item.projeto}</div>
              
              {/* Badges de informação */}
              <div className="flex items-center gap-2 flex-wrap">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-primary/5 text-primary/80 rounded-md text-xs font-semibold border border-primary/20 cursor-help hover:bg-primary/10 transition-colors">
                      Sprint {item.sprint}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Versão da Sprint</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-blue-500/5 text-blue-600/80 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-blue-500/20 cursor-help hover:bg-blue-500/10 transition-colors">
                      <Clock className="w-3 h-3" />
                      {item.duracao}d
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Duração da Sprint</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="px-2.5 py-1 bg-red-500/5 text-red-600/80 rounded-md text-xs font-semibold flex items-center gap-1.5 border border-red-500/20 cursor-help hover:bg-red-500/10 transition-colors">
                      <Bug className="w-3 h-3" />
                      {item.retrabalho?.toFixed(1) || 0}%
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Taxa de Retrabalho</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dados para Ranking por Conformidade - Maker Express
  const conformidadeExcelentes = [
    { projeto: "SEMPRE - SIGSUAS", percentual: 82.35 },
    { projeto: "CODECON - Fiscalização", percentual: 82.35 },
    { projeto: "SEDUR - Fiscalização", percentual: 82.35 },
    { projeto: "SEDUR - Contratos", percentual: 82.35 },
    { projeto: "SEMOB - SYSMOBI", percentual: 82.35 },
    { projeto: "SEFAZ - Contratos", percentual: 82.35 },
    { projeto: "SEFAZ - Gestão Projetos", percentual: 82.35 },
  ];

  const conformidadeAtencao = [
    { projeto: "LIVE - SIGSUAS", percentual: 70.59 },
    { projeto: "SEDUR - Licenciamento", percentual: 70.59 },
    { projeto: "SEMOP - SGCI", percentual: 70.59 },
    { projeto: "TRANSALVADOR", percentual: 70.59 },
    { projeto: "SMED - Conselho Escolar", percentual: 58.82 },
  ];

  const conformidadeCriticos = [
    { projeto: "SMED - SIE Salvador", percentual: 41.18 },
    { projeto: "SEMED - SIE Corupipe", percentual: 41.18 },
    { projeto: "LIVE - Educação", percentual: 29.41 },
    { projeto: "SMED - Gestão Pessoas", percentual: 29.41 },
  ];

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Ranking Completo Original */}
          <div className="space-y-3">
            {rankings.slice(0, 5).map((item, idx) => (
              <div key={idx}>
                {renderPodiumCard(item, idx + 1)}
              </div>
            ))}
          </div>

          {/* Ranking por Conformidade - Maker Express */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground border-b border-border/50 pb-3">
              Ranking por Conformidade – Maker Express
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Excelentes */}
              <div className="bg-transparent border-2 border-green-500/30 rounded-xl p-6 space-y-3 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-500">Excelentes</h3>
                    <p className="text-xs text-green-500/70">(≥80%)</p>
                  </div>
                </div>
                {conformidadeExcelentes.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between py-2.5 px-3 rounded-lg border border-border/20 bg-card/30 hover:bg-green-500/10 hover:border-green-500/40 transition-all duration-200 cursor-pointer">
                    <span className="text-sm text-foreground group-hover:text-green-500 group-hover:font-semibold transition-all">{item.projeto}</span>
                    <span className="text-sm font-bold text-green-500 group-hover:scale-110 transition-transform">{item.percentual}%</span>
                  </div>
                ))}
              </div>

              {/* Coluna Atenção */}
              <div className="bg-transparent border-2 border-orange-500/30 rounded-xl p-6 space-y-3 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-orange-500">Atenção</h3>
                    <p className="text-xs text-orange-500/70">(50-79%)</p>
                  </div>
                </div>
                {conformidadeAtencao.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between py-2.5 px-3 rounded-lg border border-border/20 bg-card/30 hover:bg-orange-500/10 hover:border-orange-500/40 transition-all duration-200 cursor-pointer">
                    <span className="text-sm text-foreground group-hover:text-orange-500 group-hover:font-semibold transition-all">{item.projeto}</span>
                    <span className="text-sm font-bold text-orange-500 group-hover:scale-110 transition-transform">{item.percentual}%</span>
                  </div>
                ))}
              </div>

              {/* Coluna Críticos */}
              <div className="bg-transparent border-2 border-red-500/30 rounded-xl p-6 space-y-3 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-500">Críticos</h3>
                    <p className="text-xs text-red-500/70">(&lt;50%)</p>
                  </div>
                </div>
                {conformidadeCriticos.map((item, idx) => (
                  <div key={idx} className="group flex items-center justify-between py-2.5 px-3 rounded-lg border border-border/20 bg-card/30 hover:bg-red-500/10 hover:border-red-500/40 transition-all duration-200 cursor-pointer">
                    <span className="text-sm text-foreground group-hover:text-red-500 group-hover:font-semibold transition-all">{item.projeto}</span>
                    <span className="text-sm font-bold text-red-500 group-hover:scale-110 transition-transform">{item.percentual}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
