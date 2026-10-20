// Dados padronizados das 15 disciplinas do 9º Ano
const dadosDisciplinas = [
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

// Frequência geral fictícia apenas para demonstração nesta etapa
const FREQUENCIA_DEMONSTRATIVA = 92;

/**
 * Função para converter e validar qualquer formato de nota para a escala 0 a 10.
 */
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte vírgula para ponto decimal se for texto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
  }

  let numero = Number(valor);

  if (isNaN(numero)) {
    return null;
  }

  // Ajusta valores na escala 0-100 para 0-10
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  // Aceita apenas valores no intervalo de 0 a 10
  if (numero >= 0 && numero <= 10) {
    return Number(numero.toFixed(1));
  }

  return null;
}

/**
 * Preenche a tabela com as disciplinas e calcula o resumo nos cards.
 */
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

    // Calcula total de faltas da disciplina
    const totalFaltasDisc = item.faltas.reduce((acc, f) => acc + f, 0);
    totalFaltasGeral += totalFaltasDisc;

    // Calcula média considerando apenas as notas disponíveis
    const notasValidas = [t1, t2, t3].filter((n) => n !== null);
    let media = null;

    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, val) => acc + val, 0);
      media = Number((soma / notasValidas.length).toFixed(1));
      somaMedias += media;
      disciplinasComMedia++;
    }

    // Define a situação da disciplina
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

    // Cria a linha na tabela usando textContent/elementos do DOM
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.disciplina}</td>
      <td>${t1 !== null ? t1.toFixed(1) : "—"}</td>
      <td>${t2 !== null ? t2.toFixed(1) : "—"}</td>
      <td>${t3 !== null ? t3.toFixed(1) : "—"}</td>
      <td><strong>${media !== null ? media.toFixed(1) : "—"}</strong></td>
      <td>${totalFaltasDisc}</td>
      <td><span class="badge ${classeBadge}">${situacaoTexto}</span></td>
    `;

    corpoTabela.appendChild(tr);
  });

  // Atualiza os Cards do Resumo
  const mediaGeral = disciplinasComMedia > 0 ? (somaMedias / disciplinasComMedia).toFixed(1) : "—";

  document.getElementById("card-media-geral").textContent = mediaGeral;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = qtdBomDesempenho;
  document.getElementById("card-precisa-atencao").textContent = qtdAtencao;
}

// Executa a função assim que a página carrega
document.addEventListener("DOMContentLoaded", renderizarBoletim);