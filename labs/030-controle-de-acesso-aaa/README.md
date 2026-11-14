# Controle de acesso em três serviços: Wi-Fi com AAA, e-mail e FTP com privilégios

> Laboratório 030 · mar/2026 · Evidência direta (captura de tela própria ou saída de terminal copiada na entrega)
>
> Página no portfólio: https://juli084.github.io/cybersecurity-portfolio/laboratorios/controle-de-acesso-aaa/

## Objetivo

Configurei autenticação por usuário na rede sem fio com servidor RADIUS, contas em um servidor de e-mail e usuários de FTP com permissões diferentes, e testei o que cada um conseguia fazer.

- Criar contas no servidor AAA e usá-las para autenticar clientes sem fio
- Ativar o serviço de e-mail, criar contas e configurar os clientes
- Criar usuários de FTP com privilégios distintos e verificar se as restrições valem

## Cenário

Autenticar é confirmar quem a pessoa é. Autorizar é decidir o que ela pode fazer depois de entrar. O laboratório aplica as duas coisas em serviços diferentes de uma mesma empresa.

## Ambiente

- Cisco Packet Tracer (rede simulada)

## Tecnologias

RADIUS, WPA2 Enterprise, SMTP, POP3, FTP, DHCP

## Ferramentas

Cisco Packet Tracer

## Procedimento

1. Ativei o serviço AAA no servidor RADIUS e cadastrei os usuários.
2. Configurei dois laptops para a rede sem fio com WPA2 e credencial individual, e conferi o endereço recebido por DHCP.
3. Ativei SMTP e POP3 no servidor de e-mail, defini o domínio e criei as contas.
4. Configurei os clientes de e-mail e enviei uma mensagem de uma estação para outra.
5. Ativei o FTP e criei três usuários, um deles sem permissão de exclusão.
6. Baixei, criei e enviei arquivos com um usuário e tentei excluir e renomear com o usuário restrito.

## Evidências

![Quadro de pontuação do Packet Tracer com 64 de 65 pontos e 64 de 65 itens](./evidence/pontuacao.png)

*Pontuação final, 64 de 65. Um item da avaliação ficou incorreto.*

## Análise técnica

## Wi-Fi com credencial individual

No WPA2 Personal, todos usam a mesma chave. Quem sai da empresa leva a chave, e trocar significa
reconfigurar todos os equipamentos. No modo Enterprise, o ponto de acesso consulta um servidor
RADIUS e cada pessoa entra com usuário e senha próprios. Dá para saber quem estava conectado e
revogar um acesso sem afetar os outros.

## FTP: o que cada usuário pode

| Usuário | Ler | Escrever | Excluir | Renomear | Listar |
| --- | --- | --- | --- | --- | --- |
| Administrador 1 | sim | sim | sim | sim | sim |
| Administrador 2 | sim | sim | sim | sim | sim |
| Usuário restrito | sim | sim | **não** | sim | sim |

O teste que importava: entrar com o usuário restrito e tentar apagar um arquivo que outro usuário
tinha enviado. O servidor recusou, com acesso negado. Esse é o princípio do privilégio mínimo
funcionando: a conta tem o necessário para trabalhar e nada além.

## O que este cenário não resolve

FTP, SMTP e POP3 trafegam em texto claro. O controle de acesso define quem pode fazer o quê, mas
não impede que alguém no caminho leia a senha. Num ambiente real, os mesmos controles seriam
aplicados sobre as versões cifradas dos protocolos.

## Resultado

Clientes sem fio autenticados com credencial individual, e-mail entregue entre estações e restrição de exclusão no FTP confirmada. Pontuação 64 de 65.

## O que aprendi

Autorização se prova testando o que deve falhar. Configurar o usuário sem permissão de exclusão é metade; a outra metade é entrar com ele e tentar excluir.

## Competências demonstradas

- `controle-de-acesso`
- `wifi-wpa2`

A relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).

## Frameworks relacionados

Relação com o que foi praticado. Não indica exercício profissional da função.

- **NIST CSF 2.0:** PR.AA (Identity Management, Authentication, and Access Control)
- **NICE Framework:** tarefas relacionadas às funções Systems Administration, Network Operations

## Referências

- [RFC 2865: RADIUS](https://www.rfc-editor.org/rfc/rfc2865)
- [RFC 959: FTP](https://www.rfc-editor.org/rfc/rfc959)
- [NIST SP 800-63B: autenticação](https://pages.nist.gov/800-63-3/sp800-63b.html)

## Limitações

- Um item da avaliação ficou incorreto e não identifiquei qual na entrega.
- Na entrega, respondi que o usuário restrito não conseguiu renomear o arquivo. Pela tabela de privilégios ele tinha permissão de renomear, então ou o teste foi feito com o nome errado ou a permissão foi cadastrada diferente do pedido. Ficou sem conferir.
- Há só a captura da pontuação. As contas e senhas do roteiro não são reproduzidas aqui.

## Para reproduzir

- Cisco Packet Tracer e a atividade de controle de acesso do Cisco Networking Academy.

## Considerações éticas

Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).

---

*Arquivo gerado a partir de `lab.md` por `npm run readmes`. Edite o `lab.md`.*
