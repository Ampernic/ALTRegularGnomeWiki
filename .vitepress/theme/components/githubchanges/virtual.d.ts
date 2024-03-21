declare module 'virtual:nolebase-git-changelog' {
  import type { Commit } from '@nolebase/vitepress-plugin-git-changelog/dist/types'

  interface Changelog {
    commits: Commit[]
  }

  const changelog: Changelog
  export default changelog
}
