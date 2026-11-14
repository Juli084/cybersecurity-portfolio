/**
 * Taxonomia do portfólio. Tudo que aparece em filtros, selos e na matriz de
 * competências sai daqui. Um laboratório só pode citar o que existe nesta lista.
 */

export const CATEGORIES = {
  'fundamentos-de-redes': 'Fundamentos de Redes',
  'troubleshooting-de-redes': 'Troubleshooting de Redes',
  'seguranca-de-redes': 'Segurança de Redes',
  'analise-de-trafego': 'Análise de Tráfego',
  'monitoramento-e-logs': 'Monitoramento e Logs',
  linux: 'Linux',
  windows: 'Windows',
  'reconhecimento-e-varredura': 'Reconhecimento e Varredura',
  'criptografia-e-integridade': 'Criptografia e Integridade',
  'malware-e-inteligencia': 'Malware e Inteligência de Ameaças',
  'forense-e-resposta': 'Forense e Resposta a Incidentes',
} as const;

export const ENVIRONMENTS = {
  'packet-tracer': 'Cisco Packet Tracer (rede simulada)',
  'vm-linux': 'VM Linux de laboratório (VirtualBox)',
  'vm-windows': 'VM Windows 10 (VirtualBox)',
  'pc-lab': 'PC Windows do laboratório do curso',
  online: 'Serviços online de análise',
  documental: 'Cenário documental',
} as const;

export const OS = {
  linux: 'Linux',
  windows: 'Windows',
  'cisco-ios': 'Cisco IOS (simulado)',
  nenhum: 'Sem sistema operacional específico',
} as const;

export const EVIDENCE_TYPES = {
  'pratica-guiada': 'Prática guiada',
  'pratica-executada': 'Prática executada',
  configuracao: 'Configuração',
  analise: 'Análise',
  investigacao: 'Investigação',
  'defesa-mitigacao': 'Defesa / Mitigação',
  'conhecimento-aplicado': 'Conhecimento aplicado',
} as const;

export const EVIDENCE_STRENGTH = {
  E3: {
    label: 'Evidência direta',
    short: 'Evidência direta',
    description:
      'Há captura de tela minha ou saída de terminal copiada na entrega, com resultado verificável.',
  },
  E2: {
    label: 'Registro textual próprio',
    short: 'Registro textual',
    description:
      'Há respostas, tabelas ou valores anotados por mim, mas sem captura de tela própria.',
  },
  E1: {
    label: 'Entrega parcial',
    short: 'Parcial',
    description: 'Atividade incompleta ou com resultado não obtido. Não conta como competência.',
  },
} as const;

export const KINDS = {
  laboratorio: 'Laboratório',
  serie: 'Série de laboratórios',
  avaliacao: 'Avaliação prática',
  'estudo-de-caso': 'Estudo de caso',
} as const;

export const SKILL_DOMAINS = {
  redes: 'Redes',
  'seguranca-de-redes': 'Segurança de redes',
  monitoramento: 'Monitoramento e detecção',
  sistemas: 'Sistemas operacionais',
  reconhecimento: 'Reconhecimento',
  criptografia: 'Criptografia e integridade',
  investigacao: 'Investigação e resposta',
  documentacao: 'Documentação',
} as const;

export type SkillDomain = keyof typeof SKILL_DOMAINS;

export const SKILLS = {
  'enderecamento-ipv4': { label: 'Endereçamento IPv4', domain: 'redes' },
  dhcp: { label: 'DHCP', domain: 'redes' },
  dns: { label: 'DNS', domain: 'redes' },
  nat: { label: 'NAT', domain: 'redes' },
  'midias-e-topologia': { label: 'Mídias, interfaces e leitura de topologia', domain: 'redes' },
  'troubleshooting-de-redes': { label: 'Diagnóstico de falhas de rede', domain: 'redes' },
  'wifi-wpa2': { label: 'Redes sem fio com WPA2', domain: 'redes' },
  'acl-cisco': { label: 'Listas de controle de acesso (ACL) em Cisco IOS', domain: 'seguranca-de-redes' },
  'aaa-tacacs-radius': { label: 'AAA com TACACS+ e RADIUS', domain: 'seguranca-de-redes' },
  'hardening-de-roteador': { label: 'Hardening de roteador sem fio', domain: 'seguranca-de-redes' },
  'controle-de-acesso': { label: 'Autenticação e autorização em serviços', domain: 'seguranca-de-redes' },
  'analise-de-pacotes': { label: 'Análise de pacotes', domain: 'monitoramento' },
  'leitura-de-logs': { label: 'Leitura de logs', domain: 'monitoramento' },
  netflow: { label: 'Telemetria de rede com NetFlow', domain: 'monitoramento' },
  'alertas-de-ids': { label: 'Leitura de alertas de IDS', domain: 'monitoramento' },
  'firewall-de-host': { label: 'Bloqueio de tráfego com iptables', domain: 'monitoramento' },
  'linux-cli': { label: 'Linha de comando Linux', domain: 'sistemas' },
  'permissoes-linux': { label: 'Permissões e sistema de arquivos no Linux', domain: 'sistemas' },
  'servicos-linux': { label: 'Serviços e processos no Linux', domain: 'sistemas' },
  'processos-windows': { label: 'Processos e Registro do Windows', domain: 'sistemas' },
  'monitoramento-windows': { label: 'Serviços, eventos e desempenho no Windows', domain: 'sistemas' },
  'varredura-de-portas': { label: 'Varredura de portas e serviços', domain: 'reconhecimento' },
  'hash-e-integridade': { label: 'Hash e verificação de integridade', domain: 'criptografia' },
  'criptografia-simetrica': { label: 'Criptografia simétrica (AES)', domain: 'criptografia' },
  'cifras-classicas-e-rsa': { label: 'Cifras clássicas e RSA', domain: 'criptografia' },
  'triagem-de-indicadores': { label: 'Triagem de indicadores de comprometimento', domain: 'investigacao' },
  'analise-de-ataque-web': { label: 'Reconhecimento de SQL injection em tráfego', domain: 'investigacao' },
  'linha-do-tempo-de-incidente': { label: 'Linha do tempo de incidente', domain: 'investigacao' },
  'contencao-e-mitigacao': { label: 'Recomendação de contenção e mitigação', domain: 'investigacao' },
  'documentacao-tecnica': { label: 'Documentação técnica', domain: 'documentacao' },
} as const satisfies Record<string, { label: string; domain: SkillDomain }>;

export type CategoryId = keyof typeof CATEGORIES;
export type EnvironmentId = keyof typeof ENVIRONMENTS;
export type OsId = keyof typeof OS;
export type EvidenceTypeId = keyof typeof EVIDENCE_TYPES;
export type EvidenceStrengthId = keyof typeof EVIDENCE_STRENGTH;
export type SkillId = keyof typeof SKILLS;
export type KindId = keyof typeof KINDS;

const keys = <T extends Record<string, unknown>>(o: T) =>
  Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

export const CATEGORY_IDS = keys(CATEGORIES);
export const ENVIRONMENT_IDS = keys(ENVIRONMENTS);
export const OS_IDS = keys(OS);
export const EVIDENCE_TYPE_IDS = keys(EVIDENCE_TYPES);
export const SKILL_IDS = keys(SKILLS);
