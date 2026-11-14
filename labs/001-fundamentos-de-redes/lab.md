---
id: "001–004 e 007"
covers: ["001", "002", "003", "004", "007"]
slug: fundamentos-de-redes
title: "Fundamentos de rede no Packet Tracer: cabeamento, DHCP, NAT e documentação"
summary: >-
  Cinco atividades iniciais do curso: escolher o cabo certo para cada enlace, montar um rack a
  partir de um diagrama, configurar DHCP, observar NAT e documentar o endereçamento de uma rede.
date: "2025-03"
dateEnd: "2025-05"
kind: serie
category: fundamentos-de-redes
environments: [packet-tracer]
os: [cisco-ios]
tools: [Cisco Packet Tracer, Cisco IOS]
protocols: [IPv4, DHCP, NAT, ICMP, Ethernet]
skills: [midias-e-topologia, dhcp, nat, enderecamento-ipv4, documentacao-tecnica]
evidenceTypes: [pratica-guiada, configuracao]
evidenceStrength: E3
context: >-
  Foram as primeiras práticas do curso, todas em rede simulada. Reuni as cinco numa página porque
  cada uma, sozinha, é pequena. Juntas, mostram a base sobre a qual os laboratórios de segurança
  foram construídos.
objectives:
  - Selecionar a mídia correta para cada tipo de enlace e verificar a conectividade
  - Conectar equipamentos em rack seguindo um diagrama lógico
  - Alterar o escopo de DHCP de um roteador sem fio e validar nos clientes
  - Distinguir endereço público de privado e observar a tradução feita pelo NAT
  - Registrar o endereçamento de uma rede em um relatório de mapeamento
procedure:
  - "001: conectei nuvem, modem, dois roteadores, switch, roteador sem fio e PCs com cabo direto, cruzado, serial, coaxial e de console. Testei com ping e com show ip interface brief pelo terminal de console."
  - "002: preenchi a tabela de dispositivos, interfaces e portas a partir do diagrama e fiz o cabeamento no rack, no modo físico."
  - "003: mudei o IP do roteador sem fio, o endereço inicial e o número máximo de clientes do DHCP, renovei o endereço nos três PCs e testei ping entre eles."
  - "004: levantei rede, máscara, gateway, faixa DHCP, DNS e a tabela de dispositivos e interfaces de uma rede doméstica."
  - "007: identifiquei o endereço público e a faixa privada no roteador, conectei quatro PCs por DHCP e acompanhei um pedido HTTP no modo de simulação para ver o endereço de origem mudar."
evidence:
  - src: ./evidence/001-show-ip-interface-brief.png
    alt: Terminal de console do roteador com mensagens de mudança de estado das interfaces e a saída do comando show ip interface brief
    caption: "001: acesso ao roteador pelo cabo de console. As interfaces sobem conforme os cabos são conectados e o show ip interface brief confirma o estado de cada uma."
  - src: ./evidence/001-ping-servidor.png
    alt: Prompt de comando de um PC com ping para o servidor, primeiras respostas expirando e depois respostas normais
    caption: "001: ping de um PC para o servidor do outro lado da topologia. Os primeiros pacotes expiram enquanto o ARP é resolvido."
  - src: ./evidence/002-pontuacao.png
    alt: Tela de resultado do Packet Tracer indicando atividade concluída e pontuação 11 de 11
    caption: "002: atividade do rack concluída, 11 de 11 itens."
  - src: ./evidence/003-dhcp-ipconfig-ping.png
    alt: Prompt de comando com ipconfig mostrando endereço recebido por DHCP na nova faixa e ping bem-sucedido para outro PC
    caption: "003: cliente com endereço da nova faixa e ping para outro PC da mesma rede."
  - src: ./evidence/003-pontuacao.png
    alt: Tela de resultado do Packet Tracer indicando atividade concluída e pontuação 9 de 9
    caption: "003: atividade de DHCP concluída, 9 de 9 itens."
  - src: ./evidence/007-ping.png
    alt: Prompt de comando com dois pings bem-sucedidos para outros PCs da rede local
    caption: "007: conectividade entre os PCs atrás do roteador sem fio antes de observar o NAT."
result: >-
  As atividades 002, 003 e 007 foram concluídas com todos os itens corretos. A 004 é um relatório,
  sem pontuação. A 001 ficou em 50 de 80 pontos, com 10 de 16 itens corretos, e está registrada
  aqui como incompleta.
learning: >-
  O cabo errado derruba o enlace antes de qualquer configuração importar, e o ipconfig e o ping
  resolvem a maior parte das dúvidas iniciais. Na 007, ver o endereço de origem mudar no cabeçalho
  deixou claro por que um endereço privado nunca aparece do lado de fora.
limitations:
  - "001 não foi concluída: 50 de 80 pontos."
  - "004 não tem captura de tela nem o arquivo do cenário; ficou só a tabela."
  - "Na 007 não guardei a captura do cabeçalho antes e depois da tradução, que é a parte mais importante da atividade."
reproducibility:
  - Cisco Packet Tracer e as atividades correspondentes do Cisco Networking Academy.
  - Os arquivos de atividade pertencem à Cisco e não estão neste repositório.
references:
  - { label: "RFC 2131: DHCP", url: "https://www.rfc-editor.org/rfc/rfc2131" }
  - { label: "RFC 3022: NAT tradicional", url: "https://www.rfc-editor.org/rfc/rfc3022" }
  - { label: "RFC 1918: endereços privados", url: "https://www.rfc-editor.org/rfc/rfc1918" }
---

| Atividade | O que ela exercita | Como verifiquei |
| --- | --- | --- |
| 001 Cabeamento | Cabo direto, cruzado, serial, coaxial e console | Luz de enlace, ping e `show ip interface brief` |
| 002 Rack | Leitura de diagrama lógico e conexão física | Pontuação da atividade |
| 003 DHCP | Escopo, endereço inicial e limite de clientes | `ipconfig` e ping em cada PC |
| 004 Mapeamento | Rede, máscara, gateway, DNS, interfaces | Tabela conferida contra o cenário |
| 007 NAT | Endereço público e privado, tradução | Cabeçalhos no modo de simulação |

Na 003, depois de trocar o IP do roteador, os PCs continuaram com o endereço antigo até eu forçar a
renovação. O cliente só pede novo endereço quando a concessão vence ou quando alguém manda, então
mudar o servidor não muda os clientes na hora.

Na 007, o roteador recebe um endereço do provedor na porta externa e distribui endereços privados
na interna. O pedido HTTP sai do PC com o endereço privado como origem e chega ao servidor com o
endereço externo do roteador. É por isso que vários equipamentos compartilham um único endereço
público, e também por isso que, de fora, não dá para iniciar uma conexão com um deles sem uma regra
que diga para qual encaminhar.
