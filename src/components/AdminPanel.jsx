
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import DisciplineManager from '@/components/admin/DisciplineManager';
import UserManager from '@/components/admin/UserManager';
import ImportHelpDialog from '@/components/admin/ImportHelpDialog';
import { X, Users, BookCopy, HelpCircle } from 'lucide-react';

const AdminPanel = ({ disciplines, setDisciplines, users, setUsers, onClose }) => {
  const [showHelpDialog, setShowHelpDialog] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="bg-gray-900/80 border border-purple-500/30 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-2xl font-bold gradient-text">Painel Administrativo</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelpDialog(true)}
              className="text-white hover:bg-white/10"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Ajuda
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto no-scrollbar">
          <Tabs defaultValue="disciplines" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/20 mb-6">
              <TabsTrigger value="disciplines"><BookCopy className="h-4 w-4 mr-2" />Disciplinas</TabsTrigger>
              <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" />Usuários</TabsTrigger>
            </TabsList>
            <TabsContent value="disciplines">
              <DisciplineManager disciplines={disciplines} setDisciplines={setDisciplines} />
            </TabsContent>
            <TabsContent value="users">
              <UserManager users={users} setUsers={setUsers} />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
      <AnimatePresence>
        {showHelpDialog && <ImportHelpDialog open={showHelpDialog} onOpenChange={setShowHelpDialog} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminPanel;
