    const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d");

let jogoAtivo = false;
let velocidadeObstaculos = 5;
let pontuacao = 0;
let carro, obstaculos, intervaloObstaculos, teclado;
let pontosAumentarVelocidade = 20;
let animacaoId;
 let testeIrado;

canvas.width = 480;
canvas.height = 600;

function reiniciarJogo() {
    jogoAtivo = false;
    pontuacao = 0;
    velocidadeObstaculos = 5;
    intervaloObstaculos = 0;
    obstaculos = [];
    teclado = {};
    document.getElementById("menu").style.display = 'block';
    cancelarAnimacao();
}

function iniciarJogo() {
    jogoAtivo = true;
    document.getElementById('menu').style.display = 'none'; 
    carro = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 120,
        largura: 50,
        altura: 90,
        velocidade: 5,
        cor: "#00f"
    };
    obstaculos = [];
    intervaloObstaculos = 0;
    pontuacao = 0;
    teclado = {};

    let dificuldade = document.getElementById("dificuldade").value;
    let testeIrado;
    
    switch(dificuldade){
        case 'facil' : velocidadeObstaculos = 3, pontosAumentarVelocidade = 30, testeIrado = 125; break;
        case 'medio': velocidadeObstaculos = 5, pontosAumentarVelocidade = 20, testeIrado = 100; break;
        case 'dificil': velocidadeObstaculos = 7, pontosAumentarVelocidade = 10, testeIrado = 125; break;

    }

    atualizarJogo();
    MusicaOn();
}

function desenharCarro() {

     const imagem = new Image();
    imagem.src = 'assets/astronauto.png';

   
      ctx.drawImage(imagem, carro.x, carro.y, carro.largura, carro.altura);
    
    //ctx.fillStyle = carro.cor;
    //ctx.fillRect(carro.x, carro.y, carro.largura, carro.altura);
}

function moverCarro() {
    if (teclado["ArrowLeft"] && carro.x > 0) {
        carro.x -= carro.velocidade;
    }
    if (teclado["ArrowRight"] && carro.x < canvas.width - carro.largura) {
        carro.x += carro.velocidade;
    }
}

function gerarObstaculos() {
    let larguraObstaculo = Math.random() * (canvas.width / 2) + 30;
    let xPosicaoObstaculo = Math.random() * (canvas.width - larguraObstaculo);
    obstaculos.push({ x: xPosicaoObstaculo, y: -100, largura: larguraObstaculo, altura: 30 });
}

function desenharObs() {

     const imagem = new Image();
    imagem.src = 'assets/pedra.png';

   
      
    //.fillStyle = '#f00';
    obstaculos.forEach(obstaculo => { 
        //ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
        ctx.drawImage(imagem, obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
    });
}

function moverObs() {
    obstaculos.forEach((obstaculo, index) => {
        obstaculo.y += velocidadeObstaculos;
        if (obstaculo.y > canvas.height) {
            obstaculos.splice(index, 1);
            pontuacao += 10;
        }
    });
}

function detectarColisao() {
    for (let obstaculo of obstaculos) {
        if (
            carro.x < obstaculo.x + obstaculo.largura &&
            carro.x + carro.largura > obstaculo.x &&
            carro.y < obstaculo.y + obstaculo.altura &&
            carro.y + carro.altura > obstaculo.y
        ) {
            musicaOff();
            explosion.currentTime = 0.0;
            explosion.play();
            alert('Você bateu!');
            reiniciarJogo();
        }
    }
}

function atualizarPontos() {
    ctx.fillStyle = '#ffc3ed';
    ctx.font = "24px Arial";
    ctx.fillText("Pontuação: " + pontuacao, 10, 30);
}

function atualizarJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharCarro();
    moverCarro();
    desenharObs();
    moverObs();
    detectarColisao();
    atualizarPontos();

    if (intervaloObstaculos % 100 === 0) {
        gerarObstaculos();
    }

    intervaloObstaculos++;

    if (pontuacao >= pontosAumentarVelocidade) {
        velocidadeObstaculos += 0.5;
        pontosAumentarVelocidade += 20;
    }

    if (jogoAtivo) {
        animacaoId = requestAnimationFrame(atualizarJogo); 
    }
}

window.addEventListener("keydown", (event) => {
    teclado[event.key] = true;
});

window.addEventListener("keyup", (event) => {
    teclado[event.key] = false;
});

function cancelarAnimacao() {
    cancelAnimationFrame(animacaoId);
}

reiniciarJogo();

var musica = new Audio();
    musica.src = 'assets/sons/musica.mp3'
    musica.load();
    musica.volume = 0.6;

    var explosion = new Audio();
   explosion.src = 'assets/sons/explosion.mp3'
   explosion.load();
    explosion.volume = 0.5;

function MusicaOn(){
    musica.loop = true;
    musica.play();

}
function musicaOff(){
    musica.pause();
    musica.currentTime = 0.0;
}