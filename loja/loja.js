// Ao clicar em qualquer botão "Adicionar no carrinho"
document.querySelectorAll('.add-button').forEach((button, index) => {
  // Para cada botão encontrado, adiciona um evento de clique
  button.addEventListener('click', () => {

    // Encontra o card (produto) mais próximo do botão clicado
    const card = button.closest('.card');

    // Pega o nome do produto (de um <h3> que não está no HTML atual, então usa Tênis X como fallback)
    const nome = card.querySelector('h3')?.innerText || `Tênis ${index + 1}`;

    // Pega o preço do produto, remove "R$" e troca vírgula por ponto para converter em número
    const preco = parseFloat(
      card.querySelector('.price').innerText.replace('R$', '').replace(',', '.')
    );

    // Pega o caminho da imagem do tênis
    const img = card.querySelector('img').getAttribute('src');

    // Junta todas as características (p dentro de .features) separadas por vírgula
    const descricao = Array.from(card.querySelectorAll('.features p'))
      .map(p => p.innerText)
      .join(', ');

    // Pega o valor selecionado no campo de tamanho (ou 41 por padrão)
    const tamanho = card.querySelector('.tamanho-select')?.value || '41';

    // Pega a cor selecionada (ou Preto por padrão)
    const cor = card.querySelector('.cor-select')?.value || 'Preto';

    // Pega a quantidade informada (converte para número inteiro), ou 1 por padrão
    const quantidade = parseInt(card.querySelector('.quantidade-input')?.value) || 1;

    // Monta um objeto com os dados do item escolhido
    const item = {
      id: index + 1, // usa o índice do botão para definir o ID do produto
      nome,
      preco,
      img,
      descricao,
      tamanho,
      cor,
      quantidade
    };

    // Tenta recuperar o carrinho salvo no localStorage (ou começa com array vazio)
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    // Verifica se esse produto (mesmo id, tamanho e cor) já está no carrinho
    const existente = carrinho.find(p =>
      p.id === item.id && p.tamanho === item.tamanho && p.cor === item.cor
    );

    let mensagem = ''; // variável que vai guardar a mensagem a exibir no alerta

    if (existente) {
      // Se já existe no carrinho, só aumenta a quantidade
      existente.quantidade += item.quantidade;
      mensagem = `${item.nome} (+${item.quantidade} und.) já está no carrinho.`;
    } else {
      // Se é um novo item, adiciona ao carrinho
      carrinho.push(item);
      mensagem = `${item.nome} (${item.quantidade} und.) foi adicionado ao carrinho.`;
    }

    // Salva o carrinho atualizado no localStorage (transforma em string JSON)
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    // Calcula o total de itens no carrinho somando as quantidades
    const totalItens = carrinho.reduce((sum, p) => sum + p.quantidade, 0);

    // Mostra um alerta com a mensagem de confirmação + total de itens no carrinho
    alert(`${mensagem}\nTotal de itens: ${totalItens}`);
  });
});
