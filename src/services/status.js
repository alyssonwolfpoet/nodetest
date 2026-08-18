let ausente = true;


function ativar(){
    ausente = true;
}


function desativar(){
    ausente = false;
}


function estaAtivo(){
    return ausente;
}


module.exports = {
    ativar,
    desativar,
    estaAtivo
};