
import { useRef } from 'react';
import Papa from 'papaparse';

const normalizeHeader = (header) => (header || '').trim().toLowerCase();

const getField = (row, mappings) => {
  for (const key of mappings) {
    if (row[key] !== undefined && row[key] !== null) {
      return String(row[key]).trim();
    }
  }
  return '';
};

const HEADER_MAPPINGS = {
  number: ['number', 'numero', 'nº', 'número'],
  question: ['question', 'pergunta', 'questão'],
  answer: ['answer', 'resposta'],
  comment: ['comment', 'comentario', 'comentário'],
};

export function useDisciplineCsvImport(disciplines, setDisciplines, toast) {
  const fileInputRef = useRef(null);
  const importConfigRef = useRef({ disciplineId: null });

  const handleImportClick = (disciplineId) => {
    importConfigRef.current = { disciplineId };
    if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.click();
    }
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: normalizeHeader,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast({
            title: "Erro de Leitura do CSV",
            description: `Ocorreram erros ao ler o arquivo: ${results.errors.map(e => e.message).join(', ')}`,
            variant: "destructive",
          });
          return;
        }

        const data = results.data;
        if (!data || data.length === 0 || Object.keys(data[0]).length <= 1) {
            toast({
                title: "Arquivo Vazio ou Mal Formatado",
                description: "O arquivo CSV parece estar vazio ou não contém dados válidos.",
                variant: "destructive",
            });
            return;
        }

        const headers = results.meta.fields.map(normalizeHeader);
        const requiredHeaderKeys = ['number', 'question', 'answer', 'comment'];
        const requiredHeaderNamesForToast = "'numero', 'pergunta', 'resposta' e 'comentario'";

        const missingHeaders = requiredHeaderKeys.filter(key => 
            !HEADER_MAPPINGS[key].some(alias => headers.includes(alias))
        );

        if (missingHeaders.length > 0) {
            toast({
                title: "Erro: Colunas Obrigatórias Faltando",
                description: `O arquivo precisa conter TODAS as seguintes colunas: ${requiredHeaderNamesForToast}.`,
                variant: "destructive",
                duration: 8000,
            });
            return;
        }

        processDisciplineImport(data);
      },
      error: (error) => {
        toast({ title: "Erro ao processar CSV", description: error.message, variant: "destructive" });
      },
    });
  };

  const processDisciplineImport = (data) => {
    const { disciplineId } = importConfigRef.current;
    if (!disciplineId) return;

    const newQuestions = [];
    const invalidRows = [];

    data.forEach((row, index) => {
      const number = getField(row, HEADER_MAPPINGS.number);
      const question = getField(row, HEADER_MAPPINGS.question);
      const answer = getField(row, HEADER_MAPPINGS.answer);
      const comment = getField(row, HEADER_MAPPINGS.comment);

      if (number && question && answer && comment) {
        newQuestions.push({ number, question, answer, comment });
      } else {
        invalidRows.push(index + 2);
      }
    });

    if (invalidRows.length > 0) {
      toast({
        title: "Aviso: Linhas com Dados Faltando",
        description: `As linhas ${invalidRows.join(', ')} foram ignoradas por terem colunas em branco.`,
        variant: "default",
        duration: 8000,
      });
    }

    if (newQuestions.length === 0) {
      toast({ title: "Nenhuma pergunta válida encontrada", description: "Verifique o preenchimento de todas as colunas. Nenhuma alteração foi feita.", variant: "destructive" });
      return;
    }
    
    const disciplineName = disciplines.find(d => d.id === disciplineId)?.name || '';

    setDisciplines(prev =>
      prev.map(d =>
        d.id === disciplineId
          ? { ...d, questions: newQuestions }
          : d
      )
    );

    toast({ title: "Importação Concluída!", description: `As questões de "${disciplineName}" foram substituídas. Total de ${newQuestions.length} perguntas importadas.` });
  };

  return { fileInputRef, handleImportClick, handleFileImport };
}
