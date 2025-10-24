const { exec } = require('child_process');

console.log('🛑 Parando servidor de chat...\n');

// Função para parar processos na porta 3000
function stopServer() {
    exec('netstat -ano | findstr :3000', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Nenhum servidor encontrado na porta 3000');
            return;
        }

        const lines = stdout.trim().split('\n');
        const processes = [];

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 5 && parts[1].includes(':3000') && parts[3] === 'LISTENING') {
                processes.push(parts[4]);
            }
        });

        if (processes.length === 0) {
            console.log('❌ Nenhum servidor encontrado na porta 3000');
            return;
        }

        console.log(`🔍 Encontrados ${processes.length} processo(s) na porta 3000:`);
        processes.forEach(pid => {
            console.log(`   PID: ${pid}`);
        });

        // Parar cada processo
        processes.forEach(pid => {
            exec(`taskkill /PID ${pid} /F`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Erro ao parar processo ${pid}:`, error.message);
                } else {
                    console.log(`✅ Processo ${pid} finalizado com sucesso`);
                }
            });
        });

        setTimeout(() => {
            console.log('\n🎉 Servidor parado com sucesso!');
        }, 1000);
    });
}

stopServer();
