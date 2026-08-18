const status = require("../services/status");
const mensagemAusente = require("../messages/automatic");
const comandoAusente = require("../commands/ausente");
const { MessageAck, Client } = require("whatsapp-web.js");


module.exports = async function(message){
    
    // comandos do dono
    if(message.fromMe){

        await comandoAusente(message);

        return;
    }


    // ignora grupos
    if(message.from.endsWith("@g.us"))
        return;



    if(status.estaAtivo()){

        await message.reply(
            mensagemAusente()
        );

    }

};