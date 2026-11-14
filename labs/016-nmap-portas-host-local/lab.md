---
id: "016"
covers: ["016"]
slug: nmap-portas-host-local
title: "Varredura de portas com Nmap em host local"
summary: >-
  Usei o Nmap contra a própria máquina virtual para descobrir quais portas TCP e UDP estavam
  abertas, que serviço havia em cada uma e que risco cada serviço representa.
date: "2025-10"
kind: laboratorio
category: reconhecimento-e-varredura
environments: [vm-linux]
os: [linux]
tools: [Nmap]
protocols: [TCP, UDP, FTP, SSH, Telnet, IPP, mDNS]
skills: [varredura-de-portas]
evidenceTypes: [pratica-executada, analise]
evidenceStrength: E3
context: >-
  Porta aberta é serviço exposto. Administradores varrem as próprias máquinas para saber o que está
  exposto antes que outra pessoa descubra.
objectives:
  - Detectar portas TCP e UDP abertas
  - Associar cada porta a um serviço
  - Avaliar o risco de cada serviço exposto
procedure:
  - Varri as portas TCP mais comuns do host local.
  - Repeti a varredura para UDP, que exige privilégio de administrador.
  - Executei os scripts padrão do Nmap para coletar detalhes dos serviços.
  - Pesquisei para que serve e que risco traz cada serviço encontrado.
scope: >-
  O alvo foi a própria máquina virtual de laboratório (localhost). Nenhum host de terceiros foi
  varrido.
result: >-
  Quatro portas TCP e uma UDP abertas, cada uma associada a um serviço. Três dos cinco serviços não
  precisavam estar expostos.
learning: >-
  A varredura UDP precisa de sudo e demora mais, e o resultado open|filtered significa que o Nmap
  não conseguiu distinguir porta aberta de porta filtrada. Saber ler essa incerteza é parte do
  resultado.
limitations:
  - Não há captura de tela; os resultados foram copiados do terminal para a entrega.
  - A impressão digital da chave de host SSH, obtida pelos scripts, foi omitida aqui.
reproducibility:
  - "Varredura TCP: nmap localhost. Varredura UDP: sudo nmap -sU localhost."
  - Usar apenas em máquinas próprias ou com autorização.
frameworks:
  attack:
    - { id: T1046, name: Network Service Discovery }
  csf:
    - { id: ID.RA, name: Risk Assessment }
  nice: [Vulnerability Analysis]
references:
  - { label: "Nmap: guia de referência", url: "https://nmap.org/book/man.html" }
  - { label: "IANA: registro de portas e serviços", url: "https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml" }
---

```text
PORTA      ESTADO          SERVIÇO
21/tcp     open            ftp
22/tcp     open            ssh
23/tcp     open            telnet
631/tcp    open            ipp
5353/udp   open|filtered   zeroconf
```

| Porta | Serviço | Avaliação |
| --- | --- | --- |
| 21/tcp | FTP | Transfere arquivos e credenciais em texto claro. Só se justifica com necessidade real e, de preferência, substituído por SFTP. |
| 22/tcp | SSH | Acesso remoto cifrado. Aceitável, com autenticação por chave e sem login direto de root. |
| 23/tcp | Telnet | Acesso remoto em texto claro. Não deveria estar ativo. |
| 631/tcp | IPP | Serviço de impressão. Desnecessário em servidor. |
| 5353/udp | mDNS | Descoberta automática de serviços na rede local. Útil em casa, ruído e superfície em rede corporativa. |

FTP e Telnet lado a lado com SSH é o achado principal. Os três dão acesso à máquina, mas dois deles
entregam a senha a qualquer um que esteja capturando o tráfego do segmento.

## Chaves de host

Os scripts do Nmap devolveram as chaves públicas de host do SSH. Chave pública é pública, e a coleta
em si não é uma falha. O risco está em outro lugar: se a chave privada correspondente vazar, um
invasor pode se passar pelo servidor e interceptar sessões. Por isso a chave privada do host fica
legível apenas pelo root, e a troca dela faz parte da resposta a um comprometimento.

## O que eu faria nessa máquina

Desativar Telnet e FTP, manter SSH com chave, parar o serviço de impressão e bloquear no firewall
tudo o que não for necessário. A varredura seguinte deveria mostrar uma porta, não cinco.
