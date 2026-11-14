---
id: "043"
covers: ["043"]
slug: snort-tcpdump-iptables
title: "Alertas do Snort, captura com tcpdump e bloqueio com iptables"
summary: >-
  Simulei o download de um arquivo malicioso numa rede emulada, li o alerta que o IDS gerou,
  gravei o tráfego em PCAP e bloqueei a comunicação no firewall do roteador.
date: "2026-06"
kind: laboratorio
category: monitoramento-e-logs
environments: [vm-linux]
os: [linux]
tools: [Snort, tcpdump, iptables, Mininet, netstat, wget]
protocols: [TCP, HTTP, ICMP, IPv4]
skills: [alertas-de-ids, analise-de-pacotes, firewall-de-host, leitura-de-logs]
evidenceTypes: [investigacao, analise, defesa-mitigacao]
evidenceStrength: E3
featured: 1
context: >-
  Em uma rede de produção, alertas chegam de fontes diferentes e em formatos diferentes. O cenário
  reproduz isso em escala pequena: hosts internos, servidores em uma DMZ e servidores externos, um
  deles hospedando malware. No meio fica um roteador que acumula os papéis de firewall e de IDS.
objectives:
  - Subir a topologia emulada e identificar onde o IDS e o firewall atuam
  - Gerar tráfego suspeito e ler o alerta correspondente
  - Capturar a transação em arquivo para análise posterior
  - Bloquear a comunicação e confirmar o efeito
procedure:
  - Subi a topologia no Mininet e abri terminais nos nós que interessavam (roteador, servidor da DMZ e servidor externo).
  - Com netstat, identifiquei a porta em que o servidor externo atendia.
  - Deixei o arquivo de alertas do Snort aberto com tail -f em um terminal do roteador.
  - A partir do servidor da DMZ, baixei o arquivo de teste com wget e acompanhei o alerta aparecer.
  - Iniciei uma captura com tcpdump gravando em PCAP e repeti o download.
  - Consultei as chains em uso no iptables do roteador, bloqueei a comunicação e tentei o download de novo.
evidence:
  - src: ./evidence/snort-alertas.png
    alt: Terminal do roteador mostrando dois alertas do Snort com a mensagem Malicious Server Hit, origem, destino e porta 6666
    caption: Arquivo de alertas do Snort acompanhado em tempo real. Cada linha traz horário, identificador da regra, mensagem, protocolo e os pares de endereço e porta.
  - src: ./evidence/tcpdump-captura.png
    alt: Saída do tcpdump listando os segmentos TCP trocados entre o servidor da DMZ e o servidor externo na porta 6666
    caption: Pacotes da transação capturados com tcpdump, com flags, números de sequência e opções TCP.
  - src: ./evidence/download-apos-bloqueio.png
    alt: Terminal mostrando o wget tentando conectar na porta 6666 e falhando, com nova tentativa em seguida
    caption: Depois do bloqueio, o wget não consegue mais abrir a conexão. A mesma tela mostra um erro de sintaxe meu no tcpdump, corrigido na sequência.
result: >-
  O primeiro download terminou e gerou alerta. Depois do bloqueio no roteador, a mesma tentativa
  falhou na conexão. O tráfego da transação ficou gravado em PCAP.
learning: >-
  Detectar e bloquear são coisas diferentes: o IDS viu tudo e não impediu nada. Também aprendi a
  conferir os dados do alerta na própria tela antes de escrevê-los num relatório, porque na entrega
  original misturei valores de dois alertas diferentes.
limitations:
  - A regra exata que usei no iptables não ficou registrada na entrega.
  - O Snort já estava configurado no cenário. Li e interpretei alertas; não escrevi regras.
  - Bloqueei a comunicação observada. Em produção eu bloquearia o destino inteiro, porque nada impede o mesmo servidor de usar outra porta.
reproducibility:
  - VM Linux de laboratório com Mininet, Snort, tcpdump e iptables.
  - A topologia vem de um script do material do curso, que não redistribuo.
frameworks:
  csf:
    - { id: DE.CM, name: Continuous Monitoring }
    - { id: DE.AE, name: Adverse Event Analysis }
    - { id: RS.MI, name: Incident Mitigation }
  attack:
    - { id: T1105, name: Ingress Tool Transfer }
    - { id: T1571, name: Non-Standard Port }
  nice: [Defensive Cybersecurity]
references:
  - { label: "Snort 3: documentação", url: "https://docs.snort.org/" }
  - { label: "tcpdump: página de manual", url: "https://www.tcpdump.org/manpages/tcpdump.1.html" }
  - { label: "netfilter/iptables: documentação", url: "https://www.netfilter.org/documentation/" }
---

O alerta tem cinco informações que importam: quando, qual regra, de onde, para onde e por qual porta.
Na captura aparecem dois:

| Campo | Primeiro alerta | Segundo alerta |
| --- | --- | --- |
| Origem | host interno, porta 33684 | servidor da DMZ, porta 51756 |
| Destino | servidor externo, porta 6666 | servidor externo, porta 6666 |
| Protocolo | TCP | TCP |
| Mensagem da regra | Malicious Server Hit! | Malicious Server Hit! |

Três coisas chamam atenção.

**A porta de destino.** 6666 não é porta de serviço web. Um download HTTP nessa porta já justifica
olhar com cuidado, e é o que a regra do cenário faz: ela dispara pelo destino, não pelo conteúdo.

**Quem iniciou.** As duas conexões saíram de dentro: uma estação interna e um servidor da DMZ. Um
servidor que busca arquivo num destino suspeito é um sinal mais forte do que uma tentativa vinda de
fora.

**O que o IDS não fez.** O arquivo chegou inteiro. O Snort estava em modo de detecção, então o
alerta é só o registro. Para interromper foi preciso agir no firewall do roteador, que tinha as
chains INPUT, OUTPUT e FORWARD em uso. Como o roteador encaminha tráfego entre redes, é na FORWARD
que esse bloqueio faz efeito.

O PCAP serve para o que o alerta não mostra: a sequência completa dos pacotes, os tamanhos e o
conteúdo transferido, que podem ser abertos depois em outra ferramenta sem depender de uma linha de
log.
