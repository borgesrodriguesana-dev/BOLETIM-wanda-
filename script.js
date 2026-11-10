const CONFIG_ALUNO = {
  turma: "9C",
  numeroChamada: 3,
  apiUrl: "https://boletim-api.profbt.com.br"
};

let pinSessao = "";

// Dados padronizados das 15 disciplinas do 9º Ano
let dadosDisciplinas = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

const FREQUENCIA_DEMONSTRATIVA = 92;

// Instâncias globais dos gráficos Chart.js
let graficoMedias = null;
let graficoEvolucao = null;
let graficoFaltas = null;

/**
 * Função para converter e validar qualquer formato de nota para a escala 0 a 10.
 */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  if (numero >= 0 && numero <= 10) {
    return Number(numero.toFixed(1));
  }

  return null;
}

function validarNotaInput(valorStr) {
  if (valorStr === null || valorStr === undefined || valorStr.trim() === "") {
    return { valido: true, valor: null };
  }

  const str = valorStr.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(str)) {
    return { valido: false };
  }

  const num = Number(str);
  if (isNaN(num) || num < 0 || num > 10) {
    return { valido: false };
  }

  return { valido: true, valor: Number(num.toFixed(1)) };
}

function validarFaltaInput(valorStr) {
  if (valorStr === null || valorStr === undefined || valorStr.trim() === "") {
    return { valido: false };
  }

  const str = valorStr.trim();
  if (!/^\d+$/.test(str)) {
    return { valido: false };
  }

  const num = Number(str);
  if (isNaN(num) || num < 0) {
    return { valido: false };
  }

  return { valido: true, valor: num };
}

function renderizarBoletim() {
  const corpoTabela = document.getElementById("corpo-tabela");
  corpoTabela.innerHTML = "";

  let somaMedias = 0;
  let disciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let qtdBomDesempenho = 0;
  let qtdAtencao = 0;

  dadosDisciplinas.forEach((item) => {
    const t1 = normalizarNota(item.tri1);
    const t2 = normalizarNota(item.tri2);
    const t3 = normalizarNota(item.tri3);

    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    const totalFaltasDisc = faltasArray.reduce((acc, f) => acc + (Number(f) || 0), 0);
    totalFaltasGeral += totalFaltasDisc;

    const notasValidas = [t1, t2, t3].filter((n) => n !== null);
    let media = null;

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, val) => acc + val, 0);
      media = Number((soma / notasValidas.length).toFixed(1));
      somaMedias += media;
      disciplinasComMedia++;
    }

    let situacaoTexto = "Nota ainda não disponível";
    let classeBadge = "badge-indisponivel";

    if (media !== null) {
      if (media >= 6.0) {
        situacaoTexto = "Bom desempenho";
        classeBadge = "badge-bom";
        qtdBomDesempenho++;
      } else {
        situacaoTexto = "Atenção";
        classeBadge = "badge-atencao";
        qtdAtencao++;
      }
    }

    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;
    tr.appendChild(tdNome);

    const tdT1 = document.createElement("td");
    tdT1.textContent = t1 !== null ? t1.toFixed(1) : "—";
    tr.appendChild(tdT1);

    const tdT2 = document.createElement("td");
    tdT2.textContent = t2 !== null ? t2.toFixed(1) : "—";
    tr.appendChild(tdT2);

    const tdT3 = document.createElement("td");
    tdT3.textContent = t3 !== null ? t3.toFixed(1) : "—";
    tr.appendChild(tdT3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = media !== null ? media.toFixed(1) : "—";
    tdMedia.appendChild(strongMedia);
    tr.appendChild(tdMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasDisc;
    tr.appendChild(tdFaltas);

    const tdSit = document.createElement("td");
    const spanBadge = document.createElement("span");
    spanBadge.className = `badge ${classeBadge}`;
    spanBadge.textContent = situacaoTexto;
    tdSit.appendChild(spanBadge);
    tr.appendChild(tdSit);

    corpoTabela.appendChild(tr);
  });

  const mediaGeral = disciplinasComMedia > 0 ? (somaMedias / disciplinasComMedia).toFixed(1) : "—";

  document.getElementById("card-media-geral").textContent = mediaGeral;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("card-precisa-atencao").textContent = qtdAtencao;

  // Atualização isolada dos gráficos
  atualizarGraficos();
}

function renderizarEditor() {
  const corpoEditor = document.getElementById("corpo-editor");
  corpoEditor.innerHTML = "";

  dadosDisciplinas.forEach((item, index) => {
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    tdNome.textContent = item.disciplina;
    tr.appendChild(tdNome);

    const t1 = normalizarNota(item.tri1);
    const t2 = normalizarNota(item.tri2);
    const t3 = normalizarNota(item.tri3);

    const faltasArray = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];

    const campos = [
      { key: "tri1", val: t1 !== null ? t1 : "" },
      { key: "tri2", val: t2 !== null ? t2 : "" },
      { key: "tri3", val: t3 !== null ? t3 : "" },
      { key: "f1", val: faltasArray[0] !== undefined ? faltasArray[0] : 0 },
      { key: "f2", val: faltasArray[1] !== undefined ? faltasArray[1] : 0 },
      { key: "f3", val: faltasArray[2] !== undefined ? faltasArray[2] : 0 }
    ];

    campos.forEach((c) => {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";
      input.className = "campo-editor";
      input.value = c.val;
      input.dataset.index = index;
      input.dataset.campo = c.key;
      td.appendChild(input);
      tr.appendChild(td);
    });

    corpoEditor.appendChild(tr);
  });
}

async function fazerLogin() {
  const inputPin = document.getElementById("input-pin");
  const msgLogin = document.getElementById("msg-login");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgLogin.textContent = "Digite o PIN para continuar.";
    return;
  }

  msgLogin.style.color = "var(--cor-ciano)";
  msgLogin.textContent = "Conectando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgLogin.style.color = "var(--cor-atencao)";
      msgLogin.textContent = "Turma, chamada ou PIN inválidos.";
      return;
    }

    if (resposta.status === 429) {
      msgLogin.style.color = "var(--cor-atencao)";
      msgLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      return;
    }

    if (!resposta.ok) {
      msgLogin.style.color = "var(--cor-atencao)";
      msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      return;
    }

    const json = await resposta.json();

    pinSessao = pinDigitado;
    inputPin.value = "";

    document.getElementById("secao-login").style.display = "none";
    document.getElementById("area-boletim").style.display = "block";

    if (json.dados && Array.isArray(json.dados.disciplinas) && json.dados.disciplinas.length > 0) {
      dadosDisciplinas = json.dados.disciplinas;
    }

    renderizarBoletim();
  } catch (erro) {
    msgLogin.style.color = "var(--cor-atencao)";
    msgLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
  }
}

async function salvarAlteracoes() {
  const msgSalvar = document.getElementById("msg-salvar");
  const inputs = document.querySelectorAll("#corpo-editor input.campo-editor");

  inputs.forEach((input) => input.classList.remove("invalido"));

  let possuiErro = false;
  const novosDados = JSON.parse(JSON.stringify(dadosDisciplinas));

  inputs.forEach((input) => {
    const idx = Number(input.dataset.index);
    const campo = input.dataset.campo;
    const valorStr = input.value;

    if (campo === "tri1" || campo === "tri2" || campo === "tri3") {
      const res = validarNotaInput(valorStr);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        novosDados[idx][campo] = res.valor;
      }
    } else {
      const res = validarFaltaInput(valorStr);
      if (!res.valido) {
        input.classList.add("invalido");
        possuiErro = true;
      } else {
        if (!Array.isArray(novosDados[idx].faltas)) {
          novosDados[idx].faltas = [0, 0, 0];
        }
        if (campo === "f1") novosDados[idx].faltas[0] = res.valor;
        if (campo === "f2") novosDados[idx].faltas[1] = res.valor;
        if (campo === "f3") novosDados[idx].faltas[2] = res.valor;
      }
    }
  });

  if (possuiErro) {
    msgSalvar.style.color = "var(--cor-atencao)";
    msgSalvar.textContent = "Verifique os campos destacados em vermelho.";
    return;
  }

  msgSalvar.style.color = "var(--cor-ciano)";
  msgSalvar.textContent = "Salvando...";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novosDados
        }
      })
    });

    if (!resposta.ok) {
      msgSalvar.style.color = "var(--cor-atencao)";
      msgSalvar.textContent = "Erro ao salvar os dados no servidor. Tente novamente.";
      return;
    }

    dadosDisciplinas = novosDados;
    renderizarBoletim();

    msgSalvar.style.color = "var(--cor-rosa)";
    msgSalvar.textContent = "Dados salvos com sucesso.";
  } catch (erro) {
    msgSalvar.style.color = "var(--cor-atencao)";
    msgSalvar.textContent = "Erro de conexão ao salvar. Tente novamente.";
  }
}

/* ==========================================================================
   FUNÇÕES EXCLUSIVAS DOS GRÁFICOS (SOMENTE LEITURA)
   ========================================================================== */

function atualizarGraficoMedias() {
  const canvas = document.getElementById("graficoMediasDisciplinas");
  if (!canvas) return;

  const labels = [];
  const data = [];

  dadosDisciplinas.forEach((item) => {
    labels.push(item.disciplina);
    const t1 = normalizarNota(item.tri1);
    const t2 = normalizarNota(item.tri2);
    const t3 = normalizarNota(item.tri3);

    const notasValidas = [t1, t2, t3].filter((n) => n !== null);
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, val) => acc + val, 0);
      data.push(Number((soma / notasValidas.length).toFixed(1)));
    } else {
      data.push(null);
    }
  });

  if (graficoMedias) {
    graficoMedias.destroy();
  }

  graficoMedias = new Chart(canvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Média",
          data: data,
          backgroundColor: "#00e5ff",
          borderRadius: 4
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Média: ${ctx.raw !== null ? ctx.raw.toFixed(1) : "Sem nota"}`
          }
        }
      },
      scales: {
        x: {
          min: 0,
          max: 10,
          ticks: { color: "#a8a8b3" },
          grid: { color: "#323238" }
        },
        y: {
          ticks: { color: "#e1e1e6", font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

function atualizarGraficoEvolucao() {
  const canvas = document.getElementById("graficoEvolucaoTrimestres");
  if (!canvas) return;

  const trimestres = ["tri1", "tri2", "tri3"];
  const mediasTrimestres = trimestres.map((key) => {
    const notas = dadosDisciplinas
      .map((item) => normalizarNota(item[key]))
      .filter((n) => n !== null);

    if (notas.length === 0) return null;
    const soma = notas.reduce((acc, val) => acc + val, 0);
    return Number((soma / notas.length).toFixed(1));
  });

  if (graficoEvolucao) {
    graficoEvolucao.destroy();
  }

  graficoEvolucao = new Chart(canvas, {
    type: "line",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [
        {
          label: "Média Geral",
          data: mediasTrimestres,
          borderColor: "#ffb6c1",
          backgroundColor: "rgba(255, 182, 193, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `Média Geral: ${ctx.raw !== null ? ctx.raw.toFixed(1) : "—"}`
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
          ticks: { color: "#a8a8b3" },
          grid: { color: "#323238" }
        },
        x: {
          ticks: { color: "#e1e1e6" },
          grid: { color: "#323238" }
        }
      }
    }
  });
}

function atualizarGraficoFaltas() {
  const canvas = document.getElementById("graficoFaltasTrimestres");
  if (!canvas) return;

  let f1 = 0;
  let f2 = 0;
  let f3 = 0;

  dadosDisciplinas.forEach((item) => {
    const faltas = Array.isArray(item.faltas) ? item.faltas : [0, 0, 0];
    f1 += Number(faltas[0]) || 0;
    f2 += Number(faltas[1]) || 0;
    f3 += Number(faltas[2]) || 0;
  });

  const totalFaltasInterno = f1 + f2 + f3;
  const LIMITE_REFERENCIA_INTERNA = 350;

  const divEstado = document.getElementById("estadoFaltas");
  const cardContainer = document.getElementById("card-faltas-container");

  if (divEstado && cardContainer) {
    if (totalFaltasInterno >= LIMITE_REFERENCIA_INTERNA) {
      divEstado.innerHTML = `<span class="badge-perigo">Perigo</span>`;
      cardContainer.classList.add("card-perigo");
    } else {
      divEstado.innerHTML = "";
      cardContainer.classList.remove("card-perigo");
    }
  }

  if (graficoFaltas) {
    graficoFaltas.destroy();
  }

  graficoFaltas = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["1º Tri", "2º Tri", "3º Tri"],
      datasets: [
        {
          label: "Faltas",
          data: [f1, f2, f3],
          backgroundColor: "#ff6b6b",
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}: ${ctx.raw} faltas`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: "#a8a8b3" },
          grid: { color: "#323238" }
        },
        x: {
          ticks: { color: "#e1e1e6" },
          grid: { display: false }
        }
      }
    }
  });
}

function atualizarGraficos() {
  atualizarGraficoMedias();
  atualizarGraficoEvolucao();
  atualizarGraficoFaltas();
}

document.addEventListener("DOMContentLoaded", () => {
  const btnEntrar = document.getElementById("btn-entrar");
  const inputPin = document.getElementById("input-pin");
  const btnAlterar = document.getElementById("btn-alterar-dados");
  const btnSalvar = document.getElementById("btn-salvar");

  if (btnEntrar) {
    btnEntrar.addEventListener("click", fazerLogin);
  }

  if (inputPin) {
    inputPin.addEventListener("keydown", (e) => {
      if (e.key === "Enter") fazerLogin();
    });
  }

  if (btnAlterar) {
    btnAlterar.addEventListener("click", () => {
      const secaoEditor = document.getElementById("secao-editor");
      if (secaoEditor.style.display === "none" || !secaoEditor.style.display) {
        renderizarEditor();
        secaoEditor.style.display = "block";
      } else {
        secaoEditor.style.display = "none";
      }
    });
  }

  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarAlteracoes);
  }
});