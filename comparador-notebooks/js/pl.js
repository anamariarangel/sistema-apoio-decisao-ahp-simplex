// Programação Linear: montagem do modelo e forma padrão

// ===== Programação Linear (montagem do modelo, sem resolver) =====
var rankingAtual = [];

function num(id) {
  var v = parseFloat(document.getElementById(id).value);
  return isNaN(v) ? 0 : v;
}

function fmt(x) {
  return Number(x.toFixed(2)).toLocaleString('pt-BR');
}

function atualizarPL() {
  var modelo = document.getElementById('modeloPL');

  if (rankingAtual.length < 2) {
    document.getElementById('p1').textContent = '0';
    document.getElementById('p2').textContent = '0';
    modelo.innerHTML = '<p>Cadastre pelo menos dois notebooks para montar o modelo de Programação Linear.</p>';
    document.getElementById('simplex').innerHTML = '';
    document.getElementById('diagnostico').innerHTML = '<p>Aguardando o modelo de Programação Linear.</p>';
    return;
  }

  var n1 = rankingAtual[0], n2 = rankingAtual[1];
  var c1 = num('c1'), c2 = num('c2');
  var p1 = n1.preco || 0, p2 = n2.preco || 0;
  var B = num('orcamento');
  var a21 = num('a21'), a22 = num('a22'), L = num('limite');
  var desc = document.getElementById('descLimite').value || 'Limite operacional';

  document.getElementById('p1').textContent = fmt(p1);
  document.getElementById('p2').textContent = fmt(p2);

  var html = '';
  html += '<p><strong>Variáveis de decisão:</strong> X1 = unidades de <strong>' + n1.nome +
    '</strong> (1º colocado); X2 = unidades de <strong>' + n2.nome + '</strong> (2º colocado).</p>';

  html += '<h3>Modelo original</h3><div class="formula">' +
    'Máx Z = ' + fmt(c1) + ' X1 + ' + fmt(c2) + ' X2<br>' +
    'Sujeito a:<br>' +
    '&nbsp;&nbsp;' + fmt(p1) + ' X1 + ' + fmt(p2) + ' X2 ≤ ' + fmt(B) + ' (orçamento)<br>' +
    '&nbsp;&nbsp;' + fmt(a21) + ' X1 + ' + fmt(a22) + ' X2 ≤ ' + fmt(L) + ' (' + desc + ')<br>' +
    '&nbsp;&nbsp;X1, X2 ≥ 0</div>';

  html += '<h3>Forma padrão (com variáveis de folga)</h3><div class="formula">' +
    'Máx Z = ' + fmt(c1) + ' X1 + ' + fmt(c2) + ' X2 + 0 F1 + 0 F2<br>' +
    'Sujeito a:<br>' +
    '&nbsp;&nbsp;' + fmt(p1) + ' X1 + ' + fmt(p2) + ' X2 + 1 F1 + 0 F2 = ' + fmt(B) + '<br>' +
    '&nbsp;&nbsp;' + fmt(a21) + ' X1 + ' + fmt(a22) + ' X2 + 0 F1 + 1 F2 = ' + fmt(L) + '<br>' +
    '&nbsp;&nbsp;X1, X2, F1, F2 ≥ 0</div>';

  html += '<p><strong>F1 (folga do orçamento):</strong> é a sobra de dinheiro, em R$, que não foi gasta na compra dos notebooks. ' +
    'Se F1 = 0, todo o orçamento de R$ ' + fmt(B) + ' foi utilizado.</p>';
  html += '<p><strong>F2 (folga de ' + desc + '):</strong> é a capacidade do limite operacional que ficou sem uso. ' +
    'Se F2 = 0, o limite de ' + fmt(L) + ' foi totalmente consumido.</p>';

  html += '<h3>Matriz de coeficientes das restrições e matriz identidade inicial</h3>' +
    '<table class="matriz"><thead><tr><th></th><th>X1</th><th>X2</th><th>F1</th><th>F2</th><th>b</th></tr></thead><tbody>' +
    '<tr><th>Orçamento</th><td>' + fmt(p1) + '</td><td>' + fmt(p2) + '</td>' +
    '<td class="identidade">1</td><td class="identidade">0</td><td>' + fmt(B) + '</td></tr>' +
    '<tr><th>' + desc + '</th><td>' + fmt(a21) + '</td><td>' + fmt(a22) + '</td>' +
    '<td class="identidade">0</td><td class="identidade">1</td><td>' + fmt(L) + '</td></tr>' +
    '</tbody></table>' +
    '<p class="nota" style="margin-top:8px">As colunas F1 e F2 (em destaque) formam a matriz identidade 2x2 inicial.</p>';

  modelo.innerHTML = html;

  resolverSimplex(
    [c1, c2, 0, 0],
    [[p1, p2, 1, 0], [a21, a22, 0, 1]],
    [B, L],
    ['Orçamento', desc],
    n1.nome, n2.nome
  );
}
