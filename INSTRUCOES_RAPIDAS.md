# 🚀 Instruções Rápidas - Chat com Vídeo

## 📱 Para seu amigo acessar:

### 1. **Iniciar o servidor:**
```bash
npm run start:network
```

### 2. **Compartilhar com seu amigo:**
- **URL:** http://192.168.118.3:3000
- **Requisito:** Mesma rede Wi-Fi

### 3. **Usar o chat:**
- Entre com um nome de usuário
- Clique em "📹 Chamada" ao lado de outro usuário
- Permita acesso à câmera/microfone

## 🛑 Para parar o servidor:
```bash
npm run stop
```

## 🔧 Comandos Úteis:

| Comando | Descrição |
|---------|-----------|
| `npm run start:network` | Inicia servidor para rede local |
| `npm run stop` | Para o servidor |
| `npm run start` | Inicia servidor local apenas |
| `npm run dev` | Inicia com auto-reload |

## 🌐 URLs de Acesso:
- **Local:** http://localhost:3000
- **Rede:** http://192.168.118.3:3000

## ❓ Problemas Comuns:

### "Porta já em uso"
```bash
npm run stop
npm run start:network
```

### "Não consegue acessar"
1. Verifique se ambos estão na mesma Wi-Fi
2. Confirme o IP com `ipconfig`
3. Configure firewall se necessário

### "Chamadas de vídeo não funcionam"
1. Permita acesso à câmera/microfone
2. Verifique se ambos têm câmera/microfone
3. Teste em navegador moderno (Chrome/Firefox)

## 📞 Suporte:
- Verifique `NETWORK_SETUP.md` para configurações detalhadas
- Execute `ipconfig` para verificar IP atual
