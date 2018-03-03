<template>
  <main>
    <title>Overview of the language JOY</title>
    <h1>Overview of the language JOY</h1>
    Joy is a functional programming language which is significantly
    different from other programming languages of that kind.  This paper
    provides an overview of most of its practical and theoretical aspects.
    <p>
      To add two integers, say 2 and 3, and to write their sum, you type the
      program
    </p>
    <pre>        2  3  +
    </pre>
    This is how it works internally: the first numeral causes the integer
    2 to be pushed onto a stack.  The second numeral causes the integer 3
    to be pushed on top of that.  Then the addition operator pops the two
    integers off the stack and pushes their sum, 5.
    The system reads inputs like the above and executes them when
    they are terminated by a period <code>"."</code>, like this:
    <pre>        2  3  + .
    </pre>
    In the default mode there is no need for an explicit output instruction,
    so the numeral <code>5</code> is now written to the output file which
    normally is the screen. So, in the default mode the terminating
    <code>"."</code> may be taken to be an instruction to write the
    top element of the stack. In what follows the terminating period will
    not be shown any further.
    <p>
      To compute the square of an integer, it has to be multiplied by
      itself.  To compute the square of the sum of two integers, the sum has
      to be multiplied by itself.  Preferably this should be done without
      computing the sum twice.
      The following is a program to compute the square of the sum of 2 and 3:
    </p>
    <pre>        2  3  +  dup  *
    </pre>
    After the sum of 2 and 3 has been computed, the stack just contains
    the integer 5.  The <kbd>dup</kbd> operator then pushes another copy
    of the 5 onto the stack.  Then the multiplication operator replaces
    the two integers by their product, which is the square of 5.  The
    square is then written out as 25.  Apart from the <code>dup</code>
    operator there are several others for re-arranging the top of the
    stack.  The <kbd>pop</kbd> operator removes the top element, and the
    <kbd>swap</kbd> operator interchanges the top two elements.
    <p>
      A <em>list</em> of integers is written inside square brackets.  Just
      as integers can be added and otherwise manipulated, so lists can be
      manipulated in various ways.  The following <kbd>concat</kbd>enates
      two lists:
    </p>
    <pre>        [1 2 3]  [4 5 6 7]  concat
    </pre>
    The two lists are first pushed onto the stack.  Then the
    <code>concat</code> operator pops them off the stack and pushes the
    list <code>[1 2 3 4 5 6 7]</code> onto the stack.  There it may be
    further manipulated or it may be written to the output file.
    <p>
      Joy makes extensive use of <em>combinator</em>s.  These are like
      operators in that they expect something specific on top of the stack.
      But unlike operators they execute what they find on top of the stack,
      and this has to be the <em>quotation</em> of a program, enclosed in
      square brackets.  One of these is a combinator for <kbd>map</kbd>ping
      elements of one list via a function to another list.  Consider the
      program
    </p>
    <pre>        [1 2 3 4]  [dup *]  map
    </pre>
    It first pushes the list of integers and then the quoted program onto
    the stack.  The <code>map</code> combinator then removes the list and
    the quotation and constructs another list by applying the program to
    each member of the given list.  The result is the list <code>[1 4 9
    16]</code> which is left on top of the stack.
    <p>
      In <em>definition</em>s of new functions no formal parameters are
      used, and hence there is no substitution of actual parameters for
      formal parameters.  After the following definition
    </p>
    <pre>        square   ==   dup  *
    </pre>
    the symbol <code>square</code> can be used in place of <code> dup *
    </code>.
    <p>
      As in other programming languages, definitions may be recursive, for
      example in the definition of the factorial function.  That definition
      uses a certain recursive pattern that is useful elsewhere.  In Joy
      there is a combinator for <em>primitive recursion</em> which has this
      pattern built in and thus avoids the need for a definition.  The
      <kbd>primrec</kbd> combinator expects two quoted programs in addition
      to a data parameter.  For an integer data parameter it works like
      this: If the data parameter is zero, then the first quotation has to
      produce the value to be returned.  If the data parameter is positive
      then the second has to combine the data parameter with the result of
      applying the function to its predecessor.  For the factorial function
      the required quoted programs are very simple:
    </p>
    <pre>        [1]  [*]  primrec
    </pre>
    computes the factorial recursively.  There is no need for any
    definition.
    For example, the following program computes the factorial of
    <code>5</code>:
    <pre>        5  [1]  [*]  primrec
    </pre>
    It first pushes the number <code>5</code> and then it pushes the two
    short quoted programs.  At this point the stack contains three
    elements.  Then the <code>primrec</code> combinator is executed.  It
    pops the two quotations off the stack and saves them elsewhere.  Then
    <code>primrec</code> tests whether the top element on the stack
    (initially the <code>5</code>) is equal to zero.  If it is, it pops it
    off and executes one of the quotations, the <code>[1]</code> which
    leaves <code>1</code> on the stack as the result.  Otherwise it pushes
    a decremented copy of the top element and recurses. On the way back
    from the recursion it uses the other quotation, <code>[*]</code>, to
    multiply what is now a factorial on top of the stack by the second
    element on the stack.  When all is done, the stack contains
    <code>120</code>, the factorial of <code>5</code>.
    <p>
      As may be seen from this program, the usual branching of recursive
      definitions is built into the combinator.  The <code>primrec</code>
      combinator can be used with many other quotation parameters to compute
      quite different functions.  It can also be used with data types other
      than integers.
      Joy has many more combinators which can be used to calculate many
      functions without forcing the user to give recursive or non-recursive
      definitions.  Some of the combinators are more data-specific than
      <code>primrec</code>, and others are far more general.
    </p>
    <p>
      Joy programs are built from smaller programs by just two operations:
      <em>concatenation</em> and <em>quotation</em>.
      Concatenation is a binary operation, and since it is associative it is
      best written in infix notation and hence no parentheses are required.
      Since concatenation is the only binary operation of its kind, in Joy
      it is best written without an explicit symbol.
      Quotation is a unary operation which takes as its operand a program.
      In Joy the quotation of a program is written by enclosing it in square
      brackets.  Ultimately all programs are built from atomic programs
      which do not have any parts.
      The semantics of Joy has to explain what the atomic programs mean, how
      the meaning of a concatenated program depends on the meaning of its
      parts, and what the meaning of a quoted program is.  Moreover, it has
      to explain under what conditions it is possible to replace a part by
      an equivalent part while retaining the meaning of the whole program.
    </p>
    <p>
      Joy programs denote functions which take one argument and yield one
      value.  The argument and the value are <em>state</em>s consisting of
      at least three components.  The principal component is a
      <em>stack</em>, and the other components are not needed here.  Much of
      the detail of the semantics of Joy depends on specific properties of
      programs.  However, central to the semantics of Joy is the following:
      The concatenation of two programs denotes
      the composition of the functions denoted by the two programs.
      Function composition is associative, and hence denotation maps the
      associative syntactic operation of program concatenation onto the
      associative semantic operation of function composition.  The quotation
      of a program denotes a function which takes any state as argument and
      yields as value the same state except that the quotation is pushed
      onto the stack.
      One part of a concatenation may be replaced by another part denoting
      the same function while retaining the denotation of the whole
      concatenation.
      One quoted program may be replaced by another denoting the same
      function only in a context where the quoted program will be dequoted
      by being executed.  Such contexts are provided by the
      <em>combinator</em>s of Joy.  These denote functions which behave like
      higher order functions in other languages.
    </p>
    <p>
      The above may be summarised as follows: Let <code>P</code>,
      <code>Q1</code>, <code>Q2</code> and <code>R</code> be programs, and
      let <code>C</code> be a combinator.  Then this principle holds:
    </p>
    <pre>        IF          Q1      ==      Q2
            THEN     P  Q1  R   ==   P  Q2  R
            AND        [Q1] C   ==     [Q2] C
    </pre>
    The principle is the prime rule of inference for the <em>algebra of
    Joy</em> which deals with the equivalence of Joy programs, and hence
    with the identity of functions denoted by such programs.  A few laws
    in the algebra can be expressed without combinators, but most require
    one or more combinators for their expression.
    <p>
      Joy programs denote functions which take <em>state</em>s as arguments
      and as values.  Programs are built from atomic programs which also
      denote functions which take states as arguments and as values.
      The meaning of compound programs has to be given in terms of the
      meanings of atomic programs.  It is useful to classify atomic programs
      into categories depending on what kind of function they denote.  A
      coarse classification distinguishes just three, called
    </p>
    <ol>
      <li>the <em>literal</em>s,
      </li>
      <li>the <em>operator</em>s and 
      </li>
      <li>the <em>combinator</em>s.
      </li>
    </ol>
    <p>
      Firstly, the <em>literal</em> atomic programs are those which look
      like constants in conventional languages.  They comprise literal
      numbers (or, more correctly, numerals) such as integers, and other
      literals of type character, string, truth value and set.  Literals do
      not denote numbers, characters, strings and so on, but they denote
      functions which take one state as argument and yield as value another
      state which is like the argument state except that the value of the
      literal has been pushed onto the stack component.
    </p>
    <p>
      Secondly, the <em>operator</em> atoms are those which look like <em>
      n</em>-ary operators in other languages.  They include the operations
      such as for addition and the other arithmetical operations, and for
      the various operations on other types.  Like all programs, operators
      denote functions from states to states, but the functions are not
      defined on all states.  An <em> n</em>-ary operator (such as the
      binary addition operator) denotes a function which is defined only on
      states whose stack component has <em> n</em> items (such as two
      integers) on top.
      The function yields as value another state which is like the argument
      state except that the <em> n</em> items on the stack have been
      replaced by the result (such as the sum).
      Also included as operators are those atoms denoting mere structural
      functions of the stack component such as <code>dup</code>,
      <code>swap</code> and <code>pop</code>, and those that involve input
      and output such as <code>get</code> and <code>put</code>.
    </p>
    <p>
      Thirdly, the <em>combinator</em> atoms are like operators in that they
      require the top of the stack to contain certain items.  But unlike
      operators, they do not treat these items as passive data.  Instead
      they execute these items - and hence those items must be quoted
      programs.  So, combinators also denote functions which are defined
      only on states having the appropriate number of quoted programs on top
      of the stack.  They yield as values another state which depends on the
      argument state, including the quoted programs, and on the combinator
      itself.
    </p>
    <p>
      Literals, operators and combinators can be concatenated to form
      <em>program</em>s.  These may then be enclosed in square brackets to
      form literal <em>quotation</em>s.  Such literals are not atomic, but
      if they occur in a program they are treated just like other literals:
      they cause the quoted program to be pushed onto the stack.  So,
      literal quotations denote functions which take any stack as argument
      and yield as value another stack which is like the argument stack
      except that it has the quotation pushed on top.  Quotations on top of
      the stack can be treated like other values, they can be manipulated,
      taken apart and combined, but they can also be executed by
      combinators.  If a quotation contains only literals, then it is a
      <em>list</em>.  The component literals do not have to be of the same
      type, and they may include further quotations.  If a list is executed
      by a combinator, then its components are pushed onto the stack.
    </p>
    <p>
      Concatenation of Joy programs denote the composition of the functions
      which the concatenated parts denote.  Hence if <code> Q1 </code> and
      <code> Q2 </code> are programs which denote the same function and
      <code> P </code> and <code> R </code> are other programs, then the two
      concatenations <code> P Q1 R </code> and <code> P Q2 R </code> also
      denote the same function.  In other words, programs <code> Q1 </code>
      and <code> Q2 </code> can replace each other in concatenations.  This
      can serve as a rule of inference for <em>rewriting</em>.
      As premises one needs axioms such as in the first three lines below,
      and definitions such as in the fourth line:
    </p>
    <pre>(+)                2  3  +   ==   5
    (dup)              5  dup   ==   5  5
    (*)                5  5  *   ==   25
    (def square)       square  ==  dup *
    </pre>
    A derivation using the above axioms and the definition looks like this:
    <pre>                   2  3  +  square
               ==      5  square                               (+)
               ==      5  dup  *                               (def square)
               ==      5  5  *                                 (dup)
               ==      25                                      (*)
    </pre>
    The comments in the right margin explain how a line was obtained from
    the previous line.  The derivation shows that the expressions in the
    first line and the last line denote the same function, or that the
    function in the first line is identical with the function in the last
    line.
    <p>
      Consider the following equations in infix notation:The first says that
      multiplying a number <code>x</code> by 2 gives the same result as
      adding it to itself.  The second says that the <kbd>size</kbd> of a
      <kbd>reverse</kbd>d list is the same as the <code>size</code> of the
      original list.
    </p>
    <pre>        2 * x  =  x + x                 size(reverse(x))  =  size(x)
    </pre>
    In Joy the same equations would be written, <em> without
    variables</em>, like this:
    <pre>        2  *   ==   dup  +              reverse  size   ==   size
    </pre>
    <p>
      Other equivalences express algebraic properties of various operations.
      For example, the predecessor <kbd>pred</kbd> of the successor
      <kbd>succ</kbd> of a number is just the number itself.  The
      conjunction <kbd>and</kbd> of a truth value with itself gives just the
      truth value.  The less than relation <code>&lt;</code> is the converse of
      the greater than relation <code>&gt;</code>.  Inserting a number with
      <kbd>cons</kbd> into a list of numbers and then taking the
      <kbd>sum</kbd> of that gives the same result as first taking the sum
      of the list and then adding the other number.
      In conventional notation these are expressed by
    </p>
    <pre>        pred(succ(x))  =  x             x and x  =  x
            x &lt; y  =  y &gt; x                 sum(cons(x,y))  =  x + sum(y)
    </pre>
    In Joy these are expressed <em> without variables</em>
    <pre>        succ  pred   ==   id            dup  and   ==   id
            &lt;   ==   swap &gt;                 cons  sum   ==   sum  +
    </pre>
    Some properties of operations have to be expressed by combinators.
    One of these is the <kbd>dip</kbd> combinator which expects a program
    on top of the stack and below that another value.  It saves the value,
    executes the program on the remainder of the stack and then restores
    the saved value.
    <p>
      In the first example below, the <code>dip</code> combinator is used to
      express the associativity of addition.  Another combinator is the
      <kbd>app2</kbd> combinator which expects a program on top of the stack
      and below that two values.  It applies the program to the two values.
    </p>
    <p>
      In the second example below it expresses one of the De Morgan laws.
      In the third example it expresses that the <kbd>size</kbd> of two
      lists <kbd>concat</kbd>enated is the sum of the <code>size</code>s of
      the two concatenands.
    </p>
    <p>
      The last example uses both combinators to express that multiplication
      distributes (from the right) over addition.  (Note that the program
      parameter for <code>app2</code> is first constructed from the
      multiplicand and <code>*</code>.)
    </p>
    <pre>        [+]  dip  +   ==   +  +
            and  not   ==   [not]  app2  or
            concat  size   ==   [size]  app2  +
            [+]  dip  *   ==   [*]  cons  app2  +
    </pre>
    <p>
      A deep result in the theory of computability concerns the elimination
      of recursive definitions.  To use the stock example, the
      <em>factorial</em> function can be <em> defined</em> recursively in
      Joy by
    </p>
    <pre>        factorial  ==
                [0 =] [pop 1] [dup 1 - factorial *] ifte
    </pre>
    The definition is then <em> used</em> in programs like this:
    <pre>        5
            factorial
    </pre>
    Because in Joy programs can be manipulated as data, the factorial
    function can also be computed recursively without a recursive
    definition, as follows:
    <pre>        5
            [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            [dup cons] swap concat dup cons i
    </pre>
    The second line in this program does much the same as the body of the
    definition of factorial, but it is a quoted program.  The third line
    first transforms this into another longer quoted program which
    performs "anonymous" recursion, and then the final <kbd>i</kbd>
    combinator essentially dequotes this program causing its execution.
    <p>
      The third line implements Joy's counterpart of the <em>Y</em>
      combinator of the lambda calculus.  Exactly the same line can be used
      to cause anonymous recursion of other functions which are normally
      defined recursively.
    </p>
    <p>
      Joy has other combinators which make recursive execution of programs
      more succinct.  (Of course it is also possible in Joy to compute the
      factorial function more efficiently with iteration instead of
      recursion.)
    </p>
    <p>
      Since Joy is very different from familiar programming languages, it
      takes a while to become used to writing programs in Joy.  One way to
      start the learning process is by way of writing some simple generally
      useful library programs.  In an implementation these may be part of an
      actual library, or they may be built into the language.
    </p>
    <p>
      Some general <em>utility program</em>s include operators for
      manipulating the Joy stack just below the top element, further
      operators for manipulating aggregate values, and a few output
      programs.
    </p>
    <p>
      Generally useful are the <em>stack type</em> and the <em>queue
      type</em>.  Values and operators of these two types are easily
      implemented as Joy lists and list operators.
    </p>
    <p>
      Another collection of useful operators take an aggregate as parameter
      and produce a list of subaggregates.  These operators are
      <em>polymorphic</em> in the sense that the aggregate parameter can be
      a (small) set, a string, or a list.  One such operator can take a set
      as parameter and produces a list of its subsets.  All of these
      operators are definable without recursion by using the
      <kbd>linrec</kbd> combinator.
    </p>
    <p>
      Some <em>arithmetic operators</em> are often used to illustrate
      recursive definitions, although it is well known that iterative
      execution is more efficient.  In particular the use of
      <em>accumulating parameter</em>s can often replace recursion.  This is
      easily done in Joy using various iteration combinators.
    </p>
    <p>
      Values of <em>sequence type</em>s, such as strings and lists, can be
      <em>sort</em>ed, and sorted sequences can be <em>merge</em>d.
      Programs for doing this are easily written in Joy without recursive
      definitions but using appropriate combinators instead.
    </p>
    <p>
      Joy's inbuilt datatype of sets is implemented just as bitstrings, and
      hence it is limited to small sets of small numbers.  The more useful
      <em>big set type</em>, which allows large sets of elements of any
      type, can be implemented in any language which has lists.  It is
      simple to do in Joy, and the usual set-theoretic operations are easily
      provided.  A similar implementation can be used for the <em>dictionary
      type</em>, which uses lookup tables for finite functions.
    </p>
    <p>
      Also useful is the <em>tree type</em>, of lists, or lists of lists, or
      lists of lists of lists ...  of elements other than lists.
    </p>
    <p>
      A <em>rewriting system</em> consists of a set of syntactic rules for
      performing replacements on certain suitable entities.  The best known
      such system is the one we learnt at school for evaluating arithmetic
      expressions.  Any programming language can be given a rewriting
      system, but for Joy it is particularly simple.  The basic binary
      rewriting relation will be written in infix notation as
      "<code>-&gt;</code>", pronounced "can be rewritten as".  The following
      are some sample rules for the <code>+</code> and <code>&lt;</code>
      operators and for the <kbd>dip</kbd> combinator.
    </p>
    <pre>        2  3  +   -&gt;   5
            2  3  &lt;   -&gt;   true
            a  [P]  dip   -&gt;   P  a
    </pre>
    In the last example, <code>P</code> is any program and <code>a</code>
    is any literal (such as a number) or a program whose net effect is to
    push exactly one item onto the stack.  The rewriting relation is
    extended to allow rewriting in appropriate contexts, further extended
    to accomodate several rewriting steps, and finally extended to become
    a congruence relation, an equivalence relation compatible with program
    concatenation.  This congruence relation between programs is
    essentially the same as the identity relation in the algebra of of
    functions which the programs denote.  Although Joy functions take a
    stack as argument and value, in the rewrite rules the stack is never
    mentioned.
    <p>
      The following are rewriting rules for arithmetic expressions in four
      different notations: infix, functional, prefix and postfix:
    </p>
    <pre>        2 + 3  -&gt;  5                    +(2,3)  -&gt;  5
            + 2 3  -&gt;  5                    2 3 +  -&gt;  5
    </pre>
    In each case on the left the operands are <code>2</code> and
    <code>3</code>, and the operator or <em>constructor</em> is
    <code>+</code>, so they all refer to the same arithmetic term.  Since
    Joy uses postfix notation, it might be thought that one should attempt
    a term rewriting system with rules just like the second one in the
    last line.  That would treat the short program <code>2 3 +</code> as
    being composed of two operands and an operator or constructor.  It
    would also treat the gap between <code>2</code> and <code>3</code> as
    quite different from the gap between <code>3</code> and
    <code>+</code>.  The difference would be explained away as a syntactic
    coincidence due to the choice of notation.  Apart from <code>+</code>
    there would be very many term constructors.
    <p>
      However, Joy has operators for manipulating the top few elements of
      the stack, such as <kbd>swap</kbd>, <kbd>dup</kbd> and <kbd>pop</kbd>.
      These are also found in the language <em>Forth</em>.  These operators
      take a stack as argument and yield a stack as value, and their
      presence forces all other operators to be of the same type.  For
      example, the following is a rewrite rule for <kbd>swap</kbd>:
    </p>
    <pre>        a  b  swap   -&gt;   b  a
    </pre>
    Unlike Forth, Joy also has quotations and combinators.  These features
    also force the conclusion that the appropriate rewriting system is a
    string rewriting system.  Consider the following four programs:
    <pre>        [2] [3 +] b                     [2] [3 +] concat i
            [2 3] [+] b                     [2 3] [+] concat i
    </pre>
    They all eventually have to reduce to <code>5</code>, just like the
    earlier Joy program <code>2 3 +</code>.  It suggests that in the
    latter the gaps have to be treated in the same way, the program is a
    concatenation of three atomic symbols, and it denotes the composition
    of three functions.  So, at least for Joy programs without quotations
    and combinators, the appropriate system is a string rewriting system.
    Such a system is equivalent to a term rewriting system with a
    <em>concatenation constructor</em> for programs as the only
    constructor.  To handle combinators, a <em>quotation constructor</em>
    has to be introduced as a second constructor.
    <p>
      The best known functional languages are the <em>lambda calculus</em>
      and, based on it, the programming languages LISP and its descendants.
      All of them rely heavily on two operations, abstraction and
      application, which are in some sense inverses of each other.
      Abstraction binds free variables in an expression, and it yields a
      function which is a first class value.
    </p>
    <p>
      The bound variables are the formal parameters of the function, and,
      importantly, they are named.  Application of an abstracted function to
      some actual parameters can be understood as resulting in a
      substitution of actual for formal parameters and then evaluation of
      the modified expression.  More efficiently application can be
      implemented using an <em>environment</em> of name-value pairs.  The
      lambda calculus does not need definitions, but all functional
      programming languages allow them as a matter of convenience.
      Definitions also use named formal parameters, and in applications
      these have to be substituted or an environment has to be maintained.
    </p>
    <p>
      Two other functional languages are the <em>combinatory logic</em> of
      Curry and the <em>FP</em> language of Backus.
      They are not based on the lambda calculus, they eliminate abstraction
      completely and hence do not have to deal with substitution and
      environments.  As a result these languages can be manipulated using
      simple algebraic techniques.  But like the lambda calculus and the
      languages derived from it, both are based on the application of
      functions to arguments.  However, application does not have attractive
      algebraic properties, and hence there is no theoretical reason for
      preferring one concrete notation over another.  
    </p>
    <p>
      The languages of <em>category</em> theory comprises another group of
      functional languages.  Whereas the other functional languages use
      function application, these use function composition.  No high level
      programming language has been based on this formalism, but it has been
      used as a low level machine language as a target for compilation from
      a (typed) lambda calculus source.  Joy is a high level programming
      language which resembles the categorical languages more than it
      resembles any of the other functional languages.
    </p>
    <p>
      The prototype implementation is written in (K&amp;R) C; it uses a
      simple stop-copy heap management.
    </p>
  </main>
</template>

<style src="~/assets/main-articles.css" scoped>
</style>