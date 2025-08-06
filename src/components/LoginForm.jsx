
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginForm = ({ onLogin, users, setUsers, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onLogin(user);
        toast({
          title: "Bem-vindo!",
          description: `Olá, ${user.name}! Login realizado com sucesso.`
        });
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Email ou senha incorretos",
          variant: "destructive"
        });
      }
    } else {
      // Registro
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos",
          variant: "destructive"
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Senhas não coincidem",
          description: "As senhas devem ser iguais",
          variant: "destructive"
        });
        return;
      }

      if (users.find(u => u.email === formData.email)) {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está em uso",
          variant: "destructive"
        });
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [...prev, newUser]);
      onLogin(newUser);
      
      toast({
        title: "Conta criada!",
        description: `Bem-vindo, ${newUser.name}! Sua conta foi criada com sucesso.`
      });
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "🚧 Funcionalidade não implementada ainda",
      description: "Mas não se preocupe! Você pode solicitar isso no seu próximo prompt! 🚀"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <Card className="w-full max-w-md glass-effect border-purple-500/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text flex items-center justify-center gap-2">
            {isLogin ? <User className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Sua senha"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
            )}
            
            <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-pink-600 font-bold">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>
          
          <div className="flex justify-between items-center text-sm">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-400 p-0 h-auto"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </Button>
            {isLogin && (
              <Button 
                variant="link" 
                onClick={handleForgotPassword}
                className="text-blue-400 p-0 h-auto"
              >
                Esqueci minha senha
              </Button>
            )}
          </div>
          
          <Button onClick={onBack} variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
            Voltar às Disciplinas
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LoginForm;
