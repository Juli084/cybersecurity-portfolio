---
id: "005"
covers: ["005"]
slug: troubleshooting-wifi
title: "Troubleshooting de conexão Wi-Fi em uma rede de biblioteca"
summary: >-
  Um laptop não acessava um site. Mapeei a rede, encontrei a causa no próprio laptop e no roteador
  sem fio, corrigi e verifiquei em todas as estações. Fiz o cenário duas vezes, com quatro meses de
  intervalo.
date: "2025-05"
dateEnd: "2025-09"
kind: laboratorio
category: troubleshooting-de-redes
environments: [packet-tracer]
os: [nenhum]
tools: [Cisco Packet Tracer]
protocols: [WPA2, DHCP, DNS, ICMP, HTTP]
skills: [troubleshooting-de-redes, wifi-wpa2, dns, documentacao-tecnica]
evidenceTypes: [investigacao, configuracao]
evidenceStrength: E3
context: >-
  Em uma biblioteca, um usuário reclama que o laptop não abre um site. As outras estações usam DHCP.
  O trabalho é descobrir o que há de errado, corrigir e provar que ficou resolvido.
objectives:
  - Identificar a falha que impedia o acesso
  - Corrigir os dispositivos mal configurados
  - Verificar a correção em todas as estações
procedure:
  - Montei o relatório de mapeamento com rede, máscara, gateway, faixa de DHCP, DNS e endereço de cada estação.
  - Comparei o laptop com problema com as estações que funcionavam.
  - Acessei a página de administração do roteador sem fio para ver a configuração da rede.
  - Conectei o laptop à rede sem fio com os parâmetros corretos e renovei o endereço.
  - Testei ping e navegador, por nome, em cada estação e no roteador.
evidence:
  - src: ./evidence/laptop1-ping-por-nome.png
    alt: Prompt de comando do laptop com um ping por nome falhando na resolução e, em seguida, o mesmo ping respondendo
    caption: O laptop com problema. O primeiro ping nem resolve o nome; depois da correção, o nome é resolvido e o servidor responde.
  - src: ./evidence/pc3-ipconfig-ping.png
    alt: Prompt de comando de um PC com ipconfig e ping por nome respondendo
    caption: Uma estação cabeada usada como referência, com endereço, gateway e resolução de nome funcionando.
  - src: ./evidence/pc3-navegador.png
    alt: Navegador do simulador exibindo a página do servidor acessada por nome
    caption: Acesso por nome pelo navegador. A própria página diz que, se ela abriu, DNS e IP estão corretos.
  - src: ./evidence/ping-roteador.png
    alt: Ping para o endereço do roteador com quatro respostas
    caption: Ping para o gateway, para separar problema de rede local de problema de resolução de nome.
  - src: ./evidence/conclusao.png
    alt: Barra do Packet Tracer indicando conclusão de 100 por cento
    caption: Atividade concluída em 100%.
result: >-
  O laptop voltou a acessar o site por nome e todas as estações responderam aos testes. A atividade
  fechou em 100% nas duas vezes.
learning: >-
  Testar por IP e por nome separa três perguntas: tenho rede, chego ao gateway, o DNS resolve.
  Na segunda vez o cenário levou 48 minutos, contra 1h21 na primeira.
limitations:
  - A primeira entrega, de maio, tem só o relatório e a tela de conclusão. As capturas dos testes são da segunda, de setembro.
  - O relatório lista as falhas, mas não registra os valores antes e depois de cada ajuste.
reproducibility:
  - Cisco Packet Tracer e a atividade de troubleshooting de conexão sem fio do Cisco Networking Academy.
frameworks:
  csf:
    - { id: PR.AA, name: "Identity Management, Authentication, and Access Control" }
  nice: [Technical Support, Network Operations]
references:
  - { label: "RFC 1035: DNS", url: "https://www.rfc-editor.org/rfc/rfc1035" }
  - { label: "RFC 2131: DHCP", url: "https://www.rfc-editor.org/rfc/rfc2131" }
---

A causa direta era simples: o laptop não estava associado à rede sem fio. Sem associação não há
endereço, sem endereço não há DNS, e o sintoma que o usuário vê é "o site não abre".

O que tornou o laboratório útil foi o que apareceu no caminho. Para conectar o laptop precisei
entrar na administração do roteador, e ali encontrei três problemas que não tinham relação com a
reclamação:

| Achado | Por que importa |
| --- | --- |
| Roteador com usuário e senha de fábrica | Qualquer pessoa na rede entra na administração; credenciais padrão são públicas |
| Endereço inicial do DHCP sujeito a conflito | Risco de dois equipamentos com o mesmo IP |
| Limite de clientes do DHCP muito acima do necessário | Sobra de endereços para quem não deveria estar na rede |

Nenhum deles causava a falha, mas todos são o tipo de coisa que um chamado de suporte revela e que
vale registrar.

Sobre os testes: `ping` para o IP do gateway diz se a rede local funciona. `ping` para um nome
acrescenta o DNS. O navegador acrescenta a aplicação. Quando o ping por nome falha com "could not
find host", o problema está antes do servidor, na resolução ou na falta de rede, e não no site.
