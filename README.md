✅ Parte 1: Estrutura Básica HTML (Cabeçalho da Página)
html
Copiar
Editar
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciador de Pedidos de Marmitas Fit</title>
    <style>
        /* Aqui começa o CSS (próxima parte eu explico o CSS) */
    </style>
</head>
<body>
📝 Explicação:
Declara que é um arquivo HTML5.

Define o idioma como português.

Configura o site para ser responsivo em dispositivos móveis.

Dá o título da aba do navegador.

Abre a tag <style> onde está o CSS.

✅ Parte 2: CSS (Estilo da Página)
css
Copiar
Editar
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9fef9;
    color: #333;
}
h1 {
    text-align: center;
    color: #2e7d32;
}
input, select, button {
    margin: 5px 0;
    padding: 8px;
    width: 100%;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}
th, td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}
.success {
    color: green;
}
.btn {
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
}
.btn-edit {
    background-color: #ff9800;
    color: white;
    padding: 5px;
}
.btn-delete {
    background-color: #f44336;
    color: white;
    padding: 5px;
}
📝 Explicação:
Geral: Define layout centralizado com largura máxima de 800px.

Fonte: Usa Arial.

Cores: Tons de verde e neutros (tema "fit/saudável").

Inputs e botões: Largura total e espaçamento.

Tabela: Com bordas simples, preenchimento e alinhamento.

Botões especiais: Cor de destaque para "Editar" e "Excluir".

Classe .success: Cor verde para mensagens de sucesso.

✅ Parte 3: Formulário de Registro de Pedido
html
Copiar
Editar
<h1>Gerenciador de Pedidos de Marmitas Fit</h1>

<div>
    <input type="text" id="cliente" placeholder="Nome do Cliente">
    
    <select id="tipo">
        <option value="Low Carb">Low Carb</option>
        <option value="Vegetariana">Vegetariana</option>
        <option value="Tradicional">Tradicional</option>
    </select>

    <input type="number" id="quantidade" placeholder="Quantidade de marmitas" min="1">

    <label><input type="checkbox" value="Sem glúten" class="restricao"> Sem glúten</label>
    <label><input type="checkbox" value="Sem lactose" class="restricao"> Sem lactose</label>

    <button onclick="salvarPedido()" class="btn">Registrar Pedido</button>
    <p id="feedback"></p>
</div>
📝 Explicação:
Campos de entrada: Nome, Tipo, Quantidade, Restrições.

Select com os 3 tipos de marmita.

Checkboxes para restrições alimentares.

Botão para salvar o pedido (ao clicar chama a função salvarPedido()).

<p id="feedback">: Onde aparece o feedback ("Pedido salvo com sucesso", etc).

✅ Parte 4: Estrutura da Tabela de Exibição dos Pedidos
html
Copiar
Editar
<table id="tabelaPedidos">
    <thead>
        <tr>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Qtde</th>
            <th>Restrições</th>
            <th>Valor Total</th>
            <th>Ações</th>
        </tr>
    </thead>
    <tbody></tbody>
</table>
📝 Explicação:
Tabela para listar os pedidos já cadastrados.

Cabeçalhos com os campos principais.

<tbody> vazio no início, o JavaScript preenche dinamicamente depois.

✅ Parte 5: JavaScript – Carregamento Inicial dos Pedidos
js
Copiar
Editar
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let indexEditando = null;

function atualizarTabela() {
    const tbody = document.querySelector("#tabelaPedidos tbody");
    tbody.innerHTML = "";
    pedidos.forEach((pedido, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${pedido.cliente}</td>
                <td>${pedido.tipo}</td>
                <td>${pedido.quantidade}</td>
                <td>${pedido.restricoes.join(", ")}</td>
                <td>R$${pedido.total.toFixed(2).replace(".", ",")}</td>
                <td>
                    <button onclick="editarPedido(${index})" class="btn-edit">Editar</button>
                    <button onclick="excluirPedido(${index})" class="btn-delete">Excluir</button>
                </td>
            </tr>
        `;
    });
}
📝 Explicação:
Lê os pedidos salvos no LocalStorage.

Cria a tabela listando cada pedido com botões de editar e excluir.

Formata o valor total em formato de moeda.

✅ Parte 6: Cálculo do Total (com desconto e taxa)
js
Copiar
Editar
function calcularTotal(tipo, quantidade, restricoes) {
    let total = quantidade * 25;

    if (tipo === "Vegetariana") total *= 0.9;

    if (restricoes.length > 0) total += restricoes.length * quantidade * 5;

    return total;
}
📝 Explicação:
Cada marmita custa R$25.

Tipo "Vegetariana" tem 10% de desconto.

Cada restrição alimentar adiciona R$5 por marmita.

✅ Parte 7: Função para Salvar Pedido (Criar e Atualizar)
js
Copiar
Editar
function salvarPedido() {
    const cliente = document.getElementById("cliente").value.trim();
    const tipo = document.getElementById("tipo").value;
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const restricoes = Array.from(document.querySelectorAll(".restricao:checked")).map(c => c.value);

    if (!cliente || isNaN(quantidade) || quantidade <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const total = calcularTotal(tipo, quantidade, restricoes);
    const novoPedido = { cliente, tipo, quantidade, restricoes, total };

    if (indexEditando !== null) {
        pedidos[indexEditando] = novoPedido;
        indexEditando = null;
        document.getElementById("feedback").textContent = "Pedido atualizado com sucesso!";
    } else {
        pedidos.push(novoPedido);
        document.getElementById("feedback").textContent = "Pedido salvo com sucesso!";
    }

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    limparFormulario();
    atualizarTabela();
}
📝 Explicação:
Lê os dados do formulário.

Valida se os campos estão preenchidos.

Calcula o total.

Se estiver editando, atualiza o pedido, se não, cria um novo.

Salva no LocalStorage.

Atualiza a tabela e limpa o formulário.

✅ Parte 8: Função Editar Pedido
js
Copiar
Editar
function editarPedido(index) {
    const pedido = pedidos[index];
    document.getElementById("cliente").value = pedido.cliente;
    document.getElementById("tipo").value = pedido.tipo;
    document.getElementById("quantidade").value = pedido.quantidade;

    document.querySelectorAll(".restricao").forEach(cb => {
        cb.checked = pedido.restricoes.includes(cb.value);
    });

    indexEditando = index;
}
📝 Explicação:
Preenche o formulário com os dados do pedido selecionado para edição.

✅ Parte 9: Função Excluir Pedido
js
Copiar
Editar
function excluirPedido(index) {
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    atualizarTabela();
}
📝 Explicação:
Remove o pedido selecionado.

Atualiza o LocalStorage e a tabela.

✅ Parte 10: Limpar Formulário
js
Copiar
Editar
function limparFormulario() {
    document.getElementById("cliente").value = "";
    document.getElementById("tipo").value = "Low Carb";
    document.getElementById("quantidade").value = "";
    document.querySelectorAll(".restricao").forEach(cb => cb.checked = false);
}
📝 Explicação:
Limpa os campos do formulário após salvar.

✅ Parte 11: Carregar Tabela ao Abrir a Página
js
Copiar
Editar
window.onload = atualizarTabela;
📝 Explicação:
Quando a página é aberta, a tabela já é carregada com os pedidos existentes no LocalStorage.

SE CASO PRECISAR MUDAR O TEMA

✅ Parte 1: Título da Página (HTML)
html
Copiar
Editar
<head>
    <title>Gerenciador de Pedidos de Marmitas Fit</title> <!-- 🔴 -->
</head>

<body>
    <h1>Gerenciador de Pedidos de Marmitas Fit</h1> <!-- 🔴 -->
👉 O que mudar:

Mude o nome do sistema para o novo tema.
Exemplo: Se for "Gerenciador de Produtos", troca para:
<title>Gerenciador de Produtos</title>
<h1>Gerenciador de Produtos</h1>

✅ Parte 2: Campos do Formulário
html
Copiar
Editar
<input type="text" id="cliente" placeholder="Nome do Cliente"> <!-- 🔴 -->

<select id="tipo"> <!-- 🔴 -->
    <option value="Low Carb">Low Carb</option> <!-- 🔴 -->
    <option value="Vegetariana">Vegetariana</option> <!-- 🔴 -->
    <option value="Tradicional">Tradicional</option> <!-- 🔴 -->
</select>

<input type="number" id="quantidade" placeholder="Quantidade de marmitas" min="1"> <!-- 🔴 -->

<label><input type="checkbox" value="Sem glúten" class="restricao"> Sem glúten</label> <!-- 🔴 -->
<label><input type="checkbox" value="Sem lactose" class="restricao"> Sem lactose</label> <!-- 🔴 -->

<button onclick="salvarPedido()" class="btn">Registrar Pedido</button> <!-- 🔴 -->
👉 O que mudar:

Nomes dos campos:
Se for outro tema, troque "Nome do Cliente" para "Nome do Produto", "Quantidade de Marmitas" para "Quantidade em Estoque", etc.

Opções do Select:
Troque os tipos de marmitas pelas categorias do novo tema.

Checkboxes:
Troque por características relacionadas ao novo tema (exemplo: "Fragil", "Perecível").

Texto do botão:
Ex: De "Registrar Pedido" para "Cadastrar Produto".

✅ Parte 3: Feedbacks Visuais
html
Copiar
Editar
<p id="feedback"></p>
No JS:

js
Copiar
Editar
document.getElementById("feedback").textContent = "Pedido salvo com sucesso!"; // 🔴
document.getElementById("feedback").textContent = "Pedido atualizado com sucesso!"; // 🔴
👉 O que mudar:

Troque todas as mensagens de feedback para frases relacionadas ao novo tema.
Exemplo: "Produto cadastrado com sucesso!"

✅ Parte 4: Cabeçalho da Tabela (HTML)
html
Copiar
Editar
<table id="tabelaPedidos">
    <thead>
        <tr>
            <th>Cliente</th> <!-- 🔴 -->
            <th>Tipo</th> <!-- 🔴 -->
            <th>Qtde</th> <!-- 🔴 -->
            <th>Restrições</th> <!-- 🔴 -->
            <th>Valor Total</th> <!-- 🔴 -->
            <th>Ações</th>
        </tr>
    </thead>
👉 O que mudar:

Altere os nomes das colunas para refletir o tema novo.
Exemplo:
| Antes | Novo Tema (Produtos) |
|---|---|
| Cliente | Produto |
| Tipo | Categoria |
| Qtde | Quantidade |
| Restrições | Características |
| Valor Total | Preço Total |

✅ Parte 5: Cálculo Total (Função calcularTotal)
js
Copiar
Editar
function calcularTotal(tipo, quantidade, restricoes) {
    let total = quantidade * 25; // 🔴 preço base por unidade

    if (tipo === "Vegetariana") total *= 0.9; // 🔴 regra de desconto

    if (restricoes.length > 0) total += restricoes.length * quantidade * 5; // 🔴 taxa por restrição
    return total;
}
👉 O que mudar:

Troque as regras de preço, descontos e taxas, conforme o cálculo do novo tema.
Exemplo:
Se for estoque de produtos, talvez o cálculo seja só quantidade * precoUnitario, ou se for reservas, pode ter taxa de serviço etc.

✅ Parte 6: Nome das Variáveis (Opcional)
js
Copiar
Editar
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || []; // 🔴
👉 O que mudar:

Se quiser, troque pedidos para algo como produtos, reservas, etc.

Troque também o nome no localStorage.setItem().

✅ Parte 7: Botões da Tabela (Ações)
html
Copiar
Editar
<td>
    <button onclick="editarPedido(${index})" class="btn-edit">Editar</button> <!-- 🔴 -->
    <button onclick="excluirPedido(${index})" class="btn-delete">Excluir</button> <!-- 🔴 -->
</td>
👉 O que mudar:

Se quiser, mude o texto dos botões.
Exemplo: "Editar Produto", "Excluir Produto".

✅ Parte 8: Mensagens de Alerta / Validação de Formulário
js
Copiar
Editar
if (!cliente || isNaN(quantidade) || quantidade <= 0) {
    alert("Preencha todos os campos corretamente!"); // 🔴
    return;
}
👉 O que mudar:

Atualize o texto de alerta para o contexto do novo tema.

✅ Parte 9: Nome das Funções (Opcional)
Exemplo de renomeação:

Função Original	Nova sugestão (se tema for Produtos)
salvarPedido()	salvarProduto()
editarPedido()	editarProduto()
excluirPedido()	excluirProduto()
atualizarTabela()	atualizarTabelaProdutos()

Obs: Isso é só pra melhorar leitura, não é obrigatório.

✅ Conclusão:
👉 Se mudar de tema, você só precisa alterar:
✔️ Textos visíveis para o usuário
✔️ Lógica de cálculo se mudar a regra de negócio
✔️ Nome das variáveis (se quiser)
✔️ Opções de input e rótulos
