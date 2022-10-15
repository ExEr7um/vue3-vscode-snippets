# Vue 3 VS Code Snippets

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/exer7um.vue-3-vscode-snippets?color=blue)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/exer7um.vue-3-vscode-snippets?color=success)
![GitHub](https://img.shields.io/github/license/ExEr7um/vue3-vscode-snippets)
![Vue Version](https://img.shields.io/badge/vue-3-%234FC08D?logo=vuedotjs)

![vue3-vscode-snippets-hero](https://i.imgur.com/qlgaQhl.gif)

## Description

These snippets were made to speed up Vue 3 development. With it you can write boilerplate code infinitely faster.

> I took my inspiration from [vue-vscode-snippets](https://github.com/sdras/vue-vscode-snippets) extension made by @sdras.
>
> A lot of snippets here were taken from that extension and then improved by me to be more useful with Vue 3 (and Vue 3 only).

### Supported versions

- Vue 3

## Installation

- You can do it by finding `Vue 3 VSCode Snippets` by `exer7um` in VS Code marketplace and clicking install.
- Or you can follow [that link](https://marketplace.visualstudio.com/items?itemName=exer7um.vue-3-vscode-snippets) and click install.

## Snippets

### `.vue` files

| Snippet      | Purpose                                                               |
| ------------ | --------------------------------------------------------------------- |
| `vbase`      | Base for Vue 3 File with `<script setup>`, `TypeScript` and `SCSS`    |
| `vbase-sass` | Base for Vue 3 File with `<script setup>`, `TypeScript` and `SASS`    |
| `vbase-less` | Base for Vue 3 File with `<script setup>`, `TypeScript` and `LESS`    |
| `vbase-pcss` | Base for Vue 3 File with `<script setup>`, `TypeScript` and `PostCSS` |
| `vbase-css`  | Base for Vue 3 File with `<script setup>`, `TypeScript` and `CSS`     |
| `vbase-styl` | Base for Vue 3 File with `<script setup>`, `TypeScript` and `Stylus`  |
| `vbase-ns`   | Base for Vue 3 File with `<script setup>`, `TypeScript` and no style  |

### Template

| Snippet        | Purpose                           |
| -------------- | --------------------------------- |
| `vfor`         | `v-for` statement                 |
| `vmodel`       | `v-model` directive               |
| `von`          | `v-on` click handler              |
| `vel-props`    | Component element with `props`    |
| `vslot-named`  | Named slot                        |
| `vimg`         | Image source binding              |
| `vstyle`       | Inline style binding              |
| `vstyle-obj`   | Inline style binding with objects |
| `vclass`       | Class binding                     |
| `vclass-ter`   | Ternary class binding             |
| `vtrans`       | Transition component              |
| `vtrans-group` | Transition group component        |
| `vrlink`       | Router link                       |
| `vrlink-param` | Router link with param            |

### Script

| Snippet                  | Purpose                                     |
| ------------------------ | ------------------------------------------- |
| `vref`                   | Vue `ref`                                   |
| `vreactive`              | Vue `reactive`                              |
| `vcomputed`              | Vue `computed`                              |
| `vwatch`                 | Watcher                                     |
| `vwatcheffect`           | Watch Effect                                |
| `vonmounted`             | onMounted hook                              |
| `vonbeforemount`         | onBeforeMount hook                          |
| `vonbeforeupdate`        | onBeforeUpdate hook                         |
| `vonupdated`             | onUpdated hook                              |
| `vonerrorcaptured`       | onErrorCaptured hook                        |
| `vonunmounted`           | onUnmounted hook                            |
| `vonbeforeunmount`       | onBeforeUnmount hook                        |
| `vdefineprops`           | Define props                                |
| `vdefineemits`           | Define emits                                |
| `vdefineemits-nopayload` | Define emits with no payload                |
| `vsingleemit`            | Single emit for defineEmits                 |
| `vsingleemit-nopayload`  | Single emit for defineEmits with no payload |

### Pinia

| Snippet                | Purpose                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `pstore`               | Base code needed for a Pinia store file                      |
| ⚠️ `pstore-composition` | Base code needed for a Pinia store file with Composition API |

> Snippets with ⚠️ symbol are unreleased.

### Vue Router

| Snippet              | Purpose                                         |
| -------------------- | ----------------------------------------------- |
| `vrouter`            | Vue Router base                                 |
| `vscrollbehavior`    | Vue Router `scrollBehavior`                     |
| `vbeforeeach`        | Vue Router global guards `beforeEach`           |
| `vbeforeresolve`     | Vue Router global guards `beforeResolve`        |
| `vaftereach`         | Vue Router global guards `afterEach`            |
| `vbeforeenter`       | Vue Router per-route guard `beforeEnter`        |
| `vbeforerouteenter`  | Vue Router component guards `beforeRouteEnter`  |
| `vbeforerouteupdate` | Vue Router component guards `beforeRouteUpdate` |
| `vbeforerouteleave`  | Vue Router component guards `beforeRouteLeave`  |

### Nuxt Template

| Snippet       | Purpose                     |
| ------------- | --------------------------- |
| `nlink`       | Nuxt router link            |
| `nlink-param` | Nuxt router link with param |

### Nuxt Script

| Snippet                 | Purpose                                      |
| ----------------------- | -------------------------------------------- |
| `nfetch`                | `useFetch` composable                        |
| `nfetch-lazy`           | `useLazyFetch` composable                    |
| `nasyncdata`            | `useAsyncData` composable                    |
| `nasyncdata-lazy`       | `useLazyAsyncData` composable                |
| `nhead`                 | `useHead` composable                         |
| `nhead-description`     | `useHead` composable with description        |
| `nhead-template`        | `useHead` composable with title template     |
| `npagemeta`             | `definePageMeta` composable                  |
| `npagemeta-description` | `definePageMeta` composable with description |
| ⚠️ `nplugin`             | Base code for Nuxt plugin                    |
| ⚠️ `nmiddleware`         | Base code for Nuxt middleware                |
| ⚠️ `nserverroute`        | Base code for Nuxt server route              |

> Snippets with ⚠️ symbol are unreleased.

### Histoire

| Snippet                   | Purpose                              |
| ------------------------- | ------------------------------------ |
| ⚠️ `hconfig`               | Histoire config for Vue 3            |
| ⚠️ `hconfig-nuxt`          | Histoire config for Nuxt 3           |
| ⚠️ `hbase`                 | Base code for story                  |
| ⚠️ `hbase-variant`         | Base code for story with variant     |
| ⚠️ `hbase-grid`            | Base code for story with grid layout |
| ⚠️ `hvariant`              | Story variant                        |
| ⚠️ `hgrid`                 | Histoire grid layout                 |
| ⚠️ `hcontrols-base`        | Histoire controls base               |
| ⚠️ `hcontrols-button`      | Histoire controls - Button           |
| ⚠️ `hcontrols-buttongroup` | Histoire controls - Button Group     |
| ⚠️ `hcontrols-checkbox`    | Histoire controls - Checkbox         |
| ⚠️ `hcontrols-number`      | Histoire controls - Number           |
| ⚠️ `hcontrols-text`        | Histoire controls - Text             |
| ⚠️ `hcontrols-textarea`    | Histoire controls - Textarea         |

> Snippets with ⚠️ symbol are unreleased.

## Contributing

This is an open source project open to anyone. Contributors are welcome on [GitHub](https://github.com/exer7um/vue3-vscode-snippets).

If you are contributing a snippet, please be sure to add the documentation for it in the tables in the `README`, the pull request cannot be accepted without this addition. Thanks!

## License

Copyright © 2022 Vasily Kuzin.

This project is [MIT](https://github.com/ExEr7um/vue3-vscode-snippets/blob/main/LICENSE) licensed.
