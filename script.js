// Configuração da API de IA (Cohere)
const COHERE_API_KEY = 'ArrrnG4OsJplH3mvfkYeOLxDLqVNMOjnxqYoOczV'; // Obtenha em: https://dashboard.cohere.ai/
const COHERE_API_URL = 'https://api.cohere.ai/v1/generate';

document.addEventListener('DOMContentLoaded', function() {
    const gerarBtn = document.getElementById('gerarBtn');
    const copiarBtn = document.getElementById('copiarBtn');
    
    gerarBtn.addEventListener('click', gerarOfertaIA);
    copiarBtn.addEventListener('click', copiarTexto);
});

async function gerarOfertaIA() {
    const texto = document.getElementById('textoOriginal').value.trim();
    
    if (!texto) {
        alert("Cole seu texto de oferta primeiro!");
        return;
    }

    try {
        // Extração básica
        const produto = extrairProduto(texto);
        const [precoAntigo, precoNovo, link] = extrairDadosBasicos(texto);
        
        // Extração de benefícios com IA
        const beneficios = await extrairBeneficiosComIA(produto);
        
        // Geração do template
        const template = montarTemplate({
            produto,
            desconto: calcularDesconto(precoAntigo, precoNovo),
            precoAntigo,
            precoNovo,
            link,
            beneficios
        });
        
        exibirResultado(template);
        
    } catch (error) {
        console.error("Erro na IA:", error);
        alert("Usando modo seguro (IA indisponível)");
        gerarOfertaBasica(texto); // Fallback sem IA
    }
}

// Função principal de IA
async function extrairBeneficiosDoTitulo(titulo) {
    // Lista de palavras-chave para priorizar
    const palavrasChave = [
        'impermeável', 'antiderrapante', 'confortável', 'luxo', 
        'profissional', 'elétrico', 'sem fio', 'automático', 
        'ergonômico', 'resistente', 'leve', 'compacto'
    ];
    
    // Processa o título
    const palavras = titulo.toLowerCase()
        .replace(/[^a-zà-ú\s]/g, '') // Remove caracteres especiais
        .split(' ')
        .filter(palavra => palavra.length > 3);
    
    // Identifica palavras-chave prioritárias
    const beneficios = [];
    palavrasChave.forEach(palavra => {
        if (titulo.toLowerCase().includes(palavra) {
            beneficios.push(palavra.charAt(0).toUpperCase() + palavra.slice(1));
        }
    });
    
    // Completa com outras palavras relevantes se necessário
    palavras.forEach(palavra => {
        if (beneficios.length < 3 && !beneficios.includes(palavra) {
            beneficios.push(palavra.charAt(0).toUpperCase() + palavra.slice(1));
        }
    });
    
    // Fallback para benefícios genéricos
    const padroes = ["Design Premium", "Alta Durabilidade", "Garantia Estendida"];
    return beneficios.concat(padroes).slice(0, 3);
}

function processarRespostaIA(textoIA) {
    // Padrão: "1. Portátil|2. Resistente|3. Moderno"
    const padrao = /(\d\.\s*[^\n|]+)/g;
    const matches = [...textoIA.matchAll(padrao)];
    
    return matches.slice(0, 3).map(m => 
        m[1].replace(/^\d\.\s*/, '').trim()
    );
}

// Funções auxiliares (otimizadas)
function extrairProduto(texto) {
    return (texto.match(/>([^<]+)</) || texto.match(/🚨[^>]+>([^\n]+)/))?.[1]
        .replace(/[🚨‼️👉🏷️]/g, '').trim() || "PRODUTO";
}

function extrairDadosBasicos(texto) {
    return [
        extrairDado(texto, /de: ~R\$\s*([\d.,]+)~/, 1) || "00,00",
        extrairDado(texto, /por R\$\s*([\d.,]+)/, 1) || "00,00",
        extrairDado(texto, /(https?:\/\/[^\s]+)/) || "#"
    ];
}

function montarTemplate({ produto, desconto, precoAntigo, precoNovo, link, beneficios }) {
    return `📢 *Mencionei Você* ‼️😱 *NESSA PROMO ${criarNomePromo(produto)}* 🏃‍♀️💨\n\n` +
           `> *${produto.toUpperCase()}*\n` +
           `✔️ ${beneficios[0] || "Qualidade Premium"}\n` +
           `✔️ ${beneficios[1] || "Design Inovador"}\n` +
           `✔️ ${beneficios[2] || "Garantia Total"}\n\n` +
           `🏷️ *DESCONTO DE ${desconto}*\n\n` +
           `❌~De R$ ${precoAntigo}~\n` +
           `🔥 *POR APENAS R$ ${precoNovo}!* 🔥\n\n` +
           `🛍️ *COMPRE AGORA:*\n` +
           `👉 [LINK DIRETO] ${link}\n\n` +
           `🎟️ *CUPONS EXCLUSIVOS:*\n` +
           `🔗 [CUPONS] https://s.shopee.com.br/2B26Ni9V1y\n\n` +
           `⏰ *ÚLTIMAS UNIDADES! Promoção pode acabar a qualquer momento!*`;
}

// ... (mantenha as outras funções do código anterior)
