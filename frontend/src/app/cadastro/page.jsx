'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

import Logo from '@/components/shadcn-studio/logo';
import AuthBackgroundShape from '@/assets/svg/auth-background-shape';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

const NIVEIS_ACESSO = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'tecnico', label: 'Técnico' },
  { value: 'admin', label: 'Administrador' },
];

const Registro = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    nivel_acesso: 'cliente',
  });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErro('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const res = await fetch(`${API_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          senha: form.senha,
          nivel_acesso: form.nivel_acesso,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || data.message || 'Erro ao criar conta.');
        return;
      }

      router.push('/login');
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute">
        <AuthBackgroundShape />
      </div>

      <Card className="z-1 w-full border-none shadow-md sm:max-w-lg">
        <CardHeader className="gap-6">
          <Logo className="gap-3" />
          <div>
            <CardTitle className="mb-1.5 text-2xl">Criar nova conta</CardTitle>
            <CardDescription className="text-base">
              Preencha os dados abaixo para se cadastrar.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Nome */}
            <div className="space-y-1">
              <Label htmlFor="nome" className="leading-5">
                Nome completo *
              </Label>
              <Input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome"
                value={form.nome}
                onChange={handleChange}
                required
                disabled={carregando}
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="leading-5">
                Email *
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={carregando}
              />
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <Label htmlFor="senha" className="leading-5">
                Senha *
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={isVisible ? 'text' : 'password'}
                  placeholder="••••••••••••••••"
                  value={form.senha}
                  onChange={handleChange}
                  required
                  disabled={carregando}
                  className="pr-9"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setIsVisible((prev) => !prev)}
                  className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
                >
                  {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                  <span className="sr-only">{isVisible ? 'Ocultar senha' : 'Mostrar senha'}</span>
                </Button>
              </div>
            </div>

            {/* Nível de Acesso */}
            <div className="space-y-1">
              <Label htmlFor="nivel_acesso" className="leading-5">
                Tipo de acesso *
              </Label>
              <select
                id="nivel_acesso"
                name="nivel_acesso"
                value={form.nivel_acesso}
                onChange={handleChange}
                disabled={carregando}
                className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {NIVEIS_ACESSO.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Erro */}
            {erro && (
              <p className="text-sm text-red-500" role="alert">
                {erro}
              </p>
            )}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </form>

          <p className="text-muted-foreground mt-4 text-center text-sm">
            Já tem cadastro?{' '}
            <a href="/login" className="text-card-foreground hover:underline font-medium">
              Fazer login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Registro;