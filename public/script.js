// =========================================================
// 1. NAVEGAÇÃO E INTERFACE (MENU LATERAL)
// =========================================================

function trocarTela(telaId, linkClicado) {
    // Esconde todas as telas
    document.getElementById('tela-dashboard').style.display = 'none';
    document.getElementById('tela-controle').style.display = 'none';
    document.getElementById('tela-usuarios').style.display = 'none';
    document.getElementById('tela-cameras').style.display = 'none';

    // Mostra a tela escolhida
    const tela = document.getElementById('tela-' + telaId);
    if (tela) tela.style.display = 'block';

    // Atualiza o menu lateral (ativo)
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (linkClicado) linkClicado.classList.add('active');
}

// Alternar Abas da Central de Operações
function abrirAba(abaId, linkClicado) {
    document.querySelectorAll('.tab-conteudo').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.nav-tabs .nav-link').forEach(link => link.classList.remove('active'));

    document.getElementById('tab-' + abaId).style.display = 'block';
    linkClicado.classList.add('active');
}

// =========================================================
// 2. FUNÇÕES DO PORTÃO (DASHBOARD)
// =========================================================
async function acionarPortao() {
    const btnTexto = document.getElementById('btn-texto');
    const statusTexto = document.getElementById('status-texto');
    const iconPortao = document.getElementById('icon-portao');
    const cardBox = document.querySelector('.bg-danger'); // A caixa vermelha

    btnTexto.innerText = "Enviando sinal...";
    
    try {
        const resposta = await fetch('/api/portao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ acao: 'alternar' })
        });
        const dados = await resposta.json();

        if (dados.sucesso) {
            // Muda visual para VERDE (Aberto)
            if(cardBox) { cardBox.classList.remove('bg-danger'); cardBox.classList.add('bg-success'); }
            statusTexto.innerText = "Aberto";
            btnTexto.innerText = "Aberto ✅";
            iconPortao.className = "fas fa-door-open";
            
            // Espera 5 segundos e volta para VERMELHO (Trancado)
            setTimeout(() => {
                if(cardBox) { cardBox.classList.remove('bg-success'); cardBox.classList.add('bg-danger'); }
                statusTexto.innerText = "Trancado";
                btnTexto.innerText = "Liberar Acesso";
                iconPortao.className = "fas fa-door-closed";
            }, 5000);
        }
    } catch (erro) {
        alert("Erro ao conectar com o servidor!");
        btnTexto.innerText = "Tentar Novamente";
    }
}

// =========================================================
// 3. CÂMERAS - SISTEMA DE VÍDEO (RTSP via WebSocket)
// =========================================================

// Função que inicia quando a página carrega
window.onload = function() {
    console.log("🚀 Iniciando Sistema de Câmeras...");
    
    // Tenta conectar nas câmeras de 1 a 9
    for (let i = 1; i <= 9; i++) {
        criarPlayer(i);
    }
};

function criarPlayer(numeroCam) {
    // Procura o elemento HTML da câmera (ex: video-canvas-1)
    const canvas = document.getElementById('video-canvas-' + numeroCam);
    
    // Se não achar o quadrado na tela, pula essa câmera
    if (!canvas) return; 

    // Calcula a porta certa (9991, 9992... 9999)
    const porta = 9990 + numeroCam; 
    
    // Monta o endereço do WebSocket (IP do computador + Porta)
    const url = 'ws://' + document.location.hostname + ':' + porta;

    try {
        // Inicia o player JSMpeg
        new JSMpeg.Player(url, {
            canvas: canvas,
            autoplay: true,
            audio: false,
            loop: true
        });
        console.log(`✅ Cam ${numeroCam} ligada na porta ${porta}`);
    } catch (e) {
        console.log(`❌ Erro ao ligar Cam ${numeroCam}:`, e);
    }
}

// Função para dar Zoom / Tela Cheia ao clicar na câmera
function toggleFullScreen(elemento) {
    // Adiciona ou remove a classe de tela cheia
    elemento.classList.toggle('camera-fullscreen');
    
    // Se estiver em tela cheia, esconde a barra de rolagem do site
    if (elemento.classList.contains('camera-fullscreen')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}
// =========================================================
// 7. ATALHO DE TECLADO (ESC PARA SAIR DO ZOOM)
// =========================================================
document.addEventListener('keydown', function(evento) {
    // Se a tecla apertada for ESC
    if (evento.key === "Escape" || evento.key === "Esc") {
        
        // Procura se tem alguma câmera em tela cheia
        const cameraCheia = document.querySelector('.camera-fullscreen');
        
        if (cameraCheia) {
            // Remove o zoom
            cameraCheia.classList.remove('camera-fullscreen');
            // Destrava a rolagem do site
            document.body.style.overflow = 'auto';
            console.log("Zoom fechado com ESC");
        }
    }
});