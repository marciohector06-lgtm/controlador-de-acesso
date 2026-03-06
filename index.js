const express = require('express');
const app = express();
const http = require('http').Server(app);
const Stream = require('node-rtsp-stream');

// =========================================================
// 1. CONFIGURAÇÕES
// =========================================================
app.use(express.json());       
app.use(express.static('public')); 

// =========================================================
// 2. BANCO DE DADOS (MEMÓRIA)
// =========================================================

// 👇 Lista de Usuários (Começa só com o Admin)
const usuarios = [
    { id: 1, nome: "Administrador", login: "admin", senha: "123", cargo: "admin" }
];

// 👇 Histórico de Logs
const historicoLogs = [];

function pegarHoraAtual() {
    return new Date().toLocaleString('pt-BR');
}

function registrarLog(acao, usuario) {
    historicoLogs.unshift({
        data: pegarHoraAtual(),
        acao: acao,
        usuario: usuario,
        status: "Sucesso"
    });
    if (historicoLogs.length > 50) historicoLogs.pop();
}

// =========================================================
// 3. ROTAS DE DADOS (API)
// =========================================================

// Rota para o site ler os logs
app.get('/api/logs', (req, res) => {
    res.json(historicoLogs);
});

// 👇 Rota para o site ler a lista de usuários (sem mostrar a senha)
app.get('/api/usuarios', (req, res) => {
    const listaSegura = usuarios.map(u => ({ id: u.id, nome: u.nome, login: u.login, cargo: u.cargo }));
    res.json(listaSegura);
});

// 👇 Rota para CADASTRAR novo usuário
app.post('/api/usuarios', (req, res) => {
    const { nome, login, senha, cargo } = req.body;
    
    // Verifica se já existe esse login
    const existe = usuarios.find(u => u.login === login);
    if (existe) {
        return res.json({ sucesso: false, msg: "Login já existe!" });
    }

    const novoUsuario = {
        id: Date.now(), // Gera um ID único
        nome, login, senha, cargo
    };

    usuarios.push(novoUsuario);
    registrarLog(`Novo usuário criado: ${login}`, "Admin");
    res.json({ sucesso: true });
});

// 👇 Rota para DELETAR usuário
app.post('/api/usuarios/deletar', (req, res) => {
    const { login } = req.body;
    
    if (login === 'admin') {
        return res.json({ sucesso: false, msg: "Não pode apagar o Admin!" });
    }

    // Remove da lista
    const index = usuarios.findIndex(u => u.login === login);
    if (index > -1) {
        usuarios.splice(index, 1);
        registrarLog(`Usuário removido: ${login}`, "Admin");
        res.json({ sucesso: true });
    } else {
        res.json({ sucesso: false });
    }
});

// =========================================================
// 4. CONFIGURAÇÃO DAS CÂMERAS (IP: 192.168.1.200)
// =========================================================
const cameras = [
    { id: 1, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=1&subtype=1" },
    { id: 2, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=2&subtype=1" },
    { id: 3, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=3&subtype=1" },
    { id: 4, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=4&subtype=1" },
    { id: 5, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=5&subtype=1" },
    { id: 6, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=6&subtype=1" },
    { id: 7, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=7&subtype=1" },
    { id: 8, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=8&subtype=1" }, 
    { id: 9, url: "rtsp://admin:12QWaszx%40%40@192.168.1.200:554/cam/realmonitor?channel=9&subtype=1" }
];

cameras.forEach((cam) => {
    const portaStream = 9990 + cam.id;
    try {
        new Stream({
            name: `Camera ${cam.id}`,
            streamUrl: cam.url,
            wsPort: portaStream,
            ffmpegOptions: { 
                '-stats': '', 
                '-r': 30, 
                '-s': '640x360',
                '-b:v': '600k',
                '-preset': 'ultrafast',
                '-tune': 'zerolatency'
            }
        });
        console.log(`🎥 Câmera ${cam.id} iniciada na porta ${portaStream}`);
    } catch (e) {
        console.log(`❌ Erro Câmera ${cam.id}`);
    }
});

// =========================================================
// 5. ROTA DE LOGIN (Inteligente)
// =========================================================
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;
    console.log(`👤 Tentativa de login: ${usuario}`);

    // 👇 Agora ele procura na lista de usuários
    const usuarioEncontrado = usuarios.find(u => u.login === usuario && u.senha === senha);

    if (usuarioEncontrado) {
        registrarLog("Login Realizado", usuarioEncontrado.nome);
        res.json({ sucesso: true, nome: usuarioEncontrado.nome });
    } else {
        registrarLog("Senha Errada", usuario);
        res.json({ sucesso: false });
    }
});

// =========================================================
// 6. ROTA DO PORTÃO
// =========================================================
let portaoEstaAberto = false; 

app.post('/api/portao', (req, res) => {
    portaoEstaAberto = !portaoEstaAberto; 
    const novoStatus = portaoEstaAberto ? "Aberto Manualmente" : "Fechado Manualmente";
    
    console.log(`🔔 COMANDO: Portão ${novoStatus}`);
    
    // Pega o nome de quem clicou (se vier na requisição) ou usa Admin
    const quemClicou = req.body.usuario || "Admin";
    registrarLog(`Portão ${portaoEstaAberto ? "ABERTO" : "FECHADO"}`, quemClicou);

    res.json({ 
        sucesso: true, 
        status: novoStatus,
        aberto: portaoEstaAberto 
    });
});

// =========================================================
// 7. INICIAR SISTEMA
// =========================================================
const PORT = 3000;
http.listen(PORT, () => {
    console.log(`\n🚀 SISTEMA ONLINE!`);
    console.log(`👉 Acesse: http://localhost:${PORT}/login.html\n`);
});