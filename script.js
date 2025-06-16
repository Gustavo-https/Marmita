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

        function calcularTotal(tipo, quantidade, restricoes) {
            let total = quantidade * 25;
            if (tipo === "Vegetariana") total *= 0.9;
            if (restricoes.length > 0) total += restricoes.length * quantidade * 5;
            return total;
        }

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

        function excluirPedido(index) {
            pedidos.splice(index, 1);
            localStorage.setItem("pedidos", JSON.stringify(pedidos));
            atualizarTabela();
        }

        function limparFormulario() {
            document.getElementById("cliente").value = "";
            document.getElementById("tipo").value = "Low Carb";
            document.getElementById("quantidade").value = "";
            document.querySelectorAll(".restricao").forEach(cb => cb.checked = false);
        }

        window.onload = atualizarTabela;