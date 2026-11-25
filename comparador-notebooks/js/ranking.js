// Ranking final (soma ponderada) e parecer executivo

// ===== Ranking final (soma ponderada) =====
var dadosNormalizados = [];
var pesosAHP = null;

function formatar(num, casas) {
  return num.toFixed(casas).replace('.', ',');
}

function calcularRanking() {
  if (!pesosAHP) return; // pesos ainda não calculados na carga inicial

  var ranking = dadosNormalizados.map(function (d) {
    var pontuacao = 0;
    for (var c = 0; c < TOTAL_CRITERIOS; c++) pontuacao += pesosAHP[c] * d.n[c];
    return { nome: d.nome, n: d.n, preco: d.preco, pontuacao: pontuacao };
  });
  ranking.sort(function (a, b) { return b.pontuacao - a.pontuacao; });

  var corpoRanking = document.getElementById('corpoRanking');
  corpoRanking.innerHTML = '';
  ranking.forEach(function (r, i) {
    corpoRanking.innerHTML += '<tr><td>' + (i + 1) + 'º</td><td>' + r.nome +
      '</td><td>' + r.pontuacao.toFixed(4) + '</td></tr>';
  });

  gerarParecer(ranking);
  rankingAtual = ranking;
  atualizarPL();
}


function gerarParecer(ranking) {
  var parecer = document.getElementById('parecer');
  if (ranking.length === 0) {
    parecer.innerHTML = '<p>Cadastre os dados dos notebooks para gerar o parecer.</p>';
    return;
  }

  var v = ranking[0];
  var html = '<p><strong>Recomendação:</strong> o notebook <strong>' + v.nome +
    '</strong> ficou em 1º lugar, com pontuação final de ' + formatar(v.pontuacao, 4) + '.</p>';

  if (ranking.length > 1) {
    var dif = v.pontuacao - ranking[1].pontuacao;
    if (dif < 0.00005) {
      html += '<p><strong>Diferença para o 2º colocado:</strong> empate com <strong>' +
        ranking[1].nome + '</strong> (' + formatar(ranking[1].pontuacao, 4) + ').</p>';
    } else {
      html += '<p><strong>Diferença para o 2º colocado:</strong> ' + formatar(dif, 4) +
        ' ponto(s) à frente de <strong>' + ranking[1].nome + '</strong> (' +
        formatar(ranking[1].pontuacao, 4) + ').</p>';
    }
  }

  // A favor: critérios com maior contribuição (peso × valor normalizado)
  // Contra: critérios com maior perda (peso × (1 − valor normalizado))
  var criterios = CRITERIOS.map(function (nome, c) {
    return { nome: nome, ganho: pesosAHP[c] * v.n[c], perda: pesosAHP[c] * (1 - v.n[c]) };
  });

  var aFavor = criterios.filter(function (c) { return c.ganho > 0; })
    .sort(function (a, b) { return b.ganho - a.ganho; }).slice(0, 2);
  var contra = criterios.filter(function (c) { return c.perda > 0; })
    .sort(function (a, b) { return b.perda - a.perda; }).slice(0, 2);

  html += '<p><strong>Critérios que mais pesaram a favor:</strong> ' +
    (aFavor.length ? aFavor.map(function (c) {
      return c.nome + ' (+' + formatar(c.ganho, 4) + ')';
    }).join('; ') : 'nenhum') + '.</p>';

  html += '<p><strong>Critérios que mais pesaram contra:</strong> ' +
    (contra.length ? contra.map(function (c) {
      return c.nome + ' (−' + formatar(c.perda, 4) + ' em relação ao máximo possível)';
    }).join('; ') : 'nenhum') + '.</p>';

  parecer.innerHTML = html;
}
