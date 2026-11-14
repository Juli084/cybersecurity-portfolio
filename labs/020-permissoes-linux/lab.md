---
id: "020"
covers: ["020"]
slug: permissoes-linux
title: "Sistema de arquivos e permissões no Linux"
summary: >-
  Montei um segundo disco, li e alterei permissões e donos de arquivos, testei o que acontece ao
  escrever sem privilégio e comparei link simbólico com link rígido.
date: "2025-11"
kind: laboratorio
category: linux
environments: [vm-linux]
os: [linux]
tools: [lsblk, mount, chmod, chown, ln]
protocols: []
skills: [permissoes-linux, linux-cli]
evidenceTypes: [pratica-executada, configuracao, analise]
evidenceStrength: E3
context: >-
  Permissão de arquivo é o controle de acesso mais básico de um sistema Linux. Boa parte dos
  problemas em servidores passa por um arquivo que estava legível ou gravável por quem não devia.
objectives:
  - Listar dispositivos de bloco e sistemas de arquivos montados
  - Montar uma partição e acessar seu conteúdo
  - Ler e alterar permissões em notação octal e o dono de um arquivo
  - Diferenciar link simbólico de link rígido
procedure:
  - Listei os discos com lsblk e os sistemas montados com mount.
  - Montei a segunda partição em um diretório do usuário e conferi o conteúdo.
  - Li as permissões com ls -l e interpretei cada grupo de três caracteres.
  - Tentei criar um arquivo em um diretório do root, vi a recusa e repeti com sudo.
  - Alterei permissões com chmod e o dono com chown, conferindo a cada passo.
  - Criei um link simbólico e um link rígido, renomeei os arquivos originais e testei os dois.
result: >-
  Partição montada e acessível, permissões e dono alterados e verificados, e a diferença entre os
  dois tipos de link demonstrada pelo link simbólico quebrado.
learning: >-
  Passei a ler a saída do ls -l da esquerda para a direita antes de tentar qualquer coisa: tipo,
  dono, grupo, outros. E aprendi que abrir a permissão para todos resolve o erro e cria o problema.
limitations:
  - Não há captura de tela. As saídas do terminal foram copiadas para a entrega e os trechos abaixo vêm delas.
  - Algumas respostas da entrega ficaram curtas demais.
reproducibility:
  - Qualquer Linux com um segundo disco ou partição disponível.
  - "Comandos: lsblk, mount, ls -l, chmod, chown, ln e ln -s."
frameworks:
  csf:
    - { id: PR.AA, name: "Identity Management, Authentication, and Access Control" }
    - { id: PR.PS, name: Platform Security }
  nice: [Systems Administration]
references:
  - { label: "chmod: página de manual", url: "https://man7.org/linux/man-pages/man1/chmod.1.html" }
  - { label: "chown: página de manual", url: "https://man7.org/linux/man-pages/man1/chown.1.html" }
  - { label: "ln: página de manual", url: "https://man7.org/linux/man-pages/man1/ln.1.html" }
---

## Montagem

A segunda partição existia no disco, mas não aparecia em nenhum diretório. Só depois de montada o
conteúdo ficou acessível:

```text
$ mount | grep /dev/sd
/dev/sda2 on / type ext4 (rw,relatime)
/dev/sdb1 on /home/analyst/second_drive type ext4 (rw,relatime)
```

O arquivo que estava nela sempre esteve lá. Montar é o que liga o dispositivo a um ponto da árvore
de diretórios.

## Escrita negada

```text
$ touch /mnt/myNewFile.txt
touch: cannot touch '/mnt/myNewFile.txt': Permission denied

$ ls -ld /mnt
drwxr-xr-x 2 root root 4096 /mnt
```

O diretório pertence ao root e só o dono tem permissão de escrita. Com `sudo` o arquivo foi criado,
e nasceu pertencendo ao root. Usar sudo para contornar uma recusa muda quem é o dono do que foi
criado, e isso tem consequência depois.

## Permissões e dono

Cada dígito octal é a soma de leitura (4), escrita (2) e execução (1), para dono, grupo e outros. O
arquivo de teste começou como `rw-rw-r-x`. O exercício pedia para liberar tudo a todos (`777`) e
conferir o resultado, o que mostra bem o que não se faz em produção: qualquer conta do sistema passa
a poder alterar o arquivo.

A correção adequada veio no passo seguinte, com `chown`: tornar o usuário dono do arquivo em vez de
abrir o arquivo para todos. Depois disso a escrita funcionou sem privilégio elevado.

## Link simbólico e link rígido

Depois de renomear os dois arquivos originais:

```text
$ cat file1symbolic
cat: file1symbolic: No such file or directory
$ cat file2hard
hard
```

O link simbólico guarda o nome do alvo; mudou o nome, quebrou. O link rígido aponta para o mesmo
conteúdo no disco, e por isso continua funcionando e reflete qualquer alteração feita pelo outro
nome.
