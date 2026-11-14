/**
 * Dados do candidato. Fonte: currículo fornecido por ele e materiais do curso.
 * Nada aqui é inferido: o que não consta nessas fontes fica de fora.
 */
export const profile = {
  name: 'Luiz Julio Rodrigues Neto',
  shortName: 'Luiz Julio',
  headline: 'Analista de Segurança da Informação Júnior | Redes de Computadores | Suporte em TI',
  location: 'Sorocaba, SP',
  objective: 'Busco uma posição em Segurança da Informação, Redes ou Suporte de TI.',
  intro:
    'Profissional de tecnologia com mais de 12 anos em diagnóstico, suporte técnico e desenvolvimento web, em transição para Segurança da Informação. Formado Técnico em Segurança Cibernética pelo Senac Sorocaba.',
  email: 'juliorodrigues84@live.com',
  linkedin: 'https://www.linkedin.com/in/julio-rodrigues84/',
  github: 'https://github.com/Juli084',
  repo: 'https://github.com/Juli084/cybersecurity-portfolio',
  cvFile: 'curriculo-luiz-julio-rodrigues-neto.pdf',
} as const;

export const education = [
  {
    title: 'Técnico em Segurança Cibernética',
    institution: 'Senac Sorocaba',
    status: 'Concluído',
    note: 'Os laboratórios deste portfólio foram feitos durante o curso, entre março de 2025 e agosto de 2026.',
    relatedDomains: ['redes', 'seguranca-de-redes', 'monitoramento', 'sistemas', 'criptografia', 'investigacao'],
  },
] as const;

export const certifications = [
  {
    title: 'Analista de Cibersegurança Júnior',
    issuer: 'Cisco Networking Academy',
    related: 'Fundamentos de cibersegurança, redes, defesa e gerenciamento de ameaças',
  },
  {
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco Networking Academy',
    related: 'TCP/IP, IPv4, switching e roteamento básicos',
  },
  {
    title: 'Gerenciamento de Ameaças Cibernéticas',
    issuer: 'Cisco Networking Academy',
    related: 'Ameaças, vulnerabilidades e resposta',
  },
] as const;

export const qualifications = [
  'Assistente em Segurança da Informação',
  'Assistente em Operação de Redes de Computadores',
  'Assistente em Segurança Cibernética de Computadores',
  'Assistente de Suporte e Manutenção de Computadores',
] as const;

export const courses = [
  {
    title: 'Introdução à Cibersegurança',
    issuer: 'Cisco Networking Academy',
    date: 'mar/2026',
    status: 'Módulos 1 a 5 concluídos com 100% nos questionários',
  },
] as const;

/** Experiência em tecnologia. Não é experiência profissional em cibersegurança. */
export const experience = [
  {
    role: 'Coordenador de E-commerce',
    company: 'Arbo Store Moda Premium',
    period: 'abr/2022 – atual',
    points: [
      'Coordenação operacional da plataforma de loja virtual e do ERP: cadastro de produtos, estoque e notas fiscais.',
      'Gestão do ciclo de vendas, processamento de pedidos, expedição e pós-venda.',
      'Controle e conciliação de estoque, com atenção à integridade dos dados.',
    ],
    transfers: 'Visão de processo, cuidado com integridade de dados e rotina operacional.',
  },
  {
    role: 'Líder Técnico e Desenvolvedor Web',
    company: 'iTech Soluções Digitais',
    period: '2013 – 2025',
    points: [
      'Diagnóstico, manutenção e resolução de problemas de hardware e software por mais de uma década.',
      'Desenvolvimento de sites e aplicações web com React, Next.js e Node.js.',
      'Atendimento consultivo: traduzir necessidade técnica em solução e explicar com clareza ao cliente.',
    ],
    transfers: 'Método de troubleshooting, comunicação técnica e leitura de como aplicações web funcionam.',
  },
] as const;

/**
 * Competências que vêm da experiência profissional e das certificações,
 * sem laboratório correspondente neste portfólio. Ficam separadas da matriz.
 */
export const otherSkills = [
  {
    group: 'Desenvolvimento web',
    items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'integração de APIs'],
    source: 'Experiência profissional (iTech Soluções Digitais)',
  },
  {
    group: 'Suporte e manutenção',
    items: ['Diagnóstico de hardware e software', 'instalação e configuração de Windows e Linux'],
    source: 'Experiência profissional',
  },
  {
    group: 'Ferramentas',
    items: ['Git', 'GitHub', 'Docker (noções básicas)', 'sistemas ERP'],
    source: 'Experiência profissional',
  },
  {
    group: 'Redes',
    items: ['Switching', 'Routing'],
    source: 'Certificação CCNA: Introduction to Networks',
  },
] as const;
