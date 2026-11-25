// Tabela de notebooks: constantes e criação de linhas editáveis

var LINHAS_INICIAIS = 6;
var TOTAL_CRITERIOS = 5;
var corpo = document.getElementById('corpoTabela');

function adicionarLinha() {
  var tr = document.createElement('tr');

  var tdNome = document.createElement('td');
  var inputNome = document.createElement('input');
  inputNome.type = 'text';
  inputNome.placeholder = 'Nome do modelo';
  tdNome.appendChild(inputNome);
  tr.appendChild(tdNome);

  for (var i = 0; i < TOTAL_CRITERIOS; i++) {
    var td = document.createElement('td');
    var input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    td.appendChild(input);
    tr.appendChild(td);
  }

  corpo.appendChild(tr);
  atualizarNormalizacao();
}
