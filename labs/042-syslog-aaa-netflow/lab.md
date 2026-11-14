---
id: "042 e 044"
covers: ["042", "044"]
slug: syslog-aaa-netflow
title: "Três fontes de dados de rede: syslog, contabilidade AAA e NetFlow"
summary: >-
  Gerei eventos em uma rede simulada e li o que cada fonte registrou: mensagens de sistema no
  servidor syslog, início e fim de sessão administrativa no AAA e fluxos de tráfego no coletor
  NetFlow.
date: "2026-05"
dateEnd: "2026-06"
kind: serie
category: monitoramento-e-logs
environments: [packet-tracer]
os: [cisco-ios]
tools: [Cisco Packet Tracer, Cisco IOS]
protocols: [syslog, NetFlow, TACACS+, ICMP, HTTP, Telnet, NTP]
skills: [leitura-de-logs, netflow, aaa-tacacs-radius]
evidenceTypes: [investigacao, analise]
evidenceStrength: E3
featured: 5
context: >-
  Um analista raramente tem uma fonte só. Syslog diz o que o equipamento relatou, a contabilidade
  AAA diz quem entrou e quando, e o NetFlow diz quem falou com quem. Nenhuma das três mostra o
  conteúdo; juntas, mostram o comportamento.
objectives:
  - Enviar mensagens de equipamentos para um servidor syslog e ler os campos
  - Observar o registro de uma sessão administrativa autenticada por servidor
  - Gerar tráfego e ler os registros de fluxo no coletor
  - Repetir a coleta de fluxos em um segundo cenário
procedure:
  - "042: ativei uma depuração no roteador e conferi as mensagens chegando ao servidor syslog."
  - "042: entrei em outro roteador com uma conta autenticada por TACACS+, saí, e li os registros de início e fim de sessão."
  - "042: gerei ping, acesso web e tentativas de Telnet a partir de várias estações, incluindo uma estação fora da rede interna, e li os fluxos no coletor."
  - "042: montei uma tabela de destino, porta e serviço das tentativas que não tiveram resposta."
  - "044: em um segundo cenário, repeti pings e acessos web entre estações e registrei os fluxos correspondentes."
evidence:
  - src: ./evidence/042-servidor-syslog.png
    alt: Tela do serviço syslog no servidor com seis entradas, cada uma com horário, endereço do equipamento de origem e mensagem
    caption: "042: mensagens recebidas pelo servidor syslog. Cada entrada traz horário, host de origem e o texto da mensagem."
  - src: ./evidence/042-coletor-netflow.png
    alt: Coletor NetFlow com gráfico de pizza dos fluxos e o detalhe de um fluxo UDP na porta 123, com endereços, interface, bytes e horários
    caption: "042: coletor NetFlow. O fluxo selecionado é UDP na porta 123, tráfego de sincronização de horário."
  - src: ./evidence/042-fluxo-http.png
    alt: Coletor NetFlow com o detalhe de um fluxo TCP para a porta 80 e flags TCP indicando início de conexão
    caption: "042: fluxo TCP para a porta 80. As flags registradas mostram apenas o início da conexão."
  - src: ./evidence/044-coletor-segundo-cenario.png
    alt: Coletor NetFlow de outro cenário com vários fluxos entre estações de redes diferentes
    caption: "044: segundo cenário, com um fluxo para cada par de estações testado."
result: >-
  As três fontes registraram os eventos gerados. As tentativas sem resposta foram tabuladas por
  destino, porta e serviço.
learning: >-
  NetFlow não guarda conteúdo, e mesmo assim responde muito: quem iniciou, para onde, por qual
  porta, quantos pacotes e por quanto tempo. Um fluxo TCP só com o primeiro pacote é uma conexão
  que não se completou, e muitos assim em sequência são varredura.
limitations:
  - "A 044 tem só as capturas, sem análise escrita na entrega."
  - Fiz também uma atividade de análise de fluxos com previsão dos campos antes de gerar o tráfego. Ela ficou fora deste portfólio por pendência de conferência da entrega.
  - O Packet Tracer simula uma versão simplificada do NetFlow, e os registros de um equipamento real têm mais campos.
reproducibility:
  - Cisco Packet Tracer com servidor configurado como coletor syslog e NetFlow.
frameworks:
  csf:
    - { id: DE.CM, name: Continuous Monitoring }
    - { id: DE.AE, name: Adverse Event Analysis }
  nice: [Defensive Cybersecurity, Network Operations]
references:
  - { label: "RFC 5424: protocolo syslog", url: "https://www.rfc-editor.org/rfc/rfc5424" }
  - { label: "RFC 3954: Cisco NetFlow versão 9", url: "https://www.rfc-editor.org/rfc/rfc3954" }
  - { label: "RFC 8907: protocolo TACACS+", url: "https://www.rfc-editor.org/rfc/rfc8907" }
---

| Fonte | O que registra | Pergunta que responde |
| --- | --- | --- |
| Syslog | Data e hora, equipamento de origem, mensagem | O que o equipamento relatou e quando |
| Contabilidade AAA | Usuário, início e fim da sessão, equipamento e linha de acesso | Quem entrou, por onde e por quanto tempo |
| NetFlow | Origem, destino, portas, protocolo, interface, bytes, pacotes, flags, horários | Quem falou com quem e quanto |

## Contabilidade AAA

Ao entrar no roteador com a conta de analista, o servidor registrou uma entrada com o usuário, o
horário, o endereço do roteador e a linha de console, marcada como início. Ao sair, uma segunda
entrada, marcada como fim. As duas juntas delimitam a sessão. Sem esse registro, a pergunta "quem
alterou a configuração naquela hora" não tem resposta.

## Lendo um fluxo

Um registro de fluxo resume uma conversa em uma direção. Para um acesso web aparecem dois: o pedido,
saindo, e a resposta, voltando, com as interfaces de entrada e saída invertidas. Quando o acesso é
por nome e não por IP, surge antes um terceiro fluxo, na porta 53, que é a consulta DNS.

## O que foi barrado

A partir de uma das estações, várias tentativas não tiveram resposta:

| Serviço | Porta | Situação |
| --- | --- | --- |
| ICMP (ping) | não se aplica | Sem resposta para uma estação de outra rede |
| HTTP | 80 | Sem resposta de um servidor web |
| Telnet | 23 | Sem resposta de três endereços |

Do ponto de vista de quem monitora, o interessante é a combinação. Uma estação que tenta Telnet em
três endereços diferentes e não consegue em nenhum está procurando acesso administrativo. Nenhuma
tentativa isolada chamaria atenção.

## Horário

As mensagens do syslog chegaram com data de 1993, porque os equipamentos do simulador não estavam
com o relógio ajustado. Em uma rede real isso inviabilizaria cruzar o syslog com as outras duas
fontes, e é o motivo de o NTP ser o primeiro serviço a configurar quando se centraliza log.
