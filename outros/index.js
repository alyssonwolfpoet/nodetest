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
	console.log("Mensagem:", message.body);
    console.log("Remetente:", message.from);
    console.log("Destino:", message.to);
    console.log("Enviada por mim:", message.fromMe);
    console.log("Autor:", message.author);
    console.log("Tipo:", message.type);
    console.log("Horário:", new Date(message.timestamp * 1000));
    
});

// Inicializa o cliente
client.initialize();