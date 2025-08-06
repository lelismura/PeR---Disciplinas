import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';

const AdminTools = ({ disciplines, setDisciplines }) => {
  const { toast } = useToast();

  const exportAllData = () => {
    const allQuestions = disciplines.flatMap(discipline => 
      (discipline.questions || []).map(q => ({
        discipline_name: discipline.name,
        number: q.number,
        question: q.question,
        answer: q.answer,
        comment: q.comment,
      }))
    );

    if (allQuestions.length === 0) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Não há perguntas em nenhuma disciplina.",
        variant: "destructive",
      });
      return;
    }

    const csv = Papa.unparse(allQuestions, {
      columns: ['discipline_name', 'number', 'question', 'answer', 'comment'],
    });

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('download', `quiz_export_completo_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação Concluída!",
      description: `Todas as ${allQuestions.length} perguntas foram exportadas.`,
    });
  };

  return (
    <Card className="glass-effect border-purple-500/30">
      <CardHeader>
        <CardTitle>Ferramentas Gerais</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="border-t border-white/10 pt-6">
            <h4 className="font-semibold text-white mb-2">Exportação Completa</h4>
             <p className="text-sm text-gray-300 mb-2">
              Exporte todas as perguntas de todas as disciplinas para um único arquivo CSV. Isso serve como um backup completo do seu quiz.
            </p>
            <Button onClick={exportAllData} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Download className="h-4 w-4 mr-2" />
              Exportar Todos os Dados
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTools;