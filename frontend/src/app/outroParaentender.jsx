<div className="login-root">
    {/* ── PAINEL ESQUERDO – Branding ── */}
    <aside className="branding">
        <div className="brand-inner">
            <div className="logo-mark">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="#C49A72" />
                    <path d="M9 23l5-5m0 0l3-3m-3 3l3 3m0-6l5-5" stroke="#fff" strokeWidth="2.2"
                        strokeLinecap="round" />
                </svg>
                <span className="logo-text">TechRent</span>
            </div>

            <div className="brand-copy">
                <h1>Sistema de<br />Chamados de TI</h1>
                <p>Gerencie equipamentos, técnicos e atendimentos em um só lugar.</p>
            </div>

            <div className="stats-row">
                <div className="stat">
                    <span className="stat-num">99%</span>
                    <span className="stat-label">uptime</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                    <span className="stat-num">3</span>
                    <span className="stat-label">perfis de acesso</span>
                </div>
            </div>
        </div>
    </aside>

    {/* ── PAINEL DIREITO – Formulário ── */}
    <main className="form-panel">
        <div className="form-card">
            <div className="form-header">
                <h2>Bem-vindo de volta</h2>
                <p>Entre com suas credenciais para acessar o painel</p>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
                <div className="field">
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" type="email" placeholder="seu@email.com" value={form.email}
                        onChange={handleChange} required autoComplete="email" />
                </div>

                <div className="field">
                    <label htmlFor="senha">Senha</label>
                    <input id="senha" name="senha" type="password" placeholder="••••••••" value={form.senha}
                        onChange={handleChange} required autoComplete="current-password" />
                </div>

                {erro && (
                <div className="erro-box" role="alert">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {erro}
                </div>
                )}

                <button type="submit" className="btn-submit" disabled={carregando}>
                    {carregando ? (
                    <>
                        <span className="spinner" aria-hidden="true" />
                        Entrando...
                    </>
                    ) : (
                    'Entrar'
                    )}
                </button>
            </form>

            <p className="form-footer">
                Primeiro acesso? Fale com o <span>administrador</span>.
            </p>
        </div>
    </main>

    <style>
        {

            ` *,
            *::before,
            *::after {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            .login-root {
                min-height: 100vh;
                display: flex;
                font-family: 'Inter', system-ui, sans-serif;
            }

            /* ── BRANDING ── */
            .branding {
                width: 42%;
                background: #111111;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 3rem;
                position: relative;
                overflow: hidden;
            }

            .branding::before {
                content: '';
                position: absolute;
                inset: 0;
                background: radial-gradient(ellipse at 30% 60%, rgba(196, 154, 114, 0.12) 0%, transparent 65%);
            }

            .brand-inner {
                position: relative;
                max-width: 360px;
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 3rem;
            }

            .logo-mark {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .logo-text {
                font-family: 'JetBrains Mono', 'Courier New', monospace;
                font-size: 1.3rem;
                font-weight: 700;
                color: #fff;
                letter-spacing: -0.02em;
            }

            .brand-copy h1 {
                font-size: 2.4rem;
                font-weight: 700;
                color: #fff;
                line-height: 1.2;
                letter-spacing: -0.03em;
                margin-bottom: 1rem;
            }

            .brand-copy p {
                font-size: 0.95rem;
                color: #888;
                line-height: 1.6;
            }

            .stats-row {
                display: flex;
                align-items: center;
                gap: 2rem;
                padding-top: 1.5rem;
                border-top: 1px solid #2a2a2a;
            }

            .stat {
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .stat-num {
                font-size: 1.5rem;
                font-weight: 700;
                color: #C49A72;
            }

            .stat-label {
                font-size: 0.75rem;
                color: #666;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }

            .stat-divider {
                width: 1px;
                height: 2.5rem;
                background: #2a2a2a;
            }

            /* ── FORM PANEL ── */
            .form-panel {
                flex: 1;
                background: #fafafa;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .form-card {
                width: 100%;
                max-width: 400px;
                background: #fff;
                border-radius: 16px;
                border: 1px solid #e8e8e8;
                padding: 2.5rem;
            }

            .form-header {
                margin-bottom: 2rem;
            }

            .form-header h2 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #111;
                letter-spacing: -0.02em;
            }

            .form-header p {
                margin-top: 4px;
                font-size: 0.875rem;
                color: #888;
            }

            .form-body {
                display: flex;
                flex-direction: column;
                gap: 1.25rem;
            }

            .field {
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            label {
                font-size: 0.8rem;
                font-weight: 600;
                color: #444;
                letter-spacing: 0.04em;
                text-transform: uppercase;
            }

            input {
                padding: 0.75rem 1rem;
                border: 1.5px solid #e2e2e2;
                border-radius: 10px;
                font-size: 0.95rem;
                color: #111;
                background: #fafafa;
                outline: none;
                transition: border-color 0.15s;
            }

            input:focus {
                border-color: #C49A72;
                background: #fff;
            }

            input::placeholder {
                color: #bbb;
            }

            .erro-box {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 0.75rem 1rem;
                background: #fff5f5;
                border: 1px solid #fecaca;
                border-radius: 8px;
                font-size: 0.875rem;
                color: #dc2626;
            }

            .btn-submit {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 0.875rem;
                background: #C49A72;
                color: #fff;
                font-size: 0.95rem;
                font-weight: 700;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                transition: background 0.15s, transform 0.1s;
                margin-top: 0.5rem;
            }

            .btn-submit:hover:not(:disabled) {
                background: #B08050;
            }

            .btn-submit:active:not(:disabled) {
                transform: scale(0.98);
            }

            .btn-submit:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }

            .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: #fff;
                border-radius: 50%;
                animation: spin 0.7s linear infinite;
            }

            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }

            .form-footer {
                margin-top: 1.5rem;
                text-align: center;
                font-size: 0.8rem;
                color: #aaa;
            }

            .form-footer span {
                color: #C49A72;
                font-weight: 600;
            }

            @media (max-width: 768px) {
                .login-root {
                    flex-direction: column;
                }

                .branding {
                    width: 100%;
                    padding: 2rem;
                    min-height: auto;
                }

                .brand-copy h1 {
                    font-size: 1.8rem;
                }

                .stats-row {
                    display: none;
                }
            }

            `
        }
    </style>
</div>