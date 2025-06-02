const clientes = JSON.parse(localStorage.getItem('clientesCRM')) || [];
let paginaAtual = 1;
const clientesPorPagina = 10;

const clientesBody = document.getElementById('clientesBody');
const clienteModalElement = document.getElementById('clienteModal');
const clienteModal = new bootstrap.Modal(clienteModalElement);
const clienteForm = document.getElementById('clienteForm');
const filtroInput = document.getElementById('filtroInput');
const clienteIndexInput = document.getElementById('clienteIndex');
const clienteModalLabel = document.getElementById('clienteModalLabel');
const paginacaoInfo = document.getElementById('paginacaoInfo');

const successToast = new bootstrap.Toast(document.getElementById('successToast'));
const errorToast = new bootstrap.Toast(document.getElementById('errorToast'));
const successToastMessage = document.getElementById('successToastMessage');
const errorToastMessage = document.getElementById('errorToastMessage');

function showSuccessToast(message) {
  successToastMessage.textContent = message;
  successToast.show();
}

function showErrorToast(message) {
  errorToastMessage.textContent = message;
  errorToast.show();
}

function abrirModal() {
  clienteForm.reset();
  clienteIndexInput.value = '';
  clienteModalLabel.textContent = 'Adicionar Cliente';
  clienteModal.show();
}

function validarCliente(cliente) {
  if (!cliente.codigo) {
    showErrorToast('O campo Código Interno é obrigatório.');
    return false;
  }
  if (!cliente.nome) {
    showErrorToast('O campo Nome/Apelido é obrigatório.');
    return false;
  }
  if (!cliente.cpf_cnpj) {
    showErrorToast('O campo CPF/CNPJ é obrigatório.');
    return false;
  }
  return true;
}

function salvarCliente(event) {
  event.preventDefault();

  const clienteData = {
    codigo: document.getElementById('codigo').value.trim(),
    nome: document.getElementById('nome').value.trim(),
    razao_social: document.getElementById('razao_social').value.trim(),
    cpf_cnpj: document.getElementById('cpf_cnpj').value.trim(),
    regime_fiscal: document.getElementById('regime_fiscal').value,
    situacao: document.getElementById('situacao').value,
    tipo_pessoa: document.getElementById('tipo_pessoa').value,
    estado: document.getElementById('estado').value,
    municipio: document.getElementById('municipio').value.trim(),
    status: document.getElementById('status').value,
    possui_ie: document.getElementById('possui_ie').value,
    ie: document.getElementById('ie').value.trim(),
    filial: document.getElementById('filial').value.trim(),
    empresa_matriz: document.getElementById('empresa_matriz').value.trim(),
    grupo: document.getElementById('grupo').value.trim()
  };

  if (!validarCliente(clienteData)) {
    return;
  }

  const index = clienteIndexInput.value;

  if (index === '') {
    clientes.push(clienteData);
    showSuccessToast('Cliente adicionado com sucesso!');
  } else {
    clientes[Number(index)] = clienteData;
    showSuccessToast('Cliente atualizado com sucesso!');
  }

  localStorage.setItem('clientesCRM', JSON.stringify(clientes));
  clienteModal.hide();
  renderizarClientes();
}

function renderizarClientes() {
  clientesBody.innerHTML = '';
  const filtro = filtroInput.value.toLowerCase();
  const clientesFiltrados = clientes.filter(cliente => 
    cliente.codigo.toLowerCase().includes(filtro) ||
    cliente.nome.toLowerCase().includes(filtro) ||
    cliente.razao_social.toLowerCase().includes(filtro) ||
    cliente.cpf_cnpj.toLowerCase().includes(filtro) ||
    cliente.situacao.toLowerCase().includes(filtro) ||
    cliente.municipio.toLowerCase().includes(filtro) ||
    cliente.status.toLowerCase().includes(filtro) ||
    cliente.grupo.toLowerCase().includes(filtro)
  );

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  paginaAtual = Math.min(paginaAtual, totalPaginas || 1);

  const inicio = (paginaAtual - 1) * clientesPorPagina;
  const fim = inicio + clientesPorPagina;
  const clientesPagina = clientesFiltrados.slice(inicio, fim);

  clientesPagina.forEach((cliente, index) => {
    const globalIndex = clientes.findIndex(c => c === cliente);
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${cliente.codigo}</td>
      <td>${cliente.nome}</td>
      <td>${cliente.razao_social}</td>
      <td>${cliente.cpf_cnpj}</td>
      <td>${cliente.regime_fiscal}</td>
      <td>${cliente.situacao}</td>
      <td>${cliente.tipo_pessoa}</td>
      <td>${cliente.estado}</td>
      <td>${cliente.municipio}</td>
      <td>${cliente.status}</td>
      <td>${cliente.possui_ie}</td>
      <td>${cliente.ie}</td>
      <td>${cliente.filial}</td>
      <td>${cliente.empresa_matriz}</td>
      <td>${cliente.grupo}</td>
      <td>
        <button class="btn btn-primary btn-sm me-2" onclick="editarCliente(${globalIndex})" title="Editar">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="excluirCliente(${globalIndex})" title="Excluir">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;

    clientesBody.appendChild(tr);
  });

  paginacaoInfo.textContent = `Página ${paginaAtual} de ${totalPaginas} (${clientesFiltrados.length} clientes)`;
}

function editarCliente(index) {
  try {
    const cliente = clientes[index];
    if (!cliente) {
      showErrorToast('Cliente não encontrado.');
      return;
    }

    document.getElementById('codigo').value = cliente.codigo || '';
    document.getElementById('nome').value = cliente.nome || '';
    document.getElementById('razao_social').value = cliente.razao_social || '';
    document.getElementById('cpf_cnpj').value = cliente.cpf_cnpj || '';
    document.getElementById('regime_fiscal').value = cliente.regime_fiscal || 'Simples Nacional';
    document.getElementById('situacao').value = cliente.situacao || 'Ativo';
    document.getElementById('tipo_pessoa').value = cliente.tipo_pessoa || 'Física';
    document.getElementById('estado').value = cliente.estado || 'AC';
    document.getElementById('municipio').value = cliente.municipio || '';
    document.getElementById('status').value = cliente.status || 'Ativo';
    document.getElementById('possui_ie').value = cliente.possui_ie || 'Não';
    document.getElementById('ie').value = cliente.ie || '';
    document.getElementById('filial').value = cliente.filial || '';
    document.getElementById('empresa_matriz').value = cliente.empresa_matriz || '';
    document.getElementById('grupo').value = cliente.grupo || '';

    clienteIndexInput.value = index;
    clienteModalLabel.textContent = 'Editar Cliente';
    clienteModal.show();
  } catch (error) {
    showErrorToast('Erro ao carregar dados do cliente.');
    console.error('Erro em editarCliente:', error);
  }
}

function excluirCliente(index) {
  if (confirm('Tem certeza que deseja excluir este cliente?')) {
    clientes.splice(index, 1);
    localStorage.setItem('clientesCRM', JSON.stringify(clientes));
    renderizarClientes();
    showSuccessToast('Cliente excluído com sucesso!');
  }
}

function filtrarClientes() {
  paginaAtual = 1;
  renderizarClientes();
}

function irParaPrimeiraPagina() {
  paginaAtual = 1;
  renderizarClientes();
}

function irParaPaginaAnterior() {
  if (paginaAtual > 1) {
    paginaAtual--;
    renderizarClientes();
  }
}

function irParaProximaPagina() {
  const filtro = filtroInput.value.toLowerCase();
  const clientesPaginas = clientes.filter(cliente => 
    cliente.codigo.toLowerCase().includes(filtro) ||
    cliente.nome.toLowerCase().includes(filtro) ||
    cliente.razao_social.toLowerCase().includes(filtro) ||
    cliente.cpf_cnpj.toLowerCase().includes(filtro) ||
    cliente.situacao.toLowerCase().includes(filtro) ||
    cliente.municipio.toLowerCase().includes(filtro) ||
    cliente.status.toLowerCase().includes(filtro) ||
    cliente.grupo.toLowerCase().includes(filtro)
  );
  const totalPaginas = Math.ceil(clientesPaginas.length / clientesPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    renderizarClientes();
  }
}

function irParaUltimaPagina() {
  const filtro = filtroInput.value.toLowerCase();
  const clientesPaginas = clientes.filter(cliente => 
    cliente.codigo.toLowerCase().includes(filtro) ||
    cliente.nome.toLowerCase().includes(filtro) ||
    cliente.razao_social.toLowerCase().includes(filtro) ||
    cliente.cpf_cnpj.toLowerCase().includes(filtro) ||
    cliente.situacao.toLowerCase().includes(filtro) ||
    cliente.municipio.toLowerCase().includes(filtro) ||
    cliente.status.toLowerCase().includes(filtro) ||
    cliente.grupo.toLowerCase().includes(filtro)
  );
  paginaAtual = Math.ceil(clientesPaginas.length / clientesPorPagina) || 1;
  renderizarClientes();
}

function exportarPDF() {
  if (clientes.length === 0) {
    showErrorToast('Não há clientes para exportar.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Relatório de Clientes', 14, 22);

  const colunas = [
    "Código", "Nome/Apelido", "Razão Social", "CPF/CNPJ", "Regime Fiscal",
    "Situação", "Tipo Pessoa", "Estado", "Município", "Status", "Possui I.E.?",
    "I.E.", "Filial", "Matriz", "Grupo"
  ];

  const dados = clientes.map(c => [
    c.codigo, c.nome, c.razao_social, c.cpf_cnpj, c.regime_fiscal,
    c.situacao, c.tipo_pessoa, c.estado, c.municipio, c.status, c.possui_ie,
    c.ie, c.filial, c.empresa_matriz, c.grupo
  ]);

  doc.autoTable({
    startY: 30,
    head: [colunas],
    body: dados,
    styles: { fontSize: 8 },
    headStyles: { fillColor: '#10b981' }
  });

  doc.save('relatorio_clientes.pdf');
}

function exportarJSON() {
  if (clientes.length === 0) {
    showErrorToast('Não há clientes para exportar.');
    return;
  }

  const dataStr = JSON.stringify(clientes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'clientes.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importarClientes(files) {
  if (files.length === 0) return;
  
  const file = files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const importedData = JSON.parse(e.target.result);
      
      if (!Array.isArray(importedData)) {
        throw new Error('O arquivo não contém um array de clientes válido');
      }
      
      const primeiroCliente = importedData[0];
      if (!primeiroCliente || !primeiroCliente.codigo || !primeiroCliente.nome || !primeiroCliente.cpf_cnpj) {
        throw new Error('O arquivo não possui o formato esperado de clientes');
      }
      
      if (confirm(`Deseja importar ${importedData.length} clientes? Isso substituirá seus clientes atuais.`)) {
        localStorage.setItem('clientesCRM', JSON.stringify(importedData));
        location.reload();
        showSuccessToast('Clientes importados com sucesso!');
      }
    } catch (error) {
      showErrorToast('Erro ao importar arquivo: ' + error.message);
      console.error(error);
    }
  };
  
  reader.onerror = function() {
    showErrorToast('Erro ao ler o arquivo');
  };
  
  reader.readAsText(file);
}

// Evento de submit do formulário
clienteForm.addEventListener('submit', salvarCliente);

// Renderizar clientes ao carregar a página
renderizarClientes();