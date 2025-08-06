import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { HelpCircle } from 'lucide-react';

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-800 p-3 rounded-md text-sm text-gray-200 overflow-x-auto">
    <code>{children}</code>
  </pre>
);

const ImportHelpDialog = ({ open, onOpenChange }) => {
  const importExample = `disciplina,numero,pergunta,resposta,comentario
"Matemática","Q1","Quanto é 5*5?","25","Cálculo simples."
"História","Q1","Em que ano o Brasil foi descoberto?","1500","Data importante."
"Matemática","Q2","Qual a fórmula de Bhaskara?","x = [-b ± sqrt(b² - 4ac)] / 2a","Fórmula quadrática."`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-purple-500/30 max-w-2xl text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-cyan-400" />
            Guia de Importação de CSV
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Use este guia para importar perguntas de forma massiva para o sistema.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <h3 className="font-bold text-lg text-purple-400">Instruções de Importação</h3>
            <p className="text-sm text-gray-300">
                Use o botão "Importar CSV" na aba "Ferramentas" para adicionar perguntas a múltiplas disciplinas de uma só vez. O sistema irá associar as perguntas às disciplinas existentes com base no nome.
            </p>
            <p className="text-sm font-semibold">Colunas Obrigatórias:</p>
            <p className="text-sm text-gray-300 mb-3">
                O arquivo <strong className="text-amber-400">DEVE</strong> conter todas as seguintes colunas, que podem estar em qualquer ordem, desde que os nomes dos cabeçalhos estejam corretos:
            </p>
            <ul className="list-disc list-inside text-sm mb-3 pl-4 font-mono space-y-1">
                <li><span className="font-semibold text-green-300">disciplina</span>: O nome exato da disciplina já cadastrada.</li>
                <li><span className="font-semibold text-green-300">numero</span>: O número ou código da questão.</li>
                <li><span className="font-semibold text-green-300">pergunta</span>: O texto da pergunta.</li>
                <li><span className="font-semibold text-green-300">resposta</span>: A resposta correta.</li>
                <li><span className="font-semibold text-green-300">comentario</span>: Um comentário ou feedback sobre a resposta.</li>
            </ul>
            <p className="text-sm font-semibold">Exemplo de arquivo CSV:</p>
            <CodeBlock>{importExample}</CodeBlock>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportHelpDialog;