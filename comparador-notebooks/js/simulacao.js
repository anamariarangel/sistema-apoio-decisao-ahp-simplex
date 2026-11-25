// Simulação de pesquisa: preenche/limpa a tabela com modelos de exemplo

// [modelo, preço R$, RAM GB, SSD GB, bateria h, CPU pts]
var MODELOS = [
  ['Apple MacBook Air M2', 7499, 8, 256, 15, 15800],
  ['Apple MacBook Air M3', 9299, 16, 512, 16, 19200],
  ['Apple MacBook Pro 14" M3 Pro', 15999, 18, 512, 14, 26500],
  ['Dell Inspiron 15 (Core i5-1235U)', 3299, 8, 256, 6, 13400],
  ['Dell Inspiron 15 (Core i7-1355U)', 4699, 16, 512, 7, 15100],
  ['Dell Latitude 3440 (Core i5)', 5199, 16, 512, 9, 14800],
  ['Dell XPS 13 (Core Ultra 7)', 11499, 16, 512, 12, 21300],
  ['Lenovo IdeaPad Slim 3 (Ryzen 7 7730U)', 3499, 16, 512, 8, 18400],
  ['Lenovo ThinkPad E14 Gen 5 (Core i7)', 6299, 16, 512, 10, 16900],
  ['Lenovo ThinkPad T14 Gen 4 (Ryzen 7 Pro)', 8799, 32, 1024, 11, 23100],
  ['ASUS Vivobook 15 (Core i5-12450H)', 3199, 8, 512, 6, 17200],
  ['ASUS Zenbook 14 OLED (Core Ultra 7)', 7899, 16, 1024, 13, 21000],
  ['Acer Aspire 5 (Core i5-12450H)', 2999, 8, 256, 6, 17100],
  ['Acer Swift Go 14 (Core Ultra 5)', 5499, 16, 512, 11, 18900],
  ['Samsung Galaxy Book4 Pro (Core Ultra 7)', 8499, 16, 512, 13, 21200]
];

function simularPesquisa() {
  // Embaralha uma cópia da lista e sorteia de 6 a 10 modelos
  var lista = MODELOS.slice();
  for (var i = lista.length - 1; i > 0; i--) {
    var k = Math.floor(Math.random() * (i + 1));
    var tmp = lista[i]; lista[i] = lista[k]; lista[k] = tmp;
  }
  var qtd = LINHAS_INICIAIS + Math.floor(Math.random() * 5);

  corpo.innerHTML = '';
  for (var n = 0; n < qtd; n++) {
    adicionarLinha();
    var tr = corpo.lastElementChild;
    var m = lista[n];
    tr.querySelector('input[type="text"]').value = m[0];
    tr.querySelectorAll('input[type="number"]').forEach(function (inp, c) {
      inp.value = m[c + 1];
    });
  }
  atualizarNormalizacao();
}

function limparSimulacao() {
  // Restaura unidades e tipos dos critérios aos valores iniciais
  document.querySelectorAll('#tabelaDados thead input').forEach(function (inp) {
    inp.value = inp.defaultValue;
  });
  document.querySelectorAll('#tabelaDados .tipo').forEach(function (sel) {
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].defaultSelected) sel.selectedIndex = i;
    }
  });

  // Volta às 6 linhas vazias
  corpo.innerHTML = '';
  for (var n = 0; n < LINHAS_INICIAIS; n++) adicionarLinha();
  atualizarNormalizacao();
}
