# COMECE AQUI: urna no VS Code e no Vercel

IMPORTANTE: abra no VS Code **esta pasta (`urna-vercel`)**, a que tem o `index.html` dentro dela.
Não abra a pasta de fora. Assim o `index.html` fica na raiz e o Vercel acha tudo.

## Parte 1: abrir e testar no VS Code
1. VS Code > **Arquivo > Abrir Pasta...** > escolha `urna-vercel`.
2. Aceite instalar as extensões recomendadas (Live Server).
3. Clique com o botão direito em `index.html` > **Open with Live Server**.
   (Ou: **Terminal > Executar Tarefa > 1. Testar no computador**.)

## Parte 2: publicar no Vercel (escolha UM caminho)

### Caminho A: direto pelo terminal (mais rápido)
Precisa do [Node.js](https://nodejs.org/) e de uma conta em vercel.com.
No terminal do VS Code (**Terminal > Novo Terminal**):
```
npm install -g vercel
vercel login
vercel
vercel --prod
```
Na primeira vez: configurar e publicar = **Y**; vincular a projeto existente = **N**; nome = qualquer; diretório = **Enter**; alterar configurações = **N**.
O link final aparece no terminal.
Nas próximas vezes: **Terminal > Executar Tarefa > 2. Publicar no Vercel (produção)**.

### Caminho B: pelo GitHub (deploy automático a cada alteração)
1. Crie um repositório VAZIO em github.com/new (ex.: `urna-eletronica`).
2. No terminal do VS Code, com a pasta `urna-vercel` aberta:
```
git init
git add .
git commit -m "Urna eletronica"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/urna-eletronica.git
git push -u origin main
```
3. Em vercel.com: **Add New > Project > Import Git Repository** > escolha o repositório.
4. Deixe **Framework Preset: Other** e **Root Directory: ./** > **Deploy**.
5. Depois, cada `git push` publica de novo sozinho.

## Se der problema
- **Erro 404 NOT_FOUND:** o `index.html` não está na raiz do repositório. No Vercel: projeto > **Settings > General > Root Directory**, coloque o nome da pasta onde ele está (ex.: `urna-vercel`), salve e faça **Redeploy**. Ou mova os arquivos para a raiz do repositório.
- **Pede login / "Authentication Required":** você abriu o endereço longo do deploy. Use o endereço curto do projeto em **Domains** (algo como `nome-do-projeto.vercel.app`).
- **O site abre, mas mostra a versão antiga:** abra `sw.js`, troque `urna-v3` por `urna-v4`, publique de novo e reabra o app.
- **Sem som:** no iPhone o som só toca depois do primeiro toque na tela; confira também se o celular não está no modo silencioso.

## Dados úteis
- Senha do mesário: **1234** (mude em `js/config.js`)
- Candidatos, números e fotos: `js/config.js` e `assets/fotos/`
- Sons: `assets/sons/click.mp3` e `assets/sons/confirma.mp3`
- No iPhone: abra o link no **Safari** > Compartilhar > **Adicionar à Tela de Início**
