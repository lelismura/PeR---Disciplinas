import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useDisciplineCsvImport } from '@/hooks/useDisciplineCsvImport';
import { Plus, Trash2, Edit, Check, X, Download, Upload } from 'lucide-react';

const DisciplineManager = ({ disciplines, setDisciplines }) => {
  const [newDiscipline, setNewDiscipline] = useState({ name: '', password: '' });
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [editData, setEditData] = useState({ name: '', password: '' });
  const { toast } = useToast();
  const { fileInputRef, handleImportClick, handleFileImport } = useDisciplineCsvImport(disciplines, setDisciplines, toast);

  const handleAddDiscipline = () => {
    if (newDiscipline.name.trim() && newDiscipline.password.trim()) {
      const disciplineExists = disciplines.some(d => d.name.toLowerCase() === newDiscipline.name.toLowerCase());
      if (disciplineExists) {
        toast({ title: "Erro", description: "Já existe uma disciplina com esse nome.", variant: "destructive" });
        return;
      }
      setDisciplines(prev => [...prev, { id: Date.now().toString(), ...newDiscipline, questions: [] }]);
      setNewDiscipline({ name: '', password: '' });
      toast({ title: "Sucesso!", description: "Disciplina adicionada." });
    } else {
      toast({ title: "Erro", description: "Preencha nome e senha.", variant: "destructive" });
    }
  };

  const handleRemoveDiscipline = (id) => {
    setDisciplines(prev => prev.filter(d => d.id !== id));
    toast({ title: "Disciplina removida." });
  };

  const startEditing = (discipline) => {
    setEditingDiscipline(discipline.id);
    setEditData({ name: discipline.name, password: discipline.password });
  };

  const cancelEditing = () => {
    setEditingDiscipline(null);
    setEditData({ name: '', password: '' });
  };

  const handleUpdateDiscipline = () => {
    if (!editData.name.trim() || !editData.password.trim()) {
      toast({ title: "Erro", description: "Nome e senha não podem estar em branco.", variant: "destructive" });
      return;
    }
    setDisciplines(prev =>
      prev.map(d =>
        d.id === editingDiscipline ? { ...d, name: editData.name, password: editData.password } : d
      )
    );
    cancelEditing();
    toast({ title: "Sucesso!", description: "Disciplina atualizada." });
  };

  const handleExportClick = (discipline) => {
    if (!discipline.questions || discipline.questions.length === 0) {
      toast({
        title: "Nenhuma pergunta",
        description: `A disciplina "${discipline.name}" não tem perguntas para exportar.`,
        variant: "destructive",
      });
      return;
    }

    const dataToExport = discipline.questions.map(q => ({
      number: q.number,
      question: q.question,
      answer: q.answer,
      comment: q.comment,
    }));

    const csv = Papa.unparse(dataToExport, {
        columns: ['number', 'question', 'answer', 'comment']
    });
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const safeFileName = discipline.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.setAttribute('download', `${safeFileName}_questoes.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação Concluída!",
      description: `As perguntas da disciplina "${discipline.name}" foram exportadas.`,
    });
  };

  return (
    <Card className="glass-effect border-purple-500/30">
      <CardHeader>
        <CardTitle>Gerenciar Disciplinas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Nome da Disciplina"
              value={newDiscipline.name}
              onChange={(e) => setNewDiscipline({ ...newDiscipline, name: e.target.value })}
              className="bg-white/10 border-white/20"
            />
            <Input
              type="text"
              placeholder="Senha"
              value={newDiscipline.password}
              onChange={(e) => setNewDiscipline({ ...newDiscipline, password: e.target.value })}
              className="bg-white/10 border-white/20"
            />
            <Button onClick={handleAddDiscipline} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar pr-2">
            <input type="file" ref={fileInputRef} onChange={handleFileImport} style={{ display: 'none' }} accept=".csv" />
            {disciplines.map(discipline => (
              <motion.div
                key={discipline.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-md"
              >
                {editingDiscipline === discipline.id ? (
                  <>
                    <Input value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="bg-white/10 border-white/20" />
                    <Input value={editData.password} onChange={e => setEditData({...editData, password: e.target.value})} className="bg-white/10 border-white/20" />
                    <Button onClick={handleUpdateDiscipline} size="icon" variant="ghost" className="text-green-400 hover:text-green-300"><Check className="h-4 w-4" /></Button>
                    <Button onClick={cancelEditing} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <span className="flex-grow">{discipline.name} ({discipline.questions?.length || 0} questões)</span>
                    <Button onClick={() => handleImportClick(discipline.id)} size="icon" variant="ghost" title="Importar CSV para esta disciplina"><Upload className="h-4 w-4" /></Button>
                    <Button onClick={() => handleExportClick(discipline)} size="icon" variant="ghost" title="Exportar CSV desta disciplina"><Download className="h-4 w-4" /></Button>
                    <Button onClick={() => startEditing(discipline)} size="icon" variant="ghost"><Edit className="h-4 w-4" /></Button>
                    <Button onClick={() => handleRemoveDiscipline(discipline.id)} size="icon" variant="ghost" className="text-red-400 hover:text-red-300"><Trash2 className="h-4 w-4" /></Button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisciplineManager;