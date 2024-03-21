// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { useRoute, useData } from 'vitepress';
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import imageViewer from 'vitepress-plugin-image-viewer'
import {
  NolebaseEnhancedReadabilitiesMenu,
  NolebaseEnhancedReadabilitiesScreenMenu,
} from '@nolebase/vitepress-plugin-enhanced-readabilities'
import type { Options } from '@nolebase/vitepress-plugin-enhanced-readabilities'
import { InjectionKey } from '@nolebase/vitepress-plugin-enhanced-readabilities'
import AGWHomeContents from './components/AGWHomeContents.vue'
import AGWMetaBars from './components/AGWAppsMetaWidget.vue'
import AGWCategories from './components/AGWDocsCategories.vue'
import AGWGallery from './components/AGWGallery.vue'

import NolebaseGitChangelog from './components/githubchanges/components/Changelog.vue'
import NolebaseGitContributors from './components/githubchanges/components/Contributors.vue'

import { locales } from '../../_data/enhanced-readabilities'

import { yandexMetrika } from '@hywax/vitepress-yandex-metrika'
import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import './styles/style.css'
import './styles/custom.css'
import './viewerjs/dist/viewer.css'
import '@nolebase/vitepress-plugin-enhanced-readabilities/dist/style.css'
import "vitepress-markdown-timeline/dist/theme/index.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(AGWHomeContents),
      'nav-bar-content-after': () => h(NolebaseEnhancedReadabilitiesMenu),
      'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
      'aside-outline-after': () => h(AGWMetaBars),
    })
  },

  enhanceApp(ctx) {

    ctx.app.provide(InjectionKey, {
      locales: locales
    } as Options)

    yandexMetrika(ctx, {
      counter: {
        id: 95081395, initParams: {
          webvisor: true
        }
      },
    }),
    ctx.app.component('AGWGallery', AGWGallery);
    ctx.app.component('AGWCategories', AGWCategories)
    ctx.app.component('NolebaseGitContributors', NolebaseGitContributors)
    ctx.app.component('NolebaseGitChangelog', NolebaseGitChangelog)
    enhanceAppWithTabs(ctx.app)
  },
  setup() {
    // Get route
    const route = useRoute();
    // Using
    imageViewer(route, '.vp-doc img:not(.gallery)', {
      title: true,
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: 4,
        reset: 4,
        prev: false,
        next: false
      }
    });
    imageViewer(route, '.galleries', {
      title: true,
      toolbar: {
        zoomIn: 4,
        zoomOut: 4,
        oneToOne: true,
        reset: true,
        prev: true,
        next: true
      }
    });
  }
} satisfies Theme
