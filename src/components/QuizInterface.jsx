
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  MessageCircle, 
  LogOut,
  Brain,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuizInterface = ({ discipline, user, onExit }) => {
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [history, setHistory] = useState([0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);
  const [showComment, setShowComment] = useState(false);
  
  const { toast } = useToast();

  const shuffleQuestions = useCallback(() => {
    if (discipline.questions && discipline.questions.length > 0) {
      const shuffled = [...discipline.questions].sort(() => Math.random() - 0.5);
      setRandomizedQuestions(shuffled);
      setHistory([0]);
      setCurrentIndex(0);
      setShowAnswer(false);
      setShowComment(false);
    }
  }, [discipline]);

  useEffect(() => {
    shuffleQuestions();
  }, [shuffleQuestions]);
  
  const currentQuestion = useMemo(() => randomizedQuestions[history[currentIndex]], [randomizedQuestions, history, currentIndex]);

  const navigate = useCallback((direction) => {
    setShowAnswer(false);
    setShowComment(false);

    if (direction === 'next') {
      if (currentIndex < history.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        let nextQuestionIndex;
        const usedIndexes = new Set(history);
        if (usedIndexes.size === randomizedQuestions.length) {
          toast({ title: "Fim do Quiz!", description: "Você viu todas as perguntas. Reiniciando...", className: "bg-green-600 text-white" });
          shuffleQuestions();
          return;
        }
        do {
          nextQuestionIndex = Math.floor(Math.random() * randomizedQuestions.length);
        } while (usedIndexes.has(nextQuestionIndex));
        
        setHistory(prev => [...prev, nextQuestionIndex]);
        setCurrentIndex(prev => prev + 1);
      }
    } else if (direction === 'prev') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  }, [currentIndex, history, randomizedQuestions, toast, shuffleQuestions]);

  const handleRestart = () => {
    shuffleQuestions();
    toast({ title: "Quiz Reiniciado!", description: "As perguntas foram embaralhadas." });
  };
  
  const toggleComment = () => {
    const hasComment = currentQuestion?.comment && currentQuestion.comment.trim() !== '';
    if (!hasComment) {
        toast({ title: "Sem Comentário", description: "Esta pergunta não possui comentário.", variant: "destructive" });
        return;
    }
    setShowComment(prev => !prev);
  };

  if (randomizedQuestions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Card className="glass-effect border-purple-500/30 text-center">
          <CardContent className="p-8">
            <Brain className="h-12 w-12 mx-auto mb-4 text-purple-400" />
            <h2 className="text-xl font-bold text-white mb-2">Sem Perguntas</h2>
            <p className="text-gray-300 text-sm mb-6">Esta disciplina ainda não tem perguntas.</p>
            <Button onClick={onExit} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <LogOut className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const progress = ((new Set(history.slice(0, currentIndex + 1))).size / randomizedQuestions.length) * 100;
  const hasComment = currentQuestion?.comment && currentQuestion.comment.trim() !== '';

  return (
    <div className="h-screen flex flex-col p-2 sm:p-4">
      <header className="w-full max-w-4xl mx-auto mb-4">
        <Card className="glass-effect border-purple-500/30">
          <CardHeader className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-xl gradient-text truncate">{discipline.name}</CardTitle>
                <p className="text-xs text-gray-300 truncate">Olá, {user.name}!</p>
              </div>
              <div className="flex items-center gap-1">
                 <Button onClick={() => navigate('prev')} disabled={currentIndex === 0} variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Pergunta Anterior"><ChevronLeft className="h-5 w-5" /></Button>
                 <Button onClick={() => navigate('next')} variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Próxima Pergunta"><ChevronRight className="h-5 w-5" /></Button>
                 <Button onClick={() => setShowAnswer(prev => !prev)} variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Mostrar Resposta"><Eye className="h-5 w-5" /></Button>
                 <Button onClick={toggleComment} disabled={!hasComment} variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Mostrar Comentário"><MessageCircle className="h-5 w-5" /></Button>
                 <Button onClick={handleRestart} variant="ghost" size="icon" className="w-8 h-8 sm:w-9 sm:h-9" aria-label="Reiniciar Quiz"><RotateCcw className="h-5 w-5" /></Button>
                 <Button onClick={onExit} variant="ghost" size="icon" className="text-red-400 hover:bg-red-500/20 hover:text-red-300 w-8 h-8 sm:w-9 sm:h-9" aria-label="Sair"><X className="h-5 w-5" /></Button>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Progress value={progress} className="h-1.5" />
              <div className="text-xs text-gray-400 text-center">
                {new Set(history.slice(0, currentIndex + 1)).size} de {randomizedQuestions.length} perguntas vistas
              </div>
            </div>
          </CardHeader>
        </Card>
      </header>

      <main className="flex-grow flex items-center justify-center w-full max-w-4xl mx-auto overflow-y-auto no-scrollbar pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={history[currentIndex]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="glass-effect border-purple-500/30 w-full">
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="p-4 bg-white/5 rounded-lg min-h-[120px] flex items-center justify-center">
                  <p className="text-base sm:text-lg text-white leading-relaxed text-center">
                    {currentQuestion.question}
                  </p>
                </div>
                
                <AnimatePresence>
                  {showAnswer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <h3 className="font-semibold text-green-400 text-sm">Resposta</h3>
                        </div>
                        <p className="text-white text-sm sm:text-base">{currentQuestion.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {showComment && hasComment && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                       className="overflow-hidden"
                    >
                      <div className="mt-2 p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-400" />
                          <h3 className="font-semibold text-blue-400 text-sm">Comentário</h3>
                        </div>
                        <p className="text-white text-sm sm:text-base">{currentQuestion.comment}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default QuizInterface;
