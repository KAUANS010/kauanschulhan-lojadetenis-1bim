// Quando o conteúdo da página estiver totalmente carregado
document.addEventListener("DOMContentLoaded", () => {
  // Recupera o valor total da compra armazenado no localStorage
  const total = parseFloat(localStorage.getItem('valorTotal')) || 0;

  // Exibe o valor total no elemento com id 'resumoPagamento'
  document.getElementById('resumoPagamento').textContent = `Total: R$ ${total.toFixed(2)}`;
});

// Função chamada quando o usuário escolhe uma forma de pagamento
function verificarPagamento() {
  const forma = document.getElementById("formaPagamento").value;

  // Se a forma for Pix, chama a função para gerar o QR Code
  if (forma === "Pix") {
    pagarPIX();
  } else {
    // Caso contrário, esconde a área do QR Code e limpa seu conteúdo
    document.getElementById("qrcode-area").style.display = "none";
    document.getElementById("qrcode").innerHTML = "";
  }
}

// Função que gera o QR Code para pagamento via Pix
function pagarPIX() {
  const forma = document.getElementById("formaPagamento").value;

  // Garante que a forma de pagamento seja Pix
  if (forma !== "Pix") {
    alert("Selecione a forma de pagamento como Pix para gerar o QR Code.");
    return;
  }

  // Recupera o valor total da compra
  const valor = parseFloat(localStorage.getItem('valorTotal')) || 0;

  // Informações do recebedor
  const chavePix = '73378690968'; // Chave Pix do recebedor
  const nomeRecebedor = 'KAUAN SCHULHAN ';
  const cidade = 'SAO PAULO';
  const descricao = 'Pagamento  LojaDeTenis';

  // Função auxiliar que formata os campos do payload Pix
  function format(id, value) {
    const size = value.length.toString().padStart(2, '0'); // Garante que o tamanho seja sempre com 2 dígitos
    return `${id}${size}${value}`;
  }

  // Monta os dados da conta do recebedor no formato do Pix
  const merchantAccount = format("00", "BR.GOV.BCB.PIX") +
                          format("01", chavePix) +
                          format("02", descricao);

  // Monta o payload completo, ainda sem o código de verificação CRC
  const payloadSemCRC =
    format("00", "01") + // Payload Format Indicator
    format("26", merchantAccount) + // Merchant Account Information
    format("52", "0000") + // Merchant Category Code (geral)
    format("53", "986") + // Moeda BRL (código 986)
    format("54", valor.toFixed(2)) + // Valor
    format("58", "BR") + // País
    format("59", nomeRecebedor) + // Nome do recebedor
    format("60", cidade) + // Cidade
    format("62", format("05", "***")) + // Campo adicional qualquer
    "6304"; // Início do campo do CRC

  // Função que calcula o CRC16 do payload, exigido pelo padrão do Pix
  function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0'); // Retorna o CRC em hexadecimal
  }

  // Junta o payload com o código de verificação (CRC)
  const payloadCompleto = payloadSemCRC + crc16(payloadSemCRC);

  // Seleciona a div onde o QR Code será exibido
  const qrCodeDiv = document.getElementById("qrcode");
  qrCodeDiv.innerHTML = ''; // Limpa qualquer conteúdo anterior

  // Exibe a área do QR Code
  document.getElementById("qrcode-area").style.display = "block";

  // Gera o QR Code com a biblioteca QRCode.js
  new QRCode(qrCodeDiv, {
    text: payloadCompleto, // Código Pix completo
    width: 250,
    height: 250,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H // Alta correção de erros
  });

  // Cria uma div com informações extras abaixo do QR Code
  const info = document.createElement("div");
  info.className = "nome-valor";
  info.innerHTML = `
    <p><strong>Nome:</strong> ${nomeRecebedor}</p>
    <p><strong>CPF/CNPJ (PIX):</strong> ${chavePix}</p>
    <p><strong>Valor:</strong> R$ ${valor.toFixed(2)}</p>
  `;
  qrCodeDiv.appendChild(info); // Adiciona à div do QR Code
}

// Função que finaliza a compra
function finalizarCompra() {
  alert("Compra finalizada com sucesso! Obrigado pela preferência, Volte sempre!!");

  // Limpa os dados do carrinho e valor total do localStorage
  localStorage.removeItem("carrinho");
  localStorage.removeItem('valorTotal');

  // Redireciona o usuário de volta ao menu
  window.location.href = '../loja/loja.html';
}
