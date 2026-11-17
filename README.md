# Portfólio de Segurança Cibernética

**Luiz Julio Rodrigues Neto** · Sorocaba, SP

Portfólio baseado em evidências: cada competência aponta para um laboratório, e cada laboratório
mostra o que foi feito, o que foi observado e o que ficou faltando.

**Site:** https://juli084.github.io/cybersecurity-portfolio/

## O que há aqui

- **38 laboratórios** do curso Técnico em Segurança Cibernética (Senac Sorocaba), documentados em
  24 páginas. Atividades pequenas sobre o mesmo assunto foram reunidas em séries.
- **2 projetos integradores** feitos em equipe, com a parte de cada um indicada.
- **Matriz de competências** gerada a partir dos metadados dos laboratórios.

Por onde começar:

| Laboratório | Assunto |
| --- | --- |
| [043](labs/043-snort-tcpdump-iptables/README.md) | Alertas do Snort, captura com tcpdump e bloqueio com iptables |
| [029](labs/029-aaa-tacacs-radius/README.md) | Correção de falhas e AAA com TACACS+ e RADIUS |
| [031–034](labs/031-serie-acl/README.md) | Listas de controle de acesso em roteadores Cisco |
| [026](labs/026-malware-hash/README.md) | Triagem de um alerta a partir de um hash |
| [042 e 044](labs/042-syslog-aaa-netflow/README.md) | Syslog, contabilidade AAA e NetFlow |
| [046](labs/046-forense-nota-fiscal/README.md) | Linha do tempo de um incidente |

Lista completa em [labs/README.md](labs/README.md).

## Como a evidência é classificada

| Selo | Critério |
| --- | --- |
| **E3, evidência direta** | Captura de tela própria ou saída de terminal copiada na entrega |
| **E2, registro textual** | Respostas, tabelas ou valores anotados, sem captura própria |

Atividades incompletas ou com entrega ainda não conferida ficaram de fora. O método completo está em
[docs/methodology.md](docs/methodology.md) e o escopo em [docs/ethics.md](docs/ethics.md).

## Estrutura

```
labs/NNN-slug/
  lab.md        fonte: metadados e análise
  README.md     gerado a partir do lab.md
  evidence/     capturas tratadas
projects/       projetos integradores
docs/           metodologia, ética, matriz de competências, referências
src/            site (Astro + TypeScript)
scripts/        geração de READMEs, auditoria de privacidade, verificação de links
```

O `lab.md` é a fonte única. O site lê esse arquivo, e `npm run readmes` gera o `README.md` de cada
pasta a partir dele. O esquema em `src/content.config.ts` faz o build falhar se um laboratório
estiver sem campo obrigatório ou citar algo fora da taxonomia.

## Rodando localmente

Requer Node 22.23.4 ou superior (exigência do Astro 7).

```bash
npm install
npm run dev          # servidor local
npm run qa           # READMEs, verificação de tipos, build, privacidade e links
```

## Privacidade

Endereços e nomes de máquina da rede da instituição foram substituídos. Senhas de laboratório,
indicadores de código malicioso, nomes de terceiros e dados de participantes não são publicados.
`npm run audit:privacy` verifica isso a cada build.

## Licença

Código sob licença MIT. Textos e imagens com todos os direitos reservados. Veja [LICENSE](LICENSE).
