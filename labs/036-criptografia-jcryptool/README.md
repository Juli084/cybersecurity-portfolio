# Criptografia clássica e moderna no JCrypTool: Vigenère, César, AES e RSA

> Série de laboratórios 036 e 037 · abr/2026 · Registro textual próprio, sem captura de tela
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/criptografia-jcryptool/

## Objetivo

Cifrei e decifrei a mesma mensagem com uma cifra de deslocamento, com AES e com RSA, e decifrei uma mensagem em Vigenère a partir da chave, para comparar o que cada método oferece.

- Usar um algoritmo clássico de substituição
- Usar um algoritmo simétrico moderno
- Usar um algoritmo assimétrico moderno
- Decifrar uma mensagem em Vigenère com a chave fornecida

## Cenário

O JCrypTool é uma ferramenta de ensino de código aberto. Serve para ver os algoritmos funcionando, não para proteger dados de verdade. O valor do exercício está na comparação.

## Ambiente

- VM Linux de laboratório (VirtualBox)

## Tecnologias

AES, RSA

## Ferramentas

JCrypTool

## Procedimento

1. 037: cifrei e decifrei uma frase com a cifra de César, primeiro só com maiúsculas e depois com maiúsculas e minúsculas.
2. 037: cifrei a mesma frase com AES usando uma senha e decifrei de volta.
3. 037: gerei um par de chaves RSA para um contato fictício, cifrei com a chave pública e decifrei com a privada.
4. 036: decifrei um texto em Vigenère com a chave informada e entreguei a mensagem em claro.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

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

## Resultado

A mesma frase foi cifrada e recuperada nos três métodos, e a mensagem em Vigenère foi decifrada.

## O que aprendi

Na cifra de César a pontuação e os acentos passaram intactos e o tamanho das palavras ficou visível, o que já entrega muito do texto. No AES e no RSA a saída não guarda nenhuma semelhança com a entrada.

## Competências demonstradas

- `cifras-classicas-e-rsa`
- `criptografia-simetrica`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** PR.DS (Data Security)

## Referências

- [CrypTool: JCrypTool](https://www.cryptool.org/en/jct/)
- [NIST FIPS 197: AES](https://csrc.nist.gov/pubs/fips/197/final)
- [RFC 8017: RSA (PKCS #1)](https://www.rfc-editor.org/rfc/rfc8017)

## Limitações

- Não há captura de tela da ferramenta. Ficaram os textos cifrados e decifrados copiados para a entrega.
- Na 036 entreguei só a mensagem decifrada, sem descrever o procedimento.
- Falta na entrega a comparação entre os métodos; a tabela abaixo foi escrita para este portfólio.

## Para reproduzir

- JCrypTool, disponível gratuitamente no projeto CrypTool.

## Considerações éticas

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
