function tests() {
  return import(/* webpackChunkName: "tests" */ './pages/tests.vue')
}

export default [
  {
    name: 'tests',
    path: '/tests',
    component: tests,
  },
]
