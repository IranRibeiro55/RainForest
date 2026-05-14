# Documentação Rain Forest

Bem-vindo à documentação técnica do site estático Rain Forest.

## Índice

1. **[Arquitetura e módulos](arquitetura.md)** — Organização do código, ordem de carregamento dos scripts, folhas de estilo, carrossel de jogos, secção “Como funciona”, eventos globais.
2. **[Configuração e traduções](configuracao.md)** — `RF_CONFIG`, `RF_TRANSLATIONS`, idioma persistido, modo `lite` / `full`, contacto e CTA.

## Público-alvo

- **Conteúdo / marketing:** editar textos em `data/translations.json` e URLs em `js/config.js` (com o fluxo descrito em [configuracao.md](configuracao.md)).
- **Design / front-end:** camadas CSS (`globals.css` → overrides), secções em `index.html`, animações em `css/animations.css`.
- **DevOps:** deploy como site estático; não há artefacto de build.

## Convenções

- Prefixo **`RF_`** em funções e objetos expostos no `window` (ex.: `RF_initMain`, `RF_CONFIG`, `RF_I18N`).
- Atributos **`data-i18n`** e **`data-i18n-attr`** para textos e atributos traduzíveis (preenchidos por `js/i18n.js`).

## Ligações úteis

- [README principal](../README.md) — início rápido e visão geral do repositório.
- [Licença MIT](../LICENSE).
