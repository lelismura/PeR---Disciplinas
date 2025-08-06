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
  discipline: ['discipline_name', 'disciplina'],
  number: ['number', 'numero', 'nº', 'número'],
  question: ['question', 'pergunta', 'questão'],
  answer: ['answer', 'resposta'],
  comment: ['comment', 'comentario', 'comentário'],
};

export function useCsvImport(disciplines, setDisciplines, toast) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
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
        
        const requiredHeaderKeys = ['discipline', 'number', 'question', 'answer', 'comment'];
        const requiredHeaderNamesForToast = "'disciplina', 'numero', 'pergunta', 'resposta' e 'comentario'";

        const missingHeaders = requiredHeaderKeys.filter(key => 
            !HEADER_MAPPINGS[key].some(alias => headers.includes(alias))
        );

        if (missingHeaders.length > 0) {
            toast({
                title: "Erro: Colunas Obrigatórias Faltando",
                description: `A importação precisa conter TODAS as seguintes colunas: ${requiredHeaderNamesForToast}.`,
                variant: "destructive",
                duration: 8000,
            });
            return;
        }

        processImport(data);
      },
      error: (error) => {
        toast({ title: "Erro ao processar CSV", description: error.message, variant: "destructive" });
      },
    });
  };

  const processImport = (data) => {
    const questionsByDiscipline = {};
    let importedCount = 0;
    const invalidRows = [];

    data.forEach((row, index) => {
      const disciplineName = getField(row, HEADER_MAPPINGS.discipline);
      const number = getField(row, HEADER_MAPPINGS.number);
      const question = getField(row, HEADER_MAPPINGS.question);
      const answer = getField(row, HEADER_MAPPINGS.answer);
      const comment = getField(row, HEADER_MAPPINGS.comment);

      if (disciplineName && number && question && answer && comment) {
        if (!questionsByDiscipline[disciplineName]) {
          questionsByDiscipline[disciplineName] = [];
        }
        questionsByDiscipline[disciplineName].push({ number, question, answer, comment });
        importedCount++;
      } else {
        invalidRows.push(index + 2);
      }
    });
    
    if (invalidRows.length > 0) {
      toast({
        title: "Erro: Linhas com Dados Faltando",
        description: `As linhas ${invalidRows.join(', ')} estão com uma ou mais colunas obrigatórias em branco e foram ignoradas.`,
        variant: "destructive",
        duration: 8000,
      });
    }

    if (importedCount === 0) {
      toast({ title: "Nenhuma pergunta válida", description: "Verifique se todas as colunas obrigatórias estão preenchidas.", variant: "destructive" });
      return;
    }

    setDisciplines(prevDisciplines => {
        let updatedDisciplines = [...prevDisciplines];
        let matchedDisciplinesCount = 0;
        const matchedDisciplineNames = new Set();
      
        Object.keys(questionsByDiscipline).forEach(disciplineName => {
          const disciplineNameLower = disciplineName.toLowerCase();
          const disciplineIndex = updatedDisciplines.findIndex(d => d.name.toLowerCase() === disciplineNameLower);
          
          if (disciplineIndex !== -1) {
            if (!matchedDisciplineNames.has(disciplineNameLower)) {
                matchedDisciplinesCount++;
                matchedDisciplineNames.add(disciplineNameLower);
            }
            const existingQuestions = updatedDisciplines[disciplineIndex].questions || [];
            updatedDisciplines[disciplineIndex] = {
                ...updatedDisciplines[disciplineIndex],
                questions: [...existingQuestions, ...questionsByDiscipline[disciplineName]]
            };
          }
        });

      if (matchedDisciplinesCount === 0) {
        toast({ title: "Nenhuma disciplina correspondente", description: "Nenhuma disciplina no arquivo CSV corresponde às existentes no sistema.", variant: "destructive", duration: 7000 });
      } else {
        toast({ title: "Importação Concluída!", description: `${importedCount} perguntas importadas para ${matchedDisciplinesCount} disciplina(s).` });
      }
      return updatedDisciplines;
    });
  };

  return { fileInputRef, handleImportClick, handleFileImport };
}