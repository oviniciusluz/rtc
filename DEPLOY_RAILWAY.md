# 🚀 Deploy no Railway - Chat com Vídeo

## 📋 Passo a Passo Completo

### 1. **Preparar o Código**

Certifique-se de que todos os arquivos estão no repositório:
- ✅ `package.json`
- ✅ `server.js`
- ✅ `public/index.html`
- ✅ `railway.json` (configuração do Railway)

### 2. **Criar Conta no Railway**

1. Acesse [railway.app](https://railway.app)
2. Clique em "Login" → "Login with GitHub"
3. Autorize o Railway a acessar seus repositórios

### 3. **Deploy do Projeto**

1. **Novo Projeto:**
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório com o código do chat

2. **Configuração Automática:**
   - Railway detectará automaticamente que é um projeto Node.js
   - Usará o comando `npm start` do `package.json`
   - Gerará uma URL HTTPS automaticamente

3. **Aguardar Deploy:**
   - O processo leva 2-3 minutos
   - Você verá os logs em tempo real
   - Quando terminar, aparecerá a URL do projeto

### 4. **Configurações Opcionais**

#### **Variáveis de Ambiente:**
- `PORT`: Railway define automaticamente
- `NODE_ENV`: Pode definir como `production`

#### **Domínio Personalizado:**
- No painel do Railway, vá em "Settings" → "Domains"
- Adicione seu domínio personalizado se desejar

### 5. **Testar o Deploy**

1. **Acesse a URL fornecida pelo Railway**
2. **Teste as funcionalidades:**
   - ✅ Login no chat
   - ✅ Envio de mensagens
   - ✅ Chamadas de vídeo
   - ✅ Múltiplos usuários

### 6. **Compartilhar com Amigos**

- **URL do Railway:** `https://seu-projeto.railway.app`
- **Funciona de qualquer lugar** com internet
- **HTTPS automático** para permissões de mídia
- **Sem configuração de rede** necessária

## 🔧 Vantagens do Railway

### **vs. Desenvolvimento Local:**
- ✅ **HTTPS nativo** - Permissões de mídia funcionam melhor
- ✅ **Acesso global** - Não limitado à rede local
- ✅ **URL permanente** - Não muda como IP local
- ✅ **Sem firewall** - Não precisa configurar portas

### **vs. Outras Plataformas:**
- ✅ **Deploy automático** - Detecta Node.js automaticamente
- ✅ **HTTPS gratuito** - Certificado SSL incluído
- ✅ **Escalabilidade** - Suporta múltiplos usuários
- ✅ **Logs em tempo real** - Fácil debug

## 📊 Monitoramento

### **Logs do Railway:**
- Acesse o painel do Railway
- Vá em "Deployments" → "View Logs"
- Monitore erros e performance

### **Métricas:**
- CPU e memória em tempo real
- Número de requisições
- Tempo de resposta

## 🔄 Atualizações

### **Deploy Automático:**
- Push para o repositório GitHub
- Railway detecta mudanças automaticamente
- Deploy automático em 1-2 minutos

### **Deploy Manual:**
- No painel do Railway, clique em "Redeploy"
- Útil para rollback ou forçar atualização

## 💰 Custos

### **Plano Gratuito:**
- ✅ 500 horas de execução/mês
- ✅ 1GB de RAM
- ✅ 1GB de armazenamento
- ✅ Domínio `.railway.app`

### **Para Produção:**
- Plano Pro: $5/mês
- Mais recursos e domínio personalizado
- Suporte prioritário

## 🆘 Solução de Problemas

### **Deploy Falha:**
1. Verifique os logs no Railway
2. Confirme que `package.json` está correto
3. Verifique se todas as dependências estão listadas

### **App Não Inicia:**
1. Verifique se `server.js` é o arquivo principal
2. Confirme que a porta está configurada corretamente
3. Verifique os logs de erro

### **Chamadas de Vídeo Não Funcionam:**
1. Confirme que está usando HTTPS (Railway fornece automaticamente)
2. Teste em navegador moderno (Chrome/Firefox)
3. Verifique se câmera/microfone estão funcionando

## 🎯 Próximos Passos

Após o deploy bem-sucedido:
1. **Compartilhe a URL** com seus amigos
2. **Teste com múltiplos usuários** simultâneos
3. **Configure domínio personalizado** se desejar
4. **Monitore performance** nos logs do Railway

---

**🎉 Parabéns!** Seu chat com vídeo está online e acessível globalmente!
