# 🚀 Guia de Implantação - Dashboard QA

## 📦 Conteúdo do Pacote

Este pacote contém o **Dashboard QA** completo e pronto para implantação permanente.

### Estrutura:
```
dashboard-qa/
├── dist/              # Build de produção (arquivos compilados)
│   ├── public/        # Arquivos estáticos otimizados
│   └── index.js       # Servidor Node.js
├── client/public/     # Dados CSV
├── package.json       # Dependências do projeto
└── GUIA_DEPLOY.md    # Este arquivo
```

---

## 🌐 Opções de Hospedagem

### Opção 1: Vercel (Recomendado - Grátis)

**Vantagens:**
- ✅ Hospedagem gratuita
- ✅ Deploy automático
- ✅ HTTPS incluído
- ✅ CDN global
- ✅ Muito fácil de configurar

**Passos:**

1. **Criar conta no Vercel**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Fazer upload do projeto**
   - Crie um repositório no GitHub com o projeto
   - No Vercel, clique em "New Project"
   - Importe o repositório do GitHub

3. **Configurar o projeto**
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`

4. **Deploy**
   - Clique em "Deploy"
   - Aguarde 2-3 minutos
   - Seu site estará online!

**URL final:** `https://seu-projeto.vercel.app`

---

### Opção 2: Netlify (Grátis)

**Vantagens:**
- ✅ Hospedagem gratuita
- ✅ Deploy por drag-and-drop
- ✅ HTTPS incluído
- ✅ Formulários e funções serverless

**Passos:**

1. **Criar conta no Netlify**
   - Acesse: https://netlify.com
   - Faça cadastro gratuito

2. **Deploy por Drag-and-Drop**
   - Arraste a pasta `dist/public` para o Netlify
   - Aguarde o upload
   - Site online em segundos!

**URL final:** `https://seu-projeto.netlify.app`

---

### Opção 3: GitHub Pages (Grátis)

**Vantagens:**
- ✅ Totalmente gratuito
- ✅ Integrado com GitHub
- ✅ Simples de configurar

**Passos:**

1. **Criar repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/dashboard-qa.git
   git push -u origin main
   ```

2. **Configurar GitHub Pages**
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: `main` / folder: `/dist/public`
   - Save

3. **Aguardar deploy**
   - GitHub fará o deploy automaticamente
   - Aguarde 2-5 minutos

**URL final:** `https://seu-usuario.github.io/dashboard-qa`

---

### Opção 4: Servidor Próprio (VPS/Cloud)

**Para quem tem servidor próprio (AWS, DigitalOcean, etc.)**

#### Requisitos:
- Node.js 18+ instalado
- PM2 (gerenciador de processos)
- Nginx (servidor web)

#### Passos:

1. **Upload do projeto**
   ```bash
   scp -r dashboard-qa usuario@seu-servidor:/var/www/
   ```

2. **Instalar dependências**
   ```bash
   cd /var/www/dashboard-qa
   npm install -g pnpm
   pnpm install --prod
   ```

3. **Configurar PM2**
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name dashboard-qa
   pm2 save
   pm2 startup
   ```

4. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
       location / {
           root /var/www/dashboard-qa/dist/public;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

5. **Reiniciar Nginx**
   ```bash
   sudo systemctl restart nginx
   ```

**URL final:** `http://seu-dominio.com`

---

## 🔧 Configurações Opcionais

### Domínio Personalizado

**Vercel/Netlify:**
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS conforme instruções

**GitHub Pages:**
1. Adicione arquivo `CNAME` na pasta `dist/public`
2. Conteúdo: `seu-dominio.com`
3. Configure DNS para apontar para GitHub

---

## 📊 Atualização de Dados

Para atualizar os dados do dashboard:

1. **Edite os arquivos CSV** em `client/public/`
2. **Faça novo build** (se necessário):
   ```bash
   pnpm build
   ```
3. **Faça novo deploy** conforme método escolhido

### Arquivos CSV principais:
- `dados_novembro_filtrado.csv` - Dados das sprints
- `analise_mensal.csv` - Análise mensal
- `metricas_qualidade_projeto.csv` - Métricas por projeto
- `metricas_qualidade_cliente.csv` - Métricas por cliente

---

## 🔒 Segurança

### Recomendações:

1. **HTTPS:** Sempre use HTTPS (incluído em Vercel/Netlify/GitHub Pages)
2. **Autenticação:** Se necessário, adicione autenticação básica
3. **Backup:** Faça backup regular dos arquivos CSV
4. **Versionamento:** Use Git para controlar versões

---

## 📈 Monitoramento

### Opções de Analytics:

1. **Google Analytics**
   - Adicione código no `index.html`
   
2. **Vercel Analytics**
   - Ative nas configurações do projeto

3. **Plausible/Umami**
   - Analytics focado em privacidade

---

## 🆘 Solução de Problemas

### Build falha:
```bash
# Limpar cache e reinstalar
rm -rf node_modules dist
pnpm install
pnpm build
```

### Página em branco:
- Verifique se os arquivos CSV estão em `dist/public/`
- Verifique console do navegador para erros

### Dados não aparecem:
- Confirme que os CSVs estão no formato correto
- Verifique encoding (UTF-8)

---

## 📞 Suporte

Para dúvidas sobre hospedagem:
- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com
- **GitHub Pages:** https://docs.github.com/pages

---

## ✅ Checklist de Deploy

- [ ] Build de produção gerado (`pnpm build`)
- [ ] Arquivos CSV copiados para `dist/public/`
- [ ] Plataforma de hospedagem escolhida
- [ ] Projeto enviado/uploaded
- [ ] Deploy realizado com sucesso
- [ ] Site acessível via URL
- [ ] Dados carregando corretamente
- [ ] Gráficos funcionando
- [ ] Responsividade testada
- [ ] HTTPS ativo

---

## 🎉 Pronto!

Seu Dashboard QA está agora **implantado permanentemente** e acessível 24/7!

**Próximos passos:**
1. Compartilhe a URL com sua equipe
2. Configure domínio personalizado (opcional)
3. Configure analytics (opcional)
4. Atualize dados conforme necessário

---

**Desenvolvido com ❤️ usando Vite + React + TypeScript**
