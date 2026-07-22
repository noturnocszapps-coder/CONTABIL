export interface Article {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  keywords: string[];
  summary: string;
  content: {
    intro: string;
    sections: {
      id: string;
      title: string;
      content: string;
      subsections?: {
        title: string;
        content: string;
      }[];
    }[];
    faqs?: {
      q: string;
      a: string;
    }[];
  };
  relatedSlugs: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: 'o-que-e-split-payment',
    title: 'O que é Split Payment? Guia Completo da Reforma Tributária EC 132/2023',
    seoTitle: 'O que é Split Payment? Guia e Impactos da Reforma Tributária',
    description: 'Entenda como funciona o Split Payment, a retenção e recolhimento automático de tributos na liquidação financeira das vendas e o impacto nas empresas.',
    category: 'Split Payment',
    publishedAt: '2026-03-15',
    updatedAt: '2026-07-20',
    readTime: '6 min de leitura',
    keywords: [
      'Split Payment',
      'Reforma Tributária',
      'EC 132/2023',
      'IBS e CBS',
      'Retenção na fonte',
      'Fluxo de caixa'
    ],
    summary: 'O Split Payment é o mecanismo central de arrecadação da Reforma Tributária que separa automaticamente o imposto do valor da venda no momento da transação financeira.',
    content: {
      intro: 'A Emenda Constitucional nº 132/2023 introduziu profundas transformações no sistema tributário brasileiro. Entre as inovações mais impactantes para a gestão financeira das empresas está o mecanismo conhecido como Split Payment (ou recolhimento fracionado automático na liquidação financeira).',
      sections: [
        {
          id: 'conceito-basico',
          title: 'O Conceito Fundamental do Split Payment',
          content: 'No modelo tradicional, quando uma empresa realiza uma venda a prazo de R$ 10.000, ela recebe o valor integral na sua conta bancária (ou na adquirente de cartão/boleto) e, semanas depois, calcula e recolhe os tributos devidos através das guias fiscais. Com o Split Payment, no instante da liquidação financeira da transação (seja via Pix, cartão de crédito, débito ou boleto bancário), o arranjo de pagamento segrega automaticamente a fatia referente aos novos impostos (IBS e CBS) e a direciona diretamente para os cofres públicos.',
          subsections: [
            {
              title: 'Mecanismo em Tempo Real',
              content: 'A instituição financeira ou credenciadora atuará como agente de retenção. O valor líquido remanescente é creditado na conta da empresa vendedora, sem que o imposto transite pelo seu caixa.'
            },
            {
              title: 'Eliminação da Inadimplência Fiscal',
              content: 'Para o Fisco, a principal vantagem é mitigar a sonegação e o não recolhimento de impostos cobrados na venda, garantindo arrecadação instantânea e automatizada.'
            }
          ]
        },
        {
          id: 'impacto-operacional',
          title: 'Como o Split Payment Altera a Rotina Financeira',
          content: 'Embora o Split Payment não signifique necessariamente um aumento formal de alíquota nominal, seu efeito prático na liquidez imediata do negócio é severo. Empresas que utilizavam o caixa temporário decorrente dos prazos de recolhimento dos impostos para financiar o capital de giro operacional não contarão mais com esse recurso flutuante.'
        },
        {
          id: 'relacao-ibs-cbs',
          title: 'A Relação com o IBS e a CBS (Imposto Dual)',
          content: 'O Split Payment se aplica ao Imposto sobre Bens e Serviços (IBS), de competência estadual e municipal, e à Contribuição sobre Bens e Serviços (CBS), de competência federal. Ambos compõem o IVA Dual brasileiro estabelecido pela EC 132/2023.'
        }
      ],
      faqs: [
        {
          q: 'O Split Payment substitui a emissão da Nota Fiscal?',
          a: 'Não. A emissão do documento fiscal eletrônico (NF-e, NFC-e, NFS-e) permanece obrigatória e será a base de dados que informará à instituição financeira a alíquota exata a ser retida no momento do pagamento.'
        },
        {
          q: 'O Split Payment se aplica a vendas no dinheiro em espécie?',
          a: 'Para vendas em espécie, o recolhimento não pode ser feito via liquidação bancária automática. Nesses casos, aplicam-se regras específicas de apuração e recolhimento periódico previstas na regulamentação.'
        }
      ]
    },
    relatedSlugs: ['como-split-payment-afeta-fluxo-de-caixa', 'ibs-e-cbs-o-que-muda-para-empresas', 'como-preparar-empresa-para-reforma-tributaria']
  },
  {
    slug: 'como-split-payment-afeta-fluxo-de-caixa',
    title: 'Como o Split Payment pode Afetar o Fluxo de Caixa das Empresas',
    seoTitle: 'Impacto do Split Payment no Fluxo de Caixa Empresarial',
    description: 'Análise detalhada do impacto da retenção imediata de impostos no capital de giro, ciclo financeiro e capacidade de pagamento das empresas.',
    category: 'Fluxo de Caixa',
    publishedAt: '2026-03-20',
    updatedAt: '2026-07-21',
    readTime: '7 min de leitura',
    keywords: [
      'Fluxo de Caixa',
      'Capital de Giro',
      'Split Payment impacto',
      'Ciclo financeiro',
      'PMR PMP',
      'Liquidez empresarial'
    ],
    summary: 'A retenção imediata dos tributos elimina a folga de caixa entre a venda e o vencimento das guias, exigindo readequação urgente nos prazos médios e na gestão de liquidez.',
    content: {
      intro: 'O fluxo de caixa é a artéria vital de qualquer empreendimento. A implementação do Split Payment trará uma mudança estrutural relevante na dinâmica de entradas e saídas financeiras das empresas brasileiras, especialmente aquelas operando com vendas parceladas e a prazo.',
      sections: [
        {
          id: 'descasamento-prazos',
          title: 'O Descasamento entre Recebimentos e Obrigações',
          content: 'Atualmente, uma empresa que vende a prazo (ex.: 30, 60 ou 90 dias) acumula o direito de receber e só recolhe os tributos no mês subsequente ao faturamento. Com a retenção no Split Payment, a parcela referente ao IBS e à CBS é descontada imediatamente no momento em que o cliente paga a parcela. Se a venda for parcelada, o imposto incide e é recolhido a cada liquidação, alterando o valor líquido efetivamente recebido.',
          subsections: [
            {
              title: 'Impacto na Margem de Segurança',
              content: 'A empresa passa a receber menos dinheiro em conta a cada venda realizada a prazo, reduzindo o caixa disponível para quitar fornecedores e folha de pagamento no curto prazo.'
            },
            {
              title: 'Fim do "Empréstimo sem Juros" do Imposto',
              content: 'Muitos gestores utilizavam o valor acumulado dos impostos a recolher como fôlego de curto prazo. Essa prática deixa de existir com a automação da retenção.'
            }
          ]
        },
        {
          id: 'calculo-pmr-pmp',
          title: 'A Importância do PMR (Prazo Médio de Recebimento) e PMP',
          content: 'Quanto maior for o seu Prazo Médio de Recebimento (PMR) em relação ao Prazo Médio de Pagamento de Fornecedores (PMP), mais vulnerável a sua empresa estará ao efeito tesoura no fluxo de caixa no momento de transição para o Split Payment.'
        },
        {
          id: 'acoes-mitigadoras',
          title: 'Estratégias para Proteger a Liquidez do Negócio',
          content: 'Para evitar sobressaltos e dependência excessiva de linhas de crédito bancário caras (como antecipação de recebíveis ou cheque especial), as empresas precisam desde já recalcular suas margens operacionais, renegociar prazos com fornecedores e realizar simulações periódicas de cenários.'
        }
      ],
      faqs: [
        {
          q: 'O Split Payment afeta vendas feitas no cartão de crédito?',
          a: 'Sim. As adquirentes e credenciadoras de cartão de crédito serão peças centrais no arranjo do Split Payment, efetuando o desconto do imposto antes de repassar o líquido à loja.'
        }
      ]
    },
    relatedSlugs: ['o-que-e-split-payment', 'capital-de-giro-e-split-payment', 'como-preparar-empresa-para-reforma-tributaria']
  },
  {
    slug: 'ibs-e-cbs-o-que-muda-para-empresas',
    title: 'IBS e CBS: O que Muda para as Empresas com os Novos Tributos',
    seoTitle: 'IBS e CBS na Reforma Tributária: Guia e Mudanças para Empresas',
    description: 'Entenda a substituição do PIS, Cofins, IPI, ICMS e ISS pelo Imposto sobre Bens e Serviços (IBS) e pela Contribuição sobre Bens e Serviços (CBS).',
    category: 'Reforma Tributária',
    publishedAt: '2026-04-02',
    updatedAt: '2026-07-18',
    readTime: '8 min de leitura',
    keywords: [
      'IBS',
      'CBS',
      'Reforma Tributária 2027',
      'Imposto Dual',
      'Não cumulatividade plena',
      'Alíquota de referência'
    ],
    summary: 'A substituição de 5 tributos por 2 impostos sobre o consumo estabelece a não cumulatividade plena e o princípio do destino na tributação brasileira.',
    content: {
      intro: 'A Reforma Tributária sobre o consumo aprovada pela Emenda Constitucional nº 132/2023 unifica cinco tributos históricos (PIS, Cofins, IPI de competência federal; ICMS de competência estadual; e ISS de competência municipal) em um modelo de Imposto sobre Valor Agregado (IVA) Dual.',
      sections: [
        {
          id: 'divisao-dual',
          title: 'A Estrutura do IVA Dual: IBS e CBS',
          content: 'O sistema brasileiro foi dividido em duas frentes para respeitar o pacto federativo: a CBS (Contribuição sobre Bens e Serviços), administrada pela Receita Federal do Brasil, e o IBS (Imposto sobre Bens e Serviços), gerido por um Comitê Gestor paritário entre Estados e Municípios.',
          subsections: [
            {
              title: 'CBS (Federal)',
              content: 'Substitui gradualmente o PIS, a Cofins e o IPI, unificando a legislação em âmbito nacional.'
            },
            {
              title: 'IBS (Estadual e Municipal)',
              content: 'Substitui o ICMS e o ISS, acabando com a guerra fiscal entre estados e municípios e tributando no local de consumo do bem ou serviço.'
            }
          ]
        },
        {
          id: 'nao-cumulatividade',
          title: 'Não Cumulatividade Plena e Acreditações',
          content: 'Uma das grandes promessas do novo sistema é a não cumulatividade plena (crédito financeiro). Em tese, todo tributo pago nas etapas anteriores da cadeia gera crédito para a empresa adquirente, reduzindo o efeito cascata histórico. O Split Payment garante que o crédito só seja homologado quando o tributo da etapa anterior for efetivamente retido e recolhido.'
        },
        {
          id: 'transicao-gradual',
          title: 'Cronograma de Transição e Prazos',
          content: 'O período de transição foi desenhado para ser gradual a partir de 2026 e 2027, permitindo testes de sistemas e ajustes operacionais por parte das empresas e dos órgãos arrecadadores.'
        }
      ],
      faqs: [
        {
          q: 'Qual será a alíquota padrão do IBS e da CBS?',
          a: 'As alíquotas definitivas serão fixadas através de Lei Complementar e resoluções do Senado com base nos estudos de neutralidade de arrecadação. Estimativas de referência trabalham com uma alíquota combinada perto de 26.5% a 28%.'
        }
      ]
    },
    relatedSlugs: ['o-que-e-split-payment', 'como-preparar-empresa-para-reforma-tributaria', 'capital-de-giro-e-split-payment']
  },
  {
    slug: 'como-preparar-empresa-para-reforma-tributaria',
    title: 'Como Preparar sua Empresa para o Split Payment e a Reforma Tributária',
    seoTitle: 'Como Preparar sua Empresa para o Split Payment e a Reforma',
    description: 'Guia prático de adaptação e planejamento preventivo para empresários, gestores financeiros e consultores contábeis.',
    category: 'Planejamento Empresarial',
    publishedAt: '2026-04-10',
    updatedAt: '2026-07-19',
    readTime: '6 min de leitura',
    keywords: [
      'Preparação empresarial',
      'Diagnóstico tributário',
      'Reforma Tributária planejamento',
      'Gestão de capital de giro',
      'Adaptação ao Split Payment'
    ],
    summary: 'O planejamento antecipado envolve mapear meios de pagamento, simular o impacto no capital de giro e revisar termos comerciais com fornecedores.',
    content: {
      intro: 'Esperar pelo início obrigatório da transição da Reforma Tributária para agir é um risco desnecessário para a sobrevivência financeira do seu negócio. As empresas mais bem preparadas serão aquelas que utilizarem a tecnologia e o diagnóstico de dados para antecipar cenários de liquidez.',
      sections: [
        {
          id: 'passo-1-diagnostico',
          title: '1. Diagnóstico de Liquidez e Ciclo Financeiro',
          content: 'O primeiro passo é mapear exatamente como a sua receita é composta por meio de pagamento (Pix, cartão à vista, cartão parcelado, boleto faturado) e calcular com precisão o Prazo Médio de Recebimento (PMR) versus o Prazo Médio de Pagamento (PMP).',
          subsections: [
            {
              title: 'Mapeamento das Vendas por Canal',
              content: 'Identifique a proporção de vendas a prazo e o percentual de antecipação de recebíveis praticado pela empresa.'
            },
            {
              title: 'Simulação de Retenção na Liquidação',
              content: 'Avalie qual seria o saldo de caixa semanal caso a retenção estimada de imposto ocorresse na fonte em cada liquidação.'
            }
          ]
        },
        {
          id: 'passo-2-precificacao',
          title: '2. Revisão da Estrutura de Formação de Preço (Markup)',
          content: 'Como a dinâmica de tributos e créditos mudará com o IBS/CBS, as fórmulas de formação de preços precisam ser revistas. A margem de contribuição bruta deverá levar em conta o valor líquido recebido no ato da liquidação.'
        },
        {
          id: 'passo-3-sistemas',
          title: '3. Atualização de Sistemas e Parceria Contábil',
          content: 'Certifique-se de que seus sistemas ERP, emissores de nota fiscal e ferramentas de controle financeiro estejam em sintonia com a assessoria da sua contabilidade para acompanhar a edição das leis complementares.'
        }
      ],
      faqs: [
        {
          q: 'O Split Ready AI substitui a minha contabilidade?',
          a: 'Não. O Split Ready AI é uma ferramenta analítica de simulação de caixa e diagnóstico estratégico. Ele foi concebido para trabalhar em sintonia com o seu contador e consultor financeiro.'
        }
      ]
    },
    relatedSlugs: ['o-que-e-split-payment', 'como-split-payment-afeta-fluxo-de-caixa', 'capital-de-giro-e-split-payment']
  },
  {
    slug: 'capital-de-giro-e-split-payment',
    title: 'Capital de Giro e Split Payment: Como Evitar a Asfixia Financeira',
    seoTitle: 'Capital de Giro e Split Payment: Evite a Asfixia Financeira',
    description: 'Entenda como o descasamento de caixa entre vendas parceladas e custos operacionais pode ser intensificado pelo recolhimento do tributo na fonte.',
    category: 'Gestão Financeira',
    publishedAt: '2026-04-25',
    updatedAt: '2026-07-22',
    readTime: '6 min de leitura',
    keywords: [
      'Capital de giro',
      'Asfixia financeira',
      'PMR e PMP',
      'Gestão de tesouraria',
      'Split Payment liquidez'
    ],
    summary: 'Com a retenção automática, empresas que financiam operações com o caixa de tributos diferidos precisarão reestruturar suas fontes de capital e prazos.',
    content: {
      intro: 'A expressão "asfixia financeira" descreve a situação na qual uma empresa, embora rentável no papel e com boas vendas, fica incapaz de honrar seus compromissos imediatos por falta de dinheiro disponível em caixa no dia a dia. O Split Payment intensifica a necessidade de disciplina e gestão rigorosa do capital de giro.',
      sections: [
        {
          id: 'efeito-tesoura',
          title: 'O Efeito Tesoura no Novo Cenário Tributário',
          content: 'O efeito tesoura ocorre quando a necessidade de capital de giro cresce num ritmo mais rápido do que a disponibilidade do saldo de caixa. Na transição do sistema antigo para o Split Payment, o saldo em conta corrente das empresas sentirá a redução imediata no valor bruto repassado pelas adquirentes e bancos.',
          subsections: [
            {
              title: 'Ajuste no Fôlego de Tesouraria',
              content: 'A retenção reduz a margem de oscilação do caixa, tornando imperioso que a empresa mantenha uma reserva de emergência e linhas de liquidez previamente estruturadas.'
            },
            {
              title: 'Alinhamento de Prazos com Fornecedores',
              content: 'Será fundamental renegociar os prazos de compra para aproximar o PMP do novo ritmo de liquidação de caixa retida.'
            }
          ]
        },
        {
          id: 'ferramentas-diagnostico',
          title: 'A Importância de Simular o Split Ready Score™',
          content: 'Utilizar diagnósticos quantitativos como o Split Ready Score™ permite identificar com precisão o nível de vulnerabilidade da empresa frente aos novos desafios de liquidez, possibilitando a implementação de ações corretivas antes do início dos testes operacionais do Fisco.'
        }
      ],
      faqs: [
        {
          q: 'Empresas do Simples Nacional correm risco de asfixia financeira?',
          a: 'Sim, se realizarem vendas expressivas a prazo e operarem com margens apertadas. O Simples Nacional terá regras específicas de transição e opção pelo regime regular, exigindo atenção dobrada dos gestores.'
        }
      ]
    },
    relatedSlugs: ['o-que-e-split-payment', 'como-split-payment-afeta-fluxo-de-caixa', 'como-preparar-empresa-para-reforma-tributaria']
  }
];
