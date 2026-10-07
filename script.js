//
// FASE 1: Modelagem dos Dados (Classe Base com Encapsulamento e Validação)
//
class Produto {
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        if (!nome || nome.trim() === "") {
            throw new Error("O nome não pode ficar em branco!");
        }
        if (preco <= 0 || isNaN(preco)) {
            throw new Error("O preço tem que ser um número maior que zero!");
        }
        if (quantidade <= 0 || isNaN(quantidade)) {
            throw new Error("A quantidade tem que ser um número maior que zero!");
        }

        this.nome = nome.trim();
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    // Método que calcula o subtotal do produto
    calcularSubtotal() {
        return this.#preco * this.#quantidade;
    }
}

//
// FASE 2: Gerenciamento de Estado (Memória)
//
const listaDeProdutos = [];

//
// FASE 2.1: Persistência com localStorage
//
const CHAVE_STORAGE = "sistema_estoque_produtos";

// 1. Função para SALVAR os dados no navegador
function salvarNoLocalStorage() {
    // Mapeamos os objetos para garantir que os valores privados sejam salvos corretamente
    const dadosParaSalvar = listaDeProdutos.map(prod => ({
        nome: prod.nome,
        preco: prod.preco,
        quantidade: prod.quantidade
    }));
    
    const listaEmTexto = JSON.stringify(dadosParaSalvar);
    localStorage.setItem(CHAVE_STORAGE, listaEmTexto);
}

// 2. Função para CARREGAR os dados salvos quando a página abrir
function carregarDoLocalStorage() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        try {
            const produtosObjetos = JSON.parse(dadosSalvos);

            // Reinstancia cada produto como uma instância de Produto
            produtosObjetos.forEach((prod) => {
                const produtoInstanciado = new Produto(prod.nome, prod.preco, prod.quantidade);
                listaDeProdutos.push(produtoInstanciado);
            });
        } catch (erro) {
            console.error("Erro ao carregar dados do localStorage:", erro);
        }
    }
}

//
// FASE 3: Captura de Elementos do DOM
//
const formProduto = document.getElementById("produto-form");
const btnLimparTudo = document.getElementById("limpar-tabela");
const totalEstoqueEl = document.getElementById("total-estoque");

//
// FASE 4: Escuta de Eventos
//

// 1. Adicionar Produto pelo Formulário
formProduto.addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    try {
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);
        listaDeProdutos.push(novoProduto);

        // Salva no localStorage e atualiza a interface
        salvarNoLocalStorage();
        atualizarInterface();
        
        formProduto.reset();
    } catch (erro) {
        alert(erro.message);
    }
});

// 2. Limpar toda a tabela
btnLimparTudo.addEventListener("click", function () {
    if (listaDeProdutos.length === 0) {
        alert("A tabela já está vazia!");
        return;
    }

    if (confirm("Tem certeza que deseja remover todos os produtos?")) {
        listaDeProdutos.length = 0;

        // Remove a chave do localStorage
        localStorage.removeItem(CHAVE_STORAGE);

        atualizarInterface();
    }
});

//
// FASE 5: Funções de Atualização e Renderização da Interface
//

// Função responsável por remover um único produto pelo índice
function removerProduto(index) {
    listaDeProdutos.splice(index, 1);

    // Salva a nova lista (sem o item removido) no localStorage
    salvarNoLocalStorage();

    atualizarInterface();
}

// Função responsável por calcular e renderizar o total geral em estoque
function atualizarTotalEstoque() {
    const total = listaDeProdutos.reduce((acc, produto) => {
        return acc + produto.calcularSubtotal();
    }, 0);

    totalEstoqueEl.textContent = `Total em Estoque: R$ ${total.toFixed(2)}`;
}

// Função responsável por re-desenhar a tabela
function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    tabelaBody.innerHTML = "";

    listaDeProdutos.forEach((produto, index) => {
        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover">Remover</button>
            </td>
        `;

        const btnRemover = linha.querySelector(".btn-remover");
        btnRemover.addEventListener("click", () => removerProduto(index));

        tabelaBody.appendChild(linha);
    });
}

// Função principal que sincroniza a tela com os dados
function atualizarInterface() {
    renderizarTabela();
    atualizarTotalEstoque();
}

//
// FASE 6: Inicialização da Aplicação
//
carregarDoLocalStorage();
atualizarInterface();