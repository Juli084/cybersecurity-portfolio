---
id: "014, 015 e 018"
covers: ["014", "015", "018"]
slug: linux-essencial
title: "Linux essencial: shell, arquivos de configuração e serviços em execução"
summary: >-
  Três laboratórios de base em Linux: navegar e manipular arquivos no shell, editar a configuração
  de um serviço e descobrir quais serviços estão escutando em uma máquina.
date: "2025-10"
kind: serie
category: linux
environments: [vm-linux]
os: [linux]
tools: [bash, nano, SciTE, nginx, ps, netstat, telnet]
protocols: [TCP, UDP, HTTP]
skills: [linux-cli, servicos-linux]
evidenceTypes: [pratica-guiada, configuracao, analise]
evidenceStrength: E3
context: >-
  Boa parte das ferramentas de segurança roda em Linux e é operada pelo terminal. Estas três
  atividades são a base usada nos laboratórios seguintes de logs, permissões, Nmap e IDS.
objectives:
  - Navegar no sistema de arquivos e manipular arquivos pelo shell
  - Editar arquivos de configuração de usuário e de serviço
  - Identificar serviços em execução, as portas que usam e os processos responsáveis
procedure:
  - "015: usei man, pwd, cd, ls -la, mkdir, cp, mv e rm, com caminhos absolutos e relativos, e os redirecionamentos > e >>."
  - "014: troquei a cor do prompt editando o .bashrc e observei em quais terminais a mudança valia."
  - "014: criei uma configuração própria do nginx trocando a porta de escuta para 8080, iniciei o serviço com ela e testei pelo navegador."
  - "018: listei processos com ps e a hierarquia entre eles, e as portas em escuta com netstat -tunap."
  - "018: relacionei a porta 80 ao processo do nginx e testei portas com telnet."
evidence:
  - src: ./evidence/nginx-porta-8080.png
    alt: Navegador na máquina virtual acessando o endereço local na porta 8080 e exibindo a página de sucesso do nginx
    caption: "014: o nginx respondendo na porta 8080 depois da alteração na configuração."
result: >-
  Serviço web iniciado com configuração alterada e respondendo na nova porta. Serviços em escuta
  identificados e associados aos seus processos.
learning: >-
  O arquivo de configuração só é lido quando o programa inicia. Mudei o .bashrc e o terminal aberto
  continuou igual; só os novos pegaram a alteração. O mesmo vale para serviço: editar não basta,
  é preciso recarregar.
limitations:
  - Só a 014 tem captura de tela. As outras duas têm o registro escrito.
  - Uma resposta do desafio final da 014 ficou incompleta.
reproducibility:
  - Qualquer distribuição Linux com nginx instalado.
  - "Para ver quem escuta em cada porta: netstat -tunap, ou ss -tunap nas distribuições atuais."
frameworks:
  nice: [Systems Administration]
references:
  - { label: "nginx: guia para iniciantes", url: "https://nginx.org/en/docs/beginners_guide.html" }
  - { label: "GNU Bash: manual de referência", url: "https://www.gnu.org/software/bash/manual/bash.html" }
  - { label: "netstat: página de manual", url: "https://man7.org/linux/man-pages/man8/netstat.8.html" }
---

## Shell

Dois operadores resolvem muita coisa. `>` manda a saída de um comando para um arquivo e apaga o que
havia nele. `>>` acrescenta ao final. Trocar um pelo outro em um arquivo de configuração ou de log
é uma forma rápida de perder dados.

Arquivo cujo nome começa com ponto não aparece no `ls` comum. Com `ls -la` a listagem do diretório
pessoal passou de 52 para 152 entradas na máquina do laboratório. Arquivo oculto não é arquivo
protegido, é só arquivo que não aparece por padrão.

## Configuração por usuário e por sistema

As configurações do usuário ficam no diretório pessoal e as do sistema em `/etc`, que só o root
altera. A separação permite que cada pessoa ajuste o próprio ambiente sem tocar no que vale para
todos.

Ao subir o nginx com a configuração nova, uma mensagem de erro avisou que a porta já estava em uso
por outro serviço. A mensagem já dizia o que conferir: quem mais estava escutando ali.

## Quem está escutando

`netstat -tunap` lista conexões TCP e UDP com endereços numéricos e o processo dono de cada porta.
Na máquina do laboratório, a porta 80 estava em escuta por TCP, sob o processo mestre do nginx. O
processo mestre roda como root e cria processos de trabalho sob um usuário sem privilégios, que são
os que atendem aos pedidos. Se um deles for comprometido, o dano fica limitado ao que aquele usuário
pode fazer.

O Telnet serviu aqui como teste de porta: conectar e ver se algo responde. Para acesso remoto ele
não serve, porque transmite tudo em texto claro, inclusive a senha.
