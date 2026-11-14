---
id: "010"
covers: ["010"]
slug: sql-injection-pcap
title: "Análise de um ataque de SQL injection em captura de pacotes"
summary: >-
  Abri no Wireshark um PCAP de um ataque já ocorrido contra uma aplicação web e reconstruí, pedido
  por pedido, como o invasor foi do teste de vulnerabilidade até os hashes de senha.
date: "2025-09"
kind: laboratorio
category: analise-de-trafego
environments: [vm-linux]
os: [linux]
tools: [Wireshark]
protocols: [HTTP, TCP, SQL]
skills: [analise-de-pacotes, analise-de-ataque-web]
evidenceTypes: [investigacao, analise]
evidenceStrength: E2
context: >-
  O ataque não foi executado por mim. O material é um arquivo de captura gravado previamente em
  ambiente de treinamento, e o trabalho é de leitura: seguir os fluxos HTTP e entender o que cada
  pedido tentava obter.
objectives:
  - Identificar os hosts envolvidos
  - Seguir os fluxos HTTP e localizar as consultas injetadas
  - Descrever o que o invasor obteve em cada etapa
  - Apontar formas de prevenção
procedure:
  - Abri o PCAP e identifiquei os dois endereços da conversa, origem e destino.
  - Em cada pedido GET relevante usei Follow, HTTP Stream para ler pedido e resposta juntos.
  - Usei a busca dentro do fluxo para localizar o trecho injetado.
  - Anotei, etapa por etapa, o que a aplicação devolveu.
  - Pesquisei medidas de prevenção e respondi às questões de reflexão.
scope: >-
  Análise de tráfego gravado em ambiente de treinamento. Nenhum ataque foi realizado. Nomes de
  usuário, hashes e senhas do cenário não são reproduzidos aqui.
result: >-
  Sequência do ataque reconstruída em cinco etapas, da confirmação da falha à extração de usuários e
  hashes. Uma das senhas foi recuperada a partir do hash em um serviço de consulta online.
learning: >-
  Do lado de quem defende, o ataque é visível: os pedidos estão em texto claro e o padrão se repete.
  Aprendi a usar o fluxo HTTP em vez de ler pacote por pacote. Hoje também sei explicar por que o
  hash caiu tão rápido: era um hash sem sal de uma senha comum.
limitations:
  - Não tenho captura de tela minha. As imagens da entrega eram do roteiro.
  - Uma das perguntas pedia para explicar o que uma consulta modificada faria, e respondi apenas que era injeção de SQL.
reproducibility:
  - Wireshark e o arquivo de captura do material do curso, que não redistribuo.
  - "No pacote do pedido: botão direito, Follow, HTTP Stream."
frameworks:
  owasp:
    - { id: "A05:2025", name: Injection }
    - { id: WSTG-INPV-05, name: Testing for SQL Injection }
  attack:
    - { id: T1190, name: Exploit Public-Facing Application }
  csf:
    - { id: DE.AE, name: Adverse Event Analysis }
  nice: [Defensive Cybersecurity]
references:
  - { label: "OWASP Top 10:2025", url: "https://top10.owasp.org/2025/" }
  - { label: "OWASP: SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html" }
  - { label: "Wireshark: seguindo fluxos de protocolo", url: "https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html" }
---

O campo vulnerável era uma caixa de busca por identificador de usuário. Tudo aconteceu em pedidos
GET, então as consultas injetadas ficaram visíveis na própria URL.

| Etapa | O que o invasor enviou | O que a aplicação devolveu |
| --- | --- | --- |
| 1 | Uma condição sempre verdadeira (`1=1`) | Um registro do banco em vez de mensagem de erro: a entrada chega à consulta sem tratamento |
| 2 | `UNION SELECT` pedindo banco e usuário atuais | Nome do banco e a conta usada pela aplicação |
| 3 | `UNION SELECT` pedindo a versão | Versão do servidor de banco de dados |
| 4 | `UNION SELECT` sobre o catálogo do sistema | Lista de todas as tabelas |
| 5 | `UNION SELECT` de usuário e senha da tabela de usuários | Nomes de usuário e hashes de senha |

A ordem é a de um reconhecimento: primeiro confirmar que funciona, depois descobrir onde se está,
depois o que existe, e só então buscar o que tem valor.

Dois detalhes agravam o caso. A aplicação se conectava ao banco com a conta de administrador, então
a injeção herdou acesso a tudo, inclusive ao catálogo. E os hashes eram de um algoritmo rápido e sem
sal: o de uma senha comum foi revertido por simples consulta a uma base pública.

## Prevenção

- **Consultas parametrizadas.** A entrada do usuário vira dado, nunca parte do comando.
- **Validação de entrada.** Um campo de identificador numérico só deveria aceitar número.
- **Privilégio mínimo.** A conta da aplicação não precisa ler o catálogo nem outras tabelas.
- **Senhas com hash lento e sal.** Mesmo com a tabela vazada, a recuperação deixa de ser imediata.
