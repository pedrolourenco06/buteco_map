# 🍺 Comida di Buteco BH 2025 · Mapa Interativo

Site interativo com mapa dos 58 bares participantes do Comida di Buteco BH 2025. Inclui hover com detalhes do prato, seleção de bar e cálculo de rota a partir da sua localização.

---

## 🚀 Deploy no GitHub Pages (passo a passo)

### 1. Configure a API Key do Google Maps

Abra o `index.html` e substitua **duas ocorrências** de `SUA_API_KEY_AQUI` pela sua chave:

```html
<!-- Linha ~490 -->
const API_KEY = 'SUA_CHAVE_AQUI';

<!-- Última linha do body -->
<script src="https://maps.googleapis.com/maps/api/js?key=SUA_CHAVE_AQUI&...">
```

### 2. Crie o repositório no GitHub

```bash
git init
git add index.html README.md
git commit -m "feat: mapa comida di buteco bh 2025"
git remote add origin https://github.com/SEU_USUARIO/buteco-map.git
git push -u origin main
```

### 3. Ative o GitHub Pages

1. Vá em **Settings** → **Pages** no repositório
2. Em **Source**, selecione `main` branch, pasta `/root`
3. Clique em **Save**
4. Aguarde ~1 minuto e acesse `https://SEU_USUARIO.github.io/buteco-map`

---

## 🔑 Como obter a API Key do Google Maps

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto (ou selecione um existente)
3. Ative as APIs:
   - **Maps JavaScript API**
   - **Directions API**
4. Vá em **Credentials** → **Create Credentials** → **API Key**
5. **Recomendado**: restrinja a chave ao domínio `*.github.io` para segurança

> ⚠️ A API do Google Maps tem uma cota gratuita generosa ($200/mês), suficiente para uso pessoal.

---

## ✨ Funcionalidades

| Feature | Descrição |
|---------|-----------|
| 🗺️ Mapa interativo | 58 pins customizados com emoji 🍺 |
| 🖱️ Hover nos pins | Tooltip com nome do bar, bairro, nome e descrição do prato |
| 📍 Localização atual | Pin amarelo no mapa indicando onde você está |
| 🔀 Rota | Traça rota da sua localização até o bar selecionado |
| 🚗🚶🚌🚴 Modos de transporte | Carro, a pé, ônibus ou bicicleta |
| 🔗 Abrir no Google Maps | Link direto para o app do Google Maps |
| 🔍 Busca | Filtra por nome do bar, prato ou bairro |
| 🏙️ Filtros por região | Centro-Sul, Pampulha, Noroeste, Nordeste, Leste, Oeste, Barreiro, V. Nova |
| 📱 Responsivo | Sidebar recolhível para mobile |

---

## 🛠️ Stack

- **HTML5 + CSS3 + JavaScript vanilla** — zero dependências, zero frameworks
- **Google Maps JavaScript API** — mapa, markers e cálculo de rotas
- **GitHub Pages** — hospedagem gratuita e estática
- **Google Fonts** — Bebas Neue + Syne + DM Sans

---

## 📂 Estrutura

```
buteco-map/
├── index.html    ← tudo em um único arquivo
└── README.md     ← este guia
```
