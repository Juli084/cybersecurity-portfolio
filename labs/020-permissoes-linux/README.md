# Sistema de arquivos e permissões no Linux

> Laboratório 020 · nov/2025 · Evidência direta (captura de tela própria ou saída de terminal copiada na entrega)
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/permissoes-linux/

## Objetivo

Montei um segundo disco, li e alterei permissões e donos de arquivos, testei o que acontece ao escrever sem privilégio e comparei link simbólico com link rígido.

- Listar dispositivos de bloco e sistemas de arquivos montados
- Montar uma partição e acessar seu conteúdo
- Ler e alterar permissões em notação octal e o dono de um arquivo
- Diferenciar link simbólico de link rígido

## Cenário

Permissão de arquivo é o controle de acesso mais básico de um sistema Linux. Boa parte dos problemas em servidores passa por um arquivo que estava legível ou gravável por quem não devia.

## Ambiente

- VM Linux de laboratório (VirtualBox)

## Ferramentas

lsblk, mount, chmod, chown, ln

## Procedimento

1. Listei os discos com lsblk e os sistemas montados com mount.
2. Montei a segunda partição em um diretório do usuário e conferi o conteúdo.
3. Li as permissões com ls -l e interpretei cada grupo de três caracteres.
4. Tentei criar um arquivo em um diretório do root, vi a recusa e repeti com sudo.
5. Alterei permissões com chmod e o dono com chown, conferindo a cada passo.
6. Criei um link simbólico e um link rígido, renomeei os arquivos originais e testei os dois.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

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

## Resultado

Partição montada e acessível, permissões e dono alterados e verificados, e a diferença entre os dois tipos de link demonstrada pelo link simbólico quebrado.

## O que aprendi

Passei a ler a saída do ls -l da esquerda para a direita antes de tentar qualquer coisa: tipo, dono, grupo, outros. E aprendi que abrir a permissão para todos resolve o erro e cria o problema.

## Competências demonstradas

- `permissoes-linux`
- `linux-cli`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** PR.AA (Identity Management, Authentication, and Access Control); PR.PS (Platform Security)
- **NICE Framework:** tarefas relacionadas às funções Systems Administration

## Referências

- [chmod: página de manual](https://man7.org/linux/man-pages/man1/chmod.1.html)
- [chown: página de manual](https://man7.org/linux/man-pages/man1/chown.1.html)
- [ln: página de manual](https://man7.org/linux/man-pages/man1/ln.1.html)

## Limitações

- Não há captura de tela. As saídas do terminal foram copiadas para a entrega e os trechos abaixo vêm delas.
- Algumas respostas da entrega ficaram curtas demais.

## Para reproduzir

- Qualquer Linux com um segundo disco ou partição disponível.
- Comandos: lsblk, mount, ls -l, chmod, chown, ln e ln -s.

## Considerações éticas

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
