// Normalização Min-Max (0 a 1) dos 5 critérios

function atualizarNormalizacao() {
  var tipos = document.querySelectorAll('#tabelaDados .tipo');
  var linhas = corpo.querySelectorAll('tr');
  var corpoNorm = document.getElementById('corpoNormalizado');

  // Lê os valores numéricos de cada linha (null quando vazio)
  var valores = [];
  linhas.forEach(function (tr) {
    var nums = tr.querySelectorAll('input[type="number"]');
    var linha = [];
    nums.forEach(function (inp) {
      linha.push(inp.value === '' ? null : parseFloat(inp.value));
    });
    valores.push(linha);
  });

  // Mínimo e máximo de cada critério
  var minimos = [], maximos = [];
  for (var c = 0; c < TOTAL_CRITERIOS; c++) {
    var coluna = valores.map(function (l) { return l[c]; })
                        .filter(function (v) { return v !== null; });
    minimos.push(coluna.length ? Math.min.apply(null, coluna) : null);
    maximos.push(coluna.length ? Math.max.apply(null, coluna) : null);
  }

  corpoNorm.innerHTML = '';
  dadosNormalizados = [];
  linhas.forEach(function (tr, i) {
    var nova = document.createElement('tr');
    var tdNome = document.createElement('td');
    var nome = tr.querySelector('input[type="text"]').value || '(sem nome)';
    tdNome.textContent = nome;
    nova.appendChild(tdNome);

    var linhaNorm = [];
    var temValor = false;
    for (var c = 0; c < TOTAL_CRITERIOS; c++) {
      var td = document.createElement('td');
      var x = valores[i][c];
      var min = minimos[c], max = maximos[c];

      if (x === null) {
        td.textContent = '–';
        linhaNorm.push(0);
      } else {
        temValor = true;
        var n;
        if (max === min) {
          n = 0;
        } else if (tipos[c].value === 'custo') {
          n = (max - x) / (max - min);
        } else {
          n = (x - min) / (max - min);
        }
        td.textContent = n.toFixed(3);
        linhaNorm.push(n);
      }
      nova.appendChild(td);
    }
    corpoNorm.appendChild(nova);

    // Guarda para o ranking apenas notebooks com algum valor preenchido
    if (temValor) dadosNormalizados.push({ nome: nome, n: linhaNorm, preco: valores[i][0] });
  });

  calcularRanking();
}
