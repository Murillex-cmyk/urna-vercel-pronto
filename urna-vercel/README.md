# 🗳️ Urna Eletrônica (Simulação)

Simulador de urna eletrônica que roda no navegador e pode ser instalado como aplicativo no iPhone e no Android (PWA).
Dois candidatos a presidente, voto em branco, voto nulo, sons e fotos, e um registro de cada voto.

> **Aviso:** é uma simulação, sem validade oficial. A tela exibe "Simulação" para evitar confusão com a urna real.

## Funcionalidades
- Votação por número de 2 dígitos, com foto, nome e partido; teclas **BRANCO**, **CORRIGE** e **CONFIRMA**
- Voto em branco e nulo (número inexistente)
- Cada voto é registrado com número sequencial, tipo e data/hora
- Painel do mesário (senha em `js/config.js`): totais, porcentagens, histórico completo, cópia em CSV e zerar a urna
- Sons de tecla e de confirmação
- Easter egg escondido: digite **15** (Prefeito, fora da contagem presidencial)
- Funciona offline e é instalável (PWA)

## Estrutura
```
urna-eletronica/
├── index.html           página principal
├── css/style.css        visual
├── js/config.js         candidatos, números, fotos, senha  ← edite aqui
├── js/app.js            lógica da urna e do painel
├── assets/fotos/        fotos dos candidatos
├── assets/sons/         click.mp3 e confirma.mp3
├── icons/               ícones do aplicativo
├── manifest.webmanifest configuração do app instalável
├── sw.js                cache offline
└── vercel.json          configuração do Vercel (já pronta)
```

## Rodar no Visual Studio Code
1. Instale o [VS Code](https://code.visualstudio.com/) e abra a pasta: **Arquivo > Abrir Pasta...**
2. Aceite instalar as extensões recomendadas (principalmente **Live Server**).
3. Clique com o botão direito em `index.html` > **Open with Live Server**. O site abre em `http://127.0.0.1:5500`.

Sem Live Server: com [Node.js](https://nodejs.org/) instalado, rode `npm start` no terminal.
> Abrir o `index.html` com duplo clique também funciona, mas o modo aplicativo/offline só ativa em `http://localhost` ou `https`.

## Personalizar
Em `js/config.js`:
- `CANDIDATOS`: número, nome, partido, cor e foto (coloque a imagem em `assets/fotos/`)
- `EGG`: o candidato escondido do número 15
- `PIN`: senha do mesário (padrão `1234`)

Troque os sons substituindo os arquivos em `assets/sons/`. Fotos 4:5 (ex.: 240x300) ficam melhor.

## Publicar no Vercel
Pré-requisito: [Node.js](https://nodejs.org/) instalado e uma conta gratuita em https://vercel.com.

No terminal do VS Code (**Terminal > Novo Terminal**), dentro da pasta do projeto:
```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```
Respostas da primeira vez que rodar `vercel`: configurar e publicar = **Y**; vincular a projeto existente = **N**; nome do projeto = o que quiser; diretório = **./** (Enter); alterar configurações = **N**.
O comando `vercel --prod` mostra o link final (`https://nome-do-projeto.vercel.app`).

Para atualizar: edite os arquivos, aumente a versão do cache em `sw.js` (`urna-v3` → `urna-v4`) e rode `vercel --prod` de novo.

Não precisa de build nem de configuração extra: o `vercel.json` já está pronto e o Vercel publica a pasta como site estático.

## Instalar no celular
- **iPhone:** abra o link no **Safari** > Compartilhar > **Adicionar à Tela de Início**.
- **Android:** abra no **Chrome** > menu ⋮ > **Instalar app**.
- Para gerar um `.apk`: use o [PWABuilder](https://www.pwabuilder.com) com o link do Vercel.

## Limitações
- Os votos ficam salvos no navegador/app do próprio aparelho (`localStorage`). Cada aparelho tem a sua contagem; limpar os dados do navegador apaga os votos.
- A senha do mesário fica visível no código: serve contra acesso casual, não é segurança real.
- Não deve ser usado como sistema de votação oficial.

## Direitos de imagem e áudio
As fotos e os sons incluídos foram fornecidos por quem montou este projeto. Antes de tornar o repositório público, confirme que você tem autorização para usar essas imagens, nomes e áudios.
