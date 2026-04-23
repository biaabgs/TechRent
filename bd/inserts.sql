-- Inserts

INSERT INTO usuarios (nome, email, senha, nivel_acesso) VALUES
  ('Admin Geral',      'admin@techrent.com',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'admin'),
  ('Carlos Mendes',    'carlos@techrent.com',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'tecnico'),
  ('Ana Paula',        'ana@techrent.com',      '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'tecnico'),
  ('Roberto Silva',    'roberto@techrent.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'tecnico'),
  ('Produção Setor A', 'setor.a@techrent.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'cliente'),
  ('Produção Setor B', 'setor.b@techrent.com',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'cliente'),
  ('Logística',        'logistica@techrent.com','$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uP3SbJ8G6', 'cliente');

INSERT INTO equipamentos (nome, categoria, patrimonio, status, descricao) VALUES
  ('Torno CNC #04',           'Usinagem',       'EQ-00204', 'em_manutencao', 'Torno de controle numérico para peças de precisão, capacidade até 500mm'),
  ('Compressor Ar Setor B',   'Pneumática',     'EQ-00089', 'em_manutencao', 'Compressor de ar comprimido 10 bar, 200L, uso industrial'),
  ('Esteira Logística 2',     'Transporte',     'EQ-00317', 'em_manutencao', 'Esteira transportadora de caixas, 40m lineares, velocidade variável'),
  ('Prensa Hidráulica 3',     'Conformação',    'EQ-00412', 'em_manutencao', 'Prensa hidráulica 150 toneladas para estampagem de chapas'),
  ('Painel Elétrico Setor A', 'Infraestrutura', 'EQ-00101', 'operacional',   'Quadro de distribuição elétrica 380V com CLP Siemens S7-300'),
  ('Fresadora Vertical #02',  'Usinagem',       'EQ-00155', 'operacional',   'Fresadora de bancada para acabamento superficial de moldes'),
  ('Empilhadeira Elétrica 1', 'Movimentação',   'EQ-00220', 'operacional',   'Empilhadeira elétrica capacidade 2.5 toneladas, bateria 48V'),
  ('Robô Soldagem MIG',       'Soldagem',       'EQ-00308', 'operacional',   'Célula robotizada de soldagem MIG/MAG, alcance 1.8m'),
  ('Serra Fita Industrial',   'Corte',          'EQ-00045', 'operacional',   'Serra fita para metais não ferrosos, lâmina 1400mm'),
  ('Lavadora de Peças',       'Limpeza',        'EQ-00512', 'desativado',    'Lavadora industrial por imersão, capacidade 300kg por ciclo');

INSERT INTO chamados (titulo, descricao, status, prioridade, cliente_id, tecnico_id, equipamento_id, aberto_em) VALUES

  -- ABERTOS — aguardando técnico
  (
    'Falha de sensor no Torno CNC #04',
    'Sensor de posição do eixo Z apresenta leitura incorreta após troca de ferramenta. Máquina parada por segurança.',
    'aberto', 'alta', 5, NULL, 1,
    NOW() - INTERVAL 1 HOUR
  ),
  (
    'Ruído anormal no motor da Esteira 2',
    'Motor emitindo ruído metálico ao atingir velocidade máxima. Possível problema no rolamento dianteiro.',
    'aberto', 'media', 7, NULL, 3,
    NOW() - INTERVAL 3 HOUR
  ),
  (
    'Painel elétrico com alarme intermitente',
    'Alarme de sobrecarga disparando esporadicamente no Setor A sem causa aparente identificada.',
    'aberto', 'baixa', 5, NULL, 5,
    NOW() - INTERVAL 5 HOUR
  ),

  (
    'Compressor Setor B não pressuriza',
    'Compressor atinge apenas 4 bar e não sobe para os 8 bar nominais. Produção do setor prejudicada.',
    'em_atendimento', 'alta', 6, 3, 2,
    NOW() - INTERVAL 2 HOUR
  ),
  (
    'Vazamento hidráulico na Prensa 3',
    'Pequeno vazamento de óleo hidráulico na conexão do cilindro principal durante o turno da manhã.',
    'em_atendimento', 'media', 6, 2, 4,
    NOW() - INTERVAL 4 HOUR
  ),

  (
    'Troca de correias da Fresadora #02',
    'Correias do cabeçote com desgaste avançado, vibração perceptível acima de 3000 RPM.',
    'resolvido', 'media', 5, 2, 6,
    NOW() - INTERVAL 4 DAY
  ),
  (
    'Bateria da empilhadeira com descarga rápida',
    'Bateria perdendo carga em menos de 2 horas. Ciclo normal é de 8 horas de operação.',
    'resolvido', 'alta', 7, 3, 7,
    NOW() - INTERVAL 6 DAY
  ),
  (
    'Calibração do robô de soldagem',
    'Após manutenção preventiva, robô apresentou desvio de 2mm no ponto de solda. Necessária recalibração.',
    'resolvido', 'media', 5, 4, 8,
    NOW() - INTERVAL 10 DAY
  ),
  (
    'Troca de lâmina da serra fita',
    'Lâmina quebrou durante corte de alumínio. Fragmentos presos no mecanismo de avanço.',
    'resolvido', 'alta', 7, 2, 9,
    NOW() - INTERVAL 15 DAY
  ),
  (
    'Torno CNC travando no eixo X',
    'Eixo X travando ao executar avanço rápido (G00). Erro 304 no controlador Fanuc.',
    'resolvido', 'alta', 5, 4, 1,
    NOW() - INTERVAL 20 DAY
  ),

  (
    'Revisão preventiva da lavadora de peças',
    'Solicitação de revisão geral antes de reativar o equipamento que está desativado há 3 meses.',
    'cancelado', 'baixa', 5, NULL, 10,
    NOW() - INTERVAL 8 DAY
  );

INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao, registrado_em) VALUES
  (
    6, 6, 2,
    'Substituídas as 3 correias do cabeçote (tipo B-52). Alinhamento das polias e tensão verificados conforme manual do fabricante. Equipamento testado em todas as rotações sem vibração residual.',
    NOW() - INTERVAL 3 DAY
  ),
  (
    7, 7, 3,
    'Teste de capacidade confirmou deterioração de células. Substituídas 4 células do banco de baterias. Carga completa realizada. Autonomia restaurada para 7h30 de operação contínua.',
    NOW() - INTERVAL 5 DAY
  ),
  (
    8, 8, 4,
    'Recalibração executada via RobotStudio. Ponto de solda ajustado com gabarito de referência. Desvio corrigido para 0.1mm, dentro da tolerância de projeto de ±0.5mm.',
    NOW() - INTERVAL 9 DAY
  ),
  (
    9, 9, 2,
    'Fragmentos da lâmina removidos do mecanismo. Instalada lâmina nova M42 bi-metal 1400x13mm. Tensão e guias ajustadas conforme tabela. Corte de teste em barra de alumínio 6061-T6 aprovado.',
    NOW() - INTERVAL 14 DAY
  ),
  (
    10, 1, 4,
    'Diagnóstico: porca do fuso ball-screw do eixo X com desgaste excessivo. Peça substituída e folga refeita. Parâmetro de backlash ajustado no Fanuc (P1851=12). Erro 304 eliminado após 20 ciclos de teste.',
    NOW() - INTERVAL 19 DAY
  );

INSERT INTO chamados (titulo, descricao, status, prioridade, cliente_id, tecnico_id, equipamento_id, aberto_em) VALUES

  -- Mais abertos na fila
  (
    'Empilhadeira fazendo barulho ao frear',
    'Ao acionar o freio regenerativo, empilhadeira emite estalo metálico. Operador relatou piora nos últimos 2 dias.',
    'aberto', 'media', 7, NULL, 7,
    NOW() - INTERVAL 30 MINUTE
  ),
  (
    'Robô de soldagem parando no meio do ciclo',
    'Robô interrompe ciclo de soldagem com alarme E103 (sobrecorrente no eixo J3). Ocorre 1 vez a cada 3 peças.',
    'aberto', 'alta', 5, NULL, 8,
    NOW() - INTERVAL 2 HOUR
  ),
  (
    'Serra fita desviando o corte',
    'Lâmina desviando cerca de 3mm para a direita em cortes longos. Peças fora de esquadro.',
    'aberto', 'baixa', 7, NULL, 9,
    NOW() - INTERVAL 6 HOUR
  ),

  -- Mais em atendimento
  (
    'Fresadora com vibração excessiva no cabeçote',
    'Vibração intensa ao fresar aço inox acima de 1500 RPM. Possível problema no mancal do cabeçote.',
    'em_atendimento', 'alta', 5, 4, 6,
    NOW() - INTERVAL 90 MINUTE
  ),
  (
    'Torno CNC com erro de zero peça',
    'Após queda de energia, torno perdeu referência do zero-peça em todos os eixos. Está produzindo fora de cota.',
    'em_atendimento', 'alta', 6, 2, 1,
    NOW() - INTERVAL 3 HOUR
  ),

  -- Mais resolvidos (últimos 30 dias para inflar taxa de resolução)
  (
    'Compressor com válvula de segurança disparando',
    'Válvula de alívio disparando a 7 bar mesmo com set-point em 9 bar. Produção parada.',
    'resolvido', 'alta', 6, 3, 2,
    NOW() - INTERVAL 2 DAY
  ),
  (
    'Esteira com correia desalinhada',
    'Correia da esteira saindo do trilho a cada 30 minutos de operação. Paradas frequentes no turno.',
    'resolvido', 'media', 7, 2, 3,
    NOW() - INTERVAL 3 DAY
  ),
  (
    'Prensa não completando ciclo',
    'Prensa desce mas não retorna automaticamente. Operador precisando acionar retorno manual a cada ciclo.',
    'resolvido', 'alta', 6, 4, 4,
    NOW() - INTERVAL 5 DAY
  ),
  (
    'Painel elétrico com disjuntor caindo',
    'Disjuntor do circuito de força caindo sempre que a fresadora é ligada junto com o torno.',
    'resolvido', 'media', 5, 3, 5,
    NOW() - INTERVAL 7 DAY
  ),
  (
    'Empilhadeira com direção pesada',
    'Sistema de direção assistida da empilhadeira com resposta lenta. Operadores reclamando de dificuldade de manobra.',
    'resolvido', 'baixa', 7, 2, 7,
    NOW() - INTERVAL 9 DAY
  ),
  (
    'Robô fora de ciclo após troca de tocha',
    'Após troca de tocha de solda, robô acusando erro de colisão preventiva (E210) ao iniciar o programa.',
    'resolvido', 'media', 5, 4, 8,
    NOW() - INTERVAL 12 DAY
  ),
  (
    'Serra fita com tensão de lâmina irregular',
    'Tensionador automático da lâmina travou na posição mínima. Cortes imprecisos e risco de quebra.',
    'resolvido', 'alta', 7, 3, 9,
    NOW() - INTERVAL 18 DAY
  ),
  (
    'Fresadora com fuso travado',
    'Fuso principal da fresadora não gira ao acionar o start. Motor funcionando, possível falha na embreagem.',
    'resolvido', 'alta', 5, 2, 6,
    NOW() - INTERVAL 22 DAY
  ),
  (
    'Compressor com óleo no filtro de ar',
    'Filtro de ar do compressor com presença de óleo, indicando desgaste dos anéis de pistão.',
    'resolvido', 'media', 6, 4, 2,
    NOW() - INTERVAL 25 DAY
  ),
  (
    'Esteira parada por sobrecarga térmica',
    'Motor da esteira desligando por proteção térmica após 40 minutos de operação contínua.',
    'resolvido', 'alta', 7, 3, 3,
    NOW() - INTERVAL 28 DAY
  );

INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao, registrado_em) VALUES
  (
    17, 2, 3,
    'Válvula de segurança substituída por unidade nova calibrada a 9.5 bar. Teste de pressão realizado por 2 horas sem disparo indevido. Filtro de ar também trocado preventivamente.',
    NOW() - INTERVAL 2 DAY
  ),
  (
    18, 3, 2,
    'Ajuste dos roletes de alinhamento lateral e tensão de correia corrigida conforme especificação do fabricante (±2mm). Monitorado por 1 turno completo sem desalinhamento.',
    NOW() - INTERVAL 3 DAY
  ),
  (
    19, 4, 4,
    'Identificada falha na válvula direcional do circuito de retorno. Válvula 4/3 substituída. Sistema purgado e testado em 50 ciclos consecutivos sem falha.',
    NOW() - INTERVAL 5 DAY
  ),
  (
    20, 5, 3,
    'Disjuntor de 63A substituído por modelo de 80A conforme reavaliação da carga instalada. Revisadas todas as conexões do barramento. Ligação simultânea dos equipamentos testada.',
    NOW() - INTERVAL 7 DAY
  ),
  (
    21, 7, 2,
    'Bomba hidráulica da direção assistida com desgaste no rotor. Bomba substituída e óleo hidráulico trocado (ATF Dexron III). Direção testada em manobras de 360° sem esforço.',
    NOW() - INTERVAL 9 DAY
  ),
  (
    22, 8, 4,
    'Parâmetros de TCP (Tool Center Point) recalibrados após troca de tocha. Teste com gabarito físico aprovado. Programa reiniciado e 10 peças de validação soldadas dentro da tolerância.',
    NOW() - INTERVAL 12 DAY
  ),
  (
    23, 9, 3,
    'Cilindro pneumático do tensionador substituído. Pressão de trabalho ajustada em 4.5 bar. Lâmina retensionada e alinhada. Corte de validação em alumínio e aço carbono aprovados.',
    NOW() - INTERVAL 18 DAY
  ),
  (
    24, 6, 2,
    'Embreagem eletromagnética do fuso com bobina queimada. Bobina substituída e ajuste de gap realizado (0.3mm). Fuso testado em toda a faixa de rotação (100 a 4000 RPM).',
    NOW() - INTERVAL 22 DAY
  ),
  (
    25, 2, 4,
    'Anéis de pistão do 1º cilindro com desgaste acima do limite. Kit de anéis substituído, cilindro honificado e cabeçote reaperto com torque especificado. Consumo de óleo monitorado.',
    NOW() - INTERVAL 25 DAY
  ),
  (
    26, 3, 3,
    'Motor desmontado: ventilação interna obstruída por pó metálico. Limpeza completa realizada, rolamentos substituídos e proteção térmica recalibrada para 85°C. Temperatura estabilizada em 72°C após 2h.',
    NOW() - INTERVAL 28 DAY
  );
