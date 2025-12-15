export interface CicloData {
  CLIENTE: string;
  PROJETO: string;
  SPRINT: string;
  INÍCIO: string;
  '1º CICLO': string;
  '2º CICLO': string;
  '3º CICLO': string;
  '4º CICLO': string;
  '5º CICLO': string;
  '6º CICLO': string;
  '7º CICLO': string;
  '8º CICLO': string;
  '9º CICLO': string;
  '10º CICLO': string;
  STATUS: string;
  PRAZO: string;
  QA: number;
  CORRETIVAS: number;
  TOTAL: number;
  '%RETRABALHO': number;
}

export interface QAData {
  CLIENTE: string;
  PROJETO: string;
  'QA PRINCIPAL': string;
  'QA SECUNDÁRIO': string;
  STATUS: string;
}

export interface ClienteStats {
  CLIENTE: string;
  Total_Ciclos: number;
  Media_Retrabalho: number;
  Total_QA: number;
  Total_Corretivas: number;
  Total_Geral: number;
}

export interface ProjetoStats {
  PROJETO: string;
  Num_Ciclos: number;
  Media_Retrabalho: number;
  Total_QA: number;
  Total_Corretivas: number;
}

export interface AnaliseMensal {
  Mes: number;
  MesNome: string;
  Ciclos: number;
  MediaRetrabalho: number;
  Corretivas: number;
  Total: number;
}

export interface ProgressaoAcumulada {
  Mes: number;
  MesNome: string;
  Ciclos: number;
  MediaRetrabalho: number;
  Corretivas: number;
  Total: number;
  CiclosAcumulados: number;
  CorretivasAcumuladas: number;
}

export interface AnaliseMensalCliente {
  Mes: number;
  MesNome: string;
  Cliente: string;
  Ciclos: number;
  MediaRetrabalho: number;
  Corretivas: number;
}

export interface ProjetoTempo {
  Projeto: string;
  Mes: number;
  MesNome: string;
  Ciclos: number;
  MediaRetrabalho: number;
  Corretivas: number;
}

export interface MetricasQualidadeProjeto {
  Projeto: string;
  NumCiclos: number;
  MediaRetrabalho: number;
  TotalCorretivas: number;
  TotalQA: number;
  DataInicio: string;
  DataFim: string;
  TaxaCorretivas: number;
  PenalidadeVolume: number;
  ScoreQualidade: number;
  Classificacao: string;
  DuracaoDias: number;
  Cliente: string;
}

export interface RankingProjeto {
  Projeto: string;
  NumCiclos: number;
  MediaRetrabalho: number;
  TaxaCorretivas: number;
  ScoreQualidade: number;
  Classificacao: string;
}

export interface TimelineProjeto {
  Projeto: string;
  DataInicio: string;
  DataFim: string;
  NumCiclos: number;
  Cliente: string;
  DuracaoDias: number;
}

export interface MetricasQualidadeCliente {
  Cliente: string;
  NumProjetos: number;
  NumCiclos: number;
  MediaRetrabalho: number;
  TotalCorretivas: number;
  TotalQA: number;
  TaxaCorretivas: number;
  ScoreQualidade: number;
}

