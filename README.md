# 📰 Agregador News

Agregador de notícias que reúne matérias de múltiplas fontes em uma única interface —
simples, rápida e sem ruído. Em vez de abrir dez sites diferentes, você abre um.

## ✨ Funcionalidades

- **Múltiplas fontes em um só lugar** — notícias de diferentes veículos reunidas em um feed único
- **Agrupamento por tema** — navegue pelas matérias organizadas por categoria
- **Busca rápida** — encontre uma notícia específica pelo título ou palavras-chave
- **Atualização automática** — o servidor busca as últimas matérias em intervalos regulares
- **Interface leve** — carregamento instantâneo, sem frameworks pesados

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Frontend | [Vite](https://vitejs.dev) + TypeScript |
| Backend | Node/Bun (`server.ts`) |
| Dados | Arquivos JSON (`data/`) — sem banco de dados externo |

## 🚀 Como executar

### Pré-requisitos

- [Bun](https://bun.sh) instalado (`curl -fsSL https://bun.sh/install | bash`)

### 1. Clone o repositório

```bash
git clone https://github.com/iwerry/agregador_news.git
cd agregador_news
```

### 2. Instale as dependências

```bash
bun install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` preenchendo as variáveis necessárias
(chaves de API de notícias, porta do servidor, intervalo de atualização).

### 4. Inicie o projeto

```bash
bun run dev
```

Acesse `http://localhost:5173` (ou a porta indicada no terminal).

## 📦 Build para produção

```bash
bun run build
```

Os arquivos otimizados ficam em `dist/`.

## 📁 Estrutura do projeto

```
agregador_news/
├── data/            # Dados persistidos em JSON (matérias, fontes, cache)
├── public/          # Assets estáticos (ícones, imagens)
├── src/             # Código-fonte do frontend (Vite + TypeScript)
├── server.ts        # Servidor da API / busca de notícias
├── metadata.json    # Metadados e fontes cadastradas
├── .env.example     # Modelo de variáveis de ambiente
├── index.html       # Ponto de entrada do frontend
├── vite.config.ts   # Configuração do Vite
└── tsconfig.json    # Configuração do TypeScript
```

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça o commit (`git commit -m 'Adiciona nova feature'`)
4. Envie para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---
Feito com ☕ e muito café.
