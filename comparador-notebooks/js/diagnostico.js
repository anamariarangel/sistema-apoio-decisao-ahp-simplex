// Diagnóstico gerencial a partir do quadro ótimo do Simplex

function gerarDiagnostico(status, base, b, C, nomesRestr, nome1, nome2) {
  var diag = document.getElementById('diagnostico');

  if (status === 'ilimitado') {
    diag.innerHTML = '<p>O modelo é ilimitado: revise as restrições, pois nenhuma delas limita a variável que entra na base.</p>';
    return;
  }
  if (status === 'limite') {
    diag.innerHTML = '<p>O Simplex atingiu o limite de iterações sem chegar ao ótimo. Revise os parâmetros.</p>';
    return;
  }

  var valores = [0, 0, 0, 0];
  base.forEach(function (v, i) { valores[v] = b[i]; });
  var zOtimo = C[0] * valores[0] + C[1] * valores[1];

  var d = '<p><strong>Adquirir ' + f3(valores[0]) + ' unidade(s)</strong> de <strong>' + nome1 + '</strong> (1º colocado, X1).</p>' +
    '<p><strong>Adquirir ' + f3(valores[1]) + ' unidade(s)</strong> de <strong>' + nome2 + '</strong> (2º colocado, X2).</p>' +
    '<p><strong>Valor ótimo máximo de Z:</strong> ' + f3(zOtimo) + '.</p>';

  [0, 1].forEach(function (k) {
    var folga = valores[2 + k];
    if (Math.abs(folga) < 1e-6) {
      d += '<p><strong>' + nomesRestr[k] + ':</strong> totalmente esgotado (F' + (k + 1) + ' = 0) – é um gargalo da decisão.</p>';
    } else {
      d += '<p><strong>' + nomesRestr[k] + ':</strong> houve sobra de ' + f3(folga) + ' (F' + (k + 1) + ' > 0) – recurso não utilizado por completo.</p>';
    }
  });

  if (Math.abs(valores[0] - Math.round(valores[0])) > 1e-6 || Math.abs(valores[1] - Math.round(valores[1])) > 1e-6) {
    d += '<p class="nota">Observação: o Simplex trabalha com valores contínuos; quantidades fracionárias devem ser arredondadas para baixo na compra real, para não violar as restrições.</p>';
  }

  diag.innerHTML = d;
}
