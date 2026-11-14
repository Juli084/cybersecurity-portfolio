---
id: "038"
covers: ["038"]
slug: openssl-aes
title: "Decifragem AES-256-CBC com OpenSSL na linha de comando"
summary: >-
  Recebi um arquivo cifrado, o algoritmo e a senha. Decifrei com OpenSSL no terminal e li a mensagem.
  O aviso que o OpenSSL emitiu no caminho acabou sendo a parte mais instrutiva.
date: "2026-04"
kind: laboratorio
category: criptografia-e-integridade
environments: [vm-linux]
os: [linux]
tools: [OpenSSL]
protocols: [AES-256-CBC, Base64]
skills: [criptografia-simetrica, linux-cli]
evidenceTypes: [pratica-executada, analise]
evidenceStrength: E3
context: >-
  Desafio curto proposto em aula: um arquivo com extensão .enc, a informação de que foi cifrado com
  AES-256 em modo CBC e a senha. Nada de roteiro.
objectives:
  - Decifrar o arquivo com OpenSSL
  - Entregar a mensagem em claro
procedure:
  - Antes do arquivo do desafio, decifrei outro arquivo cifrado, de exemplo, para confirmar os parâmetros.
  - Rodei openssl aes-256-cbc com -a para Base64 e -d para decifrar, indicando arquivo de entrada e de saída.
  - Digitei a senha quando solicitada.
  - Li o arquivo de saída com cat.
evidence:
  - src: ./evidence/openssl-decifragem.png
    alt: Terminal em máquina virtual Linux com a listagem de arquivos, os comandos openssl aes-256-cbc de decifragem, o aviso de derivação de chave obsoleta e a mensagem decifrada exibida com cat
    caption: Sessão completa no terminal. Aparecem o teste inicial, o comando de decifragem, o aviso do OpenSSL sobre derivação de chave e a mensagem em claro ao final.
result: >-
  Arquivo decifrado e mensagem lida. O arquivo cifrado e o resultado estão guardados junto com a
  captura.
learning: >-
  O OpenSSL avisou que a derivação de chave usada era obsoleta e sugeriu -iter ou -pbkdf2. O arquivo
  tinha sido cifrado do jeito antigo, então precisei decifrar do mesmo jeito. Para cifrar algo meu,
  usaria -pbkdf2.
limitations:
  - A entrega foi só o arquivo decifrado e a captura, sem texto.
  - A senha do desafio foi definida pelo docente e não é reproduzida aqui.
reproducibility:
  - "Decifrar: openssl aes-256-cbc -a -d -in arquivo.enc -out saida.txt"
  - "Cifrar com derivação atual: openssl aes-256-cbc -pbkdf2 -a -in entrada.txt -out arquivo.enc"
frameworks:
  csf:
    - { id: PR.DS, name: Data Security }
references:
  - { label: "OpenSSL: comando enc", url: "https://docs.openssl.org/master/man1/openssl-enc/" }
  - { label: "RFC 8018: PBKDF2 (PKCS #5)", url: "https://www.rfc-editor.org/rfc/rfc8018" }
  - { label: "NIST SP 800-38A: modos de operação", url: "https://csrc.nist.gov/pubs/sp/800/38/a/final" }
---

O comando tem quatro partes que precisam coincidir com a forma como o arquivo foi cifrado:

| Parte | O que significa |
| --- | --- |
| `aes-256-cbc` | Algoritmo AES, chave de 256 bits, modo de encadeamento de blocos |
| `-a` | O arquivo está em Base64, texto, e não em binário |
| `-d` | Decifrar |
| senha | De onde a chave é derivada |

O arquivo começava com `U2FsdGVkX1`, que é a palavra "Salted__" em Base64. É a marca do formato do
OpenSSL quando a chave vem de senha: logo depois dela fica o sal usado na derivação.

## O aviso

```text
*** WARNING : deprecated key derivation used.
Using -iter or -pbkdf2 would be better.
```

Senha não é chave. O OpenSSL transforma uma em outra com uma função de derivação. A antiga faz essa
conta uma única vez, o que deixa barato testar milhões de senhas contra o arquivo. O PBKDF2 repete
a operação milhares de vezes, e cada tentativa de adivinhação fica proporcionalmente mais cara.

A força do AES-256 não muda. O que muda é o elo mais fraco, que passa a ser a senha e a forma de
derivar a chave. Um arquivo cifrado com AES-256 e uma senha curta, sem PBKDF2, é mais frágil do que
o nome do algoritmo sugere.

## Por que testar antes

Decifrei primeiro um arquivo de exemplo. Se a decifragem do desafio falhasse depois, eu saberia que
o problema estava na senha ou no arquivo, e não na minha sintaxe.
