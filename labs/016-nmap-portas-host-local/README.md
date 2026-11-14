# Varredura de portas com Nmap em host local

> Laboratório 016 · out/2025 · Evidência direta (captura de tela própria ou saída de terminal copiada na entrega)
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/nmap-portas-host-local/

## Objetivo

Usei o Nmap contra a própria máquina virtual para descobrir quais portas TCP e UDP estavam abertas, que serviço havia em cada uma e que risco cada serviço representa.

- Detectar portas TCP e UDP abertas
- Associar cada porta a um serviço
- Avaliar o risco de cada serviço exposto

## Cenário

Porta aberta é serviço exposto. Administradores varrem as próprias máquinas para saber o que está exposto antes que outra pessoa descubra.

## Ambiente

- VM Linux de laboratório (VirtualBox)

## Tecnologias

TCP, UDP, FTP, SSH, Telnet, IPP, mDNS

## Ferramentas

Nmap

## Procedimento

1. Varri as portas TCP mais comuns do host local.
2. Repeti a varredura para UDP, que exige privilégio de administrador.
3. Executei os scripts padrão do Nmap para coletar detalhes dos serviços.
4. Pesquisei para que serve e que risco traz cada serviço encontrado.

## Evidências

Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.

## Análise técnica

```text
PORTA      ESTADO          SERVIÇO
21/tcp     open            ftp
22/tcp     open            ssh
23/tcp     open            telnet
631/tcp    open            ipp
5353/udp   open|filtered   zeroconf
```

| Porta | Serviço | Avaliação |
| --- | --- | --- |
| 21/tcp | FTP | Transfere arquivos e credenciais em texto claro. Só se justifica com necessidade real e, de preferência, substituído por SFTP. |
| 22/tcp | SSH | Acesso remoto cifrado. Aceitável, com autenticação por chave e sem login direto de root. |
| 23/tcp | Telnet | Acesso remoto em texto claro. Não deveria estar ativo. |
| 631/tcp | IPP | Serviço de impressão. Desnecessário em servidor. |
| 5353/udp | mDNS | Descoberta automática de serviços na rede local. Útil em casa, ruído e superfície em rede corporativa. |

FTP e Telnet lado a lado com SSH é o achado principal. Os três dão acesso à máquina, mas dois deles
entregam a senha a qualquer um que esteja capturando o tráfego do segmento.

## Chaves de host

Os scripts do Nmap devolveram as chaves públicas de host do SSH. Chave pública é pública, e a coleta
em si não é uma falha. O risco está em outro lugar: se a chave privada correspondente vazar, um
invasor pode se passar pelo servidor e interceptar sessões. Por isso a chave privada do host fica
legível apenas pelo root, e a troca dela faz parte da resposta a um comprometimento.

## O que eu faria nessa máquina

Desativar Telnet e FTP, manter SSH com chave, parar o serviço de impressão e bloquear no firewall
tudo o que não for necessário. A varredura seguinte deveria mostrar uma porta, não cinco.

## Resultado

Quatro portas TCP e uma UDP abertas, cada uma associada a um serviço. Três dos cinco serviços não precisavam estar expostos.

## O que aprendi

A varredura UDP precisa de sudo e demora mais, e o resultado open|filtered significa que o Nmap não conseguiu distinguir porta aberta de porta filtrada. Saber ler essa incerteza é parte do resultado.

## Competências demonstradas

- `varredura-de-portas`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** ID.RA (Risk Assessment)
- **MITRE ATT&CK:** T1046 Network Service Discovery
- **NICE Framework:** tarefas relacionadas às funções Vulnerability Analysis

## Referências

- [Nmap: guia de referência](https://nmap.org/book/man.html)
- [IANA: registro de portas e serviços](https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml)

## Limitações

- Não há captura de tela; os resultados foram copiados do terminal para a entrega.
- A impressão digital da chave de host SSH, obtida pelos scripts, foi omitida aqui.

## Para reproduzir

- Varredura TCP: nmap localhost. Varredura UDP: sudo nmap -sU localhost.
- Usar apenas em máquinas próprias ou com autorização.

## Considerações éticas

O alvo foi a própria máquina virtual de laboratório (localhost). Nenhum host de terceiros foi varrido.

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
