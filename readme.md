# ⛏️ Mining Dashboard - Sistema de Monitoramento de Mineração

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Sistema completo para monitorar múltiplos computadores minerando criptomoedas, com dashboard em tempo real, gráficos de lucro diário/mensal/anual e histórico persistente.

![Dashboard Preview](https://via.placeholder.com/800x400?text=Mining+Dashboard+Preview)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Endpoints da API](#-endpoints-da-api)
- [Personalização](#-personalização)
- [Solução de Problemas](#-solução-de-problemas)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

## 🎯 Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| **Monitoramento em Tempo Real** | Acompanha hashrate, workers ativos e saldo não pago |
| **Lucro Diário** | Calcula o ganho estimado nas últimas 24h |
| **Lucro Mensal** | Acumula todos os ganhos do mês corrente |
| **Lucro Anual** | Acumula todos os ganhos do ano corrente |
| **Gráficos Interativos** | Evolução diária do lucro e hashrate nos últimos 30 dias |
| **Lista de Workers** | Exibe nome, hashrate e status de cada computador |
| **Atualização Automática** | Consulta API do pool a cada 30 minutos |
| **Atualização Manual** | Botão para forçar atualização a qualquer momento |
| **Persistência de Dados** | Histórico salvo em arquivo JSON, não perde dados ao reiniciar |

---

## 🏗️ Arquitetura
