# Análise de um ataque de SQL injection em captura de pacotes

> Laboratório 010 · set/2025 · Registro textual próprio, sem captura de tela
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/sql-injection-pcap/

## Objetivo

Abri no Wireshark um PCAP de um ataque já ocorrido contra uma aplicação web e reconstruí, pedido por pedido, como o invasor foi do teste de vulnerabilidade até os hashes de senha.

- Identificar os hosts envolvidos
- Seguir os fluxos HTTP e localizar as consultas injetadas
- Descrever o que o invasor obteve em cada etapa
- Apontar formas de prevenção

## Cenário

O ataque não foi executado por mim. O material é um arquivo de captura gravado previamente em ambiente de treinamento, e o trabalho é de leitura: seguir os fluxos HTTP e entender o que cada pedido tentava obter.

## Ambiente

- VM Linux de laboratório (VirtualBox)

## Tecnologias

HTTP, TCP, SQL

## Ferramentas

Wireshark

## Procedimento

1. Abri o PCAP e identifiquei os dois endereços da conversa, origem e destino.
2. Em cada pedido GET relevante usei Follow, HTTP Stream para ler pedido e resposta juntos.
3. Usei a busca dentro do fluxo para localizar o trecho injetado.
4. Anotei, etapa por etapa, o que a aplicação devolveu.
5. Pesquisei medidas de prevenção e respondi às questões de reflexão.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

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

## Resultado

Sequência do ataque reconstruída em cinco etapas, da confirmação da falha à extração de usuários e hashes. Uma das senhas foi recuperada a partir do hash em um serviço de consulta online.

## O que aprendi

Do lado de quem defende, o ataque é visível: os pedidos estão em texto claro e o padrão se repete. Aprendi a usar o fluxo HTTP em vez de ler pacote por pacote. Hoje também sei explicar por que o hash caiu tão rápido: era um hash sem sal de uma senha comum.

## Competências demonstradas

- `analise-de-pacotes`
- `analise-de-ataque-web`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** DE.AE (Adverse Event Analysis)
- **MITRE ATT&CK:** T1190 Exploit Public-Facing Application
- **OWASP:** A05:2025 Injection; WSTG-INPV-05 Testing for SQL Injection
- **NICE Framework:** tarefas relacionadas às funções Defensive Cybersecurity

## Referências

- [OWASP Top 10:2025](https://top10.owasp.org/2025/)
- [OWASP: SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Wireshark: seguindo fluxos de protocolo](https://www.wireshark.org/docs/wsug_html_chunked/ChAdvFollowStreamSection.html)

## Limitações

- Não tenho captura de tela minha. As imagens da entrega eram do roteiro.
- Uma das perguntas pedia para explicar o que uma consulta modificada faria, e respondi apenas que era injeção de SQL.

## Para reproduzir

- Wireshark e o arquivo de captura do material do curso, que não redistribuo.
- No pacote do pedido: botão direito, Follow, HTTP Stream.

## Considerações éticas

Análise de tráfego gravado em ambiente de treinamento. Nenhum ataque foi realizado. Nomes de usuário, hashes e senhas do cenário não são reproduzidos aqui.

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
