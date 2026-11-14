---
id: P1
slug: infraestrutura-de-rede
title: "Projeto de infraestrutura de rede para um escritório de três pavimentos"
summary: >-
  Projeto Integrador do curso: documentação técnica de uma rede estruturada para uma empresa
  fictícia, com topologia lógica e física, endereçamento, cabeamento, segurança e lista de materiais.
date: "2025-08"
team: "Trabalho em grupo, três pessoas"
myPart: >-
  Fiquei responsável pelas plantas: a distribuição dos pontos de rede, câmeras, telefones e pontos
  de acesso em cada pavimento, com a metragem de cabo por ponto e o caminho do backbone.
kind: "Projeto e documentação. É uma proposta, não uma implantação."
deliverables:
  - Documento técnico com escopo, requisitos, topologia, nomenclatura, endereçamento, segurança, cabeamento e cronograma
  - Plantas dos três pavimentos com os pontos de rede
  - Topologia simulada no Cisco Packet Tracer
  - Lista de materiais com referência às normas de cabeamento estruturado
evidence:
  - src: ./evidence/planta-pavimento-a.png
    alt: Planta baixa de um pavimento com salas, pontos de rede, câmeras, ponto de acesso sem fio e a metragem de cabo indicada em cada ponto, com legenda
    caption: Planta de um pavimento com a posição de cada ponto e a metragem de cabo até o rack.
  - src: ./evidence/planta-pavimento-b.png
    alt: Planta baixa de outro pavimento com sala de servidores, pontos de rede, backbone em vermelho e eletrocalha em tracejado, com legenda
    caption: Pavimento com a sala de servidores. A legenda distingue ponto simples, ponto duplo, câmera, telefone, backbone e eletrocalha.
  - src: ./evidence/planta-pavimento-c.png
    alt: Planta baixa de um terceiro pavimento com salas de atendimento e de reunião, recepção e os pontos de rede com metragem
    caption: Pavimento de atendimento, com recepção e salas de reunião.
limitations:
  - Topologia e redação do documento foram feitas pelos colegas de grupo; aqui mostro só a parte que produzi.
  - O documento tem inconsistências que não foram corrigidas antes da entrega, como o tipo de fibra do backbone descrito de duas formas e todos os segmentos de usuário na mesma sub-rede apesar de o texto prever separação por VLAN.
  - Os controles de segurança descritos, como controle de acesso à rede e monitoramento centralizado, são proposta. Não foram configurados.
order: 1
---

O exercício era atuar como uma empresa contratada para projetar a rede de um escritório. Minha parte
foi a planta: decidir onde cada ponto fica obriga a pensar no caminho do cabo, na distância até o
rack e em onde a eletrocalha passa.

A metragem ponto a ponto é o que permite chegar a uma lista de materiais com base, em vez de uma
estimativa.

Se fosse refazer, começaria pelo endereçamento. O documento promete segmentação por setor e depois
coloca computadores, impressoras, telefones e câmeras na mesma sub-rede. Câmeras e telefones em
redes separadas, com regras entre elas, seria o mínimo para a proposta de segurança se sustentar.
