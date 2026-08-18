const config = require("../config/settings");

function mensagemAusente(){

    return `
Olá! 😊

No momento não consigo atender sua mensagem,
mas retornarei o mais breve possível. 💕

Enquanto isso, conheça meu trabalho:

📸 Instagram:
${config.instagram}

Obrigada pela compreensão! ✨
`;
}


module.exports = mensagemAusente;