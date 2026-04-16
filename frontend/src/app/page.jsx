'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import Logo from '@/components/shadcn-studio/logo'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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

  const [isVisible, setIsVisible] = useState(false)

  return (

    <div
      className='relative flex h-auto min-h-screen items-center justify-center overflow-x-hidden px-4 py-10 sm:px-6 lg:px-8'>
      <div className='absolute'>

      </div>
      <Card className='z-1 w-full border-none shadow-md sm:max-w-lg'>
        <CardHeader className='gap-6'>

          <Logo className='gap-3' />

          <div>
            <CardTitle className='mb-1.5 text-2xl font-sans'>Bem vindo de vota!</CardTitle>
            <CardDescription className='text-base'>Faça seu login</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          {/* <p className='text-muted-foreground mb-6'>
            Login with{' '}
            <a href='#' className='text-card-foreground hover:underline'>
              Magic Link
            </a>
          </p> */}

          {/* Login Form */}
          <div className='space-y-4'>

            <form className='space-y-4' onSubmit={handleSubmit}>
              {/* Email */}
              <div className='space-y-1'>
                <Label htmlFor='userEmail' className='leading-5'>
                  Email
                </Label>
                <Input type='email' id='userEmail' placeholder='Enter your email address' />
              </div>
              {/* Password */}
              <div className='w-full space-y-1'>
                <Label htmlFor='password' className='leading-5'>
                  Senha
                </Label>
                <div className='relative'>
                  <Input
                    id='senha' // ou mantenha password, mas o 'name' é o mais importante abaixo
                    name='senha' // <-- ADICIONE ISSO
                    type={isVisible ? 'text' : 'password'}
                    placeholder='••••••••••••••••'
                    className='pr-9 [&::-ms-reveal]:hidden'
                    value={form.senha}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                  />
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setIsVisible(prevState => !prevState)}
                    className='text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'>
                    {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                    <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
                  </Button>
                </div>
              </div>

              {erro && (
                <div className="erro-box flex gap-2 items-center" role="alert">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M8 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {erro}
                </div>
              )}

              {/* Lembrar de mim */}
              <div className='flex items-center justify-between gap-y-2'>
                <div className='flex items-center gap-3'>
                  <Checkbox id='rememberMe' className='size-6' />
                  <Label htmlFor='rememberMe' className='text-muted-foreground'>
                    {' '}
                    Lembrar de mim
                  </Label>
                </div>

                {/* <a href='#' className='hover:underline'>
                  Esqueceu sua senha?
                </a> */}

              </div>
              <Button type="submit" className="btn-submit w-full" disabled={carregando}>
                {carregando ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </Button>

            </form>

            <p className='text-muted-foreground text-center'>
              Não tem cadastro? {' '}
              <a href='#' className='text-card-foreground hover:underline'>
                Cadastre-se
              </a>
            </p>

          </div>
        </CardContent>
      </Card>
    </div>

  );
}