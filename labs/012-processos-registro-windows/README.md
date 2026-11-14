# Processos, threads, handles e Registro do Windows com Process Explorer

> Laboratório 012 · set/2025 · Registro textual próprio, sem captura de tela
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/processos-registro-windows/

## Objetivo

Explorei a árvore de processos do Windows, observei o que acontece com processos filhos quando o pai é encerrado e alterei um valor no Registro para ver o efeito em um programa.

- Identificar processos ativos e a relação entre pai e filho
- Examinar threads e handles de um processo
- Alterar um valor no Registro e verificar o resultado

## Cenário

Entender como o Windows organiza processos é pré-requisito para reconhecer comportamento anormal. Uma árvore de processos fora do padrão é um dos primeiros sinais de execução maliciosa.

## Ambiente

- VM Windows 10 (VirtualBox)

## Ferramentas

Process Explorer, Editor do Registro, VirusTotal

## Procedimento

1. Abri o Process Explorer e localizei o processo do navegador arrastando o alvo sobre a janela.
2. Encerrei o processo e observei o efeito.
3. Abri um prompt de comando, localizei cmd.exe e o filho conhost.exe, e disparei um ping para ver o processo aparecer e sumir.
4. Consultei a reputação de um processo no VirusTotal a partir do próprio Process Explorer.
5. Encerrei cmd.exe e observei o que aconteceu com conhost.exe.
6. Examinei as threads e os handles de um processo.
7. No Editor do Registro, alterei de 1 para 0 o valor que registra o aceite da licença do Process Explorer e reabri o programa.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

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

## Resultado

Hierarquia de processos observada na prática e valor do Registro alterado, com o efeito esperado: o programa voltou a pedir o aceite da licença.

## O que aprendi

Passei a olhar processo sempre junto com o pai. Um ping que nasce de um prompt aberto pelo usuário é normal. O mesmo ping nascendo de um editor de texto não é.

## Competências demonstradas

- `processos-windows`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NICE Framework:** tarefas relacionadas às funções Systems Administration

## Referências

- [Microsoft Sysinternals: Process Explorer](https://learn.microsoft.com/sysinternals/downloads/process-explorer)
- [Microsoft: estrutura do Registro](https://learn.microsoft.com/windows/win32/sysinfo/structure-of-the-registry)

## Limitações

- Não há captura de tela; ficou o registro escrito do que observei.

## Para reproduzir

- Windows 10 em máquina virtual e o Process Explorer, da suíte Sysinternals.
- Alterar o Registro só em máquina de teste.

## Considerações éticas

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
