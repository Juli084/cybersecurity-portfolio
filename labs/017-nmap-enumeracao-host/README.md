# Enumeração de host e serviços com Nmap

> Laboratório 017 · out/2025 · Evidência direta (captura de tela própria ou saída de terminal copiada na entrega)
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/nmap-enumeracao-host/

## Objetivo

Reconhecimento ativo em rede de laboratório: descobrir hosts ativos, escolher um alvo, listar portas, identificar versões de serviço e sistema operacional e registrar tudo em arquivo.

- Levantar a configuração da própria rede antes de varrer
- Descobrir os hosts ativos na sub-rede
- Enumerar portas, serviços, versões e sistema operacional de um host
- Salvar o resultado em arquivo

## Cenário

O ponto de partida é uma situação de analista: uma captura mostra atividade incomum em uma máquina, e é preciso descobrir que serviços ela oferece e se algum deles é um problema.

## Ambiente

- VM Linux de laboratório (VirtualBox)

## Tecnologias

ICMP, TCP, HTTP, HTTPS, SMB, RDP, MySQL, FTP

## Ferramentas

Nmap, ip, resolvectl

## Procedimento

1. Coloquei a máquina virtual em modo bridge e levantei rede, máscara, gateway e DNS com ifconfig, ip route e resolvectl.
2. Fiz a descoberta de hosts com nmap -sn na sub-rede.
3. Escolhi um host e listei as portas com nmap -Pn.
4. Rodei detecção de versão e de sistema operacional com sudo nmap -O -sV -Pn e salvei a saída com -oN.
5. Investiguei a porta 21 com -p 21 -sV -T4 e com -A.
6. Montei uma tabela das opções mais usadas a partir da página de manual.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

Comandos usados, com a rede trocada por `10.0.50.0/24` e o alvo por `10.0.50.20`:

```bash
nmap -sn 10.0.50.0/24                             # quem está ativo
nmap -Pn 10.0.50.20                               # portas, sem depender de ping
sudo nmap -O -sV -Pn 10.0.50.20 -oN analise.txt   # SO, versões e saída em arquivo
sudo nmap -v -p 21 -sV -T4 10.0.50.20             # um serviço específico
```

Portas abertas no alvo:

| Porta | Serviço | Leitura |
| --- | --- | --- |
| 80, 443, 8080 | HTTP, HTTPS, proxy HTTP | Há serviço web na máquina, em mais de uma porta |
| 135, 139, 445 | RPC, NetBIOS, SMB | Compartilhamento do Windows; a 445 é alvo recorrente de exploração |
| 3306 | MySQL | Banco de dados acessível pela rede |
| 3389 | RDP | Área de trabalho remota exposta |

O conjunto 135, 139, 445 e 3389 já indicava Windows antes mesmo da detecção de sistema operacional
confirmar.

Para uma estação de trabalho, banco de dados e área de trabalho remota acessíveis a toda a sub-rede
é exposição desnecessária. Se fosse um chamado real, o próximo passo seria perguntar ao dono da
máquina se esses serviços são usados, e restringir por firewall os que forem.

## Por que `-Pn`

Sem `-Pn`, o Nmap primeiro testa se o host responde e desiste dos que não respondem. Muitas
máquinas Windows bloqueiam ping no firewall, então o host parece desligado. `-Pn` pula esse teste e
varre assim mesmo.

## Sobre detecção

Uma varredura de conexão completa, como a padrão sem privilégio, fecha o handshake em cada porta e
deixa rastro em log. A `-sS`, que exige root, envia só o primeiro pacote e não completa a conexão.
A `-A` soma detecção de sistema, de versão, scripts e traceroute. Quanto mais informação, mais
tráfego e mais chance de um IDS perceber.

## Resultado

Host identificado como Windows, com oito portas TCP abertas. A porta 21 estava fechada, então não havia serviço FTP para enumerar. O resultado foi salvo em arquivo de texto.

## O que aprendi

A descoberta de hosts devolveu 16 máquinas na primeira execução e 11 na segunda. Uma varredura é uma fotografia do momento, não um inventário. Também aprendi que a opção -A faz muito barulho e que só se usa com autorização.

## Competências demonstradas

- `varredura-de-portas`
- `enderecamento-ipv4`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** ID.RA (Risk Assessment); ID.AM (Asset Management)
- **MITRE ATT&CK:** T1595 Active Scanning; T1046 Network Service Discovery
- **NICE Framework:** tarefas relacionadas às funções Vulnerability Analysis

## Referências

- [Nmap: guia de referência](https://nmap.org/book/man.html)
- [Nmap: técnicas de descoberta de hosts](https://nmap.org/book/man-host-discovery.html)
- [Nmap: detecção de serviço e versão](https://nmap.org/book/man-version-detection.html)

## Limitações

- Não há captura de tela; comandos e resultados foram copiados do terminal.
- O arquivo de saída gerado na aula não foi guardado junto com a entrega.
- Não avancei da enumeração para a busca de vulnerabilidades conhecidas nas versões encontradas.

## Para reproduzir

- Descoberta: nmap -sn na sub-rede. Enumeração: sudo nmap -O -sV -Pn no alvo, com -oN para salvar.
- Somente em rede própria ou com autorização por escrito.

## Considerações éticas

Atividade conduzida em aula, na rede do laboratório do curso, conforme o roteiro do docente. Os endereços e nomes de máquina desta página foram substituídos.

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
