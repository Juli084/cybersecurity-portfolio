---
id: "041"
covers: ["041"]
slug: hashes-openssl
title: "Cálculo e verificação de hashes com OpenSSL"
summary: >-
  Calculei o hash de um arquivo, alterei uma única letra e calculei de novo. Depois usei o mesmo
  princípio para verificar a integridade de um download contra o hash publicado.
date: "2026-05"
kind: laboratorio
category: criptografia-e-integridade
environments: [vm-linux]
os: [linux]
tools: [OpenSSL, sha256sum, sha512sum, nano]
protocols: [SHA-256, SHA-512]
skills: [hash-e-integridade, linux-cli]
evidenceTypes: [pratica-executada, analise]
evidenceStrength: E3
context: >-
  Função de hash recebe qualquer quantidade de dados e devolve uma sequência de tamanho fixo. É
  rápida de calcular, impraticável de reverter, e qualquer alteração na entrada muda o resultado
  inteiro. Essa última propriedade é o que a torna útil para verificar integridade.
objectives:
  - Gerar o hash de um arquivo de texto com OpenSSL
  - Observar o efeito de uma alteração mínima no arquivo
  - Verificar a integridade de um arquivo baixado
procedure:
  - Calculei o SHA-256 de um arquivo de texto com openssl sha256.
  - Abri o arquivo no nano, troquei uma letra, salvei e calculei de novo.
  - Calculei também o SHA-512 e repeti os dois cálculos com sha256sum e sha512sum.
  - Li o hash publicado junto com um arquivo de imagem e calculei o hash do arquivo baixado.
  - Comparei os dois valores.
evidence:
  - src: ./evidence/sha256-original.png
    alt: Terminal com o comando openssl sha256 sobre um arquivo de texto e o hash resultante
    caption: Hash SHA-256 do arquivo original.
  - src: ./evidence/sha256-apos-alteracao.png
    alt: Terminal com a edição do arquivo no nano e novo cálculo do SHA-256, com valor completamente diferente
    caption: Depois de trocar uma letra, o hash não tem nenhum trecho em comum com o anterior.
  - src: ./evidence/hash-publicado.png
    alt: Terminal exibindo com cat o conteúdo do arquivo que traz o hash SHA-256 publicado
    caption: Hash publicado pelo distribuidor do arquivo.
  - src: ./evidence/sha256sum-arquivo.png
    alt: Terminal com sha256sum sobre o arquivo baixado, resultando no mesmo valor do hash publicado
    caption: Hash calculado localmente. Os dois valores são idênticos.
result: >-
  A troca de uma letra produziu um hash completamente diferente. O arquivo baixado teve o hash
  igual ao publicado, o que indica que chegou íntegro.
learning: >-
  Comparar hash é rápido e pega erro de transmissão. Não prova quem publicou o arquivo: se alguém
  troca o arquivo no servidor, troca também o hash ao lado. Para isso existe assinatura digital.
limitations:
  - A verificação foi feita comparando os valores a olho. O jeito mais seguro é deixar a ferramenta comparar, com sha256sum -c.
reproducibility:
  - "openssl sha256 arquivo, ou sha256sum arquivo, em qualquer Linux."
  - "Para conferir contra um arquivo de hashes: sha256sum -c arquivo.sha256"
frameworks:
  csf:
    - { id: PR.DS, name: Data Security }
references:
  - { label: "NIST FIPS 180-4: Secure Hash Standard", url: "https://csrc.nist.gov/pubs/fips/180-4/upd1/final" }
  - { label: "OpenSSL: comando dgst", url: "https://docs.openssl.org/master/man1/openssl-dgst/" }
  - { label: "sha256sum: página de manual", url: "https://man7.org/linux/man-pages/man1/sha256sum.1.html" }
---

## Uma letra

O arquivo começava com uma saudação, e troquei uma única letra em uma palavra. Os dois hashes estão
nas duas primeiras capturas: um começa com `deff9c` e o outro com `43302c`, e não há trecho em comum
entre eles. É o efeito avalanche: uma mudança mínima na entrada altera, em média, metade
dos bits da saída. Por isso não dá para ajustar o arquivo aos poucos até o hash coincidir.

## Duas ferramentas, mesmo resultado

`openssl sha256` e `sha256sum` devolveram o mesmo valor para o mesmo arquivo, e o mesmo ocorreu com
SHA-512. O algoritmo é um padrão público; a ferramenta só o implementa. Se duas ferramentas
discordarem, uma delas leu um arquivo diferente.

## Verificando um download

As duas últimas capturas mostram o hash publicado e o hash que calculei sobre o arquivo baixado. Os
valores são iguais, então o arquivo que tenho é o mesmo que foi publicado.

O limite dessa verificação é a origem do hash. Se ele vem do mesmo servidor que o arquivo, quem
comprometeu um pode ter trocado o outro. A proteção contra isso é a assinatura digital, em que o
hash é assinado com a chave privada de quem publica e conferido com a chave pública.
