# Rain Forest — site estático

Site público da **Rain Forest** (publicadora brasileira focada em **jogos indie para Xbox**): hero, narrativa, serviços, diferenciais, processo, portfólio em carrossel, contacto e rodapé — com **três idiomas** (PT / EN / ES), splash de entrada e modos de performance.

**Stack:** HTML5, CSS3 e JavaScript **vanilla** (sem build, sem framework). Qualquer hospedagem que sirva ficheiros estáticos funciona.

---

## Início rápido

### Ver localmente

1. Clona ou descarrega o repositório.
2. Abre a pasta do projeto num servidor HTTP local (recomendado — alguns browsers limitam `file://` para fontes ou módulos).

```bash
# Python 3
python -m http.server 8080

# ou, com Node
npx --yes serve . -p 8080
```

3. Abre `http://localhost:8080` (ou a porta que escolheres).

> **Dica:** `index.html` pode abrir em duplo clique, mas um servidor local evita surpresas com caminhos relativos e cache.

### O que publicar em produção

Envia **toda a árvore** do projeto (mantendo pastas e caminhos relativos), no mínimo:

| Caminho | Função |
|--------|--------|
| `index.html` | Página única |
| `css/` | Folhas de estilo |
| `js/` | Scripts (ordem importa — ver [documentação](docs/README.md)) |
| `data/` | `translations.js` (e opcionalmente `translations.json` como fonte) |
| `assets/` | Imagens locais referenciadas no HTML/CSS (ex.: hero, fundos) |

Não é necessário Node, npm, Docker ou pipeline de build para o site em produção.

---

## Funcionalidades (resumo)

- **Internacionalização:** PT (padrão), EN, ES — `localStorage` (`rf_lang`), meta tags e `lang` no `<html>`.
- **Splash** inicial com desbloqueio do scroll do `body`.
- **Modo performance** (`html[data-performance="lite"|"full"]`) com heurísticas em `js/performance.js`.
- **Secções com scroll reveal** (`js/reveal.js`).
- **Navegação** fixa, painel e âncoras (`js/nav.js`).
- **Carrossel de jogos** com loop por **animação CSS** + clones em `js/games.js` (ver [docs/arquitetura.md](docs/arquitetura.md)).
- **“Como funciona”** em lista empilhada (`js/process.js` + estilos em `css/process-phase-map.css` e overrides).
- **CTA publicação** resolvida a partir de `RF_CONFIG` (`js/main.js` + `RF_resolvePublishHref` em `config.js`).

Lista de âncoras principais: `#sobre`, `#para-quem`, `#servicos`, `#diferencial`, `#como-funciona`, `#games`, `#contato`.

---

## Configuração rápida

O ponto central de URLs e opções de negócio é **`js/config.js`** (`window.RF_CONFIG`): logos, mailto, URLs de formulário, velocidade do carrossel de jogos, lista `PORTFOLIO_GAMES` (referência; o HTML do portfólio pode ser editado diretamente).

Textos visíveis vêm de **`data/translations.js`** (`window.RF_TRANSLATIONS`). O fluxo recomendado está em [docs/configuracao.md](docs/configuracao.md).

---

## Documentação

| Documento | Conteúdo |
|-----------|----------|
| [docs/README.md](docs/README.md) | Índice da documentação |
| [docs/arquitetura.md](docs/arquitetura.md) | Módulos JS, CSS, ciclo de vida, carrossel, processo |
| [docs/configuracao.md](docs/configuracao.md) | `RF_CONFIG`, traduções, performance, acessibilidade |

---

## Créditos e licença

**Desenvolvimento:** [Iran Ribeiro](https://github.com/IranRibeiro55) · repositório [RainForest](https://github.com/IranRibeiro55/RainForest).

**Licença:** [MIT](LICENSE) — ver o ficheiro `LICENSE` para o texto integral.

---

## Suporte a browsers

Escrito para browsers modernos (Chrome, Firefox, Safari, Edge). Usa `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `requestAnimationFrame` e animações CSS onde aplicável. Para públicos muito antigos, testa sempre o fluxo crítico (splash, i18n, carrossel, CTA).
