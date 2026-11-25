// Inicialização da página e ligação dos eventos

// Linhas iniciais da tabela
for (var n = 0; n < LINHAS_INICIAIS; n++) {
  adicionarLinha();
}

// Matriz AHP e primeiro cálculo (dispara ranking, PL e Simplex)
montarMatrizAHP();
calcularAHP();

// Eventos
document.getElementById('btnAdicionar').addEventListener('click', adicionarLinha);
document.getElementById('btnSimular').addEventListener('click', simularPesquisa);
document.getElementById('btnLimpar').addEventListener('click', limparSimulacao);
document.getElementById('tabelaDados').addEventListener('input', atualizarNormalizacao);
document.getElementById('tabelaDados').addEventListener('change', atualizarNormalizacao);
tabelaAHP.addEventListener('change', calcularAHP);
document.getElementById('secaoPL').addEventListener('input', atualizarPL);
