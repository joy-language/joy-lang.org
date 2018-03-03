<template>
  <nav role="navigation">
    <ul>
      <li><nuxt-link to="/">Home</nuxt-link></li>
      <li><nuxt-link to="/papers-on-joy">Papers</nuxt-link></li>
      <li><nuxt-link to="/libraries-and-c-sources">Libraries/C sources</nuxt-link></li>
      <li><nuxt-link to="/about">About</nuxt-link></li>
    </ul>
  </nav>
</template>

<style scoped>
nav {
  background-color: black;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  transition: all .2s ease-out;
  display: inline-block;
  padding: 0;
  cursor: pointer;
}

li:hover {
  transform: scale(1.04);
  background-color: white;
  color: black;
}

li a {
  display: block;
  padding: 15px 25px 15px 25px;
  text-decoration: none;
  color: white;
  text-align: center;
}

li:hover a {
  color: black;
}

.nuxt-link-exact-active {
  text-decoration: overline;
}
</style>