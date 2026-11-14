---
id: "011 e 019"
covers: ["011", "019"]
slug: logs-linux
title: "Leitura, localização e monitoramento de logs no Linux"
summary: >-
  Dois laboratórios sobre o mesmo assunto: ler arquivos de log com as ferramentas de linha de
  comando, encontrar o log de um serviço desconhecido e acompanhar eventos em tempo real.
date: "2025-09"
dateEnd: "2025-11"
kind: serie
category: monitoramento-e-logs
environments: [vm-linux]
os: [linux]
tools: [cat, more, less, tail, journalctl, grep, nginx]
protocols: [HTTP, syslog]
skills: [leitura-de-logs, linux-cli, servicos-linux]
evidenceTypes: [pratica-guiada, investigacao, analise]
evidenceStrength: E3
context: >-
  Log é a primeira fonte de qualquer investigação e de qualquer chamado. Cada aplicação escreve do
  seu jeito, mas as ferramentas para ler são sempre as mesmas.
objectives:
  - Ler logs com cat, more, less e tail e saber quando usar cada um
  - Entender a diferença entre syslog e journald
  - Localizar o log de um serviço em um sistema que não conheço
  - Acompanhar um log em tempo real enquanto gero eventos
procedure:
  - Li o mesmo arquivo de log com cat, more e less e comparei o comportamento.
  - Usei tail e tail -f em dois terminais, gerando eventos em um e observando no outro.
  - Li um log restrito com privilégio de root e consultei o journal com journalctl.
  - Interpretei uma entrada de erro de servidor web campo por campo.
  - Procurei, em um log de sistema, evidência de uma lentidão relatada num horário específico.
  - Localizei o serviço nginx com ps e grep e segui o log dele com journalctl -u.
evidence:
  - src: ./evidence/journalctl-nginx.png
    alt: Terminal com a saída do journalctl para o serviço nginx mostrando as mensagens de início, parada e desativação do serviço
    caption: Histórico do serviço nginx no journal, com início, parada e encerramento registrados pelo systemd.
result: >-
  Arquivos lidos com as quatro ferramentas, log do serviço localizado e acompanhado em tempo real, e
  a causa provável da lentidão identificada nas mensagens do sistema.
learning: >-
  Horário errado inutiliza log. Sem relógio sincronizado não dá para cruzar o que um servidor
  registrou com o que outro registrou. E tail -f em um terminal enquanto se testa em outro é o jeito
  mais direto de ver causa e efeito.
limitations:
  - O laboratório 011 não tem captura de tela; ficou o registro escrito das respostas.
  - Só uma captura do 019 foi guardada.
reproducibility:
  - Qualquer distribuição Linux com systemd e um serviço web instalado.
  - "Comandos centrais: tail -f, journalctl -u e ps com grep."
frameworks:
  csf:
    - { id: DE.CM, name: Continuous Monitoring }
    - { id: DE.AE, name: Adverse Event Analysis }
  nice: [Defensive Cybersecurity, Systems Administration]
references:
  - { label: "journalctl: página de manual", url: "https://www.freedesktop.org/software/systemd/man/latest/journalctl.html" }
  - { label: "RFC 5424: protocolo syslog", url: "https://www.rfc-editor.org/rfc/rfc5424" }
  - { label: "nginx: configuração de logs", url: "https://nginx.org/en/docs/ngx_core_module.html#error_log" }
---

## Qual ferramenta para qual situação

| Ferramenta | Serve para | Limite |
| --- | --- | --- |
| `cat` | Arquivo pequeno, ou para encadear com outro comando | Despeja tudo de uma vez; em arquivo grande, o início some da tela |
| `more` | Ler página por página | Navegação limitada |
| `less` | Ler, voltar e buscar dentro do arquivo | Não acompanha novas linhas por padrão |
| `tail` | Ver o fim do arquivo | Mostra só o estado no momento |
| `tail -f` | Acompanhar o que está sendo escrito agora | Precisa de outro terminal para gerar o evento |

## Syslog e journald

O syslog grava texto simples, legível com qualquer ferramenta e fácil de enviar a um servidor
remoto. O journald guarda em formato binário estruturado, o que permite filtrar por serviço, por
período ou por prioridade com `journalctl`, mas exige essa ferramenta para ler. Ver o journal
completo requer root ou participação em um grupo específico, o que por si só já é um controle de
acesso ao histórico da máquina.

## Lendo uma entrada

Uma linha de erro de servidor web traz horário, tipo do evento, processo, endereço do cliente e
descrição. No exemplo analisado, um cliente pediu um arquivo que não existia e o servidor registrou
o erro. Isolada, a linha é irrelevante. Centenas iguais, do mesmo endereço e em sequência, são
varredura.

## A lentidão

O chamado dizia que a rede ficou lenta em um horário específico. No log do sistema, naquele
intervalo, a interface de rede alternava entre ativa e inativa várias vezes. É a oscilação de
enlace, que na prática costuma ser cabo, porta de switch ou placa. O log não diz qual dos três, mas
diz onde procurar.
