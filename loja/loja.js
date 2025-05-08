// Ao clicar "Adicionar no carrinho"
document.querySelectorAll('.add-button').forEach((button, index) => {
  button.addEventListener('click', () => {
    const card = button.closest('.card');
    const nome = card.querySelector('h3')?.innerText || `Tênis ${index + 1}`;
    const preco = parseFloat(card.querySelector('.price').innerText.replace('R$', '').replace(',', '.'));
    const img = card.querySelector('img').getAttribute('src');
    const descricao = Array.from(card.querySelectorAll('.features p')).map(p => p.innerText).join(', ');

    const tamanho = card.querySelector('.tamanho-select')?.value || '41';
    const cor = card.querySelector('.cor-select')?.value || 'Preto';
    const quantidade = parseInt(card.querySelector('.quantidade-input')?.value) || 1;

    const item = {
      id: index + 1,
      nome,
      preco,
      img,
      descricao,
      tamanho,
      cor,
      quantidade
    };

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const existente = carrinho.find(p =>
      p.id === item.id && p.tamanho === item.tamanho && p.cor === item.cor
    );

    let mensagem = '';

    if (existente) {
      existente.quantidade += item.quantidade;
      mensagem = `${item.nome} (+${item.quantidade} und.) já está no carrinho.`;
    } else {
      carrinho.push(item);
      mensagem = `${item.nome} (${item.quantidade} und.) foi adicionado ao carrinho.`;
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);
    alert(`${mensagem}\nTotal de itens: ${totalItens}`);
  });
});

