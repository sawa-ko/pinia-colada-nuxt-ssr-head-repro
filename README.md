# Pinia Colada Nuxt SSR head reproduction

Minimal reproduction for a reactive `useSeoMeta()` getter that reads data from a Pinia Colada query. It fetches posts and authors from the public JSONPlaceholder API; it does not use Meisaku services or credentials.

## Environment

- Node.js 24
- pnpm 12.4.1
- Nuxt 4.6.1
- `@pinia/colada-nuxt` 1.2.0
- `@pinia/colada` 1.4.8
- Pinia 4.0.3
- Vue 3.5.44

## Reproduce

```sh
corepack pnpm@12.4.1 install --frozen-lockfile
corepack pnpm@12.4.1 exec nuxi dev --host 127.0.0.1 --port 3107
```

Request both posts and inspect the initial `<head>` and body:

```sh
curl -s http://127.0.0.1:3107/posts/1
curl -s http://127.0.0.1:3107/posts/11
```

The routes fetch posts 1 and 11, then fetch each post's author. The SSR body should contain the API response and the author's name; expected titles are `Leanne Graham · SSR head repro` and `Ervin Howell · SSR head repro`, with matching descriptions and Open Graph metadata. With the published `@pinia/colada-nuxt@1.2.0`, the failure is that the body and query payload contain the requested data while the initial title remains `SSR head repro · SSR head repro` and the reactive metadata is missing.

Check SSG separately:

```sh
corepack pnpm@12.4.1 generate
```

Generation requires access to JSONPlaceholder. With the published package, it completes without `Cannot stringify a function` and writes both pages, but their titles remain the fallback. The payload includes `pinia_colada` and also includes `_pc_query` in the Pinia state. The upstream regression tests use deterministic fixture data rather than making CI depend on this public service; they cover the same query-backed head behavior, payload exclusion, SSR, hydration, navigation, concurrent-request isolation, and SSG.
