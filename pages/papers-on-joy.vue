<template>
  <main class="lists">
    <div v-if="this.$nuxt.$route.name === 'papers-on-joy'">
      <h1>Papers on Joy</h1>
      <ul>
        <li class="top-list-item"><nuxt-link to="/papers-on-joy/tutorial-on-joy" name="tutorial">Tutorial on Joy</nuxt-link> (Revised 11-Feb-03)</li>
        <li><nuxt-link to="/papers-on-joy/mathematical-foundations-of-joy">Mathematical Foundations of Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/atomic-programs-of-joy">Atomic Programs of Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/the-algebra-of-joy">The Algebra of Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/recursion-theory-and-joy">Recursion Theory and Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/programming-in-joy">Programming in Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/a-rewriting-system-for-joy">A rewriting system for Joy</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/joy-compared-with-other-functional-languages">Joy compared with other functional languages</nuxt-link></li>
        <li><nuxt-link to="/papers-on-joy/the-current-implementation">The current implementation</nuxt-link> (Revised 23-APR-03)</li>
        <li class="no-style-litem"><h6>The following were produced automatically</h6>
          <ul>
            <li><a href="/papers-on-joy/plan-manual">The online manual for Joy primitives</a> (text format)</li>
            <li><nuxt-link to="/papers-on-joy/html-manual">The online manual for Joy primitives</nuxt-link> (html format)</li>
            <li><a href="/papers-on-joy/allhelp">List of primitive and currently defined library functions</a> (by "help." command, all libraries loaded)</li>
            <li>🡥 <a href="https://web.archive.org/web/20160527050008/http://www.system-7.freeserve.co.uk/joy/hlplib/">Nick Forde's documentation library</a></li>
            <li>🡥 <a href="http://tunes.org/~iepos/joy.html">The Theory of Concatenative Combinators</a></li>
          </ul>
        </li>
        <li class="no-style-litem"><h6>A collection of diverse examples of program development in Joy</h6>
          <ul>
            <li><nuxt-link to="/papers-on-joy/design-of-a-joy-interpreter-written-in-joy">Design of a Joy interpreter written in Joy:</nuxt-link>
              <ul>
                <li>Programs from the above (with additions) <a href="/papers-on-joy/jp-joyjoy.joy">jp-joyjoy.joy</a></li>
                <li><a href="/papers-on-joy/jp-joytst.joy">jp-joytst.joy</a> test and <a href="/papers-on-joy/jp-joytst.out">jp-joytst.out</a> (VMS: NOBDW) output</li> 
              </ul>
            </li>
            <li><nuxt-link to="/papers-on-joy/design-of-matrix-multiplication-programs">Design of matrix multiplication programs</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/imperative-thinking-for-joy-programs">Imperative thinking for Joy programs</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/church-arithmetic-and-church-logic-with-brent-kirby">Church arithmetic and Church logic with Brent Kirby</nuxt-link>, and <a href="/papers-on-joy/jp-church.joy">jp-church.joy</a> the source</li>
            <li><nuxt-link to="/papers-on-joy/nested-recursion-and-a-new-recursion-combinator">Nested Recursion and a new recursion combinator</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/fast-small-truth-tables">Fast small truth tables</nuxt-link> (using Joy native sets)</li>
            <li><nuxt-link to="/papers-on-joy/the-annoying-quadratic-formula">The annoying quadratic formula</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/lazy-lists-as-reproducing-programs">Lazy lists as reproducing programs</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/survey-of-reproducing-programs">Survey of reproducing programs</nuxt-link></li>
            <li><nuxt-link to="/papers-on-joy/floy-a-flat-concatenative-subset-of-joy">Floy - a flat concatenative subset of Joy</nuxt-link></li> 
          </ul>
        </li>
      </ul>
    </div>
    <div v-else>
      <component is="nuxt-child"></component>
    </div>
  </main>
</template>

<style src="assets/list-pages.css" scoped>
</style>
