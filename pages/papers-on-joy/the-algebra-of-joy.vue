<template>
  <article>
    <h1>The Algebra of Joy</h1>
    <i> by Manfred von Thun </i>
    <p>
      <em>Abstract:</em> Joy is a functional programming language which is not based
      on the application of functions to arguments but on the composition of functions.
      The language makes extensive use of combinators which perform the role of higher
      order functions. The algebra of Joy programs can be used to express formal properties
      of many first and second order functions without using variables ranging over values
      or over functions. Some of these properties are idempotency, inverses, converses,
      commutativity, symmetry, associativity, homomorphisms and distribution. The paper
      also gives several analogues of concepts from category theory.
    </p>
    <p>
      <em>Keywords:</em> functional programming, function composition, algebra of programs,
      monoids, categories, functors, natural transformations, monads.
    </p>
    <hr>
    <h2>Introduction</h2>
    This paper describes a rich algebra of Joy programs which can be used for formal
    manipulation of Joy programs. Concatenation of Joy programs denote the composition
    of the functions which the concatenated parts denote. Hence if <code> Q1 </code>and <code> Q2
    </code> are programs which denote the same function and <code> P
    </code> and <code> R </code> are other programs, then the two concatenations <code> P Q1 R </code>and <code> P Q2 R </code> also denote the same function. In other words, programs
    <code> Q1 </code> and <code> Q2 </code> can replace each other in concatenations.
    This can serve as a rule of inference for <em>rewriting</em>.
    <p>
      As premises one needs axioms such as in the first three lines below, and definitions
      such as in the fourth line:
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
    The comments in the right margin explain how a line was obtained from the
    previous line. The derivation shows that the expressions in the first line and the
    last line denote the same function, or that the function in the first line is identical
    with the function in the last line.
    <p>
      Consider the following equations in infix notation: The first says that multiplying
      a number <code>x</code> by 2 gives the same result as adding it to itself. The
      second says that the <kbd>size</kbd> of a
      <kbd>reverse</kbd>d list is the same as the <code>size</code> of the original list.
    </p>
    <pre>        2 * x  =  x + x                 size(reverse(x))  =  size(x)
    </pre>
    In Joy the same equations would be written, <em> without
    variables</em>, like this:
    <pre>        2  *   ==   dup  +              reverse  size   ==   size
    </pre>
    <p>
      Other equivalences express algebraic properties of various operations. For example,
      the predecessor <kbd>pred</kbd> of the successor
      <kbd>succ</kbd> of a number is just the number itself. The conjunction <kbd>and</kbd>  of a truth value with itself gives just the truth value. The less than relation
      <code>&lt;</code> is the converse of the greater than relation <code>&gt;</code>.
      Inserting a number with
      <kbd>cons</kbd> into a list of numbers and then taking the
      <kbd>sum</kbd> of that gives the same result as first taking the sum of the list
      and then adding the other number.
    </p>
    <p>
      In conventional notation these are expressed by
    </p>
    <pre>        pred(succ(x))  =  x             x and x  =  x
            x &lt;y  =  y &gt; x                 sum(cons(x,y))  =  x + sum(y)
    </pre>
    In Joy these are expressed <em> without variables</em>
    <pre>        succ  pred   ==   id            dup  and   ==   id
            &lt;  ==   swap &gt;                 cons  sum   ==   sum  +
    </pre>
    Some properties of operations have to be expressed by combinators. One of
    these is the <kbd>dip</kbd> combinator which expects a program on top of the stack
    and below that another value. It saves the value, executes the program on the remainder
    of the stack and then restores the saved value.
    <p>
      In the first example below, the <code>dip</code> combinator is used to express
      the associativity of addition. Another combinator is the
      <kbd>app2</kbd> combinator which expects a program on top of the stack and below
      that two values. It applies the program to the two values. In the second example
      below it expresses one of the De Morgan laws. In the third example it expresses
      that the <code>size</code> of two lists <kbd>concat</kbd>enated is the sum of the
      <code>size</code>s of the two concatenands. The last example uses both combinators
      to express that multiplication distributes (from the right) over addition. (Note
      that the program parameter for <code>app2</code> is first constructed from the
      multiplicand and <code>*</code>.)
    </p>
    <pre>        [+]  dip  +   ==   +  +
            and  not   ==   [not]  app2  or
            concat  size   ==   [size]  app2  +
            [+]  dip  *   ==   [*]  cons  app2  +
    </pre>
    <p>
      The remainder of this paper is organised as follows: The next five sections give
      detailed examples of algebraic laws which Joy operators satisfy. All of these laws
      are well known when expressed in familiar notation, what is new here is that they
      can be expressed in Joy notation without the use of implicitly or explicitly universally
      quantified variables. Then follow three sections using concepts from category theory,
      but no previous knowledge is assumed.
    </p>
    <h2>Idempotency, inverses and unit elements</h2>
    A unary function <code>f(x)</code> is said to be <em>idempotent</em> if applying
    it once is "as good as" applying it twice. In conventional notation this means that
    for all <code>x</code>
    <pre>        f(f(x))  =  f(x)
    </pre>
    For example, the function <kbd>abs</kbd> which returns the absolute value
    of a number is idempotent. Another one is the function defined on lists or strings
    which returns a sorted version - sorting an already sorted sequence makes no difference.
    <pre>        abs(abs(n))  =  abs(n)          sort(sort(s))  =  sort(s)
    </pre>
    Composition can be used to express that stack operations are
    <em>idempotent</em>. The following express the idempotency of
    <kbd>abs</kbd> and <kbd>sort</kbd>:
    <pre>        abs abs  ==  abs                sort sort  ==  sort
    </pre>
    Another idempotent Joy function, one which has no counterpart in conventional
    notation, is the <kbd>newstack</kbd> function, it throws away anything that is on
    the stack. Doing it twice in succession gives the same result as doing it once:
    <pre>        newstack  newstack   ==   newstack
    </pre>
    <p>
      The remainder of this section illustrates the use of the <em>identity
      function</em> in Joy algebra. This function is denoted by the symbol
      <kbd>id</kbd>. It has the property that for all programs
      <code>P</code>,
    </p>
    <pre>        id  P   ==   P   ==   P  id
    </pre>
    <p>
      Let <code>f(x)</code> be a unary function. Another unary function
      <code>g(x)</code> is said to be its <em>inverse</em> if for all
      <code>x</code>
    </p>
    <pre>        g(f(x))  =  x
    </pre>
    For example, the predecessor function on integers is the inverse of the successor
    function on integers: for all integers <code>x</code>
    <pre>        pred(succ(x))  =  x
    </pre>
    It may or may not be that if one function is the inverse of a second then
    the second is the inverse of the first. This is true of the predecessor and successor
    functions when defined on integers, but not when defined on natural numbers. The
    identity function can be used to express that one function is the inverse of another
    and that certain values are unit elements.
    <p>
      The atomic program <kbd>succ</kbd> denotes a function which takes a stack as argument
      and yields a stack as value. The argument stack has to have an integer (or a character)
      on top. The value stack is like the argument stack except that the integer (or
      character) has been incremented by 1. The semantics for <kbd>pred</kbd> is analogous,
      it decrements the integer (or character). The following express that the functions
      denoted by the symbols <code>succ</code> and
      <code>pred</code> are <em>inverse</em>s of each other:
    </p>
    <pre>        pred succ  ==  id               succ pred  ==  id
    </pre>
    <p>
      The <kbd>cons</kbd> function expects a list on top of the argument stack. Below
      that it expects another value. The value that is returned is another stack which
      is like the argument stack except that the two top elements of the argument stack
      have been replaced by a new list which has the value inserted into it at the front.
      The
      <kbd>uncons</kbd> function undoes this. It expects a non-empty list and leaves
      the first and the rest of the list. The two functions are inverses of each other:
    </p>
    <pre>        cons uncons  ==  id             uncons cons  ==  id
    </pre>
    It is worth pointing out this cannot be expressed in conventional notation
    because there the <code>uncons</code> operation makes no sense. Actually, both functions
    are polymorphic in that instead of lists they can operate on strings or on sets The
    two equations still hold applied to strings. Only the right equation holds for sets.
    <p>
      The symbols <kbd>pairlist</kbd>, <kbd>pairstring</kbd> and
      <kbd>pairset</kbd> denote functions which expect two potential members of lists,
      strings or sets on top of the stack. They return a new stack with the two members
      replaced by a single list, string or set. The polymorphic <kbd>unpair</kbd> function
      is their inverse, but not vice versa. Since <code>unpair</code> leaves two results,
      the following have no counterpart in conventional notation.
    </p>
    <pre>        pairlist unpair  ==  id
            pairstring unpair  ==  id
            pairset unpair  ==  id
    </pre>
    <p>
      Some functions are inverses of themselves. Examples of
      <em>self-inverse</em> functions are the Boolean negation function and the list
      reversal function: for all Boolean values <code>b</code> and for all lists <code>l</code>
    </p>
    <pre>        not(not(b))  =  b               reverse(reverse(l))  =  l
    </pre>
    In Joy the two unary operators <kbd>not</kbd> and <kbd>reverse</kbd> are polymorphic.
    The <code>not</code> operator expects a truth value or a set on top of the stack
    and returns a stack which has the complementary truth value or set on top of the
    stack. The
    <code>reverse</code> operator expects a list or a string on top of the stack and
    returns a stack which has the reversal the list or string on top of the stack. The
    two functions are self-inverses, and this is expressed by
    <pre>        not not  ==  id                 reverse reverse  ==  id
    </pre>
    <p>
      Let <code>f(x,y)</code> be a binary function. A constant
      <code>c</code> is called a left or right <em>unit element</em> if the first or
      the second equation holds for all <code>x</code>
    </p>
    <pre>        f(c,x)  =  x                    f(x,c)  =  x
    </pre>
    Left and right unit elements often coincide, and then they are just called
    unit elements. In particular, this is true for the unit elements of commutative functions.
    For example, 0 is the unit element for addition, and 1 is the unit element for multiplication.
    In conventional infix notation:
    <pre>        n + 0  =  n  =  0 + n            n * 1  =  n  =  1 * n
    </pre>
    <p>
      The identity function can also be used to express that certain literals are <em>right unit</em>  elements for binary operations: 0 for addition, 1 for multiplication, the <em>empty string</em>
      <code>""</code> or the <em>empty list</em> <code>[]</code> for concatenation, the
      truth value <kbd>false</kbd> and the <em>empty
      set</em> <code>{}</code> for logical disjunction and set union, and the truth value
      <kbd>true</kbd> for logical conjunction.
    </p>
    <pre>        0 +  ==  id                     1 *  ==  id
            "" concat  ==  id               [] concat  ==  id
            false or  ==  id                {} or  ==  id
            true and  ==  id
    </pre>
    <h2>Idempotency, zero elements and arities</h2>
    This section illustrates the <code>dup</code> and <code>pop</code> operators in
    Joy algebra. The Joy operator <kbd>dup</kbd> expects one value on top of the stack
    and pushes a duplicate on top. For example,
    <pre>        42 dup  ==  42 42
    </pre>
    Both sides of the equation denote compositions of two functions. On the left
    the first function pushes a number and the second makes a duplicate of the top element.
    On the right the two functions are the same, each pushes a number. The equation says
    that the function on the left is identical to the one on the right. Both functions
    are defined for all stacks, and both return a stack which is like the argument stack
    except that two copies of the number 42 have been pushed.
    <p>
      A binary function <code>f(x,y)</code> is called <em>idempotent</em> if for all
      <code>x</code>
    </p>
    <pre>        f(x,x)  =  x
    </pre>
    Two examples are the Boolean conjunction and disjunction operations: for all
    <code>b</code>
    <pre>        b and b  =  b                   b or b  =  b
    </pre>
    In Joy the <code>dup</code> operator can express idempotency of the Boolean
    operations <kbd>and</kbd> and <kbd>or</kbd> which are defined for truth values and
    for sets. It can also express the idempotency of the numeric binary <kbd>min</kbd>and <kbd>max</kbd> operators:
    <pre>        dup and  ==  id                 dup or  ==  id
            dup min  ==  id                 dip max  ==  id
    </pre>
    <p>
      The Joy operator <kbd>pop</kbd> expects one value on top of the stack and removes
      it. For example
    </p>
    <pre>        17 42 pop  ==  17
    </pre>
    On the left the composition of three functions first pushes two numbers and
    then pops the second. On the right the function just pushes the first number. The
    two functions are identical since for all argument stacks they have the same result
    stack.
    <p>
      Let <code>f(x,y)</code> be a binary function. A constant
      <code>c</code> is called a left or right <em>zero element</em> of
      <code>f(x,y)</code> if the first or second equation holds for all
      <code>x</code>:
    </p>
    <pre>        f(c,x)  =  c                    f(x,c)  =  c
    </pre>
    For example, the number zero is a left and right zero element for multiplication,
    and in conventional infix notation the laws looks like this:
    <pre>        0 * n  =  0                     n * 0  =  0
    </pre>
    The <code>pop</code> operator can also be used to express that particular
    values are zero elements for binary operations: 0 for multiplication, <code>false</code>and the empty set <code>{}</code> for logical conjunction and set intersection, and
    <code>true</code> for logical disjunction.
    <pre>        0 *  ==  pop 0
            false and  ==  pop false         {} and  ==  pop {}
            true or  ==  pop true
    </pre>
    <p>
      The two operators <code>dup</code> and <code>pop</code> are related by the identity
    </p>
    <pre>        dup pop  ==  id
    </pre>
    The <code>pop</code> operator can also be used to express the
    <em>arity</em> of a function, the number of parameters which it expects. For example,
    numbers are nullary, the successor function is unary, and addition is binary. There
    is no way to express this in conventional notation. In Joy it is expressed by:
    <pre>        42 pop  ==  id        succ pop  ==  pop        + pop  ==  pop pop
    </pre>
    Similar laws express that some operators return two results on the stack:
    <pre>        uncons pop pop  ==  pop        dup pop pop  ==  pop
    </pre>
    <h2>Converses, commutativity and symmetry</h2>
    This section illustrates the use of the <code>swap</code> operator in Joy algebra.
    The Joy operator <kbd>swap</kbd> expects two values of any type on top of the stack;
    its effect is to interchange them. The operator is its own inverse:
    <pre>        swap swap  ==  id
    </pre>
    <p>
      Let <code>f(x,y)</code> be a binary function. Another binary function
      <code>g(x,y)</code> is its <em>converse</em> if for all <code>x</code> and <code>y</code>
    </p>
    <pre>        f(x,y)  =  g(y,x)
    </pre>
    For example, the numeric comparison relation <code>&lt;</code> has as its
    converse the relation <code>&gt;</code>:
    <pre>        (i &lt;j)  =  (j &gt; i)
    </pre>
    In Joy notation the <code>swap</code> operator can express that comparison
    predicates <code>&lt;</code> and <code>&lt;=</code> have as their converses the predicates
    <code>&gt;</code> and <code>&gt;=</code> by the laws
    <pre>        swap &gt;   ==   &lt;                swap &gt;=    ==    &lt;=
    </pre>
    The operator <kbd>swons</kbd> is similar to <code>cons</code>, it expects
    an aggregate and a new value on top of the stack. It leaves a new aggregate with
    the value inserted. But whereas <code>cons</code> expects the aggregate on top and
    the value below, <code>swons</code> expects them in the opposite order, the value
    on top and the aggregate below. It follows that <code>swons</code> is the converse
    of
    <code>cons</code>. In the same way, a binary string or list operation
    <kbd>swoncat</kbd> is defined to be the converse of
    <code>concat</code>.
    <pre>        swap cons  ==  swons            swap concat  ==  swoncat
    </pre>
    <p>
      One function is the converse of a second function if and only if the second is the
      converse of the first. This says that converseness is a symmetric relation. In
      Joy it is expressed by the following: for all programs <code>P</code> and <code>Q</code>
    </p>
    <pre>        swap P  ==  Q    if and only if    swap Q  ==  P
    </pre>
    From this rule and the previous equalities it follows that
    <pre>        swap &lt; ==   &gt;                  swap &lt;=  ==  &gt;=
            swap swons  ==  cons            swap swoncat  ==  concat
    </pre>
    <p>
      A binary function <code>f(x,y)</code> is <em>commutative</em> if it is its own
      converse - if for all <code>x</code> and <code>y</code>
    </p>
    <pre>        f(x,y)  =  f(y,x)
    </pre>
    For example, addition of numbers is commutative, for all integers
    <code>x</code> and <code>y</code>
    <pre>        i + j  =  j + i
    </pre>
    In Joy the <code>swap</code> operator can express that a function is commutative.
    <pre>        swap +  ==  +                   swap *  ==  *
            swap and  ==  and               swap or  ==  or
            swap max  ==  max               swap min  ==  min
    </pre>
    Two sorted sequences can be combined with the <kbd>merge</kbd> operator to
    form one new sorted sequence. Unlike
    <kbd>concat</kbd>enation, merging is commutative:
    <pre>        swap merge  ==  merge
    </pre>
    <p>
      A function which yields a truth value is often called a
      <em>predicate</em>. Commutative predicates are often called
      <em>symmetric</em>. For example, the <em>identity relation</em>
      <code> = </code>, a binary predicate, is commutative or symmetric. Another is the
      <kbd>equal</kbd> predicate which tests lists for identity, including sublists and
      their sublists. In conventional notation, for all integers or lists <code>x</code>  and <code>y</code>
    </p>
    <pre>        (i = j)  =  (j = i)        equal(x,y)  =  equal(y,x)
    </pre>
    Turning these concepts on themselves, the converse relation is symmetric:
    for all functions <code>f</code> and <code>g</code>
    <pre>        (g is the converse of f)  =  (f is the converse of g)
    </pre>
    The same is not true for the inverse relation. The <code>swap</code> operator
    can express that a binary predicate is <em>symmetric</em>. The following express
    that <code> = </code> and <code>equal</code> are symmetric:
    <pre>        swap =   ==   =                 swap equal  ==  equal
    </pre>
    With <code>swap</code> one can express that elements are <em>left
    unit</em> elements for binary operations. In the case of operations such as addition
    and the Boolean operations this already follows from their commutativity. On the
    other hand, concatenation of strings or lists is not commutative, but the empty string
    and the empty list are both right and left unit elements for concatenation. They
    are also both right unit elements for <kbd>merge</kbd>.
    <pre>        0 swap +  ==  id                1 swap *  ==  id
            false swap or  == id            {} swap or  ==  id
            true swap and  ==  id
            "" swap concat  ==  id          [] swap concat  ==  id
            "" swap merge  ==  id           [] swap merge  ==  id
    </pre>
    <p>
      Some operators leave two elements on top of the stack, and two such operator may
      be related in the sense that they just leave the elements in a different order.
      This can also be expressed by
      <code>swap</code>:
    </p>
    <pre>        uncons swap  ==  unswons        unswons swap  ==  uncons
    </pre>
    There is even one operator which is related to itself in this way, and that
    is <code>dup</code>:
    <pre>        dup swap  ==  dup
    </pre>
    <p>
      Two operators related to <code>swap</code> are <kbd>rollup</kbd> and
      <kbd>rolldown</kbd>. The <code>rollup</code> operator moves the third and second
      element on the stack into second and first position, and it moves the original
      first element into third position. The
      <code>rolldown</code> operator moves the second and first element on the stack
      into third and second position, and it moves the original third element into first
      position. They can express laws such as
    </p>
    <pre>        rolldown  concat  concat   ==   concat swoncat
            rollup  swoncat  concat   ==   swoncat  swoncat
            rollup  merge  merge   ==   merge merge
    </pre>
    Their arities are expressed by
    <pre>        swap  pop  pop   ==   pop  pop
            rollup  pop  pop  pop   ==   pop  pop  pop
            rolldown  pop  pop  pop   ==   pop  pop  pop
    </pre>
    <h2>Associativity</h2>
    <p>
      This section illustrates the use of the <code>dip</code> combinator in Joy algebra.
    </p>
    <p>
      The three previous sections have shown how a few Joy operations can express a variety
      of well-known laws. In the sections to follow more difficult Joy concepts will
      be needed. These resemble higher order functions, but like everything else in Joy
      they really are just functions from stacks to stacks. They differ from what are
      called the operators in that they expect on top of the stack not just a passive
      datum, but a quoted program which they execute. In accordance with an older terminology
      they are here called <em>combinator</em>s.
    </p>
    <p>
      One of these is the <kbd>dip</kbd> combinator. It expects a quoted program on the
      top of the stack, and below at least one value of any type. During execution it
      removes the program and the value from the stack and saves them. Then it executes
      the program on the remainder of the stack. Finally it restores the saved value
      to the top of the stack. In most applications the program will be pushed just before
      the combinator is to be applied. The combinator is useful for doing something to
      the stack without disturbing the top value.
    </p>
    <p>
      Here is an example:
    </p>
    <pre>        1 2 3 4 + * 5  ==  1 14 5
            1 2 3 4 5 [+ *] dip  ==  1 14 5
    </pre>
    In the first line on the left the 3 and the 4 are immediately added, the result
    is multiplied by the 2 to give 14, and then the 5 is pushed on top. In the second
    line the 5 is pushed immediately after the 4, and consequently it is not possible
    to add the 3 and 4 without popping the 5 first. So, the program <code>[+ *]</code>is pushed and then executed by <code>dip</code>. The results are the same as those
    in the two (identical) right sides.
    <p>
      A binary function <code>f(x,y)</code> is said to be
      <em>associative</em> if the result of applying it twice to three values is independent
      of the order of application:
    </p>
    <pre>        f(x,f(y,z))  =  f(f(x,y),z)
    </pre>
    For example, addition of numbers is associative:
    <pre>        i + (j + k)  =  (i + j) + k
    </pre>
    If <code>g(x,y)</code> is the converse of an associative
    <code>f(x,y)</code>, then <code>g(x,y)</code> is also associative.
    <p>
      In Joy the <code>dip</code> combinator can be used to express associativity:
    </p>
    <pre>        [+] dip +  ==  + +              [*] dip *  ==  * *
            [and] dip and  ==  and and      [or] dip or  ==  or or
            [max] dip max  ==  max max      [min] dip min  ==  min min
            [concat] dip concat  ==  concat concat
            [swoncat] dip swoncat  ==  swoncat swoncat
            [merge] dip merge  ==  merge merge
    </pre>
    <p>
      The following law expresses that the <code>dip</code> combinator leaves one value
      unchanged:
    </p>
    <pre>        dip  pop   ==   [pop]  dip  i
    </pre>
    <h2>Homomorphisms, De Morgan and distribution</h2>
    This section illustrates the use of the <code>app2</code> combinator in Joy algebra.
    <p>
      The <kbd>app2</kbd> combinator expects a quoted program on top of the stack, and
      below that two data parameters. As with all combinators, the program will be executed,
      in this case twice. In case the program computes a unary function, the effect is
      to replace the two data parameters by two corresponding values of that function.
      The two evaluations could be done in parallel. The more general case where the
      program does not denote a unary function is described further down.
    </p>
    <p>
      Let <code>f(x1,x2)</code> be a binary function defined on a type
      <code>X</code>, and let <code>g(y1,y2)</code> be a binary function defined on a
      type <code>Y</code>. Let <code>h(x)</code> be a function from <code>X</code> to
      <code>Y</code>. Then <code>h(x)</code> is a
      <em>homomorphism</em> from <code>X</code> and its binary function to
      <code>Y</code> and its binary function when the following holds for all <code>x1</code>  and <code>x2</code>:
    </p>
    <pre>        h(f(x1,x2)  =  g(h(x1),h(x2))
    </pre>
    One example is the logarithm function which maps logarithms of products onto
    sums of logarithms. Two other examples are the doubling function which maps integers
    with addition into even integers with addition, and the squaring function which maps
    naturals with multiplication into square naturals with multiplication and the
    <kbd>size</kbd> (or length) of string function which maps the size of concatenations
    onto sums of sizes. The <em>De Morgan</em> laws are another example.
    <pre>        log(x * y)  =  log(x) + log(y)
            double(x + y)  =  double(x) + double(y)
            square(x * y)  =  square(x) * square(y)
            size(concat(x,y))  =  size(x) + size(y)
            not(p and q)  =  not p or not q
            not(p or q)  =  not p and not q
    </pre>
    <p>
      In Joy the <code>app2</code> combinator can be used to express
      <em>homomorphism</em> laws, and these all take the form:
    </p>
    <pre>        f  h   ==   [h]  app2  g
    </pre>
    Some such laws are
    <pre>        +  double   ==   [double]  app2  +
            *  square   ==   [square]  app2  *
            max  succ   ==   [succ]  app2  max
            concat  size   ==   [size]  app2  +
            concat  sum   ==   [sum]  app2  +
            concat  product   ==   [product]  app2  *
            concat  charset   ==   [charset]  app2  or
    </pre>
    In the above, <kbd>charset</kbd> transforms a string of characters into a
    set of characters, and the <code>or</code> operator computes set union in this case.
    Another homomorphism is the <kbd>sort</kbd> operator which maps unordered lists under
    concatenation onto ordered lists under a binary <kbd>merge</kbd> operator which preseves
    ordering:
    <pre>        concat  sort   ==   [sort]  app2  merge
    </pre>
    <p>
      The <code>app2</code> combinator can also be used to express the familiar De Morgan
      laws for Boolean algebra and a (perhaps surprising) isomorphic pair of laws for
      strings or lists:
    </p>
    <pre>        and not  ==  [not] app2 or
            or not  ==  [not] app2 and
            concat reverse  ==  [reverse] app2 swoncat
            swoncat reverse  ==  [reverse] app2 concat
    </pre>
    <p>
      Laws like the above generalise to <em>distribution</em> laws. In these the unary
      function is replaced by a new binary function, and for each element in the domain
      a unary function can be defined from the new binary function by letting one parameter
      be the given element. It is useful to distinguish <em>right distribution</em> and
      <em>left
      distribution</em>.
    </p>
    <p>
      A binary function <code>f(x,y)</code> distributes from the right over another binary
      function <code>g(x,y)</code> if the following holds:
    </p>
    <pre>        f(g(x,y),z)  =  g(f(x,z),f(y,z))
    </pre>
    In arithmetic we have the familiar example of multiplication distributing
    from the right over addition. In Boolean algebra the conjunction and disjunction
    operators distribute from the right over
    <em> each other</em>. Here is the arithmetic law:
    <pre>        (i + j) * k  =  (i * k) + (j * k)
    </pre>
    <p>
      The <code>app2</code> combinator can also express <em>right
      distribution</em> laws. In each case there are three data parameters on the stack,
      and the two ways of applying two functions are equivalent. The one way is to apply
      the one function to the second and third parameters (using the <code>dip</code>  combinator) and then to apply the distributing function to the result and the first
      parameters. The other way is to use the first parameter and the distributing function
      to make a <em>constructed program</em> that computes a unary function, use <code>app2</code>  to compute its values for the second and third data parameters and to combine the
      two values with the other function.
    </p>
    <pre>        [+] dip *  ==  [*] cons app2 +
            [and] dip or  ==  [or] cons app2 and
            [or] dip and  ==  [and] cons app2 or
    </pre>
    <p>
      A binary function <code>f(x,y)</code> distributes from the left over another binary
      function <code>g(x,y)</code> if the following holds:
    </p>
    <pre>        f(x,g(y,z))  =  g(f(x,z),f(y,z))
    </pre>
    In arithmetic multiplication also distributes from the left over addition:
    <pre>        i * (j + k)  =  i * j + i * k
    </pre>
    The <code>app2</code> combinator can also be applied to a quoted program which
    does not compute a unary function, but accesses data elements further down in the
    stack. In the examples below, these elements have to be explicitly deleted later
    on, by <code>[pop]
    dip</code>. It can be used to express <em>left distribution</em> laws.
    <pre>        + *  ==  [*] app2 + [pop] dip
            or and  ==  [and] app2 or [pop] dip
            and or  ==  [or] app2 and [pop] dip
    </pre>
    <p>
      Apart from <code>app2</code> there are similar combinators
      <kbd>app1</kbd> and <kbd>app3</kbd>. Each expects a program
      <code>[P]</code> on top of the stack and below that 1, 2 or 3 further parameters
      and produces 1, 2 or 3 values. Some pertinent laws are
    </p>
    <pre>        [succ]  app1  ==  succ            [not]  app1  ==  not
            [pop]  dip  app1   ==   app2  pop
            [swap]  dip  app2   ==   app2  swap
            [dup]  dip  app2   ==   app1  dup
    </pre>
    The arities of these combinators are expressed by
    <pre>        app1  pop   ==   pop  pop
            app2  pop  pop   ==   pop  pop  pop
            app3  pop  pop  pop   ==   pop  pop  pop  pop
    </pre>
    <p>
      There is a sense in which one might say that an integer has two parts: a sign and
      an absolute value. When the two parts are multiplied, the result is the same as
      the original. In the same way, a non-empty list has two parts, its first and its
      rest. When the first is consed into the rest, the result is the same as the original
      list. In conventional notation this might be expressed as
    </p>
    <pre>        sign(x) * abs(x)  =  x
            cons(first(x),rest(x))  =  x
    </pre>
    The same may be expressed in Joy notation using the <code>dip</code> combinator:
    <pre>        dup [sign] dip abs *  ==  id
            dup [first] dip rest cons  ==  id
    </pre>
    <p>
      The laws look somewhat cleaner when expressed in terms of another combinator. The
      <kbd>cleave</kbd> combinator expects two programs and below that another item.
      It applies both programs to produce two results, for example
    </p>
    <pre>        5  [pred]  [dup *]  cleave   ==   4  25
    </pre>
    The earlier laws about parts and wholes can then be expressed like this:
    <pre>        [sign]  [abs]  cleave  *   ==   id
            [first]  [rest]  cleave  cons   ==  id
    </pre>
    <p>
      The combinator <kbd>split</kbd> applied to a list and a test predicate produces
      two lists, those members of the original list which pass the test and those with
      fail. For any predicate, a list will have two parts which can be merged to reconstitute
      the original list. In Joy notation:
    </p>
    <pre>        [sort] dip split merge   ==   pop  sort
    </pre>
    The law cannot be expressed in conventional notation because
    <code>split</code> produces two results.
    <h2>The LIST functor and its natural transformations</h2>
    This section uses several concepts from category theory. The following brief sketch
    is unavoidably superficial, for a proper exposition see <a href="refs.html#{Rydeheard85}">{Rydeheard85}</a>
    <a href="refs.html#{Poigne92}">{Poigne92}</a>. For excellent short introductions
    for computer science see <a href="refs.html#{Tennent91}">{Tennent91}</a> and
    <a href="refs.html#{Walters91}">{Walters91}</a>. Another short introduction with
    an extensive bibliography is
    <a href="refs.html#{Pierce91}">{Pierce91}</a>.
    <p>
      A <em>category</em> consists of a collection of <em>object</em>s and for any two
      objects a collection of <em>morphism</em>s, each having the one object as their
      <em>source</em> and the other object as their
      <em>target</em>. In many categories the objects are just sets, or they are sets
      with structure - algebras. Then the morphisms are unary functions from sets to
      sets, or they are homomorphisms from algebras to algebras. For any object the morphisms
      must include an
      <em>identity morphism</em> with that object as source and target. Often there will
      be other morphisms with that object as source and target. For any object and two
      morphisms having a given object as target and source respectively, there must be
      a composite morphism having as source the source of the one component and as target
      the target of the other.
    </p>
    <p>
      This composition of morphisms must be associative, with identity morphisms as left
      and right unit elements. These requirements are satisfied for categories of sets
      and functions and for categories of algebras and homomorphisms. But there are many
      categories that are quite different. One kind of example are <em>monoid</em>s:
      an associative binary operation over a set which includes a left and right unit
      element. Here the category consists of just one object (which is of no interest),
      but many morphisms, the elements of the monoid. There are many other kinds of categories
      which are different again.
    </p>
    <p>
      Categories deal with two sorts of things, objects and morphisms. So they are two-sorted
      algebras. Between categories there are morphisms called <em>functor</em>s. These
      take objects and morphims of one category into objects and morphisms of another
      category. In computer science the most familiar functors are the <em>type constructor</em>s.
      They take integers, characters, truth values and so on into
      <code>LIST</code>s of integers, <code>LIST</code>s of characters,
      <code>SET</code>s of integers and so on. The functors must <em>
      also</em> take integer functions such as squaring into corresponding functions on
      <code>LIST</code>s or <code>SET</code>s of integers.
    </p>
    <p>
      In computing circles the corresponding functions are usually written
      <code>map(square,L)</code>, for a list <code>L</code>. In category theory the same
      symbol is used for objects and morphisms, so the examples are written <code>LIST(integer)</code>  and
      <code>LIST(square)</code>. In Joy there is no explicit type notation at all, and
      <kbd>map</kbd> is just one of many combinators. Programs to compute the list of
      squares of a given list can be written in either of these two ways:
    </p>
    <pre>        [square]  map                   [dup *]  map
    </pre>
    <p>
      Between any two functors <code>F</code> and <code>G</code> there can be functions
      called <em>natural transformation</em>s. These take as arguments the values of
      <code>F</code> and <code>G</code> at their objects. A function <code>n</code> is
      natural if for all morhisms
      <code>m</code> in the domains of <code>F</code> and <code>G</code> the following
      holds for all <code>x</code>:
    </p>
    <pre>        n(F(m)(x))  =  G(m)(n(x))
    </pre>
    Initially we shall only be concerned with the case where
    <code>F</code> and <code>G</code> are the same functor
    <code>LIST</code>. Then an example of a natural transformation from lists to lists
    is the <kbd>reverse</kbd> function: for all functions
    <code>f</code> and lists <code>L</code>
    <pre>        reverse(LIST(f)(L)  =  LIST(f)(reverse(L))
    </pre>
    or in conventional notation
    <pre>        reverse(map(f,L))  =  map(f,reverse(L))
    </pre>
    In Joy algebra the naturality of <code>reverse</code> is expressed by
    <pre>        [reverse]  dip  map   ==   map  reverse
    </pre>
    <p>
      In computer science natural transformations are often called
      <em>polymorphic</em> functions, in the case of lists they are independent of the
      type of the elements of the lists. Four other naturality laws, expressed in conventional
      notation:
    </p>
    <pre>        map(f,rest(L))  =  rest(map(f,L))
            f(first(L))  =  first(map(f,L))
            map(f,concat(L1,L2))  =  concat(map(f,L1),map(f,L2))
            map(f,cons(x,[]))  =  cons(f(x),[])
            map(f,unitlist(x))  =  unitlist(f(x))
    </pre>
    The last two laws of course say the same thing. In Joy these would be expressed
    by
    <pre>        [rest]  dip  map   ==   map  rest
            [first]  dip  i   ==   map  first
            [concat]  dip  map   ==   [map]  cons  app2  concat
            [[] cons] dip map   ==   i [] cons
            [unitlist] dip map   ==   i  unitlist
    </pre>
    Note that in the third equation on the right the <code>app2</code> combinator
    has to use a <em>constructed program</em>. The last two laws again say the same thing.
    <p>
      Somewhat more difficult is the naturality of <kbd>cons</kbd>. In conventional notation
      this is expressed by
    </p>
    <pre>        map(f,cons(x,L))  =  cons(f(x),map(f,L))
    </pre>
    and in Joy notation by
    <pre>        [cons]  dip  map   ==   dup  [dip]  dip  map  cons
    </pre>
    This is so complex that a step-by-step verification is called for. Let <code>L</code>and <code>x</code> be the list and the additional member. Let <code>[F]</code> be
    a program which computes the function
    <code>f</code>. Let <code>x'</code> be the result of applying
    <code>f</code> to <code>x</code>, and let <code>L'</code> be the result of applying
    <code>f</code> to all members of <code>L</code>. The proof of the equivalence of
    the LHS and the RHS consists in showing that both reduce to the same program. For
    the LHS we have:
    <pre>        x  L  [F]  [cons]  dip  map                             LHS
        ==  x  L  cons  [F]  map                                    (dip)
        ==  [x L]  [F]  map                                         (cons)
        ==  [x' L']                                                 (map)
    </pre>
    For the RHS:
    <pre>        x  L  [F]  dup  [dip]  dip  map  cons                   RHS
        ==  x  L  [F]  [F]  [dip]  dip  map  cons                   (dup)
        ==  x  L  [F]  dip  [F]  map  cons                          (dip)
        ==  x'  L  [F]  map  cons                                   (dip)
        ==  x'  L' cons                                             (map)
        ==  [x' L']                                                 (cons)
    </pre>
    The two sides reduce to the same program, so they denote the same function.
    <p>
      A similar equation is the following:
    </p>
    <pre>        map   ==   [uncons]  dip  dup  [dip]  dip  map  cons
    </pre>
    But note that this is not suitable as a definition, since the RHS only applies
    to non-empty lists. The following is a suitable recursive definition:
    <pre>        map   ==   [ pop null ]
                       [ pop ]
                       [ [uncons]  dip  dup  [dip]  dip  map  cons ]
                       ifte
    </pre>
    <p>
      The fact that <code>map</code> does not change the number of elements in a list
      is expressed in conventional notation by
    </p>
    <pre>        size(map(f,L))  =  size(L)
    </pre>
    and in Joy notation by
    <pre>        map  size   ==   pop  size
    </pre>
    <p>
      An important combinator for any aggregate is <kbd>filter</kbd>, which expects an
      aggregate and below that a quotation which implememnts a predicate. It returns
      an aggregate of the same type as the parameter containing only those members for
      which the predicate yielded
      <code>true</code>. Given two aggregates, it does not matter whether they are first
      combined and then filtered, or first filtered separately and then combined. For
      sequences the law is this:
    </p>
    <pre>        [concat] dip filter  ==  [filter] cons app2 concat
    </pre>
    For sets the combining operator has to be <code>or</code> instead of
    <code>concat</code>.
    <p>
      Another law concerns passing an aggregate first through one filter and then passing
      the result through another filter. Passing the aggregate through the conjunction
      of these filters produces the same result. The <kbd>conjoin</kbd> operator takes
      two quoted predicates and returns one quoted predicate which is their conjunction.
    </p>
    <pre>        [filter] dip filter  ==  conjoin filter
    </pre>
    <p>
      The following laws concern the <code>sum</code>s and
      <code>product</code>s of lists of integers:
    </p>
    <pre>        cons  sum   ==   sum  +         sum   ==   uncons  sum  +
            cons product  ==  product *     product  ==  uncons product *
    </pre>
    (Only the equations on the left could be expressed in conventional notation.)
    <p>
      This holds:
    </p>
    <pre>        P  ==  uncons Q   iff   cons P  == Q
    </pre>
    <h2>Other functors and their natural transformations</h2>
    As indicated in the previous section, apart from <code>LIST</code> there are other
    functors such as <code>SET</code>. So there is the type <code>SET(integer)</code>,
    the function <code>SET(square)</code> which maps a set of integers into the set of
    their squares, and similarly for other integer functions. Much of what was said about
    lists and their natural transformations has counterparts for sets and their natural
    transformations. In Joy there are several implementations of <em>set type</em>s.
    The simplest is in terms of bitstrings with potential elements <code>0</code> ..
    <code>31</code>, such sets are written in curly braces, as in <code>{1 3 5}</code>.
    Values of this type can be manipulated by the combinator
    <code>map</code> and the operators <code>first</code>,
    <code>rest</code> and <code>cons</code>. Instead of the operator
    <code>concat</code> the set union operator <kbd>or</kbd> applies. The naturality
    of these operators is expressed by
    <pre>        [rest]  dip  map   ==   map  rest
            [first]  dip  map   ==   map  first
            [or]  dip  map   ==   [map]  cons  app2  or
            [{} cons]  dip  map   ==   i  {}  cons
            [cons]  dip  map   ==   dup  [dip]  dip  map  cons
    </pre>
    <p>
      Now we have two functors, <code>LIST</code> and <code>SET</code>. Lists have order
      and may have repetitions, sets have neither. A useful function from lists to sets
      is the function <kbd>elements</kbd> which removes order and repetitions. For example,
      in Joy notation
    </p>
    <pre>        [ 3 1 5 1 ]  elements   ==   { 1 3 5 }
    </pre>
    It makes no difference whether the set of elements of a list is taken first
    and then the set is mapped through a function, or whether the list is first mapped
    through the same function and then the set of elements is taken. This is the naturality
    of the
    <code>elements</code> function, expressed by
    <pre>        [elements]  dip  map   ==   map  elements
    </pre>
    For example:
    <pre>        [ 3 1 5 1 ]  [dup *]  [elements]  dip  map
        ==  [ 3 1 5 1 ]  elements  [dup *]  map
        ==  { 1 3 5 }  [dup *]  map
        ==  { 1 9 25 }
    </pre>
    and
    <pre>        [ 3 1 5 1 ]  [dup *]  map  elements
        ==  [ 9 1 25 1 ]  elements
        ==  { 1 9 25 }
    </pre>
    <p>
      Halfway between lists and sets are multisets or <em>bag</em>s; these have no order
      but may have repetitions. A <code>BAG</code> functor would be similar to <code>LIST</code>  and <code>SET</code>, and there would be natural transformations from bags to bags,
      from lists to bags, and from bags to sets. Currently Joy does not have an implementation
      of bags.
    </p>
    <p>
      A list can have as its members other lists, for example lists of integers. Formally
      these are of type
      <code>LIST(LIST(integer))</code>. This uses the <code>LIST</code> functor composed
      with itself: <code>LIST</code> °
      <code>LIST</code>. Such a list can be mapped through a function by mapping each
      sublist, for example
    </p>
    <pre>        [[1 2 3][4 5]]  [[dup *] map]  map   ==   [[1 4 9][16 25]]
    </pre>
    Here the second <code>map</code> is applied to the whole list, the first or
    inner <code>map</code> is applied to the sublists. Alternatively a combinator <kbd>mmap</kbd>can be defined by
    <pre>        mmap   ==   [map]  cons  map
    </pre>
    and then one can write
    <pre>        [[1 2 3][4 5]]  [dup *]  mmap  ==  [[1 4 9][16 25]]
    </pre>
    <p>
      Whereas a list is one-dimensional, a <em>matrix</em> is two-dimensional. Matrices
      can be implemented as lists of lists, and the sublists can be interpreted either
      as the rows or the columns. One important operation on matrices is the interchange
      of rows and columns. The <kbd>transpose</kbd> operator does just that:
    </p>
    <pre>        [[1 2][3 4]]  transpose   ==   [[1 3][2 4]]
    </pre>
    Transposition is another polymorphic function or natural transformation for
    matrices. It does not matter whether a matric is first transposed and then mapped
    elementwise through a function, or whether it is first mapped and then transposed.
    <pre>        [transpose]  dip  mmap   ==   mmap  transpose
    </pre>
    <p>
      The operator <kbd>zip</kbd> will transform two lists of the same length into a
      list of pairs, for example
    </p>
    <pre>        [1 2 3]  [4 5 6]  zip   ==   [[1 4][2 5][3 6]]
    </pre>
    The <code>zip</code> operator can be defined by
    <pre>        zip   ==   []  cons  cons  transpose
    </pre>
    The <code>zip</code> function is natural, <code>zip</code>ping the two lists
    and then <code>mmap</code>ing has the same effect as
    <code>map</code>ping and then <code>zip</code>ping:
    <pre>        [zip]  dip  mmap   ==   [map]  app2  zip
    </pre>
    <p>
      A similar naturality law holds for the <kbd>cartproduct</kbd> operator which produces
      the <em>cartesian product</em> of two aggregates which do not have to be of the
      same type:
    </p>
    <pre>        [cartproduct] dip  mmap   ==   [map] app2  cartproduct
    </pre>
    <p>
      Another useful datatype is that of <em>tree</em>s, also called
      <em>recursive list</em>s. A tree of integers is either an integer or a list of
      trees of integer. A <em>proper tree</em> is a list of trees. The type gives rise
      to a functor <code>TREE</code>, with the data type <code>TREE(integer)</code> and
      mapping functions such as
      <code>TREE(square)</code>. In Joy the combinator for tree mapping is
      <kbd>treemap</kbd>. Most of the operations on lists also apply to proper trees.
      Reversal can be done by <code>reverse</code> just at the top level, or by <kbd>treereverse</kbd>  all the way down into all sublists. Some naturality laws are:
    </p>
    <pre>        [reverse]  dip  treemap   ==   treemap  reverse
            [treereverse]  dip  treemap   ==   treemap  treereverse
            [rest]  dip  treemap   ==   treemap  rest
            [first]  dip  i   ==   treemap  first
            [[] cons]  dip  treemap   ==   treemap  []  cons
    </pre>
    <p>
      Proper trees can be <kbd>treeflatten</kbd>ed to form a one-level list. For example
    </p>
    <pre>        [ [1 [2 3] [] 4] [5] ]  treeflatten   ==   [ 1 2 3 4 5 ]
    </pre>
    The <code>treeflatten</code>ing function is a natural transformation between
    the <code>TREE</code> and <code>LIST</code> functors, the order of treeflattening
    and mapping does not matter:
    <pre>        [treeflatten]  dip  map   ==   treemap  treeflatten
    </pre>
    The following also holds:
    <pre>        treereverse  treeflatten   ==   treeflatten  reverse
    </pre>
    <p>
      A <em>bare tree</em> is either the empty list <code>[]</code> or it is a list of
      bare trees. Formally there is a functor
      <code>BARETREE</code>, and for (degenerate) functions which can only take <code>[]</code>  as parameters <code>BARETREE(f)</code> maps bare trees with contained <code>[]</code>  into trees. Proper trees can also be <kbd>strip</kbd>ped of their leaves to form
      a bare tree:
    </p>
    <pre>        [ [1 [2 3] [] 4] [5] ]  strip   ==   [ [ [] [] ] [] ]
    </pre>
    The <code>strip</code> function commutes with <code>reverse</code> and
    <code>treereverse</code>:
    <pre>        reverse  strip   ==   strip  reverse
            treereverse  strip   ==   strip  treereverse
    </pre>
    Once stripped, there is nothing for <code>treemap</code> to do:
    <pre>        [strip]  dip  treemap   ==   treemap  strip   ==   pop strip
    </pre>
    <h2>The LIST monad</h2>
    This section gives a superficial sketch of monads, another useful concept from category
    theory. For a fuller exposition see
    <a href="refs.html#{Arbib-Manes75}">{Arbib-Manes75}</a>,
    <a href="refs.html#{Asperti-Longo91}">{Asperti-Longo91}</a> and especially
    <a href="refs.html#{Wadler92}">{Wadler92}</a>.
    <p>
      A <em>monad</em> <code>M</code> over a category consists of a functor from the
      category to itself, and two natural transformations. The first transformation <code>joinM</code>  takes as argument an object in the target of the square of the functor and gives
      as value an object in the target of the functor. The second transformation
      <code>unitM</code> takes as argument an object in the category and gives as value
      an object in the target of the functor. The two transformations must satisfy two
      laws which are expressed in terms of two variants obtained by applying the functor
      to the two transformations:
    </p>
    <p>
      From the first transformation one can define a variant by applying the functor to
      it. This variant is again a natural transformation, it takes as argument an object
      in the target of the cube of the functor and gives as value an object in the target
      of the square of the functor. The first transformation or its variant may be composed
      with the first transformation. The two compositions are again natural transformations,
      they take as argument an object in the cube of the functor and give as value an
      object in the target of the functor. The first defining law for monads is that
      these two compositions must be identical.
    </p>
    <p>
      Similarly, from the second transformation one can define a variant by applying the
      functor to it. This variant is again a natural transformation, it takes as argument
      and value objects in the target of the functor. The second transformation or its
      variant may be composed with the first transformation. The two compositions take
      as argument an value objects in the target of the functor. The second defining
      law for monads is that these two compositions must both be equal to the identity
      function.
    </p>
    <p>
      The above will now be illustrated with the <em>LIST monad</em>. Its functor is
      the <code>LIST</code> functor. Its first natural transformation is usually called
      <kbd>flatten</kbd>, which concatenates a two-level list to produce a single-level
      list. Its second natural transformation is the unary <kbd>unitlist</kbd> operation
      which takes any argument to produce its singleton list. Here are two examples:
    </p>
    <pre>        [[1 2 3] [peter paul]] flatten  ==  [1 2 3 peter paul]
            [[1 2 3] [peter paul]] unitlist  ==  [[[1 2 3] [peter paul]]]
    </pre>
    The two required variants are obtained by applying the
    <code>LIST</code> functor, as <code>map</code>.
    <p>
      The variant of the <code>flatten</code> operator is the polymorphic operator
    </p>
    <pre>        [flatten]  map
    </pre>
    which takes a list of (lists of lists) as argument and concatenates the (list
    of lists) but leaves the outer level list structure intact. This is an example:
    <pre>        [[[1 2] [3]] [[a] [b]]]  [flatten] map  ==  [[1 2 3] [a b]]
    </pre>
    The first monad law can now be written in Joy notation. It says that there
    are two equivalent ways of flattening a list of lists of lists to produce a list:
    <pre>        [flatten]  map  flatten   ==   flatten  flatten
    </pre>
    <p>
      The variant of <code>unitlist</code> is the polymorphic operator
    </p>
    <pre>        [unitlist] map
    </pre>
    which takes a list of elements and produces the list of their unitlists. An
    example is
    <pre>        [1 2 [3 4]]  [unitlist] map   ==   [[1] [2] [[3 4]]]
    </pre>
    The second monad law can now be written in Joy as
    <pre>        [unitlist] map  flatten   ==   id   ==   unitlist  flatten
    </pre>
    <p>
      As natural transformations both <code>flatten</code> and
      <code>unitlist</code> interact with the <code>LIST</code> functor operating (as
      <code>map</code>) on arbitrary functions. There are two further laws that arise.
      Because these two laws are more general than the preceding ones, they are also
      more useful:
    </p>
    <p>
      A list of lists can be mapped at the second level through an arbitrary function using
      the <code>mmap</code> combinator, producing another list of lists. That can then
      be <code>flatten</code>ed to produce a single level list. The same original list
      of list can first be
      <code>flatten</code>ed to produce a single level list which can then be mapped
      at the top level using <code>map</code>. The two results are the same, and in Joy
      this is expressed as
    </p>
    <pre>        mmap  flatten   ==   [flatten] dip  map
    </pre>
    <p>
      A function may be applied to an argument of any type, and then the
      <code>unitlist</code> can be taken. Alternatively the
      <code>unitlist</code> can be taken first and then the result can be
      <code>map</code>ped through the function. That the results are the same can be
      written in Joy as
    </p>
    <pre>        i  unitlist   ==   [unitlist] dip  map
    </pre>
    <p>
      <a href="refs.html#{Wadler92}">{Wadler92}</a> shows that in any monad it is possible
      to define another natural transformation, <em>monadic composition</em> which simultaneously
      resembles function application and function composition. For the <code>LIST</code>  monad it takes as one of its arguments a list and as the other argument a function
      which yields a list as value. The result is again a list. In Joy it might be defined
      by
    </p>
    <pre>        bind   ==   map  flatten
    </pre>
    It satisfies the following laws:
    <pre>        [unitlist] dip  bind   ==   i
            [unitlist] bind   ==   id
            [K [H] bind] bind  ==  [K] bind  [H] bind
    </pre>
    The first two laws say that <code>unitlist</code> is a left and right identity
    for <code>bind</code>, the third says that <code>bind</code> is associative. The
    third law is here expressed with program variables <code>K</code> and <code>H</code>.
    Alternatively it is expressed by
    <pre>        [bind] cons  concat  bind   ==   [bind] dip  bind
    </pre>
    Wadler makes extensive use of many <code>bind</code>-like functions for monads
    other than the <code>LIST</code> monad.
    <p>
      A very general theory of lists, without the use of category theory, is given in
      <a
        href="refs.html#{Bird86}">{Bird86}</a>. A very readable introduction to the
      <code>LIST</code> functor can be found in <a href="refs.html#{Spivey89}">{Spivey89}</a>.
      The theory of lists is generalised by <a href="refs.html#{Malcolm89}">{Malcolm89}</a>    to what have been called rose trees. <a href="refs.html#{Meijer-etal91}">{Meijer-etal91}</a>    give a comprehensive collection of laws of functional programming using very
      general functional forms for lists and other data types. <a href="refs.html#{Bird-deMoor92}">{Bird-deMoor92}</a>    use categories, homomorphisms and algebraic techniques to solve sophisticated
      optimisation problems in functional programming. It appears that most, and perhaps
      even all, of the contributions in the above papers can be translated into Joy
      notation.
    </p>
    <hr>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>