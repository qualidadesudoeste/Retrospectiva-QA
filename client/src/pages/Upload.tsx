import { useState } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Verificar se é arquivo de texto/TSV
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.tsv')) {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Por favor, selecione um arquivo de texto (.txt ou .tsv)' });
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      // Ler arquivo
      const text = await file.text();
      
      // Processar dados
      const lines = text.split('\n');
      const data: any[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split('\t');
        if (parts.length >= 19) {
          data.push({
            cliente: parts[0],
            projeto: parts[1],
            sprint: parts[2],
            inicio: parts[3],
            fim: parts[4],
            duracao: parseInt(parts[5]) || 0,
            ciclos: [parts[6], parts[7], parts[8], parts[9], parts[10], parts[11], parts[12], parts[13], parts[14], parts[15]].filter(c => c && c.trim() !== '').length,
            corretivas: parseInt(parts[17]) || 0,
            total: parseInt(parts[18]) || 0,
            retrabalho: parseFloat(parts[19]?.replace('%', '').replace(',', '.')) || 0
          });
        }
      }

      // Filtrar SEMED
      const dadosFiltrados = data.filter(d => d.cliente !== 'SEMED');

      // Agrupar por projeto
      const projetoMap = new Map<string, any>();
      
      dadosFiltrados.forEach(item => {
        const key = `${item.cliente} - ${item.projeto}`;
        if (!projetoMap.has(key)) {
          projetoMap.set(key, {
            Projeto: key,
            NumCiclos: 0,
            MediaRetrabalho: 0,
            TotalCorretivas: 0,
            TotalGeral: 0,
            DuracaoDias: 0,
            retrabalhos: []
          });
        }
        
        const proj = projetoMap.get(key)!;
        proj.NumCiclos += item.ciclos;
        proj.TotalCorretivas += item.corretivas;
        proj.TotalGeral += item.total;
        proj.DuracaoDias += item.duracao;
        if (item.retrabalho > 0) {
          proj.retrabalhos.push(item.retrabalho);
        }
      });

      // Calcular médias e métricas
      const projetos = Array.from(projetoMap.values()).map(p => {
        p.MediaRetrabalho = p.retrabalhos.length > 0 
          ? p.retrabalhos.reduce((a: number, b: number) => a + b, 0) / p.retrabalhos.length 
          : 0;
        p.TaxaCorretivas = p.TotalGeral > 0 ? (p.TotalCorretivas / p.TotalGeral * 100) : 0;
        delete p.retrabalhos;
        return p;
      });

      // Calcular score
      const maxCiclos = Math.max(...projetos.map(p => p.NumCiclos));
      projetos.forEach(p => {
        p.ScoreQualidade = (
          p.MediaRetrabalho * 0.5 +
          p.TaxaCorretivas * 0.3 +
          (p.NumCiclos / maxCiclos * 100 * 0.2)
        );
        
        if (p.ScoreQualidade < 20) p.Classificacao = 'Excelente';
        else if (p.ScoreQualidade < 35) p.Classificacao = 'Bom';
        else if (p.ScoreQualidade < 50) p.Classificacao = 'Regular';
        else p.Classificacao = 'Crítico';
      });

      // Converter para CSV
      const csvHeader = 'Projeto,NumCiclos,MediaRetrabalho,TotalCorretivas,TotalGeral,DuracaoDias,TaxaCorretivas,ScoreQualidade,Classificacao\n';
      const csvRows = projetos.map(p => 
        `${p.Projeto},${p.NumCiclos},${p.MediaRetrabalho},${p.TotalCorretivas},${p.TotalGeral},${p.DuracaoDias},${p.TaxaCorretivas},${p.ScoreQualidade},${p.Classificacao}`
      ).join('\n');
      const csvContent = csvHeader + csvRows;

      // Criar blob e fazer download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metricas_qualidade_projeto.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ 
        type: 'success', 
        text: `Arquivo processado com sucesso! ${projetos.length} projetos analisados. Baixe o CSV gerado e substitua o arquivo em /client/public/metricas_qualidade_projeto.csv` 
      });
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setMessage({ type: 'error', text: 'Erro ao processar arquivo. Verifique o formato dos dados.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Upload de Dados</h2>
          <p className="text-slate-600">Atualize os dados do dashboard enviando um novo arquivo</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              Instruções
            </h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-slate-700">
              <ul className="list-disc list-inside space-y-2">
                <li>O arquivo deve estar no formato <strong>TXT ou TSV</strong> (separado por tabulações)</li>
                <li>Deve conter as colunas: CLIENTE, PROJETO, SPRINT, INÍCIO, FIM, DURAÇÃO, ciclos (1º ao 10º), QA, CORRETIVAS, TOTAL, %RETRABALHO</li>
                <li>Projetos do cliente <strong>SEMED</strong> serão automaticamente removidos</li>
                <li>Após o processamento, um arquivo CSV será gerado para download</li>
                <li>Substitua o arquivo <code className="bg-white px-2 py-1 rounded">/client/public/metricas_qualidade_projeto.csv</code> pelo arquivo gerado</li>
              </ul>
            </div>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".txt,.tsv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="p-4 bg-blue-50 rounded-full">
                <UploadIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-800 mb-1">
                  {file ? file.name : 'Clique para selecionar um arquivo'}
                </p>
                <p className="text-sm text-slate-500">
                  ou arraste e solte aqui
                </p>
              </div>
            </label>
          </div>

          {file && (
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="px-8"
              >
                {uploading ? 'Processando...' : 'Processar Arquivo'}
              </Button>
            </div>
          )}

          {message && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              message.type === 'success' 
                ? 'bg-primary/5 border border-primary/20' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className={`text-sm ${
                message.type === 'success' ? 'text-primary' : 'text-red-800'
              }`}>
                {message.text}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Nota Importante
          </h4>
          <p className="text-sm text-amber-800">
            Esta funcionalidade processa os dados localmente no navegador e gera um arquivo CSV.
            Para que as alterações sejam refletidas no dashboard, você precisa substituir manualmente
            o arquivo CSV na pasta <code className="bg-white px-2 py-1 rounded">/client/public/</code> do projeto.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

