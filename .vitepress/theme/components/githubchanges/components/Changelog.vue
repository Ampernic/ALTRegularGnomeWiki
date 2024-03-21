<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue'
import { differenceInDays, toDate } from 'date-fns'
import { useData } from 'vitepress'

import { NuVerticalTransition } from './../../ui/src/'
import Changelog from 'virtual:nolebase-git-changelog'

import { useRawPath } from '../composables/path'
import { useCommits } from '../composables/commits'
import { formatDistanceToNowFromValue, renderCommitMessage } from '../utils'
import { useI18n } from '../composables/i18n'
import { InjectionKey } from '../constants'
import type { Locale } from '../types'
import { defaultEnLocale, defaultLocales } from '../locales'

const toggleViewMore = ref(false)

const options = inject(InjectionKey, { locales: defaultLocales })

const { lang } = useData()
const { t } = useI18n()
const rawPath = useRawPath()
const commits = useCommits(Changelog.commits, rawPath)

const lastChangeDate = ref<Date>(toDate(commits.value[0]?.date_timestamp))

const locale = computed<Locale>(() => {
  if (!options.locales || typeof options.locales === 'undefined')
    return defaultLocales[lang.value] || defaultEnLocale || {}

  return options.locales[lang.value] || defaultEnLocale || {}
})

const isFreshChange = computed(() => {
  if (!lastChangeDate.value)
    return false

  return differenceInDays(new Date(), lastChangeDate.value) < 1
})

onMounted(() => {
  lastChangeDate.value = toDate(commits.value[0]?.date_timestamp)
})
</script>

<template>
  <em v-if="!commits.length" opacity="70">{{ t('noLogs') }}</em>
  <div
    v-else
    :class="[
      isFreshChange ? 'bg-green/16' : 'bg-$vp-custom-block-details-bg',
    ]"
    rounded-lg p-4
  >
    <label cursor-pointer>
      <div
        class="vp-nolebase-git-changelog-title flex select-none items-center justify-between"
        transition="color ease-in-out"
        text="<sm:xs" duration-200
      >
        <span class="vp-nolebase-git-changelog-last-edited-title inline-flex items-center gap-3">
          <span class="i-octicon:history-16" />
          <span v-if="commits[0]">
            {{ t('lastEdited', {
              props: {
                daysAgo: formatDistanceToNowFromValue(lastChangeDate, locale.lastEditedDateFnsLocaleName || lang || 'enUS'),
              },
            }) }}
          </span>
        </span>
        <input v-model="toggleViewMore" type="checkbox" invisible appearance-none>
        <span class="vp-nolebase-git-changelog-view-full-history-title inline-flex cursor-pointer items-center gap-3">
          <span class="<sm:hidden">
            {{ t('viewFullHistory') }}
          </span>
          <svg
            class="i-octicon:chevron-down-16"
            :class="[
              toggleViewMore ? 'rotate-180' : 'rotate-0',
            ]"
            transition="transform ease-in-out"
            duration-200
          />
        </span>
      </div>
    </label>
    <NuVerticalTransition :duration="200">
      <div
        v-show="toggleViewMore"
        class="grid grid-cols-[30px_auto] mt-3 gap-1.5 children:my-auto -ml-1.5"
        text="<sm:xs"
      >
        <template v-for="(commit) of commits" :key="commit.hash">
          <template v-if="commit.tag">
            <div class="m-auto h-[1.75em] w-[1.75em] inline-flex rounded-full bg-gray-400/10 opacity-90">
              <div class="i-octicon:rocket-16 !h-[50%] !min-h-[50%] !min-w-[50%] !w-[50%]" m="auto" />
            </div>
            <div flex items-center gap-1>
              <a :href="commit.release_tag_url" target="_blank">
                <code class="font-bold">{{ commit.tag }}</code>
              </a>
              <ClientOnly>
                <span class="text-xs opacity-50" :title="toDate(commit.date_timestamp).toString()">
                  {{ t('committedOn', { props: { date: toDate(commit.date_timestamp).toLocaleDateString() } }) }}
                </span>
              </ClientOnly>
            </div>
          </template>
          <template v-else>
            <div class="i-octicon:git-commit-16 m-auto rotate-90 transform opacity-30" />
            <div flex items-center gap-1>
              <a :href="`${commit.repo_url}/commit/${commit.hash}`" target="_blank">
                <code
                  class="text-xs text-$vp-c-brand-1 hover:text-$vp-c-brand-1"
                  transition="color ease-in-out"
                  duration-200
                >
                  {{ commit.hash.slice(0, 5) }}
                </code>
              </a>
              <span>-</span>
              <span>
                <span class="text-sm <sm:text-xs" v-html="renderCommitMessage(commit.repo_url || 'https://github.com/example/example', commit.message)" />
                <ClientOnly>
                  <span class="text-xs opacity-50" :title="toDate(commit.date_timestamp).toString()">
                    {{ t('committedOn', { props: { date: toDate(commit.date_timestamp).toLocaleDateString() } }) }}
                  </span>
                </ClientOnly>
              </span>
            </div>
          </template>
        </template>
      </div>
    </NuVerticalTransition>
  </div>
</template>

<style scoped>
.vp-nolebase-git-changelog-title{color:var(--vp-custom-block-details-text);font-size:var(--vp-custom-block-font-size)}.vp-nolebase-git-changelog-title:hover{color:var(--vp-c-brand-1)}.vp-nolebase-git-changelog-last-edited-title{font-weight:800}.vp-nolebase-git-changelog-view-full-history-title{font-weight:400}*,:before,:after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgb(0 0 0 / 0);--un-ring-shadow:0 0 rgb(0 0 0 / 0);--un-shadow-inset: ;--un-shadow:0 0 rgb(0 0 0 / 0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgb(147 197 253 / .5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.i-octicon\:chevron-down-16{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 16 16' display='inline-block' vertical-align='middle' min-width='1.2rem' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M12.78 5.22a.749.749 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.06 0L3.22 6.28a.749.749 0 1 1 1.06-1.06L8 8.939l3.72-3.719a.749.749 0 0 1 1.06 0'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;display:inline-block;vertical-align:middle;min-width:1.2rem;width:1.2em;height:1.2em}.i-octicon\:git-commit-16{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 16 16' display='inline-block' vertical-align='middle' min-width='1.2rem' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;display:inline-block;vertical-align:middle;min-width:1.2rem;width:1.2em;height:1.2em}.i-octicon\:history-16{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 16 16' display='inline-block' vertical-align='middle' min-width='1.2rem' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m.427 1.927l1.215 1.215a8.002 8.002 0 1 1-1.6 5.685a.75.75 0 1 1 1.493-.154a6.5 6.5 0 1 0 1.18-4.458l1.358 1.358A.25.25 0 0 1 3.896 6H.25A.25.25 0 0 1 0 5.75V2.104a.25.25 0 0 1 .427-.177M7.75 4a.75.75 0 0 1 .75.75v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5A.75.75 0 0 1 7.75 4'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;display:inline-block;vertical-align:middle;min-width:1.2rem;width:1.2em;height:1.2em}.i-octicon\:rocket-16{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 16 16' display='inline-block' vertical-align='middle' min-width='1.2rem' width='1.2em' height='1.2em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M14.064 0h.186C15.216 0 16 .784 16 1.75v.186a8.752 8.752 0 0 1-2.564 6.186l-.458.459c-.314.314-.641.616-.979.904v3.207c0 .608-.315 1.172-.833 1.49l-2.774 1.707a.749.749 0 0 1-1.11-.418l-.954-3.102a1.214 1.214 0 0 1-.145-.125L3.754 9.816a1.218 1.218 0 0 1-.124-.145L.528 8.717a.749.749 0 0 1-.418-1.11l1.71-2.774A1.748 1.748 0 0 1 3.31 4h3.204c.288-.338.59-.665.904-.979l.459-.458A8.749 8.749 0 0 1 14.064 0M8.938 3.623h-.002l-.458.458c-.76.76-1.437 1.598-2.02 2.5l-1.5 2.317l2.143 2.143l2.317-1.5c.902-.583 1.74-1.26 2.499-2.02l.459-.458a7.25 7.25 0 0 0 2.123-5.127V1.75a.25.25 0 0 0-.25-.25h-.186a7.249 7.249 0 0 0-5.125 2.123M3.56 14.56c-.732.732-2.334 1.045-3.005 1.148a.234.234 0 0 1-.201-.064a.234.234 0 0 1-.064-.201c.103-.671.416-2.273 1.15-3.003a1.502 1.502 0 1 1 2.12 2.12m6.94-3.935c-.088.06-.177.118-.266.175l-2.35 1.521l.548 1.783l1.949-1.2a.25.25 0 0 0 .119-.213ZM3.678 8.116L5.2 5.766c.058-.09.117-.178.176-.266H3.309a.25.25 0 0 0-.213.119l-1.2 1.95ZM12 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;display:inline-block;vertical-align:middle;min-width:1.2rem;width:1.2em;height:1.2em}.invisible,[invisible=""]{visibility:hidden}.absolute{position:absolute}.grid,[grid=""]{display:grid}.grid-cols-\[30px_auto\]{grid-template-columns:30px auto}.m-auto,[m~=auto]{margin:auto}.children\:my-auto>*,[children\:my-auto=""]>*{margin-top:auto;margin-bottom:auto}.-ml-1\.5{margin-left:-.375rem}.mt-3,[mt-3=""]{margin-top:.75rem}.hidden{display:none}.\!h-\[50\%\]{height:50%!important}.\!min-h-\[50\%\]{min-height:50%!important}.\!min-w-\[50\%\]{min-width:50%!important}.\!w-\[50\%\]{width:50%!important}.h-\[1\.75em\]{height:1.75em}.h-8{height:2rem}.w-\[1\.75em\]{width:1.75em}.w-8{width:2rem}.flex,[flex=""]{display:flex}.inline-flex,[inline-flex=""]{display:inline-flex}.flex-wrap{flex-wrap:wrap}.rotate-0{--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-rotate:0;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.rotate-180{--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-rotate:180deg;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.rotate-90{--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-rotate:90deg;transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.transform{transform:translate(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotate(var(--un-rotate-z)) skew(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z))}.cursor-pointer,[cursor-pointer=""]{cursor:pointer}.select-none{-webkit-user-select:none;user-select:none}.appearance-none,[appearance-none=""]{-webkit-appearance:none;-moz-appearance:none;appearance:none}.items-center,[items-center=""]{align-items:center}.justify-between{justify-content:space-between}.gap-1,[gap-1=""]{gap:.25rem}.gap-1\.5,[gap-1\.5=""]{gap:.375rem}.gap-2{gap:.5rem}.gap-3,[gap-3=""]{gap:.75rem}.gap-4{gap:1rem}.rounded-full{border-radius:9999px}.rounded-lg,[rounded-lg=""]{border-radius:.5rem}.bg-\$vp-custom-block-details-bg{background-color:var(--vp-custom-block-details-bg)}.bg-gray-400\/10{background-color:#9ca3af1a}.bg-green\/16{background-color:#4ade8029}.p-4,[p-4=""]{padding:1rem}.pt-2{padding-top:.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.text-\$vp-c-brand-1,.hover\:text-\$vp-c-brand-1:hover{color:var(--vp-c-brand-1)}.opacity-30{opacity:.3}.opacity-50{opacity:.5}.opacity-90{opacity:.9}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}[transition~=color]{transition-property:color;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}[transition~=transform]{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-200,[duration-200=""],[duration~="200"]{transition-duration:.2s}.ease-in-out,[transition~=ease-in-out]{transition-timing-function:cubic-bezier(.4,0,.2,1)}@media (max-width: 639.9px){.\<sm\:hidden{display:none}.\<sm\:text-xs,[text~="<sm:xs"]{font-size:.75rem;line-height:1rem}}
</style>
