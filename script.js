//
// FASE 1: modelagem dos dados (Classe Base)
//
class Produto {
    // Novo: Desafio 1
    #preco;
    #quantidade;

    constructor(nome, preco, quantidade) {
        // Novo: Desafio 1 
        if (nome == "") {
            throw new Error("O nome não pode ficar em branco!");
        }
        if (preco <= 0) {
            throw new Error("O preço tem que ser maior que zero!");
        }
        if (quantidade <= 0) {
            throw new Error("A quantidade tem que ser maior que zero!");
        }

        this.nome = nome;
        this.#preco = parseFloat(preco);
        this.#quantidade = parseInt(quantidade);
    }

    // Novo: Desafio 1 
    get preco() {
        return this.#preco;
    }

    get quantidade() {
        return this.#quantidade;
    }

    calcularSubtotal() {
        // Novo
        return this.#preco * this.#quantidade;
    }
}

//
// FASE 2: Gerenciamento de Estado (memória)
//
const listaDeProdutos = [];

//FASE 2.1 Persistencia com localStorage
//definir uma constante para evitar erros de digitação ao usarmos a chave do localStorage

const CHAVE_STORAGE = "sistema_estoque_produto";

//1. funçao para Salvar os dados no navegador

function salvarNoLocalStorage(){
    const listaEmTexto = JSON.stringify(listaDeProdutos);
    localStorage.setItem(CHAVE_STORAGE, listaEmTexto);
}

//
// FASE 3: Escuta de Eventos do DOM
//
const formProduto = document.getElementById("produto-form");

formProduto.addEventListener("submit", function(event){
    event.preventDefault();

    const nomeInput = document.getElementById("nome").value;
    const precoInput = document.getElementById("preco").value;
    const quantidadeInput = document.getElementById("quantidade").value;

    // Novo: Desafio 1
    try {
        const novoProduto = new Produto(nomeInput, precoInput, quantidadeInput);
        listaDeProdutos.push(novoProduto);

        renderizarTabela();
        atualizarTotalEstoque(); // Novo: Desafio 2 
        formProduto.reset();
    } catch (erro) {
        alert(erro.message); 
    }
});

// Novo: Desafio 3 
document.getElementById("limpar-tabela").addEventListener("click", function() {
    listaDeProdutos.length = 0; 
    renderizarTabela(); 
    atualizarTotalEstoque(); 
});


//
// FASE 4: Renderização da Interface DOM
//
function renderizarTabela() {
    const tabelaBody = document.querySelector("#tabela-produtos tbody");
    tabelaBody.innerHTML = "";

    // Novo:
    listaDeProdutos.forEach(function(produto, index) {
        const linha = document.createElement("tr");

        // Novo: Desafio 3
        linha.innerHTML = `
            <td>${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${produto.calcularSubtotal().toFixed(2)}</td>
            <td>
                <button class="btn-remover" onclick="removerProduto(${index})">Remover</button>
            </td>
        `;

        tabelaBody.appendChild(linha);
    });
}

//

// Novo: Desafio 2 
function atualizarTotalEstoque() {
    const total = listaDeProdutos.reduce(function(acumulador, produto) {
        return acumulador + produto.calcularSubtotal();
    }, 0); 

    document.getElementById("total-estoque").innerText = "Total em Estoque: R$ " + total.toFixed(2);
}

// Novo: Desafio 3 
function removerProduto(index) {
   
    listaDeProdutos.splice(index, 1);
    
    
    renderizarTabela();
    atualizarTotalEstoque();
}

//
// FASE 5: Funções de Atualização e Renderização da Interface
//

// Função responsável por remover um único produto pelo índice
function removerProduto(index) {
    listaDeProdutos.splice(index, 1);

    // 🆕 Salva a nova lista (sem o item removido) no localStorage
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
// 🆕 FASE 6: Inicialização da Aplicação
//
// Ao carregar o script pela primeira vez, restaura os dados do localStorage
// e atualiza a interface gráfica.
carregarDoLocalStorage();
atualizarInterface();