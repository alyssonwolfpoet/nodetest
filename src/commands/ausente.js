const status = require("../services/status");

async function executar(message) {

    console.log("Comando recebido:", message.body);

    switch (message.body) {

        case "!ausente on":
            console.log("Ativando modo ausente");
            status.ativar();
            await message.reply("🟢 Modo ausente ativado");
            break;

        case "!ausente off":
            console.log("Desativando modo ausente");
            status.desativar();
            await message.reply("🔴 Modo ausente desativado");
            break;

        case "!status":
            console.log("Entrou no !status");
            console.log("Estado:", status.estaAtivo());

            await message.reply(
                status.estaAtivo()
                    ? "🟢 Ausente ativo"
                    : "🔴 Ausente desligado"
            );
            break;
        
        case "!menu":
            await message.reply(
`🤖 *MENU DE COMANDOS*

📌 *Modo Ausente*
• !ausente on  → Ativa o modo ausente.
• !ausente off → Desativa o modo ausente.

📊 *Informações*
• !status → Exibe o estado atual.
• !menu → Mostra este menu.

━━━━━━━━━━━━━━━━━━
Desenvolvido por Alysson`
            );
            break;
    }
}

module.exports = executar;