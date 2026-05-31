const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// CONFIGURAÇÃO - Mude para os dados do seu pool
const POOL_API = 'https://ocean.xyz/api/stats'; // URL da API do pool
const WALLET_ADDRESS = 'SEU_WALLET_ADDRESS_AQUI'; // sua carteira BTC

// Estrutura de dados persistente (salva em arquivo JSON)
const DATA_FILE = path.join(__dirname, 'mining_data.json');

// Carrega dados históricos
function loadHistory() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
    return { daily: {}, workers: [], lastUpdate: null };
}

// Salva dados históricos
function saveHistory(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Busca dados atuais do pool (hashrate, earnings, workers)
async function fetchCurrentStats() {
    try {
        // Exemplo usando Ocean.xyz API
        const response = await fetch(`${POOL_API}?address=${WALLET_ADDRESS}`);
        const data = await response.json();
        
        // Adapte conforme a API do seu pool
        return {
            timestamp: new Date().toISOString(),
            hashrate: data.hashrate || 0, // em TH/s
            workers: data.workers || [],
            unpaidBalance: data.unpaid || 0,
            dailyEarning: data.dailyEarning || 0,
            monthlyEarning: data.monthlyEarning || 0
        };
    } catch (error) {
        console.error('Erro ao buscar dados do pool:', error);
        return null;
    }
}

// Atualiza histórico diário e salva
async function updateDailyHistory() {
    const stats = await fetchCurrentStats();
    if (!stats) return;

    const history = loadHistory();
    const today = new Date().toISOString().split('T')[0];
    
    // Atualiza registro do dia
    if (!history.daily[today]) {
        history.daily[today] = { earnings: 0, hashrate: [], count: 0 };
    }
    
    history.daily[today].earnings += stats.dailyEarning;
    history.daily[today].hashrate.push(stats.hashrate);
    history.daily[today].count++;
    history.workers = stats.workers;
    history.lastUpdate = stats.timestamp;
    
    saveHistory(history);
    return stats;
}

// ============= ENDPOINTS DA API =============

// Dashboard principal - dados atuais + visão geral
app.get('/api/dashboard', async (req, res) => {
    const current = await fetchCurrentStats();
    const history = loadHistory();
    
    // Calcula totais mensais e anuais
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const currentYear = now.getFullYear();
    
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    
    for (const [date, data] of Object.entries(history.daily)) {
        const year = date.slice(0, 4);
        const month = date.slice(0, 7);
        
        if (month === currentMonth) monthlyTotal += data.earnings;
        if (year == currentYear) yearlyTotal += data.earnings;
    }
    
    res.json({
        current: current,
        monthlyTotal: monthlyTotal,
        yearlyTotal: yearlyTotal,
        lastUpdate: history.lastUpdate,
        workersCount: history.workers?.length || 0
    });
});

// Histórico detalhado para gráficos
app.get('/api/history', (req, res) => {
    const history = loadHistory();
    const { days = 30 } = req.query;
    
    const entries = Object.entries(history.daily)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(-days);
    
    const result = entries.map(([date, data]) => ({
        date,
        earnings: data.earnings,
        avgHashrate: data.hashrate.reduce((a,b) => a+b, 0) / data.hashrate.length
    }));
    
    res.json(result);
});

// Lista de workers (computadores minerando)
app.get('/api/workers', (req, res) => {
    const history = loadHistory();
    res.json({ workers: history.workers });
});

// Endpoint para forçar atualização manual
app.post('/api/refresh', async (req, res) => {
    await updateDailyHistory();
    res.json({ success: true, message: 'Atualizado!' });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    
    // Atualização automática a cada 30 minutos
    setInterval(updateDailyHistory, 30 * 60 * 1000);
    updateDailyHistory(); // primeira execução
});