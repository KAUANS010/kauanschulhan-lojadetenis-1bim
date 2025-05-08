const carrinhoContainer = document.getElementById('carrinho');
let produtos = JSON.parse(localStorage.getItem('carrinho')) || [];

if (produtos.length === 0) {
  carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
} else {
  produtos.forEach(produto => adicionarAoCarrinho(produto));
  adicionarBotaoFinalizar();
}

function adicionarAoCarrinho(produto) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `produto-${produto.id}`;

  card.innerHTML = `
    <img src="${produto.img}" alt="${produto.nome}" />
    <h3>${produto.nome}</h3>
    <p><strong>Tamanho:</strong> ${produto.tamanho}</p>
    <p><strong>Cor:</strong> ${produto.cor}</p>
    <p><strong>Quantidade:</strong> ${produto.quantidade}</p>
    <p>${produto.descricao || 'Sem descrição disponível.'}</p>
    <button class="remover-btn" onclick="removerItem(${produto.id})">Remover</button>
  `;

  carrinhoContainer.appendChild(card);
}




function removerItem(id) {
  produtos = produtos.filter(p => p.id !== id);
  localStorage.setItem('carrinho', JSON.stringify(produtos));
  document.getElementById(`produto-${id}`).remove();

  const botao = document.getElementById('botao-pagamento');
  if (produtos.length === 0) {
    carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
    if (botao) botao.remove();
  }
}

function adicionarBotaoFinalizar() {
  const botao = document.createElement('button');
  botao.textContent = 'Confirmar Pagamento de Todos os Itens';
  botao.id = 'botao-pagamento';
  botao.onclick = () => {
    if (produtos.length > 0) {
      const valorTotal = produtos.reduce((soma, p) => soma + (p.preco * p.quantidade), 0);
      localStorage.setItem('valorTotal', valorTotal.toFixed(2));
      window.location.href = '../pagamento/pagamento.html';
    } else {
      alert('Todos os itens foram confirmados para pagamento!');
    }
  };
  document.body.appendChild(botao);
}

