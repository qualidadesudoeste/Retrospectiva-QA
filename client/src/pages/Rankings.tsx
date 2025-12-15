import { useEffect, useState } from "react";
import Papa from "papaparse";
import DashboardLayout from "@/components/DashboardLayout";
import { Trophy, Clock, Bug, Award } from "lucide-react";
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
        case 1: return 'hover:bg-yellow-500/10 hover:border-yellow-500/40';
        case 2: return 'hover:bg-slate-400/10 hover:border-slate-400/40';
        case 3: return 'hover:bg-orange-600/10 hover:border-orange-600/40';
        case 4: return 'hover:bg-blue-500/10 hover:border-blue-500/40';
        case 5: return 'hover:bg-purple-500/10 hover:border-purple-500/40';
        default: return 'hover:bg-primary/5 hover:border-primary/30';
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

  return (
    <TooltipProvider>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Ranking Completo */}
          <div className="space-y-3">
            {rankings.slice(0, 5).map((item, idx) => (
              <div key={idx}>
                {renderPodiumCard(item, idx + 1)}
              </div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </TooltipProvider>
  );
}
