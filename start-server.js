const { exec } = require('child_process');
const os = require('os');

// Função para obter IP da rede local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Pula interfaces internas e não IPv4
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando servidor de chat com vídeo...\n');
console.log('📡 Informações de acesso:');
console.log(`   Local:  http://localhost:${PORT}`);
console.log(`   Rede:   http://${localIP}:${PORT}\n`);

console.log('👥 Para seu amigo acessar:');
console.log(`   1. Abra o navegador`);
console.log(`   2. Digite: http://${localIP}:${PORT}`);
console.log(`   3. Entre com um nome de usuário\n`);

console.log('⚠️  Importante:');
console.log('   - Certifique-se de que o firewall permite conexões na porta 3000');
console.log('   - Ambos devem estar na mesma rede Wi-Fi');
console.log('   - Para chamadas de vídeo, permita acesso à câmera/microfone\n');

// Iniciar o servidor principal
require('./server.js');
