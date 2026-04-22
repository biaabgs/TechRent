'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import AuthBackgroundShape from '@/assets/svg/auth-background-shape';

const Login = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', senha: '' });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.mensagem || 'Erro ao fazer login');
        return;
      }

      localStorage.setItem('token', data.token);

      // Decodifica o payload do JWT para saber o nível de acesso
      const payload = JSON.parse(atob(data.token.split('.')[1]));

      if (payload.nivel_acesso === 'admin') router.push('/admin');
      else if (payload.nivel_acesso === 'tecnico') router.push('/tecnico');
      else router.push('/cliente');
    } catch (err) {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <Card className='z-1 w-full border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6'>
          <div className="items-center justify-center flex">
            <img src="/logo.svg" alt="Logo" className="gap-3 h-15" />
          </div>
          <div>
            <CardTitle className='mb-1.5 text-2xl'>Acesse sua conta</CardTitle>
            <CardDescription className='text-base'>Bem-vindo ao TechRent.</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form className='space-y-4' onSubmit={handleSubmit}>
            {/* Email */}
            <div className='space-y-1'>
              <Label htmlFor='email'>E-mail*</Label>
              <Input 
                type='email' 
                id='email' 
                name='email' // Importante: deve ser igual à chave no useState
                placeholder='seu@email.com' 
                value={form.email}
                onChange={handleChange}
                required
                disabled={carregando}
              />
            </div>

            {/* Password */}
            <div className='w-full space-y-1'>
              <Label htmlFor='senha'>Senha*</Label>
              <div className='relative'>
                <Input
                  id='senha'
                  name='senha' // Importante: deve ser igual à chave no useState
                  type={isVisible ? 'text' : 'password'}
                  placeholder='••••••••••••••••'
                  className='pr-9'
                  value={form.senha}
                  onChange={handleChange}
                  required
                  disabled={carregando}
                />
                <Button
                  type='button' // Importante: para não dar submit no form ao clicar no olho
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsVisible(!isVisible)}
                  className='text-muted-foreground absolute inset-y-0 right-0 hover:bg-transparent'
                >
                  {isVisible ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                </Button>
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Checkbox id='rememberMe' />
                <Label htmlFor='rememberMe' className='text-sm text-muted-foreground cursor-pointer'>
                  Lembrar de mim
                </Label>
              </div>
              <a href='#' className='text-sm hover:underline text-primary'>
                Esqueceu a senha?
              </a>
            </div>

            {/* Exibição de Erro */}
            {erro && (
              <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-md flex items-center gap-2 border border-destructive/20">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {erro}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className='text-muted-foreground text-center mt-6'>
            Não tem cadastro?{' '}
            <a href='/cadastro' className='text-primary hover:underline font-medium'>
              Cadastre-se
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;