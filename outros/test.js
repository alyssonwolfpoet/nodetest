document.addEventListener('keydown', (evento) => {
    console.log(`Você pressionou: ${evento.key}`);
    
    if (evento.key === 'Enter') {
        console.log('A tecla Enter foi acionada!');
    }
});
