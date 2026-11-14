---
id: "006"
covers: ["006"]
slug: falhas-enderecamento-dhcp
title: "Diagnóstico e correção de falhas de endereçamento e DHCP"
summary: >-
  Recebi uma rede de escritório que não funcionava e nenhuma pista do motivo. Levantei 13
  dispositivos, encontrei falhas de rede, máscara, gateway, DNS, DHCP e cabeamento, e padronizei
  tudo em uma única sub-rede.
date: "2025-05"
kind: laboratorio
category: troubleshooting-de-redes
environments: [packet-tracer]
os: [nenhum]
tools: [Cisco Packet Tracer]
protocols: [IPv4, DHCP, DNS, ICMP]
skills: [troubleshooting-de-redes, enderecamento-ipv4, dhcp, documentacao-tecnica]
evidenceTypes: [investigacao, configuracao]
evidenceStrength: E3
context: >-
  Diferente das atividades guiadas, aqui o enunciado só dizia para abrir a topologia, achar as
  falhas, corrigir e relatar, levando em conta a presença de um servidor DHCP.
objectives:
  - Analisar a topologia em busca de falhas
  - Documentar cada falha e a correção aplicada
  - Deixar todas as estações se comunicando entre si, com o servidor e com o roteador
procedure:
  - Passei por cada estação anotando interface, IP, máscara, gateway e DNS.
  - Agrupei as estações pelo tipo de erro para achar o padrão.
  - Verifiquei a configuração do roteador sem fio e do servidor DHCP.
  - Defini uma única rede, um gateway e uma faixa de DHCP, e reconfigurei roteador, servidor e estações.
  - Conferi o cabeamento no roteador e conectei o laptop que estava fora da rede.
  - Testei ping entre estações, para o servidor e para o roteador.
evidence:
  - src: ./evidence/ping-entre-estacoes.png
    alt: Prompt de comando com ping entre duas estações da rede corrigida, quatro respostas sem perda
    caption: Ping entre duas estações depois da correção.
  - src: ./evidence/ping-gateway-servidor.png
    alt: Prompt de comando com ping para o endereço do roteador respondendo sem perda
    caption: Ping de uma estação para o gateway.
result: >-
  Todas as estações passaram a se comunicar entre si, com o servidor e com o roteador, na mesma
  sub-rede e com endereços distribuídos pelo DHCP.
learning: >-
  Quando metade das máquinas está numa rede e metade em outra, o problema não está nas máquinas,
  está em quem distribui os endereços. Olhar o conjunto antes de corrigir uma por uma economiza
  tempo.
limitations:
  - Na tabela entregue, as colunas de falha e de correção têm o mesmo texto. Faltou registrar o valor errado e o valor corrigido de cada item.
  - Não há captura da configuração do servidor DHCP depois do ajuste.
reproducibility:
  - Cisco Packet Tracer. O cenário foi montado pelo docente e não está neste repositório.
frameworks:
  nice: [Network Operations, Technical Support]
references:
  - { label: "RFC 2131: DHCP", url: "https://www.rfc-editor.org/rfc/rfc2131" }
  - { label: "RFC 1918: endereços privados", url: "https://www.rfc-editor.org/rfc/rfc1918" }
---

As falhas se dividiam em quatro grupos:

| Grupo | O que encontrei | Efeito |
| --- | --- | --- |
| Rede e gateway | Parte das estações numa rede privada e parte em outra | Estações vizinhas não se enxergavam |
| Máscara e DNS | Máscara e servidor DNS incorretos em várias estações | Comunicação parcial e nomes sem resolver |
| Distribuição | Servidor DHCP sem configuração válida e roteador distribuindo outra faixa | Cada estação recebia o endereço de quem respondesse primeiro |
| Físico e acesso | Cabos em portas erradas no roteador, rede sem fio aberta, laptop desconectado | Enlaces inativos e rede sem proteção |

A decisão principal foi escolher uma rede só e fazer tudo obedecer a ela: mesma rede, mesma
máscara, um gateway, uma faixa de DHCP com 13 endereços para os 13 hosts.

Dois equipamentos distribuindo endereços diferentes na mesma rede explicam a maior parte do
sintoma. As estações não estavam "mal configuradas" uma a uma; elas estavam recebendo a
configuração de fontes que não concordavam entre si.

A rede sem fio aberta não impedia nada de funcionar, e por isso mesmo é o tipo de falha que passa
despercebida num chamado de conectividade. Anotei como falha de segurança, separada das de
funcionamento.
