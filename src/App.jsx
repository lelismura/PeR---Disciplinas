
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import AdminPanel from '@/components/AdminPanel';
import LoginForm from '@/components/LoginForm';
import QuizInterface from '@/components/QuizInterface';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, GraduationCap, Lock, BookOpen } from 'lucide-react';

function App() {
  const [disciplines, setDisciplines] = useLocalStorage('quiz_disciplines', []);
  const [users, setUsers] = useLocalStorage('quiz_users', []);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [disciplinePassword, setDisciplinePassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPasswordDialog, setShowAdminPasswordDialog] = useState(false);
  const [pendingDiscipline, setPendingDiscipline] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Only load initial data if localStorage is empty
        if (localStorage.getItem('quiz_disciplines') === null) {
          const pooQuestionsResponse = await fetch('/POO.json');
          const pooQuestions = await pooQuestionsResponse.json();
          
          const gpQuestionsResponse = await fetch('/GP.json');
          const gpQuestions = await gpQuestionsResponse.json();

          const initialDisciplines = [
            { id: '3', name: 'POO', password: 'poo', questions: pooQuestions },
            { id: '4', name: 'Gerenciamento de Projetos', password: 'gp', questions: gpQuestions }
          ];
          setDisciplines(initialDisciplines);
        }
        
        if (localStorage.getItem('quiz_users') === null) {
          const usersResponse = await fetch('/usuarios.json');
          const initialUsers = await usersResponse.json();
          setUsers(initialUsers);
        }
      } catch (error) {
        console.error("Falha ao carregar dados iniciais:", error);
        toast({
          title: "Erro de Carregamento",
          description: "Não foi possível carregar os dados iniciais.",
          variant: "destructive",
        });
      } finally {
        setDataLoaded(true);
      }
    };

    loadInitialData();
  }, [setDisciplines, setUsers, toast]);

  const handleDisciplineSelect = (disciplineId) => {
    const discipline = disciplines.find(d => d.id === disciplineId);
    if (discipline) {
      setPendingDiscipline(discipline);
      setShowPasswordDialog(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (pendingDiscipline && disciplinePassword === pendingDiscipline.password) {
      setSelectedDiscipline(pendingDiscipline);
      setShowLoginForm(true);
      setShowPasswordDialog(false);
      setDisciplinePassword('');
      setPendingDiscipline(null);
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha da disciplina está incorreta. Entre em contato com o administrador.",
        variant: "destructive"
      });
    }
  };

  const handleAdminAccess = () => {
    if (adminPassword === 'brucutu') {
      setShowAdminPanel(true);
      setShowAdminPasswordDialog(false);
      setAdminPassword('');
    } else {
      toast({
        title: "Acesso negado",
        description: "Senha de administrador incorreta",
        variant: "destructive"
      });
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setShowLoginForm(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedDiscipline(null);
  };

  const handleBackToDisciplines = () => {
    setShowLoginForm(false);
    setSelectedDiscipline(null);
    setCurrentUser(null);
    setShowPasswordDialog(false);
    setDisciplinePassword('');
    setPendingDiscipline(null);
  };

  if (!dataLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <GraduationCap className="h-16 w-16 text-white animate-spin" />
      </div>
    );
  }

  if (currentUser && selectedDiscipline) {
    return (
      <>
        <Helmet>
          <title>Quiz - {selectedDiscipline.name}</title>
          <meta name="description" content={`Sistema de quiz para a disciplina ${selectedDiscipline.name}`} />
        </Helmet>
        <QuizInterface 
          discipline={selectedDiscipline}
          user={currentUser}
          onExit={handleLogout}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Lechare Educacional - Sistema de Aprendizagem</title>
        <meta name="description" content="Sistema educacional de quiz com múltiplas disciplinas para aprendizagem interativa" />
      </Helmet>
      
      <main className="h-screen w-screen flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 floating-animation mb-4">
              <img className="w-16 h-16" alt="Lechare Educacional Icon" src="https://horizons-cdn.hostinger.com/def5e7ac-8538-4c31-ac13-2ec0e048ff74/ceeab5976f1a565593cb63c823b685bc.jpg" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
              Lechare Educacional
            </h1>
            <p className="text-base text-gray-300">
              Escolha uma disciplina para começar.
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Card className="glass-effect border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-white flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                  Selecione a Disciplina
                </CardTitle>
              </CardHeader>
              <CardContent>
                {disciplines.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Nenhuma disciplina cadastrada.</p>
                  </div>
                ) : (
                  <Select onValueChange={handleDisciplineSelect}>
                    <SelectTrigger className="w-full text-base bg-white/10 border-white/20">
                      <SelectValue placeholder="Escolha uma disciplina..." />
                    </SelectTrigger>
                    <SelectContent className="glass-effect border-purple-500/30">
                      {disciplines.map((discipline) => (
                        <SelectItem key={discipline.id} value={discipline.id} className="text-base cursor-pointer">
                          {discipline.name} ({discipline.questions?.length || 0} questões)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          </motion.div>
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-center"
            >
              <Button
                onClick={() => setShowAdminPasswordDialog(true)}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </motion.div>
        </div>

        <AnimatePresence>
          {showAdminPanel && (
            <AdminPanel
              disciplines={disciplines}
              setDisciplines={setDisciplines}
              users={users}
              setUsers={setUsers}
              onClose={() => setShowAdminPanel(false)}
            />
          )}

          {showLoginForm && (
            <LoginForm
              onLogin={handleLogin}
              users={users}
              setUsers={setUsers}
              onBack={handleBackToDisciplines}
            />
          )}
        </AnimatePresence>

        <Dialog open={showPasswordDialog} onOpenChange={(isOpen) => { if(!isOpen) { setPendingDiscipline(null); setShowPasswordDialog(false); }}}>
          <DialogContent className="glass-effect border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Acesso à Disciplina
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-300 text-center">
                Digite a senha para acessar <br /> <strong>{pendingDiscipline?.name}</strong>
              </p>
              <div>
                <Label htmlFor="discipline-password" className="text-white sr-only">Senha da Disciplina</Label>
                <Input
                  id="discipline-password"
                  type="password"
                  value={disciplinePassword}
                  onChange={(e) => setDisciplinePassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white text-center text-lg"
                  placeholder="******"
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handlePasswordSubmit} className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                  Acessar
                </Button>
                <Button 
                  onClick={() => setShowPasswordDialog(false)} 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showAdminPasswordDialog} onOpenChange={setShowAdminPasswordDialog}>
          <DialogContent className="glass-effect border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Acesso Administrativo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
               <Label htmlFor="admin-password" className="text-white sr-only">Senha do Administrador</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="bg-white/10 border-white/20 text-white text-center text-lg"
                  placeholder="******"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminAccess()}
                />
              <div className="flex gap-2">
                <Button onClick={handleAdminAccess} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600">
                  Entrar
                </Button>
                 <Button 
                  onClick={() => setShowAdminPasswordDialog(false)} 
                  variant="outline" 
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Toaster />
      </main>
    </>
  );
}

export default App;
