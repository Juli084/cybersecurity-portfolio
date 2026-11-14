---
id: "017"
covers: ["017"]
slug: nmap-enumeracao-host
title: "Enumeração de host e serviços com Nmap"
summary: >-
  Reconhecimento ativo em rede de laboratório: descobrir hosts ativos, escolher um alvo, listar
  portas, identificar versões de serviço e sistema operacional e registrar tudo em arquivo.
date: "2025-10"
kind: laboratorio
category: reconhecimento-e-varredura
environments: [vm-linux]
os: [linux]
tools: [Nmap, ip, resolvectl]
protocols: [ICMP, TCP, HTTP, HTTPS, SMB, RDP, MySQL, FTP]
skills: [varredura-de-portas, enderecamento-ipv4]
evidenceTypes: [pratica-executada, investigacao]
evidenceStrength: E3
anonymized: true
context: >-
  O ponto de partida é uma situação de analista: uma captura mostra atividade incomum em uma
  máquina, e é preciso descobrir que serviços ela oferece e se algum deles é um problema.
objectives:
  - Levantar a configuração da própria rede antes de varrer
  - Descobrir os hosts ativos na sub-rede
  - Enumerar portas, serviços, versões e sistema operacional de um host
  - Salvar o resultado em arquivo
procedure:
  - Coloquei a máquina virtual em modo bridge e levantei rede, máscara, gateway e DNS com ifconfig, ip route e resolvectl.
  - Fiz a descoberta de hosts com nmap -sn na sub-rede.
  - Escolhi um host e listei as portas com nmap -Pn.
  - Rodei detecção de versão e de sistema operacional com sudo nmap -O -sV -Pn e salvei a saída com -oN.
  - Investiguei a porta 21 com -p 21 -sV -T4 e com -A.
  - Montei uma tabela das opções mais usadas a partir da página de manual.
scope: >-
  Atividade conduzida em aula, na rede do laboratório do curso, conforme o roteiro do docente. Os
  endereços e nomes de máquina desta página foram substituídos.
result: >-
  Host identificado como Windows, com oito portas TCP abertas. A porta 21 estava fechada, então não
  havia serviço FTP para enumerar. O resultado foi salvo em arquivo de texto.
learning: >-
  A descoberta de hosts devolveu 16 máquinas na primeira execução e 11 na segunda. Uma varredura é
  uma fotografia do momento, não um inventário. Também aprendi que a opção -A faz muito barulho e
  que só se usa com autorização.
limitations:
  - Não há captura de tela; comandos e resultados foram copiados do terminal.
  - O arquivo de saída gerado na aula não foi guardado junto com a entrega.
  - Não avancei da enumeração para a busca de vulnerabilidades conhecidas nas versões encontradas.
reproducibility:
  - "Descoberta: nmap -sn na sub-rede. Enumeração: sudo nmap -O -sV -Pn no alvo, com -oN para salvar."
  - Somente em rede própria ou com autorização por escrito.
frameworks:
  attack:
    - { id: T1595, name: Active Scanning }
    - { id: T1046, name: Network Service Discovery }
  csf:
    - { id: ID.RA, name: Risk Assessment }
    - { id: ID.AM, name: Asset Management }
  nice: [Vulnerability Analysis]
references:
  - { label: "Nmap: guia de referência", url: "https://nmap.org/book/man.html" }
  - { label: "Nmap: técnicas de descoberta de hosts", url: "https://nmap.org/book/man-host-discovery.html" }
  - { label: "Nmap: detecção de serviço e versão", url: "https://nmap.org/book/man-version-detection.html" }
---

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
