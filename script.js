document.addEventListener('DOMContentLoaded', function() {
    const gerarBtn = document.getElementById('gerarBtn');
    const copiarBtn = document.getElementById('copiarBtn');
    
    gerarBtn.addEventListener('click', gerarOferta);
    copiarBtn.addEventListener('click', copiarTexto);
});

function gerarOferta() {
    const texto = document.getElementById('textoOriginal').value.trim();
    
    if (!texto) {
        alert("Cole seu texto de oferta primeiro!");
        return;
    }
    
    // Extração dos dados
    const produto = extrairProduto(texto);
    const desconto = extrairDado(texto, /Desconto de (até )?(\d+%)/, 2) || "XX%";
    const precoAntigo = extrairDado(texto, /de: ~R\$\s*([\d.,]+)~/, 1) || "00,00";
    const precoNovo = extrairDado(texto, /por R\$\s*([\d.,]+)/, 1) || "00,00";
    const link = extrairDado(texto, /(https?:\/\/[^\s]+)/) || "#";
    
    // Extrai benefícios do título (modo local)
    const beneficios = extrairBeneficiosDoTitulo(produto);
    
    // Gera o template
    const template = `📢 *Mencionei Você* ‼️😱 *NESSA PROMO ${criarNomePromo(produto)}* 🏃‍♀️💨\n\n` +
                    `> *${produto.toUpperCase()}*\n` +
                    `✔️ ${beneficios[0]}\n` +
                    `✔️ ${beneficios[1]}\n` +
                    `✔️ ${beneficios[2]}\n\n` +
                    `🏷️ *DESCONTO DE ${desconto}*\n\n` +
                    `❌~De R$ ${precoAntigo}~\n` +
                    `🔥 *POR APENAS R$ ${precoNovo}!* 🔥\n\n` +
                    `🛍️ *COMPRE AGORA:*\n` +
                    `👉 [LINK DIRETO] ${link}\n\n` +
                    `🎟️ *CUPONS EXCLUSIVOS:*\n` +
                    `🔗 [CUPONS] https://s.shopee.com.br/2B26Ni9V1y\n\n` +
                    `⏰ *ÚLTIMAS UNIDADES! Promoção pode acabar a qualquer momento!*`;
    
    document.getElementById('resultado').innerText = template;
    document.getElementById('copiarBtn').style.display = 'block';
}

// Extrai benefícios diretamente do título (sem IA)
function extrairBeneficiosDoTitulo(titulo) {
    // Palavras-chave prioritárias
    const palavrasChave = [
        'impermeável', 'antiderrapante', 'confortável', 'luxo', 'profissional',
        'elétrico', 'sem fio', 'automático', 'ergonômico', 'resistente', 
        'leve', 'compacto', 'durável', 'prático', 'moderno'
    ];
    
    // Processamento do título
    const palavrasUnicas = [...new Set( // Remove duplicatas
        titulo.toLowerCase()
            .replace(/[^a-zà-ú\s]/g, '') // Remove caracteres especiais
            .split(' ')
            .filter(palavra => palavra.length > 3) // Filtra palavras curtas
    )];
    
    // Identifica palavras-chave prioritárias
    const beneficios = [];
    palavrasChave.forEach(palavra => {
        if (titulo.toLowerCase().includes(palavra) {
            beneficios.push(
                palavra.charAt(0).toUpperCase() + palavra.slice(1)
            );
        }
    });
    
    // Adiciona outras palavras relevantes (se necessário)
    palavrasUnicas.forEach(palavra => {
        if (beneficios.length < 3 && !palavrasChave.includes(palavra)) {
            beneficios.push(
                palavra.charAt(0).toUpperCase() + palavra.slice(1)
            );
        }
    });
    
    // Completa com padrões se não atingir 3 benefícios
    const padroes = ["Design Premium", "Alta Durabilidade", "Garantia Estendida"];
    return beneficios.concat(padroes).slice(0, 3);
}

// Funções auxiliares
function extrairProduto(texto) {
    const match = texto.match(/>([^<]+)</) || texto.match(/🚨[^>]+>([^\n]+)/);
    return match ? match[1].replace(/[🚨‼️👉🏷️]/g, '').trim() : "PRODUTO";
}

function extrairDado(texto, regex, grupo = 1) {
    const match = texto.match(regex);
    return match ? match[grupo].trim() : null;
}

function criarNomePromo(nome) {
    const palavras = nome.replace(/[^a-zA-ZÀ-ú\s]/g, '').split(' ');
    const palavraChave = palavras.find(p => p.length > 3) || palavras[0];
    return palavraChave.substring(0, 5).toUpperCase() + "DOO";
}

function copiarTexto() {
    const texto = document.getElementById('resultado').innerText;
    navigator.clipboard.writeText(texto)
        .then(() => {
            const btn = document.getElementById('copiarBtn');
            btn.textContent = '✅ COPIADO!';
            setTimeout(() => {
                btn.textContent = '📋 COPIAR OFERTA';
            }, 2000);
        });
}
