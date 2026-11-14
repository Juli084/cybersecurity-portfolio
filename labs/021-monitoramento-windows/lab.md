---
id: "021"
covers: ["021"]
slug: monitoramento-windows
title: "Monitoramento de serviços, eventos e desempenho no Windows"
summary: >-
  Iniciei e parei um serviço do Windows observando o efeito no sistema, li os eventos gerados e
  criei um coletor de dados que grava a memória disponível em arquivo.
date: "2025-11"
kind: laboratorio
category: windows
environments: [vm-windows]
os: [windows]
tools: [Monitor de Desempenho, Visualizador de Eventos, Serviços do Windows]
protocols: []
skills: [monitoramento-windows, leitura-de-logs]
evidenceTypes: [pratica-guiada, configuracao, analise]
evidenceStrength: E3
context: >-
  As ferramentas administrativas do Windows mostram o que mudou na máquina e quando. É o mesmo
  raciocínio de log do Linux, com outra interface.
objectives:
  - Iniciar e parar um serviço e observar o efeito
  - Ler os eventos registrados pelo sistema
  - Registrar um contador de desempenho e gravar uma coleta em arquivo
procedure:
  - Abri as conexões de rede e o Monitor de Desempenho lado a lado.
  - Em Serviços, mudei o tipo de inicialização do Roteamento e Acesso Remoto e iniciei o serviço.
  - Observei a nova conexão que apareceu e o gráfico do processador durante a mudança.
  - Parei o serviço e conferi que a conexão sumiu.
  - No Visualizador de Eventos, li os eventos gerados pelas mudanças.
  - Criei um conjunto de coletores com o contador de memória disponível, gravei alguns minutos e abri o CSV.
evidence:
  - src: ./evidence/monitor-de-desempenho.png
    alt: Monitor de Desempenho do Windows com o gráfico do contador de tempo do processador apresentando picos
    caption: Contador de tempo do processador durante a atividade, com picos nos momentos de mudança.
  - src: ./evidence/evento-7040.png
    alt: Janela de propriedades de um evento do Service Control Manager com identificador 7040, informando mudança no tipo de inicialização de um serviço
    caption: Evento 7040 do Service Control Manager. O sistema registra toda mudança de tipo de inicialização de serviço.
  - src: ./evidence/evento-20063.png
    alt: Janela de propriedades de um evento de erro do RemoteAccess com identificador 20063
    caption: Evento 20063, de erro, gerado pelo serviço de acesso remoto ao tentar iniciar.
  - src: ./evidence/coletor-csv.png
    alt: Bloco de Notas com o arquivo CSV do coletor, listando data, hora e megabytes de memória disponível em intervalos regulares
    caption: Arquivo gerado pelo coletor, com a memória disponível amostrada em intervalos regulares.
result: >-
  Serviço iniciado e parado com o efeito observado nas conexões de rede, eventos correspondentes
  localizados e coleta de memória gravada em CSV.
learning: >-
  Uma mudança de configuração deixa rastro em mais de um lugar: na lista de conexões, no gráfico e
  no log de eventos. Cruzar os três é mais confiável do que olhar um só.
limitations:
  - A entrega mistura capturas minhas, em português, com ilustrações do roteiro, em inglês. Aqui estão só as minhas.
  - Duas perguntas foram respondidas apenas com imagem, sem texto.
reproducibility:
  - Windows 10 em máquina virtual.
  - "Ferramentas: services.msc, perfmon e eventvwr."
frameworks:
  csf:
    - { id: DE.CM, name: Continuous Monitoring }
  nice: [Systems Administration]
references:
  - { label: "Microsoft: perfmon", url: "https://learn.microsoft.com/windows-server/administration/windows-commands/perfmon" }
  - { label: "Microsoft: registro de eventos", url: "https://learn.microsoft.com/windows/win32/eventlog/event-logging" }
---

## O serviço

Com o Roteamento e Acesso Remoto parado, a máquina tinha uma conexão de rede. Ao iniciá-lo, surgiu
uma segunda, de conexões de entrada, sem clientes. Ao pará-lo, ela sumiu. Um serviço que ninguém
pediu, rodando, é uma porta a mais na máquina, e a lista de conexões mostra isso sem precisar de
ferramenta externa.

## Os eventos

Cada ação gerou registro no log do sistema:

| Evento | Origem | O que diz |
| --- | --- | --- |
| 7040 | Service Control Manager | O tipo de inicialização de um serviço foi alterado |
| 20063 | RemoteAccess | O serviço falhou ao inicializar um componente |

O 7040 interessa a quem administra e a quem investiga: é o registro de que alguém mudou como um
serviço se comporta na inicialização. Ver esse evento fora de uma janela de manutenção merece
pergunta.

## A coleta

O coletor gravou a memória disponível em megabytes, a cada poucos segundos, num CSV. Durante a
coleta os valores caíram de cerca de 890 MB para a faixa de 550 MB. A utilidade está na série, não
no número isolado: sem linha de base não há como dizer se um valor é anormal.
