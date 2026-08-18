const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("./config/settings");
const message = require("./events/message");


const messageEvent = require("./events/message");

const PHONE_NUMBER = config.telefone;
const MODO_AUTENTICACAO = config.modoAutenticacao;

const client = new Client({

    authStrategy:
    new LocalAuth()

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


client.on("ready", ()=>{

    console.log(
        "🚀 WhatsApp conectado!"
    );

});


client.on(
    "message_create",messageEvent
);


client.initialize();