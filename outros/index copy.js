const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { create } = require('node:domain');

const PHONE_NUMBER = '5585985287976'; // Código do país + DDD + número

const client = new Client({
    authStrategy: new LocalAuth()
});

// Caso o WhatsApp solicite QR Code
client.on('qr', async (qr) => {
    console.log('\nQR Code recebido.\n');

    // Exibe o QR Code no terminal
    qrcode.generate(qr, { small: true });

    // Tenta gerar o código de pareamento
    try {
        const pairingCode = await client.requestPairingCode(PHONE_NUMBER);
        console.log('\n==============================');
        console.log('Código de Pareamento:');
        console.log(pairingCode);
        console.log('==============================\n');
    } catch (err) {
        console.log('Não foi possível gerar o código de pareamento.');
        console.error(err.message);
    }
});

// Cliente autenticado
client.on('authenticated', () => {
    console.log('✅ Autenticado!');
});

// Sessão salva
client.on('ready', () => {
    console.log('🚀 WhatsApp conectado!');
});

// Sessão desconectada
client.on('disconnected', (reason) => {
    console.log('❌ Desconectado:', reason);
});

// Listening to all incoming messages
client.on('message_create', message => {
	console.log(message.body);
});

client.on('message_create', async message => {
	if (message.body === '!ping') {
		// reply back "pong" directly to the message
		message.reply('pong');
	}
    
    //  if (message.from.endsWith("@g.us")) return;

    // const partes = message.body.trim().split(/\s+/);

    // if (partes[0] !== "!send") return;

    // const numero = partes[1];
    // const quantidade = parseInt(partes[2], 10);
    // const texto = partes.slice(3).join(" ");

    // if (isNaN(quantidade) || !texto) {
    //     return message.reply("Uso: !send <numero> <quantidade> <mensagem>");
    // }

    // const chatId = `${numero}@c.us`;

    // for (let i = 0; i < quantidade; i++) {
    //     await client.sendMessage(chatId, texto);
    //     await new Promise(resolve => setTimeout(resolve, 1000));
    // }

    // message.reply("Mensagens enviadas!");
    
});

client.on("message_create",  (message) => {

    console.log(message.body);

    // if (message.fromMe) return;
    if (message.from.endsWith("@g.us")) return;

    // const partes = message.body.split(" ");

    // const quantidade = parseInt(partes[0]);

    // if (isNaN(quantidade)) return;

    // if (quantidade <= 0) return;

    // if(message.gr)

    // if (quantidade > 100) {
    //     return message.reply("Máximo permitido é 20 mensagens.");
    // }

    // const texto = partes.slice(1).join(" ");

    // if (!texto) {
    //     return message.reply("Digite uma mensagem.");
    // }

    // for (let i = 0; i < quantidade; i++) {

    //      message.reply(`nº ${i+1} : ${texto}`);

    //      new Promise(resolve => setTimeout(resolve, 1000));
    // }

});

// Inicializa o cliente
client.initialize();