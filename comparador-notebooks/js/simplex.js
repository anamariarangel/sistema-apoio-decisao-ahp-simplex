// Método Simplex Tabular: quadros, razão mínima e pivoteamento

// ===== Método Simplex Tabular =====
var NOMES_VAR = ['X1', 'X2', 'F1', 'F2'];

function f3(x) {
  if (Math.abs(x) < 1e-9) x = 0;
  return Number(x.toFixed(3)).toLocaleString('pt-BR');
}

// Desenha um quadro; destaca coluna que entra, linha que sai e pivô
function desenharQuadro(titulo, C, A, b, base, cz, z, entra, razoes, sai) {
  var h = '<div class="quadro"><h3>' + titulo + '</h3><div class="tabela-wrap" style="display:inline-block"><table>';
  h += '<tr><th></th><th>Cj</th>';
  C.forEach(function (c) { h += '<th>' + f3(c) + '</th>'; });
  h += '<th></th>' + (razoes ? '<th></th>' : '') + '</tr>';
  h += '<tr><th>Cb</th><th>Base</th>';
  NOMES_VAR.forEach(function (n, j) { h += '<th' + (j === entra ? ' class="entra"' : '') + '>' + n + '</th>'; });
  h += '<th>b</th>' + (razoes ? '<th>Razão b / a</th>' : '') + '</tr>';

  for (var i = 0; i < A.length; i++) {
    var classeLinha = i === sai ? ' class="sai"' : '';
    h += '<tr' + classeLinha + '><td>' + f3(C[base[i]]) + '</td><th>' + NOMES_VAR[base[i]] + '</th>';
    for (var j = 0; j < A[i].length; j++) {
      var cls = (i === sai && j === entra) ? ' class="pivo"' : (j === entra ? ' class="entra"' : '');
      h += '<td' + cls + '>' + f3(A[i][j]) + '</td>';
    }
    h += '<td>' + f3(b[i]) + '</td>';
    if (razoes) h += '<td>' + (razoes[i] === null ? '—' : f3(razoes[i])) + '</td>';
    h += '</tr>';
  }

  // Linha Zj
  h += '<tr><th></th><th>Zj</th>';
  for (var j = 0; j < C.length; j++) {
    var zj = 0;
    for (var i = 0; i < A.length; i++) zj += C[base[i]] * A[i][j];
    h += '<td>' + f3(zj) + '</td>';
  }
  h += '<td>Z = ' + f3(z) + '</td>' + (razoes ? '<td></td>' : '') + '</tr>';

  // Linha Cj − Zj
  h += '<tr class="cz"><th></th><th>Cj − Zj</th>';
  cz.forEach(function (v, j) { h += '<td' + (j === entra ? ' class="entra"' : '') + '>' + f3(v) + '</td>'; });
  h += '<td></td>' + (razoes ? '<td></td>' : '') + '</tr>';
  return h + '</table></div>';
}

function resolverSimplex(C, Aorig, borig, nomesRestr, nome1, nome2) {
  var saida = document.getElementById('simplex');
  var diag = document.getElementById('diagnostico');

  if (borig[0] < 0 || borig[1] < 0) {
    saida.innerHTML = '<div class="parecer"><p>Os valores do lado direito (orçamento e limite) precisam ser maiores ou iguais a zero para iniciar o Simplex com as folgas na base.</p></div>';
    diag.innerHTML = '<p>Não foi possível resolver o modelo com os parâmetros atuais.</p>';
    return;
  }

  // Cópias para não alterar os dados originais
  var A = Aorig.map(function (l) { return l.slice(); });
  var b = borig.slice();
  var base = [2, 3]; // F1 e F2 na base inicial
  var html = '';
  var status = 'otimo';

  for (var it = 0; it <= 20; it++) {
    // Calcula Zj e Cj − Zj
    var cz = [], z = 0;
    for (var j = 0; j < C.length; j++) {
      var zj = 0;
      for (var i = 0; i < A.length; i++) zj += C[base[i]] * A[i][j];
      cz.push(C[j] - zj);
    }
    for (var i = 0; i < A.length; i++) z += C[base[i]] * b[i];

    var titulo = it === 0 ? 'Quadro inicial' : 'Quadro ' + it;

    // Coluna que entra: maior Cj − Zj positivo
    var entra = -1, maior = 1e-9;
    cz.forEach(function (v, j) { if (v > maior) { maior = v; entra = j; } });

    if (entra === -1) {
      html += desenharQuadro(titulo + ' – ótimo', C, A, b, base, cz, z, -1, null, -1);
      html += '<p class="nota">Todos os valores de Cj − Zj são menores ou iguais a zero: solução ótima encontrada.</p></div>';
      break;
    }

    // Teste da razão mínima
    var razoes = [], sai = -1, menor = Infinity;
    for (var i = 0; i < A.length; i++) {
      if (A[i][entra] > 1e-9) {
        razoes.push(b[i] / A[i][entra]);
        if (razoes[i] < menor) { menor = razoes[i]; sai = i; }
      } else {
        razoes.push(null);
      }
    }

    html += desenharQuadro(titulo, C, A, b, base, cz, z, entra, razoes, sai);

    if (sai === -1) {
      html += '<p class="nota">Nenhum coeficiente positivo na coluna de ' + NOMES_VAR[entra] +
        ': a solução é ilimitada (Z pode crescer sem limite).</p></div>';
      status = 'ilimitado';
      break;
    }

    var pivo = A[sai][entra];
    var passos = '<ul class="passos">' +
      '<li><strong>Entra na base:</strong> ' + NOMES_VAR[entra] + ' (maior Cj − Zj = ' + f3(cz[entra]) + ').</li>' +
      '<li><strong>Sai da base:</strong> ' + NOMES_VAR[base[sai]] + ' (menor razão = ' + f3(menor) + ').</li>' +
      '<li><strong>Pivô:</strong> ' + f3(pivo) + '.</li>' +
      '<li>Nova linha L' + (sai + 1) + ' = L' + (sai + 1) + ' ÷ ' + f3(pivo) + '.</li>';

    // Pivoteamento de Gauss-Jordan
    for (var j = 0; j < A[sai].length; j++) A[sai][j] = A[sai][j] / pivo;
    b[sai] = b[sai] / pivo;

    for (var i = 0; i < A.length; i++) {
      if (i === sai) continue;
      var fator = A[i][entra];
      for (var j = 0; j < A[i].length; j++) A[i][j] = A[i][j] - fator * A[sai][j];
      b[i] = b[i] - fator * b[sai];
      passos += '<li>Nova linha L' + (i + 1) + ' = L' + (i + 1) + ' − (' + f3(fator) + ') × nova L' + (sai + 1) + '.</li>';
    }
    base[sai] = entra;
    html += passos + '</ul></div>';

    if (it === 20) status = 'limite';
  }

  saida.innerHTML = html;
  gerarDiagnostico(status, base, b, C, nomesRestr, nome1, nome2);
}
