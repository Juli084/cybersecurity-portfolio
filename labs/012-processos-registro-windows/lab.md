---
id: "012"
covers: ["012"]
slug: processos-registro-windows
title: "Processos, threads, handles e Registro do Windows com Process Explorer"
summary: >-
  Explorei a árvore de processos do Windows, observei o que acontece com processos filhos quando o
  pai é encerrado e alterei um valor no Registro para ver o efeito em um programa.
date: "2025-09"
kind: laboratorio
category: windows
environments: [vm-windows]
os: [windows]
tools: [Process Explorer, Editor do Registro, VirusTotal]
protocols: []
skills: [processos-windows]
evidenceTypes: [pratica-guiada, analise]
evidenceStrength: E2
context: >-
  Entender como o Windows organiza processos é pré-requisito para reconhecer comportamento anormal.
  Uma árvore de processos fora do padrão é um dos primeiros sinais de execução maliciosa.
objectives:
  - Identificar processos ativos e a relação entre pai e filho
  - Examinar threads e handles de um processo
  - Alterar um valor no Registro e verificar o resultado
procedure:
  - Abri o Process Explorer e localizei o processo do navegador arrastando o alvo sobre a janela.
  - Encerrei o processo e observei o efeito.
  - Abri um prompt de comando, localizei cmd.exe e o filho conhost.exe, e disparei um ping para ver o processo aparecer e sumir.
  - Consultei a reputação de um processo no VirusTotal a partir do próprio Process Explorer.
  - Encerrei cmd.exe e observei o que aconteceu com conhost.exe.
  - Examinei as threads e os handles de um processo.
  - No Editor do Registro, alterei de 1 para 0 o valor que registra o aceite da licença do Process Explorer e reabri o programa.
result: >-
  Hierarquia de processos observada na prática e valor do Registro alterado, com o efeito esperado:
  o programa voltou a pedir o aceite da licença.
learning: >-
  Passei a olhar processo sempre junto com o pai. Um ping que nasce de um prompt aberto pelo usuário
  é normal. O mesmo ping nascendo de um editor de texto não é.
limitations:
  - Não há captura de tela; ficou o registro escrito do que observei.
reproducibility:
  - Windows 10 em máquina virtual e o Process Explorer, da suíte Sysinternals.
  - Alterar o Registro só em máquina de teste.
frameworks:
  nice: [Systems Administration]
references:
  - { label: "Microsoft Sysinternals: Process Explorer", url: "https://learn.microsoft.com/sysinternals/downloads/process-explorer" }
  - { label: "Microsoft: estrutura do Registro", url: "https://learn.microsoft.com/windows/win32/sysinfo/structure-of-the-registry" }
---

## Pai e filho

| Ação | O que observei |
| --- | --- |
| Encerrar o processo do navegador | A janela fechou junto com os processos abaixo dele |
| Rodar `ping` no prompt | Surgiu `ping.exe` abaixo de `cmd.exe`; quando os pacotes acabaram, ele desapareceu |
| Encerrar `cmd.exe` | `conhost.exe`, que era filho, foi encerrado junto |

O processo filho depende do pai para existir naquele contexto. Isso vale para o uso normal e vale
para a investigação: a pergunta útil diante de um processo estranho é quem o iniciou.

## Threads e handles

A aba de threads lista, para cada uma, identificador, prioridade, uso de CPU e endereço de início.
Os handles mostram a que o processo está agarrado: arquivos, chaves do Registro, eventos, canais de
comunicação. Um processo com handle aberto para um arquivo que ele não deveria tocar é uma pista.

## Registro

O valor que guarda o aceite da licença fica na parte do Registro que pertence ao usuário atual. Mudei
de 1 para 0 e, ao abrir o programa de novo, a janela da licença reapareceu. O Registro é onde boa
parte do comportamento do sistema e dos programas é decidida, e por isso é também onde muita
persistência de malware se esconde.
