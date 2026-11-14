---
id: "031–034"
covers: ["031", "032", "033", "034"]
slug: serie-acl
title: "Listas de controle de acesso em roteadores Cisco: padrão e estendida, numerada e nomeada"
summary: >-
  Quatro laboratórios em sequência. Em cada um mapeei a rede, escrevi a ACL, apliquei na interface
  certa e conferi pelos contadores e por testes o que passava e o que era barrado.
date: "2026-03"
dateEnd: "2026-04"
kind: serie
category: seguranca-de-redes
environments: [packet-tracer]
os: [cisco-ios]
tools: [Cisco Packet Tracer, Cisco IOS]
protocols: [IPv4, TCP, ICMP, FTP, HTTP, HTTPS]
skills: [acl-cisco, enderecamento-ipv4, documentacao-tecnica]
evidenceTypes: [configuracao, analise]
evidenceStrength: E3
featured: 3
context: >-
  ACL é o filtro mais básico de um roteador: uma lista ordenada de regras que decide, pelo cabeçalho
  do pacote, o que segue e o que é descartado. Os quatro laboratórios cobrem os dois tipos e as duas
  formas de identificá-las.
objectives:
  - Mapear o endereçamento antes de escrever qualquer regra
  - Configurar ACL padrão, por origem, numerada e nomeada
  - Configurar ACL estendida, por origem, destino, protocolo e porta
  - Aplicar cada ACL na interface e na direção adequadas
  - Verificar o resultado por testes e pelos contadores de correspondência
procedure:
  - "031: ACL padrão nomeada permitindo dois hosts e negando o restante no acesso a um servidor de arquivos."
  - "032: ACL padrão numerada em dois roteadores, cada uma barrando uma rede de origem, aplicada na saída para a rede protegida. Testes antes e depois."
  - "033: ACL estendida numerada liberando só FTP e ping de uma estação, e ACL estendida nomeada liberando só web e ping de outra."
  - "034: ACL estendida nomeada bloqueando HTTP e HTTPS de uma estação, FTP de outra e ping de uma terceira, com permissão geral ao final."
  - Em todos, conferi com show access-lists e repeti os testes a partir de cada estação.
evidence:
  - src: ./evidence/031-show-access-lists.png
    alt: Saída de show access-list com uma ACL padrão nomeada de três regras e o número de correspondências em cada uma
    caption: "031: a ACL em funcionamento. Os contadores mostram oito pacotes da estação autorizada e 22 barrados pela negação final."
  - src: ./evidence/031-ping-estacao-nao-autorizada.png
    alt: Prompt de comando de uma estação com dois pings respondendo e um terceiro, para o servidor protegido, retornando destino inacessível
    caption: "031: a estação não autorizada alcança a rede, mas o roteador responde destino inacessível quando o alvo é o servidor de arquivos."
  - src: ./evidence/032-acl-na-interface.png
    alt: Trecho da configuração de uma interface com o comando ip access-group 1 out
    caption: "032: ACL aplicada na saída da interface que leva à rede protegida."
  - src: ./evidence/032-contadores-r2.png
    alt: Saída de show access-list em um roteador com negação de uma rede e permissão geral, com contadores
    caption: "032: contadores no primeiro roteador, 16 pacotes barrados e 13 permitidos."
  - src: ./evidence/032-contadores-r3.png
    alt: Saída de show access-list em outro roteador com negação de outra rede e permissão geral, com contadores
    caption: "032: contadores no segundo roteador."
  - src: ./evidence/032-ping-depois.png
    alt: Prompt de comando com ping para a rede bloqueada retornando destino inacessível e ping para o servidor web respondendo
    caption: "032: depois das ACLs, a estação não alcança a rede bloqueada e continua alcançando o servidor web."
  - src: ./evidence/034-acl-na-interface.png
    alt: Trecho da configuração de uma interface com o comando ip access-group de uma ACL nomeada na entrada
    caption: "034: ACL estendida aplicada na entrada da interface da LAN, perto da origem."
  - src: ./evidence/034-http-bloqueado.png
    alt: Navegador de uma estação tentando abrir um servidor por HTTP e recebendo tempo esgotado
    caption: "034: HTTP da primeira estação para o servidor, bloqueado."
  - src: ./evidence/034-ftp-permitido.png
    alt: Prompt de comando da mesma estação conectando ao servidor por FTP e concluindo o login
    caption: "034: a mesma estação usa FTP normalmente. A regra bloqueia o serviço, não a máquina."
  - src: ./evidence/034-ftp-bloqueado.png
    alt: Prompt de comando de outra estação tentando FTP e recebendo tempo esgotado
    caption: "034: FTP da segunda estação, bloqueado."
result: >-
  As quatro ACLs funcionaram como planejado, confirmadas por contadores e por testes de sucesso e
  de falha.
learning: >-
  Onde a ACL fica importa tanto quanto o que ela diz. A padrão só enxerga a origem, então vai perto
  do destino, para não cortar tráfego legítimo. A estendida é específica e vai perto da origem,
  para o pacote indesejado morrer antes de atravessar a rede.
limitations:
  - "A 033 tem o log completo do terminal, mas não capturas dos testes."
  - "A 031 não registra em qual interface e direção a ACL foi aplicada."
  - "O arquivo do Packet Tracer da 032 não foi guardado."
  - Fiz também uma atividade de ACLs em roteadores de borda, concluída em 100%, mas sem relatório do que foi configurado. Por isso ela não entra aqui.
reproducibility:
  - Cisco Packet Tracer e as atividades de ACL do Cisco Networking Academy.
  - "Verificação: show access-lists, show running-config e show ip interface."
frameworks:
  csf:
    - { id: PR.AA, name: "Identity Management, Authentication, and Access Control" }
    - { id: PR.IR, name: Technology Infrastructure Resilience }
  nice: [Network Operations, Infrastructure Support]
references:
  - { label: "Cisco: configuração de listas de acesso IP", url: "https://www.cisco.com/c/en/us/support/docs/security/ios-firewall/23602-confaccesslists.html" }
  - { label: "RFC 3704: filtragem de entrada", url: "https://www.rfc-editor.org/rfc/rfc3704" }
---

## 033: liberar só o necessário

Uma estação só podia usar FTP no servidor, outra só web. As duas podiam pingar o servidor, mas não
uma à outra. Do log do terminal:

```text
R1(config)# access-list 100 permit tcp 172.22.34.66 0.0.0.31 host 172.22.34.62 eq ftp
R1(config)# access-list 100 permit icmp 172.22.34.66 0.0.0.31 host 172.22.34.62
R1(config)# interface gigabitEthernet 0/0
R1(config-if)# ip access-group 100 in

R1(config)# ip access-list extended HTTP-ACCESS
R1(config-ext-nacl)# permit tcp 172.22.34.98 0.0.0.15 host 172.22.34.62 eq www
R1(config-ext-nacl)# permit icmp 172.22.34.98 0.0.0.15 host 172.22.34.62

R1# show access-lists
Extended IP access list 100
    10 permit tcp 172.22.34.64 0.0.0.31 host 172.22.34.62 eq ftp (11 match(es))
    20 permit icmp 172.22.34.64 0.0.0.31 host 172.22.34.62 (4 match(es))
```

Não escrevi nenhuma negação. Toda ACL termina com uma negação implícita, então o que não foi
liberado, inclusive o ping entre as duas estações, cai nela.

Um detalhe que só percebi relendo o log: digitei o endereço da própria estação (`.66`) com a máscara
curinga da rede, e o IOS gravou a regra como `.64`, o endereço da rede. Funciona igual, mas o certo
é escrever o endereço da rede desde o início.

## 034: bloquear o específico e liberar o resto

Aqui a lógica se inverte. Oito negações por host e serviço, e no final:

```text
RT1(config-ext-nacl)# permit ip any any
```

Sem essa última linha, a negação implícita derrubaria toda a LAN. Usei `host` em cada regra porque a
política era por máquina. Os testes mostram o efeito esperado: a mesma estação que não abre o site
consegue usar FTP, porque a regra bloqueia o serviço, não a estação.

## Padrão contra estendida

| | Padrão | Estendida |
| --- | --- | --- |
| Filtra por | Endereço de origem | Origem, destino, protocolo e porta |
| Numeração | 1 a 99 | 100 a 199 |
| Onde aplicar | Perto do destino | Perto da origem |
| Usei em | 031 e 032 | 033 e 034 |

## O que os contadores dizem

Em cada `show access-lists`, o número ao lado da regra é a quantidade de pacotes que caíram nela.
Regra com contador zero depois dos testes é regra que nunca foi alcançada: ou está abaixo de outra
que captura o tráfego antes, ou o teste não gerou aquele tráfego. Foi assim que confirmei que as
negações estavam de fato barrando, e não apenas presentes na configuração.
