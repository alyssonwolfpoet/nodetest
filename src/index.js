const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const config = require("./config/settings");
const eventm = require("./events/message");


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


client.on('message_create', async message => {

 console.log("----------------");
    console.log("body:", message.body);
    console.log("from:", message.from);
    console.log("to:", message.to);
    console.log("fromMe:", message.fromMe);
    console.log("Nome:", message._data.notifyName);
    console.log("author:", message.author);
    const contato = await message.getContact();
    console.log("Nome:", contato.pushname);
    console.log("Nome:", contato.name);
    console.log("Número:", contato.number);

    try {
        
        if (message.to.endsWith("@g.us")) {
            console.log("Grupo");
        
        } else {
            if(message.to === "160180872442075@lid"){
                console.log("ingnoraedo") 
                return;
            }else{
                console.log("Privado");
                //await message.reply("Olá! Recebi sua mensagem.");
                console.log("entro no else:")
                await messageEvent(message)
            }
            
        }
    } catch (err) {
        console.error("Erro ao obter chat:");
        console.error(err);
    }
        

});


client.initialize();