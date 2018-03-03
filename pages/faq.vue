<template>
  <main>
    Contents:
    <ol>
      <li>"What is a functional language ?"</li>
      <li>"What really is expression evaluation ?"</li>
      <li>"What is an applicative functional language ?"</li>
      <li>"Do functional languages need function application ?"</li>
      <li>"What might a compositional functional language be ?"</li>
      <li>"What is a concatenative functional language ?"</li>
      <li>"Why distinguish between postfix and concatenative notation ?"</li>
      <li>"What is an environment ?"</li>
      <li>"Is an environment needed ?"</li>
      <li>"What about second order functions in a concatenative language ?"</li>
      <li>"What is the difference between a list and a quotation ?"</li>
      <li>"So, what is Joy ?"</li>
      <li>"Where can I find out more about Joy ?"</li>
    </ol>
    <h2>"What is a functional language ?"</h2>
    The programs of functional languages are expressions, and
    computation proceeds by evaluating expressions.
    Functional languages differ from mainstream imperative languages
    (C, C++, Pascal, Ada) in one respect:
    imperative languages have assignment statements,
    which are commands to change the state, a collection
    of assignable variables.
    Functional languages have no state and hence no assignment statements.
    <p>
      One of the simplest functional languages is the one we encountered
      in primary school, the language of arithmetical expressions.
      We learnt how to do evaluations such as the following:
    </p>
    <pre>   (2 + 3)  *  (7 - 4)
           5     *  (7 - 4)
           5     *     3
           15
    </pre>
    Note that the evaluation steps in the second and third line
    could have been interchanged or even done in parallel.
    In contrast, in imperative languages it is not always possible
    to execute assignment statements in arbitrary order.
    <p>
      Expressions need not be numerical, subexpressions can be of
      different types, and the operations can be unary.
      In the following the only operand is a list of numbers,
      here writen inside square brackets.
    </p>
    <pre>(1)    square(  size(  rest( [11 22 33] ) ) )
        square(  size(  [22 33]            ) )
        square(  2                           )
        4
    </pre>
    This will serve as the running example in most of the remaining
    sections.
    <h2>"What really is expression evaluation ?"</h2>
    In the previous section the first example was a numerical expression:<br>
    <pre>   (2 + 3)  *  (7 - 4)
    </pre>
    The whole expression, the two parenthesised subexpressions, the four
    single digit numerals and the final two digit end result - all of them
    denote numbers.
    The three symbols "+", "*" and "-" are infix operators which denote binary
    functions from two numbers to give a result number.
    <p>
      In the second example:<br>
    </p>
    <pre>(1)    square(  size(  rest( [11 22 33] ) ) )
    </pre>
    the symbol "[11 22 33]" denotes
    a list of three elements which happen to be numbers.
    The symbol "rest" denotes a unary function from lists to lists,
    the symbol "size" denotes a unary function from lists to numbers,
    and "square" denotes a unary function from numbers to numbers.
    <p>
      In both examples all lines of the evaluation denote the same number,
      the end results 15 and 4 respectively.
      Alternatively we say that all lines have the same value.
      So, single symbols denote all sorts of things, numbers, lists and
      various functions.
      Expressions always denote, or have, values.
    </p>
    <p>
      Denotations and values are semantic notions, and so is evaluation,
      the end result of the process of finding the value.
      By that we mean finding an expression that does not contain function
      or operator symbols, but has the same value.
      Typically, though by no means always, the final expression is shorter
      than the original.
    </p>
    <p>
      The actual evaluation process, however, is purely syntactic,
      it is just a matter of rewriting the given expression in accordance
      with certain rules.
      The rewriting rules are essentially derived from the semantics,
      but using the rules is a purely syntactic process.
      One can do it without knowing what the symbols mean,
      even without understanding the difference between a symbol
      and what it denotes.
      Most of us understood the difference between a numeral and a number
      only when we encountered notations to bases other than ten.
      (I am told that one textbook says that computers use
      hexadecimal numbers as addresses, which is nonsense.)
    </p>
    <p>
      The difference between a symbol and what it denotes will become
      important in what follows.
      This is because in Joy many symbols look more or less familiar,
      but there is an important difference between what they denote conventionally
      and what they denote in Joy.
      One can learn to program in Joy barely noticing the difference,
      but there is a deep shift in denotation.
      Some people might speak of a "paradigm shift",
      but I would be reluctant to use the term here.
    </p>
    <h2>"What is an applicative functional language ?"</h2>
    All but the simplest functional languages at least internally use
    a binary application operator which here will be written with an
    explicit infix symbol "@".
    An expression of the form "f @ x" is to be read as "the function f
    applied to the argument x".
    The value of that expression is exactly the same as the value of "f(x)".
    The evaluation of the running example now looks like this:
    <pre>(2)    square  @  (size  @  (rest  @  [11 22 33]) )
        square  @  (size  @  [22 33]               )
        square  @  2
        4
    </pre>
    <p>
      Application is a second order function because one of its arguments,
      the one written on the left, is itself a function.
      The reason for hiding the explicit symbol "@" externally
      is that it just adds to the syntactic complexity.
      The reason for introducing application internaly will be explained
      in Section 4.
    </p>
    <p>
      The best known applicative functional languages are:
    </p>
    <ul>
      <li>Lisp and Scheme (dynamic typing, strict of "eager")</li>
      <li>ML (static typing, strict or "eager")</li>
      <li>Erlang (optional static typing, strict or "eager")</li>
      <li>Miranda and Haskell (static typing, nonstrict or "lazy")</li>
    </ul>
    Lisp, Scheme and ML are actually impure functional languages
    because they have assignment statements.
    <h2>"Do functional languages need function application ?"</h2>
    Because applicative functional languages have the higher order
    application function, it is possible to define other higher order
    functions.
    One example is the composition function,
    a binary operation on unary functions.
    Notationally it is often written in infix,
    using a small circle, or "o", or ".", as here.
    The definition is
    <pre>   (f . g)  @  x   ==   f  @  (g  @  x)
    </pre>
    Since the "f" and the "g" appear in the same order on the left
    side as in the applicative expression on the right,
    this is sometimes called "applictive order" notation for composition.
    <p>
      The functions in the running examples are all unary,
      so it can be written in two ways:
    </p>
    <pre>   (square  .  (size  .  rest))   @   [11 22 33]
        ((square  .  size)  .  rest)   @   [11 22 33]
    </pre>
    Function composition is in fact associative, and hence the two
    have the same value. So the running example might as well be written
    without the inner parentheses as
    <pre>(3)    (square  .  size  .  rest)   @   [11 22 33]
    </pre>
    The change to function composition has eliminated the first two
    occurrences of "@" in (2) of the previous section.
    <p>
      Application is not associative,
      and apart from being a function it has no formal properties at all.
      Could the last application "@" also be eliminated and turned into
      composition?
      Clearly not, because "[11 22 33]" does not denote a unary function.
      Therefore it seems that functional languages need application.
    </p>
    <h2>"What might a compositional functional language be ?"</h2>
    Suppose the expression "[11 22 33]" could denote a unary function,
    just as "square", "size" and "rest" do.
    Then the running example  would be written
    <pre>(4)    square  .  size  .  rest  .  [11 22 33]
    </pre>
    The entire composition would have to be applied to a suitable
    suppressed argument.
    <p>
      One suitable argument is a stack which is initially empty.
      Then "[11 22 33]" denotes not a list but a stack function which
      pushes a list. Similarly "square", "size" and "rest" would denote
      stack functions which replace the top element of the stack.
      The previous result, "4", denotes not a number but a stack
      function which pushes a number.
      Then all five symbols denote unary functions from stacks to stacks.
      What normally are binary operators "+" and "*" for addition and
      multiplication now also denote unary stack functions,
      they replace the top two elements of the stack by a single one.
      The idea is simple enough, and it is one of the key features of Joy.
    </p>
    <p>
      An alternative for function composition would use a reverse notation.
      It is sometimes defined using an infix operator, say ";",
      instead of the previous ".":
    </p>
    <pre>   (f ; g)  @  x   ==   g  @  (f  @  x)
    </pre>
    This is is known as "diagrammatic order" notation for composition.
    Then the running example would be written
    <pre>(5)    [11 22 33]  ;  rest  ;  size  ;  square
    </pre>
    One advantage of this notation is that the order in the notation
    reflects the order of the execution.
    <p>
      Any functional language which completely replaces
      application, by explicit or implicit "@",
      by composition, with explicit or implicit "." or ";",
      might be called a <b>compositional</b> functional language.
    </p>
    <h2>"What is a concatenative functional language ?"</h2>
    An applicative functional language is based on the higher order
    function of application.
    A compositional functional language is based on the higher order
    function of composition.
    Either kind of language might have other kinds of higher order functions.
    <p>
      Here is an example: the squaring function can be <b>map</b>ped over the
      elements of a list [1 2 3] to yield the result [1 4 9].
      In a compositional language one might write
    </p>
    <pre>   [1 2 3]  map  square
    </pre>
    where "map" is an  infix operator just like ";".
    Now "[1 2 3]" and "square" denote unary stack functions, and the two are
    transformed by the higher order mapping function into another
    unary stack function, the one denoted by "[1 4 9]".
    <p>
      With two distinct infix operators ";" and "map",
      there arises the possibility of expressions containing both.
      Typically it will be necessary to use parentheses too, as in
      the following:
    </p>
    <pre> ([1 2 3]  ;  rest)  map  square
      ([1 2 3]  map  square)  ;  rest
    </pre>
    It so happens that the two expressions denote the same function,
    the one denoted by "[4 9]".
    <p>
      Functional languages need the mapping function and several others,
      especially a conditional, or "if-then-else" of some kind.
      However, if a compositional language has no other function operator,
      then there is no point in ever writing the ";".
      The running example would now be written as
    </p>
    <pre>(6)    [11 22 33]   rest   size   square
    </pre>
    Now the concatenation of any consecutive two or three or all four
    of the parts of (6) denote the composition of the stack functions
    tht the parts denote.
    This is a desirable consequence.
    But it must not come at the price of not being able to express
    other higher order functions such as the mapping function or
    the conditional or the many others that a mature language needs.
    The topic is resumed in section 10.
    <p>
      A language in which the concatenation of programs denote
      the composition of functions has been called a <b>concatenative</b>
      language.
      I first heard this terminology from Billy Tanksley.
    </p>
    <h2>"Why distinguish between postfix and concatenative notation ?"</h2>
    The running example (6) looks just like postfix notation:
    the operand is [11 22 33]  and there are three unary operators.
    Similarly the first example in section 1 could be written
    in postfix as
    <pre>   2   3   +   4   7   -   *
    </pre>
    with four number operands and three binary operators.
    Just as in the evaluation of the original infix expression,
    the addition and the subtraction could be done in any order,
    even simultaneously.
    Just as in the original infix expression,
    the whole expression, the two subexpressions, the four single
    digit numerals - all of them denote numbers.
    <p>
      The expression is also correct concatenative notation
      (though not in compositional languages that use ";").
      So what is the difference?
      Consider some consecutive parts such as
    </p>
    <pre> + 3  +        +  4        3  +  4        7  -  *
    </pre>
    These do not denote numbers, they are not postfix expressions.
    However, they are perfectly correct concatenative expressions,
    each denoting, as always, unary functions from stacks to stacks.
    <p>
      The difference between postfix notation and concatenative notation
      becomes even more obvious in the following.
      The square of a number is just the number multiplied with
      a <b>dup</b>licate of itself.
      Let "dup" denote a stack function which <b>dup</b>licates
      the top element of the stack.
      So the running example might be written as
    </p>
    <pre>(7)    [11 22 33]   rest   size   dup   *
    </pre>
    The duplication operator only makes sense in compositional
    languages that use a stack (or perhaps something similar),
    and hence also in concatenative languages.
    Two others are for <b>pop</b>ping off the top element of the
    stack and for <b>swap</b>ping the top two elements.
    <p>
      Postfix notation is used in some pocket calculators.
      Concatenative notation is used in Forth, Postscript and Joy.
      The unix utility <b>dc</b> (which similates a <b>d</b>esk
      <b>c</b>alculator) is often described as using postfix,
      but the presence of a duplication operator d actually
      makes it concatenative.
      The two other stack manipulators are easily defined in <b>dc</b>.
    </p>
    <h2>"What is an environment ?"</h2>
    The squaring function can be defined in just about any programming
    language.
    In infix notation the external definition might look similar to this:
    <pre>   square(x)   ==   x  *  x
    </pre>
    Internally, and possibly externally too, the definition would be<br>
    <pre>   square   ==   Lx :  x * x
    </pre>
    where "Lx" is sometimes written "\x" or "lambda x" or "fun x".
    The expression on the right side of the definition then is to be read as
    "the function of one argument x which yields the value x * x".
    An expression like that is known as a <b>lambda abstraction</b>.
    <p>
      Such a definition would be used as in the evaluation<br>
    </p>
    <pre>         square  @  2
        (Lx : x * x)  @  2
              2 * 2
          4
    </pre>
    In the second line "square" is being replaced by its definition.
    This sets up an environment in which x = 2,
    in which the formal parameter x has been given the value of the
    actual parameter 2.
    An environment is a collection of associations of formal and actual
    parameters.
    In all but the simplest cases the environment will contain several such
    associations.
    In the third line this environment is used to replace the formal
    parameter x by the actual parameter 2.
    All this is completely hidden from the user when the
    first style of definition is used.
    <p>
      The two operations of lambda abstraction and application are
      complementary.
      They form the heart of the lambda calculus which
      underlies all the mainstream functional languages.
    </p>
    <h2>"Is an environment needed ?"</h2>
    The previous definitions of the squaring function
    as a lambda abstraction might be written in postfix or concatenative
    notation as
    <pre>   square   ==   Lx :  x  x  *
        square   ==   Ls :  x  dup  *
    </pre>
    For a compostional (and hence for concatenative) language
    the right hand side has to be read as
    "the stack function for stacks in which there is a top element x
    and which for stacks without that top element yields the same
    result as x dup *".
    But one might also write without the explicit lambda abstraction as<br>
    <pre>   x  square   ==   x  x  *
        x  square   ==   x  dup  *
    </pre>
    <p>
      In the last of these both sides start with the formal paramater x,
      and otherwise there are no further occurrences of x on either side.
      Would it be possible for the two occurrences on the left and right
      to "cancel out", so to speak?
      Yes indeed, and now the definition looks loke this:
    </p>
    <pre>   square   ==   dup  *
    </pre>
    <p>
      The full evaluation of the running example now looks like this:<br>
    </p>
    <pre>(8)    [11 22 33]   rest   size   square
            [22 33]   size   square
                   2   square
                   2   dup   *
                   2   2   *
                   4
    </pre>
    Note how in line four the substitution of the right hand side of
    the definition is a simple textual substitution.
    <p>
      The mainstream imperative languages have a <b>state</b> of associations
      between assignable variables and their current values.
      The values are changed by assignments during the run of the
      program.
      These languages also have an environment of formal / actual
      parameter associations that are set up by calls of defined
      functions or procedures.
      Purely functional languages have no state,
      but at least the mainstream applicative functional languages
      invariably have an environment.
      Compositional functional languages and hence concatenative
      functional languages have no state and need no environment.
      The concatenative language Joy has neither.
    </p>
    <h2>"What about second order functions in a concatenative language ?"</h2>
    A concatenative language has an all but invisible second order
    function of function composition.
    In section 6 it was emphasised that there are many other second
    order functions that have to be fitted into the concatenative model.
    One of the second order functions mentioned there was the mapping function.
    The list [1 2 3] can be mapped by the squaring function to yield the
    list [1 4 9].
    In concatenative syntax one can use either of these:
    <pre>   [1 2 3]   [square]   map
        [1 2 3]   [dup  *]   map
    </pre>
    Both lines are concatenations of three parts:
    (a) "[1 2 3]" which denotes a stack function to push a list,
    (b) "[square]" or "[dup *]" which denotes a stack function to
    push a "quoted" program without executing it, and
    (c) "map" which denotes a stack function to use the program
    from (b) on each member of the list from (a) to produce a list
    of the same size.
    Note that the second version was obtained from the first by
    simple textual substitution in accordance with the definition
    of "square".
    <p>
      The map function in Joy does all the work of a second order function,
      but actually it is a first order stack funnction like all others in Joy.
      It expects a stack whose top two elements are a list and a quoted program
      and it leaves behind a new list.
      The program is protected from execution by being enclosed in
      square brackets, and in this form it is called a quotation.
    </p>
    <p>
      Because the mapping function is only first order,
      it is possible to write
    </p>
    <pre> [1 2 3]    [ [dup *] [dup dup * *] ]    [map]    map
    </pre>
    which leaves [ [1 4 9] [1 8 27] ] on top of the stack,
    and below that the original [1 2 3].
    <p>
      Another common word for higher order function
      is "combinator", but in Joy it is used for what are really
      first order functions.
      Apart from "map", Joy has a large number of combinators,
      and in programming they are used more often that in other
      languages.
    </p>
    <h2>"What is the difference between a list and a quotation ?"</h2>
    Lists and quotations use square brackets to enclose something -
    or possibly nothing.
    Isn't that confusing? 
    Would it not be better to use a different notation for the two?
    <p>
      Lists are passive data structures that can be manipulated
      for eample by the rest operation.
      There are quite a few other well known list manipulation
      operations for building up lists, combining lists, and for
      taking them apart.
    </p>
    <p>
      Quotations are potentially active programs that can be passed
      as parameters to be eventually activated by combinators such as map.
      There are many other combinators in Joy.
      Some of them are similar to well known counterparts
      in other languages.
      But many of them are unique to Joy and do not make much sense elsewhere.
    </p>
    <p>
      So, why use the same notation for lists and quotations?
      The reason is that fundamentally they really are the same.
    </p>
    <p>
      On the one hand consider the program<br>
    </p>
    <pre>   [1 2 3]   [4 5]   map
    </pre>
    The first list is used as the passive data structure,
    and at the very least its size, 3, determines the size
    of the result list of the program.
    The second list is the quotation.
    When activated by the map combinator three times,
    it will ignore the three arguments 1 or 2 or 3,
    and in each case simply push 4 and 5 on top.
    Whatever is on top will be the element of the result list,
    and that is the same on all three occasions.
    So the result list is [5 5 5].
    <p>
      On the other hand, and more usefully,
      any list processing operation can be used on quotations.
      Consider
    </p>
    <pre>   [1 2 3]   [dup * dup *]   map
    </pre>
    which will compute the fourth powers of the elements of the list.
    Removing the first two parts of the quotation first,
    <pre>   [1 2 3]   [dup * dup *]   rest  rest  map
    </pre>
    will compute the second powers of the elements of the list.
    <p>
      Instead of taking a quotation apart, with the rest operation,
      a more likely scenario is that a quotation is first constructed,
      possibly in several steps, and then used by a combinator.
      Many Joy programs do just that.
    </p>
    <p>
      The following two programs compute the same function:<br>
    </p>
    <pre> [dup *]  map      [square]  map
    </pre>
    because the quotations compute the same function.
    At the same time, of course,
    <pre> [dup *]  size     [square]  size
    </pre>
    give different results, 2 and 1, because as lists they are different.
    <p>
      So it is useful to speak of lists as passive data structures
      and quotations as inactive programs that might be activated
      by a combinator.
    </p>
    <h2>"So, what is Joy ?"</h2>
    What are the essentials of Joy?
    <ol>
      <li>Joy is a purely functional language, so there is no state
        and hence no assignment.
      </li>
      <li>Joy programs denote unary functions from stacks to stacks.</li>
      <li>Joy uses concatenative notation, so the concatenation
        of programs denotes the composition of the functions which the
        programs denote.
      </li>
      <li>Definitions do not use formal parameters, so there is no
        environment of associations.
      </li>
      <li>Combinators do the work of higher order functions,
        they take quoted programs as parameters.
      </li>
      <li>Lists are a special case of quotations, and both can be
        manipulated in the same way. So, as in Lisp, program = data.
      </li>
    </ol>
    <p>
      Apart from what is in this FAQ, what else does Joy have?
    </p>
    <ol>
      <li>Atomic data: logical values, characters, integers, floats,
        files.
      </li>
      <li>Aggregate data: strings (of characters), sets of numbers (0...31),
        Quotations or lists (of anything, even recursively)
      </li>
      <li>Operations on data elements, and polymorphic operations on aggregates.</li>
      <li>Many combinators, including some polymorphic ones for aggregates,
        and many for common recursion patterns.
      </li>
      <li>Several standard libraries, with varying specialisation.</li>
    </ol>
    <p>
      How does one think about Joy programs?
      There are three useful styles:
    </p>
    <ol>
      <li>
        Imperative: programs are commands to modify the stack.
        <ul>
          <li>e.g. "5" means: push the number 5 !
          </li>
          <li>e.g. "+" means: add the top two numbers !
          </li>
        </ul>
      </li>
      <li>
        Semantic: programs denote unary functions from stacks to stacks.
        <ul>
          <li>e.g. "5" denotes the functions which yields a new stack
            with the number 5 on top.
          </li>
          <li>e.g. "+" denotes the function which yields a new stack
            with the top two numbers replaced by their sum.
          </li>
        </ul>
      </li>
      <li>
        Syntactic: programs are mere text to be evaluated by rewriting.
        <ul>
          <li>e.g. "5" can be only be part of an expression to be rewritten
          </li>
          <li>e.g. "+" is used in rewriting, so "5 3 +" is rewritten "8"
          </li>
        </ul>
      </li>
    </ol>
    The three explicit or conscious ways of thinking will,
    after some exposure and experience,
    merge into a single unified unconscious whole.
    <p>
      Any questions?
    </p>
    <ul>
      <li>🡥 <a href="http://www.cs.nott.ac.uk/~pszgmh//faq.html" target="_blank">
        FAQ for comp.lang.functional</a> Functional languages in general
      </li>
      <li>
        Maybe
        <nuxt-link to="faq-part-2">
          Further Frequently Asked Questions about Joy
        </nuxt-link>
        <br>
      </li>
    </ul>
  </main>
</template>

<style src="~/assets/main-articles.css" scoped>
</style>