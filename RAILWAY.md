# Railway Configuration Guide

## 🚀 Deploy no Railway

### 1. Preparação do Projeto

O projeto já está configurado para deploy no Railway com as seguintes adaptações:

- ✅ **Porta dinâmica**: Usa `process.env.PORT` do Railway
- ✅ **Host configurável**: Usa `0.0.0.0` para aceitar conexões externas
- ✅ **Procfile**: Configurado para `npm start`
- ✅ **Build script**: Compila TypeScript para JavaScript
- ✅ **Gitignore**: Configurado adequadamente

### 2. Variáveis de Ambiente no Railway

Configure as seguintes variáveis no painel do Railway:

#### **Obrigatórias:**
```
NODE_ENV=production
```

#### **Opcionais (para melhor performance):**
```
PUBLIC_IP=seu-ip-publico-aqui
HOST=0.0.0.0
```

### 3. Limitações do Railway para WebRTC

⚠️ **IMPORTANTE**: Railway tem algumas limitações para WebRTC:

1. **Portas UDP**: Railway não expõe portas UDP específicas
2. **IP Público**: Pode não funcionar perfeitamente para WebRTC
3. **NAT Traversal**: Pode precisar de configurações adicionais

### 4. Alternativas Recomendadas

Para produção com WebRTC, considere:

- **Heroku** (com add-ons para WebRTC)
- **DigitalOcean** (VPS com IP público)
- **AWS EC2** (com configuração de rede)
- **Google Cloud** (com configuração de firewall)

### 5. Configuração de Rede

Se usar Railway, você pode precisar:

1. **Configurar STUN/TURN servers** externos
2. **Usar serviços como Xirsys** para NAT traversal
3. **Configurar proxy reverso** com nginx

### 6. Deploy Steps

1. **Conecte seu repositório GitHub ao Railway**
2. **Configure as variáveis de ambiente**
3. **Deploy automático** será feito
4. **Teste a aplicação** na URL fornecida

### 7. Teste Local de Produção

Para testar como será em produção:

```bash
# Build do projeto
npm run build

# Teste com variáveis de produção
NODE_ENV=production npm start
```

### 8. Monitoramento

O Railway fornece:
- **Logs em tempo real**
- **Métricas de performance**
- **Status de saúde**

### 9. Troubleshooting

**Problemas comuns:**

1. **WebRTC não conecta**: Configure STUN/TURN servers
2. **Porta não encontrada**: Verifique se `PORT` está configurado
3. **Build falha**: Verifique se todas as dependências estão no `package.json`

### 10. Próximos Passos

Para melhorar a compatibilidade com WebRTC:

1. **Implementar STUN/TURN servers**
2. **Adicionar fallback para TCP**
3. **Configurar proxy reverso**
4. **Implementar health checks**

## 📝 Notas Importantes

- Railway é ótimo para APIs REST, mas tem limitações para WebRTC
- Para produção com WebRTC, considere VPS com IP público
- O código está preparado para ambos os cenários
- Teste sempre em ambiente similar à produção
