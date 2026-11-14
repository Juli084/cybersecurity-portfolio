# Análise de tráfego DNS com Wireshark

> Laboratório 009 · ago/2025 · Registro textual próprio, sem captura de tela
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/dns-wireshark/

## Objetivo

Capturei uma consulta DNS, filtrei o tráfego e li o pacote camada por camada: Ethernet II, IPv4, UDP e DNS, na consulta e na resposta. Um erro que cometi na entrega virou a parte mais útil.

- Capturar tráfego DNS em uma interface ativa
- Examinar os campos da consulta
- Examinar os campos da resposta e comparar com a consulta

## Cenário

O Wireshark mostra cada campo de cada pacote. Isso serve para resolver problema de rede e investigar incidente, e serve igualmente a quem quer reconhecer uma rede alheia. O laboratório usa uma única consulta DNS para percorrer a pilha inteira.

## Ambiente

- PC Windows do laboratório do curso

## Tecnologias

DNS, UDP, IPv4, Ethernet

## Ferramentas

Wireshark, nslookup, ipconfig, arp

## Procedimento

1. Iniciei a captura no Wireshark e limpei o cache DNS com ipconfig /flushdns.
2. Fiz a consulta de um nome pelo nslookup e parei a captura.
3. Apliquei o filtro udp.port == 53 para ficar só com DNS.
4. No pacote de consulta, anotei MAC, IP e porta de origem e de destino.
5. Comparei com os endereços do próprio PC em ipconfig /all e arp -a.
6. Repeti a leitura no pacote de resposta.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

Valores que anotei, com os endereços trocados por equivalentes:

| Campo | Consulta | Resposta |
| --- | --- | --- |
| MAC de origem | placa de rede do PC | interface do roteador |
| MAC de destino | interface do roteador | placa de rede do PC |
| IP de origem | `10.0.20.50` (PC) | `10.0.30.53` (servidor DNS) |
| IP de destino | `10.0.30.53` (servidor DNS) | `10.0.20.50` (PC) |
| Porta de origem | 53952 | 53 |
| Porta de destino | 53 | 53952 |

## O erro

Na entrega, chamei o IP de destino da consulta de "gateway padrão". Não é. Aquele IP é o servidor
DNS. O gateway aparece em outro lugar: no MAC de destino.

As duas informações não se contradizem. O servidor DNS estava em outra sub-rede, então o PC
entrega o quadro Ethernet ao roteador, que é o próximo salto, e o roteador encaminha o pacote. Eu
estava misturando as duas camadas. Na resposta os papéis se invertem, e o MAC de origem volta a ser
o do roteador, não o do servidor.

## O resto do pacote

A porta 53952 é efêmera, escolhida pelo sistema para aquela consulta. A 53 é a do serviço. Na
resposta elas trocam de lugar, e é assim que o sistema sabe a qual pedido a resposta pertence.

## Por que isso importa em segurança

DNS tradicional trafega sem criptografia. Quem captura o tráfego de um segmento vê quais nomes
estão sendo consultados e descobre, de quebra, onde ficam o servidor DNS interno e o gateway. É
informação de reconhecimento obtida sem enviar um único pacote.

## Resultado

Consulta e resposta identificadas e lidas nas quatro camadas. Os endereços do pacote coincidiram com os do PC, confirmando que o tráfego capturado era o meu.

## O que aprendi

O IP diz para onde o pacote vai no fim. O MAC diz para quem ele vai agora. Passei a conferir as duas camadas antes de afirmar que equipamento é qual.

## Competências demonstradas

- `analise-de-pacotes`
- `dns`
- `enderecamento-ipv4`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** DE.CM (Continuous Monitoring)
- **NICE Framework:** tarefas relacionadas às funções Defensive Cybersecurity

## Referências

- [Wireshark: guia do usuário](https://www.wireshark.org/docs/wsug_html_chunked/)
- [RFC 1035: DNS, implementação e especificação](https://www.rfc-editor.org/rfc/rfc1035)

## Limitações

- Não tenho captura de tela minha deste laboratório. As imagens da entrega eram do roteiro.
- Duas perguntas ficaram sem resposta na entrega, sobre recursão e sobre os registros CNAME em comparação com o nslookup.
- Pretendo refazer a captura em rede própria e publicar as telas.

## Para reproduzir

- Qualquer computador com Wireshark e permissão para capturar na própria interface.
- Filtro de exibição: udp.port == 53.

## Considerações éticas

Captura feita em aula, no PC do laboratório, e a análise se limitou à minha própria consulta. Os endereços IP e MAC desta página foram substituídos.

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
