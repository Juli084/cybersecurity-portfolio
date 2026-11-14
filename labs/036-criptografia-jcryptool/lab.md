---
id: "036 e 037"
covers: ["036", "037"]
slug: criptografia-jcryptool
title: "Criptografia clássica e moderna no JCrypTool: Vigenère, César, AES e RSA"
summary: >-
  Cifrei e decifrei a mesma mensagem com uma cifra de deslocamento, com AES e com RSA, e decifrei
  uma mensagem em Vigenère a partir da chave, para comparar o que cada método oferece.
date: "2026-04"
kind: serie
category: criptografia-e-integridade
environments: [vm-linux]
os: [linux]
tools: [JCrypTool]
protocols: [AES, RSA]
skills: [cifras-classicas-e-rsa, criptografia-simetrica]
evidenceTypes: [pratica-guiada, conhecimento-aplicado]
evidenceStrength: E2
context: >-
  O JCrypTool é uma ferramenta de ensino de código aberto. Serve para ver os algoritmos
  funcionando, não para proteger dados de verdade. O valor do exercício está na comparação.
objectives:
  - Usar um algoritmo clássico de substituição
  - Usar um algoritmo simétrico moderno
  - Usar um algoritmo assimétrico moderno
  - Decifrar uma mensagem em Vigenère com a chave fornecida
procedure:
  - "037: cifrei e decifrei uma frase com a cifra de César, primeiro só com maiúsculas e depois com maiúsculas e minúsculas."
  - "037: cifrei a mesma frase com AES usando uma senha e decifrei de volta."
  - "037: gerei um par de chaves RSA para um contato fictício, cifrei com a chave pública e decifrei com a privada."
  - "036: decifrei um texto em Vigenère com a chave informada e entreguei a mensagem em claro."
result: >-
  A mesma frase foi cifrada e recuperada nos três métodos, e a mensagem em Vigenère foi decifrada.
learning: >-
  Na cifra de César a pontuação e os acentos passaram intactos e o tamanho das palavras ficou
  visível, o que já entrega muito do texto. No AES e no RSA a saída não guarda nenhuma semelhança
  com a entrada.
limitations:
  - Não há captura de tela da ferramenta. Ficaram os textos cifrados e decifrados copiados para a entrega.
  - "Na 036 entreguei só a mensagem decifrada, sem descrever o procedimento."
  - Falta na entrega a comparação entre os métodos; a tabela abaixo foi escrita para este portfólio.
reproducibility:
  - JCrypTool, disponível gratuitamente no projeto CrypTool.
frameworks:
  csf:
    - { id: PR.DS, name: Data Security }
references:
  - { label: "CrypTool: JCrypTool", url: "https://www.cryptool.org/en/jct/" }
  - { label: "NIST FIPS 197: AES", url: "https://csrc.nist.gov/pubs/fips/197/final" }
  - { label: "RFC 8017: RSA (PKCS #1)", url: "https://www.rfc-editor.org/rfc/rfc8017" }
---

A frase cifrada com César ficou assim, com deslocamento sobre o alfabeto maiúsculo:

```text
claro:   CRIPTOGRAFIA É DIVERTIDO VOCÊ PODE LER ESTA MENSAGEM SECRETA?
cifrado: MBSZDYQBKPSK É NSFOBDSNY FYMÊ ZYNO VOB OCDK WOXCKQOW COMBODK?
```

Os espaços, o ponto de interrogação e as letras acentuadas continuam no lugar. Quem olha sabe o
tamanho de cada palavra e onde estão as vogais acentuadas. Com 25 deslocamentos possíveis, testar
todos leva segundos.

A mesma frase em AES virou uma sequência de 160 caracteres hexadecimais, e em RSA, uma ainda mais
longa. Nenhuma das duas dá pista do conteúdo.

| | César e Vigenère | AES | RSA |
| --- | --- | --- | --- |
| Tipo | Substituição clássica | Simétrico | Assimétrico |
| Chave | Um deslocamento ou uma palavra | Uma chave secreta compartilhada | Par: pública cifra, privada decifra |
| Problema principal | Preserva a estrutura do texto | Como entregar a chave ao outro lado | Lento para volume grande de dados |
| Uso hoje | Ensino | Cifrar dados em disco e em trânsito | Trocar chaves e assinar |

Na prática os dois modernos trabalham juntos: o assimétrico resolve a entrega da chave e o
simétrico cifra o conteúdo.

A Vigenère melhora a César ao usar uma palavra como chave, de modo que a mesma letra do texto vira
letras diferentes conforme a posição. Mesmo assim a chave se repete, e a repetição é o que permite
quebrá-la por análise de frequência quando o texto é longo.
