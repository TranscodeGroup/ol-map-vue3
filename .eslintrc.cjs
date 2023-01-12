/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  // 消除js文件上使用$ref之类全局定义提示no-undef问题
  globals: {
    module: true,
    __dirname: true,
    process: true,
    $ref: true,
    $computed: true,
    onMounted: true,
    watchEffect: true,
    useI18n: true,
    useRouter: true,
    useRoute: true,
    useHead: true,
    computed: true,
    isDark: true,
    preferredDark: true,
    nextTick: true,
    useTitle: true,
    defineOptions: true,
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
