// AHP de Saaty: matriz par a par, pesos, λmáx, IC e RC

// ===== AHP de Saaty =====
var CRITERIOS = ['Preço', 'Memória RAM', 'Armazenamento SSD', 'Autonomia de Bateria', 'Processamento/CPU'];
var IR = 1.12; // índice randômico para n = 5
var tabelaAHP = document.getElementById('tabelaAHP');

// Escala de Saaty: 9 ... 1 ... 1/9 (valor decimal + rótulo)
var ESCALA = [];
for (var v = 9; v >= 1; v--) ESCALA.push({ valor: v, rotulo: String(v) });
for (var d = 2; d <= 9; d++) ESCALA.push({ valor: 1 / d, rotulo: '1/' + d });

function montarMatrizAHP() {
  var html = '<thead><tr><th></th>';
  CRITERIOS.forEach(function (c) { html += '<th>' + c + '</th>'; });
  html += '</tr></thead><tbody>';

  for (var i = 0; i < CRITERIOS.length; i++) {
    html += '<tr><th>' + CRITERIOS[i] + '</th>';
    for (var j = 0; j < CRITERIOS.length; j++) {
      if (i === j) {
        html += '<td>1</td>';
      } else if (j > i) {
        html += '<td><select class="julgamento" data-i="' + i + '" data-j="' + j + '">';
        ESCALA.forEach(function (e) {
          html += '<option value="' + e.valor + '"' + (e.valor === 1 ? ' selected' : '') + '>' + e.rotulo + '</option>';
        });
        html += '</select></td>';
      } else {
        html += '<td id="rec-' + i + '-' + j + '">1.000</td>';
      }
    }
    html += '</tr>';
  }
  tabelaAHP.innerHTML = html + '</tbody>';
}

function calcularAHP() {
  var n = CRITERIOS.length;

  // Monta a matriz com 1 na diagonal e recíprocas abaixo dela
  var A = [];
  for (var i = 0; i < n; i++) {
    A.push([]);
    for (var j = 0; j < n; j++) A[i].push(1);
  }
  tabelaAHP.querySelectorAll('.julgamento').forEach(function (sel) {
    var i = +sel.dataset.i, j = +sel.dataset.j;
    var valor = parseFloat(sel.value);
    A[i][j] = valor;
    A[j][i] = 1 / valor;
    document.getElementById('rec-' + j + '-' + i).textContent = (1 / valor).toFixed(3);
  });

  // Soma de cada coluna
  var somaColunas = [];
  for (var j = 0; j < n; j++) {
    var s = 0;
    for (var i = 0; i < n; i++) s += A[i][j];
    somaColunas.push(s);
  }

  // Pesos: média das linhas da matriz normalizada pelas colunas
  var pesos = [];
  for (var i = 0; i < n; i++) {
    var soma = 0;
    for (var j = 0; j < n; j++) soma += A[i][j] / somaColunas[j];
    pesos.push(soma / n);
  }

  // Lambda máximo: média de (A·w)i / wi
  var lambda = 0;
  for (var i = 0; i < n; i++) {
    var aw = 0;
    for (var j = 0; j < n; j++) aw += A[i][j] * pesos[j];
    lambda += aw / pesos[i];
  }
  lambda = lambda / n;

  var IC = (lambda - n) / (n - 1);
  var RC = IC / IR;

  // Exibe os pesos
  var corpoPesos = document.getElementById('corpoPesos');
  corpoPesos.innerHTML = '';
  var total = 0;
  pesos.forEach(function (p, i) {
    total += p;
    corpoPesos.innerHTML += '<tr><td>' + CRITERIOS[i] + '</td><td>' + p.toFixed(4) + '</td></tr>';
  });
  corpoPesos.innerHTML += '<tr><th>Soma</th><th>' + total.toFixed(4) + '</th></tr>';

  // Exibe os indicadores de consistência
  var consistente = RC < 0.10;
  document.getElementById('corpoConsistencia').innerHTML =
    '<tr><th>λ máximo</th><td>' + lambda.toFixed(4) + '</td></tr>' +
    '<tr><th>IC</th><td>' + IC.toFixed(4) + '</td></tr>' +
    '<tr><th>IR</th><td>' + IR.toFixed(2) + '</td></tr>' +
    '<tr><th>RC</th><td>' + RC.toFixed(4) + '</td></tr>' +
    '<tr><th>Resultado</th><td class="' + (consistente ? 'ok' : 'erro') + '">' +
    (consistente ? 'Consistente (RC < 0,10)' : 'Inconsistente (RC ≥ 0,10) – revise os julgamentos') +
    '</td></tr>';

  pesosAHP = pesos;
  calcularRanking();
}
