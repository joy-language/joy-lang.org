<template>
  <main class="wrapper">
    <bf>Prospectus for John Cowan's Joy1</bf>
    <title>Prospectus for John Cowan's Joy1</title>
    <p>
    John Cowan's Joy1 is essentially the old prototype of Joy
    with the following additions:
    </p><ul>
    <li>Floats (real numbers) as a new datatype, together with
        numerous new functions over floats.
    </li><li>Files as a datatype, together with some common functions
        for manipulating files and doing I/O.
    </li><li>Some new string functions. Also, on most platforms, an option
        to include garbage collection for strings.
    </li><li>Some bugs in the old prototype have been fixed. Portability
        has been further increased.  Joy1 will still compile and run
        with any strictly conforming ISO C compiler.
    </li></ul>
    <p>
    The currently supported platforms for the general garbage collector
    include Unix/Linux/*BSD on i386/Alpha/SPARC/SGI/HP, OS/2,
    Win32 native/Cygwin/DJGPP, and perhaps Macintosh.  One system
    known *not* to work is OpenVMS (here the 4 C-files have
    to be compiled and linked in the usual manner).
    Joy1 has not yet been built on all these systems.
    </p><p>
    It is intended that the new implementation become known as Joy1,
    and that the earlier prototype, now Joy0, should gradually fade away. 
    However, for compatiblity reasons the prototype Joy0
    C sources have been updated (16-JUN-01).
    </p><p>
    I am enormously grateful to John for his work.
    </p>
  </main>
</template>

<style scoped>
main {
  padding-top: 37px;
  padding-left: 12vw;
  padding-right: 12vw;
}

p {
  margin-top: 16px;
}
</style>