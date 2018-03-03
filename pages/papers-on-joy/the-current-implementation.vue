<template>
  <article>
    <p>
      <title> The prototype implementation of Joy </title>
      The prototype implementation of Joy
    </p>
    <p>
      <i> by Manfred von Thun </i>
    </p>
    <p>
    </p>
    <p>
      Revised March 2003
    </p>
    <p>Contents
    </p>
    <ol>
      <li><a href="#TOC_1">Introduction</a>
      </li>
      <li><a href="#TOC_2">Tokens</a>
      </li>
      <li><a href="#TOC_3">Factors and terms</a>
      </li>
      <li><a href="#TOC_4">Definitions and the main cycle</a>
      </li>
      <li><a href="#TOC_5">Initiating a Joy session</a>
      </li>
      <li><a href="#TOC_6">Input and output</a>
      </li>
      <li><a href="#TOC_7">Error messages</a>
      </li>
      <li><a href="#TOC_8">The libraries</a>
      </li>
      <li><a href="#TOC_9">Miscellaneous features</a>
      </li>
    </ol>
    <p>
      <em> Abstract </em> Joy is a functional programming language which is not based on the application of functions
      to arguments but on the composition of functions. This paper serves as a manual for the current prototype implementation.
      Other implementations might differ in some details.
      <a name="TOC_1"></a>
    </p>
    <h2><a name="TOC_1"><strong>Introduction</strong></a></h2>
    <p>
      The prototype implementation of Joy is written in unadorned C. It is not the first implementation, earlier ones
      have been written in Pascal, Prolog and Lisp. A small version in C was written by a group of students. The current
      prototype bears almost no resemblance to these earlier versions.
    </p>
    <p>
      This manual includes references to John Cowan's (2001) major extension to the earlier version of the prototype,
      and also to some additions by Nick Forde. Their help has been invaluable, and it is a pleasure to acknowledge
      their support. I am also grateful to many other members of the "concatenative" mailing group for finding and
      fixing numerous bugs.
    </p>
    <p>
      The source files for the current implementation are freely available, and can be downloaded in various formats
      by following links from the main page.
    </p>
    <p>
      In the next three sections the following (extended) <em> BNF notation</em> is used for the grammar: A <em> BNF production</em>  consists of a <em> BNF nonterminal</em> followed by <kbd>::=</kbd> (pronounced "can be"), followed by a BNF expression.
      A <em> BNF expression</em> consists of one or more BNF terms separated by the alternation symbol
      <kbd>|</kbd> pronounced "or". A <em> BNF term</em> consists of one or more BNF factors concatenated. A <em> BNF factor</em>  can be a non-terminal, or a <em> BNF terminal</em> enclosed in double quotes. It can also be an English phrase.
      A BNF factor can also be a BNF expression enclosed in parentheses <kbd>()</kbd> to override precedences, or in
      curly braces <kbd>{}</kbd> to indicate zero or more repetitions, or in square brackets <kbd>[]</kbd> to indicate
      options.
    </p>
    <p>
      The remainder of this paper gives a provisional manual for the prototype implementation. The focus of this manual
      is on general structure, and it leaves out many details that have been described elsewhere. Also, the manual
      should be understood to be provisional; other implementations of Joy might differ considerably. The first few
      sections to follow describe the syntax and the general semantics of this implementation of Joy. The later sections
      describe some very specific features that have not been covered elsewhere might not be present in other implementations.
      <a name="TOC_2"></a>
    </p>
    <h2><a name="TOC_2"><strong>Tokens</strong></a></h2>
    <p>
      This section describes the <em>lexicon</em> of Joy, the individual <em>token</em>s which make up a program.
    </p>
    <p>
      A Joy program consists of an ASCII file, which consists of lines of characters. Lines beginning with the escape
      character <kbd>$</kbd> are not processed by the Joy interpreter but are dispatched to the command shell. Under
      VMS typical uses are the following:
      <br>
    </p>
    <pre>        $  show  time
            $  directory
            $  edit  myfile.joy
    </pre>
    Under Unix the corresponding uses are:
    <br>
    <pre>        $  date
            $  ls
            $  vi  myfile.joy
    </pre>
    When the request has been processed, control returns to the Joy system.
    <p>
      Lines not beginning with the escape character are processed by the Joy system. There are two styles of comments:
      parenthesis style and end-of-line style. The first kind of comments are enclosed in starred parentheses,
      <kbd>(*</kbd> and
      <kbdd>*)<kbd>,
        they may continue over several lines:
        <br></kbd>
      </kbdd>
    </p>
    <pre>        (*  this is a comment
                continued on the second line *)
    </pre>
    The second kind of comments occur after the hash-symbol
    <kb>
      # up to the end of line; no terminator is required:
      <br>
      <pre>            # this comment terminates at the end of this line
             
                # and this comment terminates here
    </pre>
      Comments are not further processed but are treated just like blank space.
      <p>
        An input line consists of a number of <em>token</em>s. Some of these are single characters, the <em>reserved character</em>s.
        They are the two (square) brackets <kbd> [ </kbd> and <kbd> ] </kbd>, the two (curly) braces <kbd>{</kbd> and
        <kbd>}</kbd>, the semicolon <kbd> ; </kbd> and the period<kbd> . </kbd>:
        <br>
      </p>
      <pre>    reserved-character  ::=
                "["  |  "]"  |  "{"  |  "}"  |  ";"  |  "."
    </pre>
      <p>
        Another kind of token is that of <em>integer constant</em>, a string of one or more decimal digits <kbd>"0"</kbd>    .. <kbd>"9"</kbd> possibly immediately preceded by a unary minus <kbd>"-"</kbd>.
        <br>
      </p>
      <pre>    integer-constant  ::=
                [ "-" ]  ( "0" | "1" .. | "9" )  { "0" | "1" .. | "9" }
    </pre>
      An integer constant can contain up to 10 digits but must not exceed the platform dependent maximum integer
      (generally $2^{32}-1$).
      <p>
        Apart from integers, the current implementation of Joy also has real numbers or "floats". In the simplest form
        a <em>float constant</em> consists of a string of one or more decimal digits, then a <em>decimal point . </em>    and then at least one more decimal digit or possibly more. As for integer constants, a float constant can optionally
        be preceded by a unary minus. For scientific notation, a float constant can be followed by a scale factor,
        either of the letters "e" or "E" followed by one or more digits.
      </p>
      <p>
        Instead of writing integers or floats in decimal notation, they can be preceded by "0" to signify octal notation
        (using digits "0" .. "7"), or preceded by "0x" pr "0X" to signify hexadecimal notation (using digits "0" ..
        "9" "A" .. "F").
      </p>
      <p>
        Others tokens are <em>string constant</em>s and <em>character constant</em>s. Some character sequences beginning
        with the backslash <kbd>"\"</kbd> character inside string constants or character constants are treated as
        <em>escaped character</em>s. A character other than the backslash character is an ordinary character.
        <br>
      </p>
      <pre>    escaped-character  ::=
                   "\n"                     newline
                |  "\t"                     tab
                |  "\b"                     backspace
                |  "\r"                     carriage return
                |  "\f"                     formfeed
                |  "\'"                     single quote
                |  "\""                     double quote
                |  "\ddd"                   ASCII whose value is ddd
                                            where ddd are three decimal digits
        ordinary-character  ::=
                any character except "\"
    </pre>
      A <em>string constant</em> begins and ends with the double quote character <kbd>"</kbd>, enclosing any sequence
      of zero or more special characters or ordinary characters. A <em>character constant</em> begins with the single
      quote character <kbd>'</kbd> followed by a special character or an ordinary character; there is no closing single
      quote.
      <br>
      <pre>    string-constant  ::=
                '"'  { escaped-character | ordinary-character } '"'
        character-constant  ::=
                "'"  ( escaped-character | ordinary-character )
    </pre>
      <p>
        Of the remaining tokens some are the <em>reserved symbol</em>s:
        <br>
      </p>
      <pre>    reserved-word  ::=
          "=="  |  "MODULE"  |  "PRIVATE"  |  "PUBLIC"  |  "END"
                                   |  "HIDE"     |  "IN"
                                                 |  "DEFINE"
                                                 |  "LIBRA"   
    </pre>
      The reserved words "HIDE", "IN", "DEFINE" and "LIBRA" are currently synonyms for "PRIVATE" and "PUBLIC",
      and they may eventually declared obsolescent.
      <p>
        Any other token beginning with a printing character and possibly continuing with upper or lower case letters, digits
        or the three characters <kbd>"="</kbd>, <kbd>"_"</kbd> or <kbd>"-"</kbd> is an <em>atomic symbol</em>.
        <br>
      </p>
      <pre>    atomic-symbol  ::=
            any printing character which is not a reserved character
                or a digit or the single or double quote character
            { letter  |  digit  |  "="  |  "_"  |  "-" }
    </pre>
      <p>
        To summarise, here is the definition of <em>token</em>s:
        <br>
      </p>
      <pre>    token  ::=
              reserved-character | reserved-word
      | integer-constant | float-constant
      | character-constant |  string-constant
      | atomic-symbol
    </pre>
      <a name="TOC_3">
        <h2><strong>Factors and terms</strong></h2>
      </a>
      <p>
        Individual tokens are used to built up two kinds of syntactic entities called <em>factor</em>s and <em>term</em>s.
        Their definitions are mutually recursive.
      </p>
      <p>
        A <em>factor</em> can be a single token such as an atom or one of the three constants: integer constant, character
        constant or string constant. A factor can also consists of a (possibly empty) sequence of integer or character
        constants enclosed in the curly brace tokens <kbd>{</kbd> and <kbd>}</kbd>. Finally, a factor can also be a
        (possibly empty) term enclosed in the square bracket tokens
        <kbd>[</kbd> and <kbd></kbd>}.
        <br>
      </p>
      <pre>    factor  ::=
               atomic-symbol
            |  integer-constant | float-constant
            |  character-constant | string-constant
            |  "{"  { character-constant | integer-constant } "}"
            |  "["  term  "]"
    </pre>
      A <em>term</em> consists of zero or more factors.
      <br>
      <pre>    term  ::=
            { factor }
    </pre>
      <p>
        For the <em>semantics</em> another classification is essential. Factors are either <em>literal</em>s or <em>operator</em>s
        or <em>combinator</em>s. A literal can be one of the two atomic symbols
        <kbd>"true"</kbd> or <kbd>"false"</kbd> -- these are the logical literals. A literal can also be one of the
        four constants and these are then called
        <em>integer literal</em>,
        <em>float literal</em>, <em>character literal</em> or <em>string literal</em>. A literal can also consist of
        the braces enclosing characters or integers - these are the <em>set literals</em>. Finally a literal can consist
        of the brackets enclosing a term - these are the <em>quotation literals</em> or simply <em>quotations</em>.
        If the term consists just of literals, the factor is called a <em>list list</em> or just a <em>list</em>.
        <br>
      </p>
      <pre>    literal  ::=
               "true"  |  "false"
      |  integer-constant | float-constant
      |  character-constant | string-constant
            |  "{"  { character-constant | integer-constant } "}"
            |  "["  term  "]"
    </pre>
      The other atomic factors are either built in or defined. All built in atomic factors are either operators
      or combinators. Most defined atomic factors are likely also to be operators or combinators, but it is possible
      to define atomic symbols which are literals.
      <p>
        <em>factor</em>s and <em>term</em>s denote functions which take one argument and yield one value or result.
        The argument and the result consist principally of a <em>stack of values</em>, but have as minor components
        several <em>input file</em>s and one <em>output file</em>. The stack is normally a sequence of values of the
        kind denoted by constants and thus it resembles a list. But in (rather rare) cases the stack can contain operators
        or combinators. So the stack is essentially the same thing as a term. Most of the functions affect only the
        stack component. An empty term denotes the identity function. A non-empty term, consisting of one or more factors
        concatenated, denotes the composition of the functions denoted by the factors. The functions denoted by the
        factors are applied in the order in which the factors are written.
      </p>
      <p>
        All literal factors denote functions yielding as result a stack component which is like the argument stack except
        that the value of the literal has been pushed on top of the stack. The operator factors expect as argument
        a stack which has to contain one or more values. They denote functions yielding as a result another stack which
        is like the argument stack except that the top few values have been replaced by others. The combinator factors
        are like the operator factors in that they expect a stack containing certain values. Specifically, the combinator
        factors expect a stack containing one or more quotations and possibly some other values. Combinators will execute
        the terms contained in the quotations.
      </p>
      <p>
        The file
        <a href="joy/plain-manual.html">
        Online manual (raw Joy1) </a> gives a very synoptic explanation of the inbuilt primitives of <em>raw Joy1</em>    -- that is, excluding anything defined in one or the other library. The arrow <kbd>-&gt;</kbd> indicates that
        the operator or combinator that is being described expects on top of the stack the items on the left of the
        arrow and returns a stack on top of which are the items on the right. The content of this file is identical
        in content with that obtained by the <kbd>manual</kbd> command.
        <a name="TOC_4"></a>
      </p>
      <h2><a name="TOC_4"><strong>Definitions and the main cycle</strong></a></h2>
      Joy programs can be written using only the inbuilt atomic symbols, but it also possible to define new symbols.
      There are several kinds of reason why one might want to define new symbols: because they are needed in various
      places in the program, because they involve recursion or because they make the program more intelligible. The
      first two reasons are less compelling in Joy than in most other languages.
      <p>
        Often one needs not just one <em>definition</em> but a <em>sequence</em> of definitions, and these are then
        separated by semicolons "<kbd>;</kbd>".
        <br>
      </p>
      <pre>    definition-sequence  ::=
            definition  { ";"  definition }
    </pre>
      <p>
        Definitions can be of two kinds: simple or compound. A <em>simple definition </em>consists of a user-chosen
        atomic symbol followed by the <kbd>==</kbd> token followed by a term:
        <br>
      </p>
      <pre>    simple-definition  ::=
              atomic-symbol  "=="  term
    </pre>
      A <em>simple definition</em> introduces the new atomic symbol into the current working dictionary. The initial
      dictionary is empty. After the definition the new symbol can be used, and if executed its effect is that of executing
      the term.
      <p>
        A <em>compound definition</em> consists of 1) optionally the <kbd>MODULE</kbd> token followed by an atomic
        symbol, then 2) optionally either the <kbd>PRIVATE</kbd> token followed by a definition sequence, then 3) optionally
        the <kbd>PUBLIC</kbd> token followed by a definition sequence, and finally either the "<kbd>.</kbd>" (period)
        token or the <kbd>END</kbd> token. At least one of the three options must be present:
        <br>
      </p>
      <pre>    compound-definition  ::=
      [ "MODULE"  atomic-symbol ]
      [ "PRIVATE"  definition-sequence ]
      [ "PUBLIC"  definition sequence ]
      ( "." | "END" )
    </pre>
      Instead of <kbd>PRIVATE...PUBLIC...</kbd> the combination
      <kbd>HIDE...IN...</kbd> can be used, and instead of <kbd>PUBLIC...</kbd> the syntax <kbd>LIBRA...</kbd> or
      <kbd>DEFINE...</kbd> can be used. These alternative symbols may become obsolscent in the future, but will be
      supported for the time being.
      <p>
        In the simplest case only the <kbd>PUBLIC</kbd>-part is present. In that case all <em>definition</em>s in the
        <em>definition sequence</em> are entered into the symbol table. If there is a <kbd>PRIVATE</kbd>-part, then
        any <em>definition</em>s in its <em>definition sequence</em> are entered into the symbol tableand are then
        available for use by the <kbd>PUBLIC</kbd>-part. However, the <kbd>PRIVATE<kbd> <em>definition</em>s are
        then obscured at the end of the <kbd>PUBLIC</kbd>
        <em>definition sequence</em> and are then not available any further. If there is a <kbd>MODULE</kbd>-part,
        then all subsequent <kbd>PRIVATE</kbd> and <kbd>PUBLIC</kbd>
        <em>definition</em> are visible as before except that at the end of the <kbd>PUBLIC</kbd> <em>definition sequence</em>    all <em>definition</em>s are obscured except the name of the module. In that case the <em>definition</em>s
        of the <kbd>PUBLIC</kbd>-part can only be accessed as factors by what is called "qualified access", in the
        form
        <br>
        </kbd>
        </kbd>
      </p>
      <pre> m . f   or   m.f
    </pre>
      where <kbd>m</kbd> and <kbd>f</kbd> are respectively the name of the module and of a function from its <kbd>PUBLIC</kbd>-part.
      <p>
        In many uses of Joy the initial input will be from the terminal keyboard and the output will be to the terminal
        screen. Operating systems will generally allow the input and the output to be redirected, so that the input
        comes from a disk file or the output goes to a disk file, or both. Whatever the actual input file is, it will
        consist of a a number of requests to the Joy system. A request is either a compound <em>definition</em>    or it is a term followed by either the <kbd>END</kbd> token or just a period "<kbd>.</kbd>".
        <br>
      </p>
      <pre>    cycle  ==
            {    compound-definition
        |  term  ( "END" | "." ) }
    </pre>
      In the first case the compound <em>definition</em> is processed and control returns to the top level. In
      the second case the term is executed on the current stack. In the default mode the top value on the stack is
      then written the output file, normally the screen. If several terms are executed in succession, each term inherits
      from the preceding term the remainder of the stack. This can be useful when debugging larger programs. On the
      other hand, every library declaration clears the stack. The inbuilt factor <kbd>abort</kbd> returns to the main
      cycle, but it leaves the stack intact.
      <a name="TOC_5">
        <h2><strong>Initiating a Joy session</strong></h2>
      </a>
      A session with Joy is initiated by running
      the Joy interpreter in whatever ways the installation allows or requires. In most cases this will be done from
      the top level of the command language. In Unix it might simply be
      <br>
      <pre> $  joy
    </pre>
      and under VMS it might be
      <br>
      <pre> $  RUN JOY
    </pre>
      or, if "JOY" has been appropriately defined as a symbol,
      <br>
      <pre> $  JOY
    </pre>
      The Joy interpreter will then announce itself with a brief banner. In the simplest case the Joy interpreter
      will then use the keyboard as the first input device and start the main cycle by taking input from there. Output
      will be to the screen.
      <p>
        However, although this is the simplest case, it is not the most common. If the current directory contains a file
        by the name "<kbd>usrlib.joy</kbd>", this will become the first input file, and the main cycle will start
        reading requests from there. Typically this file will contain some <em>definition</em>s specific to the particular
        user, or to the particular installation, or to the particular operating system. Typically this file will also
        contain a directive to continue by reading some of the standard libraries, or to continue with some other files.
        When these requests have been serviced, the main cycle will continue by reading inputs from the keyboard, unless
        the main cycle has been terminated before that happens.
      </p>
      <p>
        Most operating systems allow input to and output from a program to be "redirected" to come not from the keyboard
        or go to the screen, but to come from and go to a file. In Unix the Joy interpreter can be run with the input
        redirected from a file, say "<kbd>my-input.joy</kbd>", like this:
        <br>
      </p>
      <pre> $  joy  &lt;my-input.joy
    </pre>
      It is also possible to redirect the output to go to, say "<kbd>my-output.txt</kbd>", like this:
      <br>
      <pre> $  joy  &lt;my-input.joy  &gt;my-output.txt
    </pre>
      The same can also be done in VMS, but here it is necessary that both redirections occur:
      <br>
      <pre> $  JOY /INPUT=MY-INPUT.JOY  /OUTPUT=MY-OUTPUT.TXt
    </pre>
      With redirection of the input the behaviour of the Joy interpreter again depends on whether the current
      directory contains a file "
      <kbd>usrlib.joy</kbd>". If there is such file, then that is read first, and only then the main cycle reads not
      from the keyboard but from the redirected file. If there is no file "<kbd>usrlib.joy</kbd>", the main cycle will
      immediately read from the redirected file.
      <p>
        Under some operating systems it is possible to give what are called command line arguments to a program that is
        to run. This is very familiar under Unix, where the Joy interpreter might be run like this:
        <br>
      </p>
      <pre> $  joy  P1  P2  P3
    </pre>
      with in this case three arguments P1 P2 P3. Under VMS it is also possible to define programs as "foreign
      commands" by a <em>definition</em> (possibly in <kbd>login.com</kbd>):
      <br>
      <pre> $  JOY == "$DSK-XYZ[MYNAME.JOYDIR]JOY.EXE"
    </pre>
      where <kbd>DSK-XYZ</kbd>, <kbd>MYNAME</kbd> and <kbd>JOYDIR</kbd> are respectively the user's disk, the
      user's name and the directory on which the executable interpreter is located. The joy interpreter is then run
      with parameters P1 P2 P3 by
      <br>
      <pre> $  JOY  P1  P2  P3
    </pre>
      <p>
        When the Joy interpreter is run with command line arguments, the first parameter P1 must be a valid file name.
        The interpreter then attempts to open that file for reading, and if that attempt fails it exits. If the attempt
        succeeds, all further commands are taken not from standard input (possibly redirected) but from that file.
        This means that any explicit input from the "get" command can still come from standard input.
      </p>
      <p>
        When Joy is run with command line parameters, say by
        <br>
      </p>
      <pre> $  joy  test.joy  mary  42
    </pre>
      the number of parameters is available by the operator
      <kbd>argc</kbd> which pushes an "argument count", in this case 3. Also, a list of the parameters is available
      by the operator
      <kbd>argv</kbd> which pushes the "argument vector", in this case the list <kbd>[ "test.joy"  "mary"  "42" ]</kbd>.
      <p>
        Under Unix and under VMS one can write files that are to be executed by the command interpreter and whose first
        line calls Joy and uses the rest of the file s input to Joy. In Unix these are "here documents", for VMS they
        are ".com" files. With the command line arguments to Joy there is another, more elegant, possibility using
        the "#!" facility (interpreted by the Unix <em>exec</em> system call). For Joy such a file would have to
        start with "#!joy" as the first line, and the rest of the file as input to Joy. The file
        <a href="joy/gcd">gcd</a> is an example which uses Joy to compute the greatest common divisor. After it has
        been created, it has to be made executable with 
      </p>
      <pre>$ chmod +x gcd</pre>
      and thereafter it can be run
      with command lines such as
      <pre>$ gcd 45 100</pre>
      which will give the answer <kbd>5</kbd>.
      <a name="TOC_6">
        <h2><strong>Input and output</strong></h2>
      </a>
      <p>
        For many applications no explicit output operation is needed because in the default mode the main cycle will always
        write the value of the top of stack to the output stream. But sometimes explicit output is useful. There are
        two basic output operators: <kbd>put</kbd> will remove a value of any type from the stack and write it
        to the output stream.
        <kbd>putch</kbd> will remove a value of a numeric type (character or integer) and write it as a single ASCII
        character to the output stream. Other useful output operations are defined in the library.
      </p>
      <p>
        In the default mode the Joy system will write the value of the top of stack item to the output. The mode is under
        the control of a flag with value 0 and 1. If the value is 0, no automatic output occurs. If the value is 1,
        the default, output of the top value occurs after the evaluation of every term in the main cycle. If the value
        is 2, the entire stack is output after such an evaluation. The value of this flag can be changed by the <kbd>setautoput</kbd>    operator, typical use is
        <br>
      </p>
      <pre>        0  setautoput.
    </pre>
      <p>
        Most Joy programs operate on a stack, several input files and one output file. The initial input comes either from
        the keyboard or it can be redirected to come from a diskfile, or it can be not from standard input but from
        a file specified as a command line argument. Often it is useful to include other files, typically diskfiles,
        in the input. Joy has an <kbd>include</kbd> operator for this purpose. It takes a string on the stack as
        a parameter and opens a file with that name and henceforth accepts input from there. A typical use might be
        <br>
      </p>
      <pre>        "test.joy"  include.
    </pre>
      Included files can contain library <em>definition</em>s or <em>term</em>s to be executed. They can contain
      other <kbd>include</kbd> operators, up to a level of 10. When the end of an included file is reached, input reverts
      to the previous file which contained the relevant <kbd>include</kbd> operator. The include files therefore form
      a stack.
      <p>
        Users will often want their own selection of systems or private libraries read in automatically when the system
        starts up. For this purpose the Joy system always starts by checking whether a file "<kbd>usrlib.joy</kbd>"
        exists in the user's current directory. That file can be empty, but it can contain user specific <em>definition</em>s
        and it can contain particular <em>term</em>s to be executed. One such <em>term</em> might be a directive to
        include yet another file, perhaps
        <br>
      </p>
      <pre>        "inilib.joy"  include.
    </pre>
      which transfers input to the <em>initial library</em>, <kbd>inilib.joy</kbd>, one of the systems libraries
      for Joy. These libraries are described in the next section.
      <p>
        If input does not come from the keyboard but from an include file, it is often useful to see the current input
        on the screen. Normally the Joy system does not echo keyboard or other input on the screen or output file,
        but it can be made to do so. Joy has an internal <em>echoflag</em> with values 0, 1, 2 or 3.. The initial
        default value is 0, and then no echo occurs. If the value is 1, then input lines are echoed to the output without
        change. If the value is 2, then each line is preceded by a tab (ASCII 9) -- this can help to distinguish echoed
        lines in the output from others. If the value is 3, then each tab is preceded by a line number specific to
        the current input file. When input reverts to an earlier file, the earlier line numbering is resumed. The value
        of the echo flag can be set by the operator <kbd>setecho</kbd>. Typically the value will be set by something
        like
        <br>
      </p>
      <pre>        2  setecho.
    </pre>
      <a name="TOC_7">
        <h2><strong>Error messages</strong></h2>
      </a>
      <p>
        When a Joy program is processed, two kinds of programming errors can occur. The first kind can occur during reading
        of the input file. Because the syntax of Joy is so simple, there are only few possibilities for error. The
        second kind can occur at runtime when a term is being executed. These errors concern incorrect parameters for
        operators and combinators. Because there are many kinds of operators and combinators, the possibilities for
        runtime errors are great.
      </p>
      <p>
        Errors of the first kind occur during reading a program. Since the input line is still available at that time,
        it is possible for the error message to point to the exact place at which the error occurred. If input comes
        from the initial input file, most likely the terminal, it is not repeated. In other case it is repeated, including
        its line number. The next line then consists just of an up-arrow <kbd>"^"</kbd> pointing to the error position.
        Following that is a line containing the specific error message.
      </p>
      <p>
        The following (rare) message can be reported when reading tokens, it occurs when the second or third digit in an
        escaped character is missing.
        <br>
      </p>
      <pre>        digit expected
    </pre>
      The following errors can occur when reading factors:
      <br>
      <pre>        numeric expected in set
            ']' expected
            a factor cannot begin with this symbol
    </pre>
      The following errors can occur when reading <kbd>HIDE</kbd> declarations:
      <br>
      <pre>        IN expected in HIDE-definition
            END expected in HIDE-definition
    </pre>
      The following errors can occur when reading <em>definition</em>s:
      <br>
      <pre>        atom expected at start of <em>definition</em>
            == expected in <em>definition</em>
    </pre>
      <p>
        All other errors are <em>runtime error</em>s. These are given in the form:
        <br>
      </p>
      <pre>    "run time error: "  MESSAGE  " needed for "  NAME
    </pre>
      Two examples are
      <br>
      <pre>    run time error: fewer include files needed for include
        run time error: valid file name needed for include
    </pre>
      In general, the <kbd>NAME</kbd> is the name of the operator or combinator whose execution was attempted
      but failed. The <kbd>MESSAGE</kbd> is often the same for many operators or combinators. It can be one of the
      following:
      <br>
      <pre>        one parameter
            two parameters
            three parameters
            four parameters
            four parameters
            quotation as top parameter
            quotation as second parameter
            quotation as third parameter
            quotation as fourth parameter
            two parameters of the same type
            integer
            two integers
            numeric
            numeric second parameter
            non-zero operand
            list
            list as second parameter
            user defined symbol
            internal list
            small numeric
            non-empty set
            non-empty string
            non-empty list
            smaller index
            aggregate parameter
            different type
    </pre>
      <p>
        Some apparently inexplicable runtime errors can occur when reading an included library file which is syntactically
        correct and hence does not produce an error message as it is read in. The program can still contain a logical
        error which causes something unintended to be executed that produces a run time error. In that case it is helpful
        to use <kbd>setecho</kbd> to set the echoflag to <kbd>3</kbd>, resulting in line numbers to be printed
        as the included file is read in. There have been two occasions where this trick helped clear up a problem.
        <a name="TOC_8"></a>
      </p>
      <h2><a name="TOC_8"><strong>The libraries</strong></a></h2>
      <p>
        The Joy system has a growing number of library files containing definitions which extend the core Joy language.
        he following is a brief description of the various libraries in the current distribution. The actual content
        of all the libraries is still subject to minor change, so these descriptions should only be taken to be a rough
        guide.
      </p>
      <p>
        The first two libraries below are very atypical: the first because it does not even have to exist at all, the second
        because it is assumed by just about all other libraries and hence is quite non-specific.
      </p>
      <p>
      </p>
      <dl>
        <dt><a href="joy/usrlib.joy">usrlib.joy</a><br>
        </dt>
        <dd>
          <p>This <em>user library</em> is intended to be just an example of what a personalised file <kbd>usrlib.joy</kbd>        might look like. When Joy is run with input coming from the <em>standard input stream</em>, on startup
            Joy will first determine whether there is a file
            <kbd>usrlib.joy</kbd> in the current directory. If there is, it is opened for reading. When the end is
            reached, or when there is no such file, the terminal or the designated inpu file is used. For any particular
            user this file might look very different -- it might be empty, or it might might contain just a directive
            to include the library described next, or it might contain fewer or it might contain more definitions,
            or it might contain definitions of a very different kind.
          </p>
        </dd>
        <dt><a href="joy/inilib.joy">inilib.joy</a><br>
        </dt>
        <dd>
          <p>This <em>initial library</em> contains a disparate collection of operators and combinators that are widely
            useful. Most are not dependent on particular types. Some of them might eventually be incorporated as primitives
            into the Joy language. Currently there are a few simple operators to help with explicit input and output,
            some operators for dates and times, some operators on predicates, and some useful combinators. Finally
            there are some utilities to help loading and managing libraries. All other libraries wiil ensure either
            directly or indirectly that this library is also loaded.
          </p>
        </dd>
      </dl>
      <p>The following <em>basic libraries</em> contain definitions of still rather general operators and combinators
        but related to specific types or groups of types.
      </p>
      <dl>
        <dt><a href="joy/agglib.joy">agglib.joy</a><br>
        </dt>
        <dd>
          <p>This <em>aggregate library</em> contains definitions of operators and combinators most of which are applicable
            to all of the three <em>aggregate</em> datatypes such as
            <em>list</em>s, <em>string</em>s and <em>set</em>s. (Note that the next library seqlib.joy is specifically
            for sequence datatypes such as lists and strings.)
          </p>
          <p>The agglib.joy library contains definitions of several unary and binary operators for building special cases
            of these datatypes, and for accessing parts of these datatypes. There are also some ("dipped") variants
            which operate not on the top of the stack but one below. The combinators in this library are mainly for
            traversing these datatypes. (At the end there are a few definitions of statistical operators, but in the
            future these might be moved to a more extensive statistics library.)
          </p>
        </dd>
        <dt><a href="joy/seqlib.joy">seqlib.joy</a><br>
        </dt>
        <dd>
          This <em>sequence library&gt;</em> contains definitions of functions specific to the <em>sequence datatypes</em>      such as lists and strings. When this library is loaded, it ensures that the <kbd>agglib.joy</kbd> library
          will also be loaded.
          <p>This library contains definitions of functions for reversing lists or strings, for flattening lists of sequences,
            for generating lists of various subsquences of sequences, sorting and merging of sequences and inserting
            into and deleting from sequences. (At the end there are a few definitions of functions applicable to <em>tree</em>s
            or recursive lists, but in the future these might be moved to a more extensive tree library.)
          </p>
        </dd>
        <dt><a href="joy/numlib.joy">numlib.joy</a><br>
        </dt>
        <dd>This <em>numerical library</em> contains definitions of functions and combinators for numerical work on integers
          and floating numbers. some convenience predicates such as positive, negative, odd, even and prime, some standard
          functions such as factorial, fibonacchi, greatest common divisor and temperature conversion. Also included
          are methods for finding roots of quadratic equations and Newton's method for finding solutions of equations
          in one variable.
        </dd>
        <dt><a href="joy/symlib.joy">symlib.joy</a>
          <br>
        </dt>
        <dd>This <em>symbolic library</em> is for purely symbolic manipulation of various notations. Currently all the
          definitions are for non-specific translations from one notation to another.
          <br>There is a
          <a href="joy/symtst.joy">symtst.joy</a> test file and its
          <a href="joy/symtst.out">symtst.out</a> output. This library is currently used by the special libraries
          <kbd>grmlib.joy</kbd> and <kbd>plglib.joy</kbd>, see below.
        </dd>
      </dl>
      <p>
        The followiing <em>special libraries</em> contain definitions of operators and combinators that are very specific
        to a particular field or problem.
      </p>
      <dl>
        <dt><a href="joy/mtrlib.joy">mtrlib.joy</a>
          <br>
        </dt>
        <dd>A library for <em>matrices</em> and <em>vector</em> manipulation. The vectors are implemented as Joy lists,
          the matrices as lists of lists. Either may contain numeric or non-numeric elements.
          <br>There is a
          <a href="joy/mtrtst.joy">mtrtst.joy</a> testfile and its
          <a href="joy/mtrtst.out">mtrtst.out</a> output.
        </dd>
        <dt><a href="joy/tutlib.joy">tutlib.joy</a>
          <br>
        </dt>
        <dd>A library for writing <em>interactive sessions</em> such as <em>tutorials</em>.
          <br>Currently there is only one such tutorial (for Joy):
          <a href="joy/joytut.joy">joytut.joy</a>
          <br> There is a
          <a href="joy/joytut.com">joytut.com</a> (pseudo) input and its
          <a href="joy/joytut.out">joytut.out</a> output.
        </dd>
        <dt><a href="joy/lazlib.joy">lazlib.joy</a><br>
        </dt>
        <dd>A <em>"lazy list" library</em>, for unevaluated infinite or finite lists that will only be evaluated as needed.
          <br> There is a
          <a href="joy/laztst.joy">laztst.joy</a> test file and its
          <a href="joy/laztst.out">laztst.out</a> output.
        </dd>
        <dt><a href="joy/lsplib.joy">lsplib.joy</a> and
          <a href="joy/lsplib.lsp">lsplib.lsp</a><br>
        </dt>
        <dd>A small (eval-apply) Lisp interpreter in Joy, and a small library for this version of Lisp.
          <br> There is a
          <a href="joy/lsptst.joy">lsptst.joy</a> driver for the
          <a href="joy/lsptst.lsp">lsptst.lsp</a> lisp input and its
          <a href="joy/lsptst.out">lsptst.out</a> output.
        </dd>
        <dt><a href="joy/plglib.joy">plglib.joy</a><br>
        </dt>
        <dd>A library for <em>propositional logic</em> using semantic tableaux for determining whether a formula is a tautology
          (or for determining satisfiability). This library depends on (and loads) the
          <em>symbolic library</em> <kbd>symlib.joy<kbd>.<br>
          There is a
          <a href="joy/plgtst.joy">plgtst.joy</a>
          file of test input and its
          <a href="joy/plgtst.out">plgtst.out</a>
          output.
          </kbd></kbd>
        </dd>
        <dt><a href="joy/grmlib.joy">grmlib.joy</a><br>
        </dt>
        <dd>A <em>grammar library</em> for regular expressions and context free grammars. Both parsing and generating are
          supported. This library depends on (and loads) the
          <em>symbolic library</em> <kbd>symlib.joy<kbd>.<br>
          There is a
          <a href="joy/grmtst.joy">grmtst.joy</a>
          test input and its
          <a href="joy/grmtst.out">grmtst.out</a>
          output.
          </kbd></kbd>
        </dd>
      </dl>
      <p>
        The file
        <a href="joy/allhelp.html">allhelp.html</a> is the output of the <em>help</em> command when all libraries have
        been loaded. It gives some impression of the size of the Joy implementation so far.
      </p>
      <p>
        The file
        <a href="joy/joylibs.tar.gz">joylibs.tar.gz</a> is a gzipped tar file of all *.joy libraries, input test files
        and output files. This file is automatically updated when there is any change to the Joy distribution.
      </p>
      <p> </p>
      <p>
        The following libraries are external to the main Joy web pages. They are part of the "files" folder for the "concatenative"
        yahoo mailing group. To access them you need to join the group.
      </p>
      <dl>
        <dt><a href="http://www.groups.yahoo.com/group/concatenative/files/rabbit">
          rabbit</a><br>
        </dt>
        <dd>A Joy to HTML translation library by Heiko Kuhrt, it contains an extensive Joy manual in HTML format.
        </dd>
        <dt><a href="http://www.groups.yahoo.com/group/concatenative/files/mandel.html">
          mandel</a><br>
        </dt>
        <dd>Several Mandelbrot programs in Joy by Nick Forde et. al. collected by Nick Forde.
        </dd>
      </dl>
      <a name="TOC_9">
        <h2><strong>Miscellaneous features</strong></h2>
      </a>
      <p>
        Joy has a <kbd>help</kbd> command to remind users of the names of currently defined symbols. The command does
        not expect any parameters on the stack, and it does not affect the stack. The effect is to write all user defined
        symbols and all inbuilt symbols to the output which is normally the screen. The list begins with the most recently
        defined symbols, typically those specially defined just for the current run, then the library symbols and finally
        the inbuilt symbols. The <kbd>help</kbd> command is just a factor:
        <br>
      </p>
      <pre>        help
    </pre>
      <p>
        More details about a particular symbol can be obtained by the <kbd>helpdetail</kbd> operator. It expects a
        list of atoms on the stack and gives a short message for each symbol. If the symbol is defined, then the message
        consists of the <em>definition</em> for the symbol. If the symbols is inbuilt, then the message consists of
        a brief description of its usage.
        <br>
      </p>
      <pre>        [ swap step product ]  helpdetail.
    </pre>
      asks for detailed help about the inbuilt operator <kbd>swap</kbd>, the inbuilt combinator <kbd>step</kbd>  and the defined operator <kbd>product</kbd>. The message is
      <br>
      <pre>swap   :   X Y  -&gt;  Y X
      Interchanges X and Y on top of the stack.
    step   :   A [P]  -&gt;  ...
      Pushing successive members of aggregate A onto stack, executes P for each.
    product  ==
      1  swap  [*]  step
    </pre>
      For the inbuilt primitives the <kbd>-&gt;</kbd> arrow indicates the type of the symbol. To the left of the
      arrow are the required parameters in ascending order. To the right of the arrow are the results, where possible.
      If that cannot be specified in this simple notation, a dieresis <kbd>...</kbd> is used.
      <p>
        As described in section 2, Joy already allows escapes to the operating system at the level of input lines. Another
        such escape is at the level of Joy operators. The <kbd>system</kbd> operator expects a string as a parameter
        and passes that to the operating system. A typical use might be:
        <br>
      </p>
      <pre>        "directory"  system
    </pre>
      The string parameter does not have to be pushed as a literal, it can equally well have been constructed.
      For example, the <kbd>system</kbd> operator can be used as in the following. My personal <kbd>USRLIB.JOY</kbd>  contains the <em>definition</em>
      <br>
      <pre>        editor  ==  "EDIT/TECO "
    </pre>
      The general <kbd>STDLIB.JOY</kbd> file contains
      <br>
      <pre>        edit  ==  dup editor swoncat system include
    </pre>
      Then, to edit and immediately read in a file, say <kbd>TEST.JOY</kbd>, I can use the Joy command
      <br>
      <pre>        "TEST.JOY"  edit
    </pre>
      This calls the <kbd>edit</kbd> operator to make a duplicate of the string <kbd>"TEST.JOY"</kbd>. One copy
      is concatenated with the <kbd>editor</kbd> string, and the result passed on to the system. That will call my
      favourite editor to edit the file. When the editing is finished, the original string <kbd>"TEST.JOY"</kbd> is
      used to include the edited file. Note that other users might put a different name of their editor in their own
      <kbd>USRLIB.JOY</kbd>. For example, Unix users would probably put
      <br>
      <pre>        editor  ==  "vi "
    </pre>
      The <em>definition</em> of <kbd>edit</kbd> in <kbd>STDLIB.JOY</kbd> remains unchanged.
    </kb>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>