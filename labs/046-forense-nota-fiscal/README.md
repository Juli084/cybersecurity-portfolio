# Análise documental de um incidente iniciado por falsa nota fiscal

> Estudo de caso 046 · jul/2026 · Registro textual próprio, sem captura de tela
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/forense-nota-fiscal/

## Objetivo

Estudo de caso: recebi os artefatos já extraídos de uma estação Windows comprometida e respondi a doze questões, cruzando as fontes até montar a linha do tempo do incidente.

- Determinar o vetor inicial e a natureza do arquivo
- Reconstruir a sequência de eventos a partir de fontes diferentes
- Avaliar persistência, comunicação externa e tentativa de remoção de rastros
- Dizer o que a evidência permite afirmar e o que não permite
- Recomendar medidas de contenção e de prevenção

## Cenário

Uma funcionária do financeiro abriu um anexo recebido por e-mail. Minutos depois percebeu uma janela preta, lentidão e um alerta do antivírus. A estação foi desconectada da rede cerca de 18 minutos depois. O cenário é fictício e foi entregue em texto pelo docente.

## Ambiente

- Cenário documental

## Tecnologias

HTTPS, DNS

## Ferramentas

Nenhuma: análise sobre material fornecido.

## Procedimento

1. Li o conjunto de artefatos fornecido, com registro de alterações do sistema de arquivos, arquivos de pré-carregamento, eventos do Windows, árvore de processos, tarefa agendada e conexões de rede.
2. Ordenei todos os eventos por horário em uma única tabela.
3. Respondi às doze questões indicando, em cada uma, de qual fonte saiu a resposta.
4. Separei o que estava comprovado do que era apenas possível.
5. Listei medidas de contenção, investigação, credenciais e endurecimento.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

## Linha do tempo

| Horário | O que aconteceu | Fonte |
| --- | --- | --- |
| 10:21:13 | Arquivo compactado salvo na pasta de downloads, com marca de origem da internet | Registro de alterações do sistema de arquivos |
| 10:22:47 | Arquivo extraído | Registro de alterações |
| 10:23:56 | A própria usuária abre o arquivo pelo gerenciador de arquivos | Evento de criação de processo e pré-carregamento |
| 10:23:57 | O programa aberto inicia um interpretador de comandos oculto | Evento de criação de processo e árvore de processos |
| 10:24:01 | Um script é executado | Evento de registro de script |
| 10:24:09 | Pasta e script criados no perfil da usuária | Registro de alterações |
| 10:24:34 | Tarefa agendada criada para rodar a cada logon | Evento de criação de tarefa |
| 10:25:03 | Arquivo compactado e arquivo extraído apagados | Registro de alterações |
| 10:27:49 | O antivírus detecta | Evento do antivírus |
| 10:28:03 | O antivírus coloca em quarentena | Evento do antivírus |

## O que essa ordem mostra

**O arquivo não era o que parecia.** Tinha ícone e nome de documento, mas era um programa, com duas
extensões no nome. Como o sistema esconde a extensão final por padrão, a usuária viu um documento.

**Quem abriu foi a usuária.** O processo nasceu do gerenciador de arquivos, na sessão dela. O
interpretador de comandos, por sua vez, nasceu do programa, com janela oculta e política de execução
contornada. Ela não o iniciou.

**A persistência veio antes da detecção.** A tarefa agendada foi criada às 10:24:34. O antivírus só
agiu às 10:27:49. Colocar o arquivo original em quarentena não desfaz a tarefa, que continuaria
executando o script a cada logon.

**Houve comunicação externa.** Uma conexão estabelecida, a partir do interpretador, para um endereço
de fora, pela porta 443. Porta 443 indica o canal, não o conteúdo.

**Tentaram apagar o rastro, e não conseguiram.** Os dois arquivos iniciais foram excluídos. O
registro de alterações, os arquivos de pré-carregamento, os eventos, a tarefa e a memória
continuaram contando a história.

## O que não dá para afirmar

O script coletava nome do computador, usuário, endereço, lista de processos e versão do sistema. É
reconhecimento. Não havia, nos artefatos, sinal de leitura de documentos, de compactação ou de
envio de arquivos.

Respondi que não há evidência de exfiltração de documentos, e também que não dá para descartar sem
olhar registros de proxy, firewall e DNS. "Não encontrei" e "não aconteceu" são conclusões
diferentes, e um relatório precisa dizer qual das duas está sustentando.

## Recomendações

- **Contenção:** manter a estação isolada, preservar disco e memória, remover a tarefa e o script,
  procurar outras formas de persistência.
- **Investigação:** consultar o hash em bases de inteligência, analisar o script por inteiro,
  procurar o endereço e o domínio nos registros de rede e identificar outras máquinas que tenham
  falado com eles.
- **Credenciais:** trocar a senha da usuária e encerrar sessões ativas.
- **Prevenção:** filtrar anexos executáveis no e-mail, restringir execução a partir da pasta de
  downloads, limitar o uso do interpretador de comandos por usuários comuns e treinar as pessoas
  para reconhecer esse tipo de mensagem.

## Resultado

Linha do tempo consolidada e doze respostas fundamentadas. Conclusão: comprometimento confirmado, com persistência criada antes da detecção e sem evidência suficiente para afirmar exfiltração de documentos.

## O que aprendi

A ordem dos eventos muda a conclusão. Olhando só o alerta do antivírus, o caso parece resolvido. Colocando tudo em sequência, a detecção vem depois da persistência, e o que parecia fim é meio.

## Competências demonstradas

- `linha-do-tempo-de-incidente`
- `contencao-e-mitigacao`
- `leitura-de-logs`
- `processos-windows`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** RS.AN (Incident Analysis); RS.MI (Incident Mitigation); DE.AE (Adverse Event Analysis)
- **MITRE ATT&CK:** T1566.001 Phishing: Spearphishing Attachment; T1036.007 Masquerading: Double File Extension; T1204.002 User Execution: Malicious File; T1059.001 Command and Scripting Interpreter: PowerShell; T1053.005 Scheduled Task/Job: Scheduled Task; T1082 System Information Discovery; T1070.004 Indicator Removal: File Deletion
- **NICE Framework:** tarefas relacionadas às funções Incident Response, Digital Forensics

## Referências

- [NIST SP 800-61 Rev. 3: resposta a incidentes](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST SP 800-86: técnicas forenses na resposta a incidentes](https://csrc.nist.gov/pubs/sp/800/86/final)
- [MITRE ATT&CK: matriz Enterprise](https://attack.mitre.org/matrices/enterprise/)

## Limitações

- É análise sobre material fornecido. Coleta, preservação e extração de artefatos não fizeram parte da atividade.
- As medidas de endurecimento que recomendei vêm de estudo; não as configurei em laboratório.

## Para reproduzir

- O cenário é um texto do docente e não é redistribuído.
- O método se aplica a qualquer caso: reunir as fontes, ordenar por horário e anotar a origem de cada afirmação.

## Considerações éticas

Atividade de leitura de evidência. Não operei ferramenta forense: os artefatos vieram prontos no enunciado. Nomes, endereços e arquivos são fictícios.

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
