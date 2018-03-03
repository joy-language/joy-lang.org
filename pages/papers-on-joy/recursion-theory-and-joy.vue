<template>
  <article>
    <h1>Recursion Theory and Joy</h1>
    <i> by Manfred von Thun </i>
    <p>
      <em>Abstract:</em> Joy is a functional programming language which is not based
      on the application of functions to arguments but on the composition of functions.
      Many topics from the theory of computability are particularly easy to handle within
      Joy. They include the parameterisation theorem, the recursion theorem and Rice's
      theorem. Since programs are data, it is possible to define a Y-combinator for recursion
      and several variants. It follows that there are self-reproducing and self-describing
      programs in Joy. Practical programs can be written without recursive definitions
      by using several general purpose recursion combinators which are more intuitive
      and more efficient than the classical ones.
    </p>
    <p>
      <em>Keywords:</em> functional programming, functionals, computability, diagonalisation,
      program = data, diagonalisation, self-reproducing and self-describing programs,
      hierarchy of recursion combinators, elimination of recursive definitions.
    </p>
    <hr>
    <h2>Introduction</h2>
    This paper describes some aspects of the language from the perspective of recursive
    function theory.
    <p>
      A deep result in the theory of computability concerns the elimination of recursive
      definitions. To use the stock example, the
      <em>factorial</em> function can be <em> defined</em> recursively in Joy by
    </p>
    <pre>        factorial  ==
                [0 =] [pop 1] [dup 1 - factorial *] ifte
    </pre>
    The definition is then <em> used</em> in programs like this:
    <pre>        5
            factorial
    </pre>
    Because in Joy programs can be manipulated as data, the factorial function
    can also be computed recursively without a recursive definition, as follows:
    <pre>        5
            [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            [dup cons] swap concat dup cons i
    </pre>
    The second line in this program does much the same as the body of the definition
    of factorial, but it is a quoted program. The third line first transforms this into
    another longer quoted program which performs "anonymous" recursion, and then the
    final <kbd>i</kbd> combinator essentially dequotes this program causing its execution.
    <p>
      The third line implements Joy's counterpart of the <em>Y
      combinator</em> of the lambda calculus and of combinatory logic. Exactly the same
      line can be used to cause anonymous recursion of other functions which are normally
      defined recursively.
    </p>
    <p>
      Joy has other combinators which make recursive execution of programs more succinct.
      (Of course it is also possible in Joy to compute the factorial function more efficiently
      with iteration instead of recursion.)
    </p>
    <p>
      The remainder of this paper deals with various aspects of the theory of computability,
      in particular the theory of <em>recursive
      function</em>s. The next section gives a recursive definition of a recursion combinator.
      Following that is a section dealing with various well known and elementary theorems
      from recursive function theory. The next section then proves a fixpoint theorem
      for Joy. The theorem implies the existence of self-reproducing programs, as shown
      in the following section. There is also some discussion of the effect of evaluation
      order on termination. The topic of the next section is Rice's theorem for Joy.
      Then there is a section describing further self-reproducing and self-describing
      programs. Another recursion combinator is constructed in the next section. The
      final section discusses the more practical recursion combinators of Joy. Previous
      knowledge of the field of recursion theory is not assumed.
    </p>
    <h2>Recursion and its elimination</h2>
    The factorial function and the Fibonacci function are often used to illustrate two
    different recursion patterns, although both are most efficiently computed non-recursively.
    This section follows tradition by using these two functions. The ultimate aim is
    to show how
    <em>recursive definition</em>s of functions can be eliminated to obtain a (closed)
    form of a program for <em>recursive execution</em>.
    <p>
      In conventional notation the <em>factorial</em> function can be defined recursively
      like this:
    </p>
    <pre>    r-fac(n)  =  if n = 0 then 1 else n * r-fac(n - 1)
    </pre>
    It is obvious that in conventional notation the definitions need the formal
    parameter <code>n</code>. Joy was designed to eliminate formal parameters in definitions,
    and the factorial function would be defined in Joy like this:
    <pre>    r-fac1  ==  [0 =] [pop 1] [dup 1 - r-fac1 *] ifte
    </pre>
    The suffix <code>1</code> serves to distinguish this definition from a later
    version. The RHS of the definition contains three quotations: an if-part, a then-part
    and an else-part. These serve as parameters to the <kbd>ifte</kbd> combinator. The
    if-part tests for equality with <code>0</code>, and if that is true then the then-part
    <kbd>pop</kbd>s off the parameter and replaces it with the result
    <code>1</code>. Otherwise the else-part is executed, which
    <kbd>dup</kbd>licates the parameter, subtracts <code>1</code> from the top copy,
    calls <code>r-fac1</code> recursively on that and, when that call has returned with
    a value, multiplies that with the original. Using a more Joy-like idiom:
    <pre>    r-fac1  ==  [null] [succ] [dup pred r-fac1 *] ifte
    </pre>
    This uses the <kbd>null</kbd> predicate in the if-part, the
    <kbd>succ</kbd>essor function in the then-part and the
    <kbd>pred</kbd>ecessor operator in the else-part.
    <p>
      In conventional notation the <em>Fibonacci</em> function is defined recursively
      like this:
    </p>
    <pre>    r-fib(n)   =  if n &lt;= 1 then n else r-fib(n - 1) + r-fib(n - 2)
    </pre>
    A more or less literal translation into Joy is the following:
    <pre>    r-fib1  ==  [small] [] [pred dup [r-fib1] dip pred r-fib1 +] ifte
    </pre>
    The if-part uses the <kbd>small</kbd> predicate, which for numeric parameters
    yields <code>true</code> for <code>0</code> and for
    <code>1</code>. The then-part is the empty quotation <code>[]</code>, when executed
    it does nothing. In the else-part <code>r-fib1</code> has to call itself twice, once
    each for the two parameters that have been prepared by <code>dup</code>. The <kbd>dip</kbd>combinator applies the quotation <code>[r-fib1]</code> to the earlier version, and
    the later version, after <code>pred</code> has done its job, is handled directly
    by <code>r-fib1</code>. A cleaner version is
    <pre>    r-fib2  ==  [small] [] [pred dup pred [r-fib2] app2 +] ifte
    </pre>
    The <kbd>app2</kbd> combinator applies the quoted
    <code>[r-fib2]</code> twice, to each of the two numbers on top of the stack.
    <p>
      It will help if the minor differences between the definitions of the factorial function
      and the Fibonacci function are eliminated. In particular this concerns the patterns
      of the recursive calls. In the body of <code>r-fac1</code> the direct recursive
      call has been replaced by its quotation and <kbd>app1</kbd>, which applies the
      quotation just once, to the single number. So here are two other versions, they
      have aligned to make comparisons easier.
    </p>
    <pre>    r-fac2  ==  [ null] [succ] [     dup pred [r-fac2] app1 *] ifte
        r-fib2  ==  [small] [    ] [pred dup pred [r-fib2] app2 +] ifte
    </pre>
    The task of eliminating the recursion in the RHS of the definitions amounts
    to this: The occurrences of the quoted programs
    <code>[r-fac2]</code> and <code>[r-fib2]</code> have to be replaced by the quoted
    RHS. But this will introduce those same quotes again, and these have to be replaced
    by the RHS, and so on <em> ad
    infinitum</em>. It seems impossible.
    <p>
      One part of the solution is that the programs have to be given an extra parameter
      which is to be used when the else-part is executed. The extra parameter will have
      to contain whatever is necessary to enable the recursion inside the else-part.
      But this means that the extra parameter will be somewhat in the way. Consequently
      the if-part and the then-part need an extra <code>pop</code> to remove the unneeded
      parameter. Furthermore, in the else-part any preparatory work before the actual
      recursion has to be done <em> below</em> the extra parameter using <code>dip</code>.
      The one or two recursions are then to be effected by <code>app1</code> and <code>app2</code>,
      respectively. The two programs now look like this:
    </p>
    <pre>?-fac:  [[pop  null] [pop succ] [[dup pred     ] dip app1 *] ifte] ?
    ?-fib:  [[pop small] [pop     ] [[pred dup pred] dip app2 +] ifte] ?
    </pre>
    To indicate that these are <em> not</em> recursive definitions, they are not
    given as definitions at all. The <code>?</code>-symbol is left unanalysed at this
    point, only this much can be said about it:
    <ol>
      <li> it takes the entire quoted program as a parameter and then produces another quoted
        program with a special property.
      </li>
      <li> it then executes this resulting program.
      </li>
    </ol>
    So the <code>?</code>-symbol denotes a strange combinator.
    <p>
      For comparison the three versions of the factorial program are listed here:
    </p>
    <pre>r-fac1 == [     null] [    succ] [ dup pred        r-fac1       *] ifte
    r-fac2 == [     null] [    succ] [ dup pred       [r-fac2] app1 *] ifte
    ?-fac:   [[pop  null] [pop succ] [[dup pred     ] dip      app1 *] ifte] ?
    </pre>
    And here are the three versions of the Fibonacci program:
    <pre>r-fib1 == [    small] [        ] [ pred dup [r-fib1] dip r-fib1 +] ifte
    r-fib2 == [    small] [        ] [ pred dup pred  [r-fib2] app2 +] ifte
    ?-fib:   [[pop small] [pop     ] [[pred dup pred] dip      app2 +] ifte] ?
    </pre>
    <p>
      The recursion combinator must do this: At the point where
      <code>?-fac</code> uses <code>app1</code> and where <code>?fib</code> uses <code>app2</code>  they expect <code>?-fac</code> and
      <code>?fib</code> on top of the stack. That is why the if-parts and the then-parts
      each need an extra <code>pop</code>, and why the else-part has to do its initial
      work from a <code>dip</code>. It all means that a recursion combinator has to supply
      the RHS to itself as an extra parameter. In general, a recursion combinator expects
      a program <code>[P]</code> and it executes it in a special way. It must call <code>P</code>  but provide the extra parameter. This is the defining law for a recursion combinator
      <code>?</code> :
    </p>
    <pre>        [P]  ?   ==   [[P] ?]  P
    </pre>
    <p>
      How can a recursion combinator be defined? This can be done recursively and non-recursively.
      Once the <code>?</code> combinator is defined, it can be used to eliminate all
      other recursive definitions. If a recursion combinator is defined recursively,
      then this would be the only recursive definition that is needed. Here is a step-by-step
      development of such a definition. The development is a fairly typical example of
      how one can write Joy programs systematically. Start with the defining law:
    </p>
    <pre>        [P] ?
        ==  [[P] ?]  P
    </pre>
    In the second line <code>P</code> occurred twice, in quoted and unquoted form.
    It will be simpler if it occurs in only one form, and that has to be the quoted form.
    So, using the <code>i</code> combinator,
    <pre>    ==  [[P] ?]  [P]  i
    </pre>
    The two quotations are not exactly the same, but they can be produced from
    two identical quotations:
    <pre>    ==  [[P ?]  [[P] ?]  first  i
    </pre>
    Now the two identical quotations can be produced by the
    <code>dup</code> operator:
    <pre>    ==  [[P] ?]  dup  first  i
    </pre>
    All that is needed now is to extract <code>[P]</code> to the left:
    <pre>    ==  [P]  [?]  cons  dup  first  i
    </pre>
    In this construction each line was equivalent to its one or two neighbours.
    Hence the first and the last lines of this construction are equivalent:
    <pre>        [P]  ?   ==   [P]  [?]  cons  dup  first  i
    </pre>
    Hence the following is a suitable recursive definition of a recursion combinator:
    <pre>        ?   ==   [?]  cons  dup  first  i
    </pre>
    <p>
      It is useful to think of the RHS as being composed of two parts: the first is
    </p>
    <pre>        [?]  cons  dup  first
    </pre>
    and the second part is just <code>i</code>. The first part is just a function
    which takes one quoted program as a parameter and produces two quoted programs as
    values:
    <pre>        [P]  [?]  cons  dup  first
            [[P]  ?]  dup  first                    (by cons)
            [[P]  ?]  [[P]  ?]  first               (by dup)
            [[P]  ?]  [P]                           (by first)
    </pre>
    The second part of the definition is <code>i</code>, which effectively dequotes
    the topmost <code>[P]</code> and hence executes
    <code>P</code>. So the next reduction step depend on what
    <code>P</code> actually does.
    <p>
      An alternative recursive definition may be constructed:
    </p>
    <pre>        [P]  ?
        ==  [[P] ?]  P
        ==  [[P] ?]  [P]  i
        ==  [P]  [?]  cons  [P]  i
        ==  [P]  [P]  [[?] cons]  dip  i
        ==  [P]  dup  [[?] cons]  dip  i
    </pre>
    The resulting alternative recursive definition is
    <pre>        ?   ==   dup  [[?] cons]  dip  i
    </pre>
    It follows that the two RHSs of the two equivalent definitions are equal:
    <pre>        [?]  cons  dup  first  i   ==   dup  [[?] cons]  dip  i
    </pre>
    (Note that cancellation of the trailing <code>i</code> combinator on both
    sides is not valid in general, though it would be valid here.)
    <p>
      We now have a recursive definition of recursion. Computationally this is quite adequate,
      the recursive definition of any one of the
      <code>?</code> combinators really does make it possible to eliminate all other
      recursive definitions. Some of the following sections deal with the elimination
      of recursion even for the recursion combinators.
    </p>
    <p>
      The recursive definition of a recursion combinator can of course also be given in
      other languages. For an example in the lambda calculus see <a href="refs.html#{Henson87}">{Henson87}</a>.
      For an example in ML see <a href="refs.html#{Sokolowski91}">{Sokolowski91}</a>.
    </p>
    <h2>Theorems in recursion theory</h2>
    The theory of <em>computability</em> treats various formalisms which independently
    aim to capture the essence of computation. These formalisms include Turing machines,
    the lambda calculus, Markov algorithms, register machines, flow charts and any of
    the conventional programming languages. Each formalism deals with various specifications:
    for the Turing formalism the specifications are particular Turing machines, for the
    Markov formalism the specifications are particular Markov algorithms, for the programming
    languages they are particular programs, and so on. Some results in the theory concern
    connections between the formalisms, whereas others concern connections within the
    same formalism.
    <p>
      The main results in the theory can be divided into two groups: those concerned with
      the relationships between two such formalisms and those concerned with just one.
    </p>
    <p>
      The principal results in the first group are that the formalisms are all equivalent,
      in this sense: Given any two formalisms, for any specification in the one formalism
      there is a specification in the other formalism such that the two specifications
      compute the same function. Proofs of such results are always constructive, by exhibiting
      an algorithm which converts any specification in the one formalism into a specification
      in the other.
    </p>
    <p>
      Results in the second group concern just one formalism and often take this form:
      For any specification S1 having a certain property there is another specification
      S2 such that the two specifications S1 and S2 are related in some special way.
      Proofs are again constructive, by exhibiting algorithms for converting S1 into
      S2.
    </p>
    <p>
      The algorithms of both groups can be expressed in any of the formalisms. The constructive
      proofs then look like this: There is a specification S (in formalism F) with the
      capacity of transforming any specification S1 (in formalism F1) into a specification
      S2 (in formalism F2, not necessarily different from F1) such that the two specification
      S1 and S2 are related in a special way. Since the formalisms are universal, the
      algorithms can be written in the formalism itself, as another specification S.
      The results then take this form: There is a specification S such that for every
      specification S1 the result of applying S to S1 yields the required S2.
    </p>
    <p>
      Historically the theory of computability has been mainly couched in terms of <em>recursive function</em>s,
      a collection of functions built from a small base by means of a small number of
      constructors. These functions take natural numbers as arguments and give natural
      numbers as values. By means of a theoretically elegant (but computationally unfeasible)
      mapping called Gödel numbering, linguistic entities such as expressions can be
      assigned a unique number. In this way the functions can be made to "talk about
      themselves". Any syntactic operation on linguistic entities has a counterpart purely
      arithmetical operation on natural numbers which are the Gödel numbers of these
      entities. The theorems are basic to any proper understanding of the the foundations
      of computer science. But the proofs, when not hand-waiving by appeals to Church's
      thesis, tend to be forbidding.
    </p>
    <p>
      The ease of writing S depends crucially on how well the formalism can handle its
      own specifications. Often it is necessary to use encodings of S1 and S2 into a
      form which the formalism can handle. In the worst case the encodings are truly
      ghastly. In the best case the formalism can handle its own specifications very
      naturally. This is sometimes expressed by the slogan <em>program = data</em>.
      Most formalisms fare badly on this, including most programming languages.
    </p>
    <p>
      Some languages can treat their own programs as data; they are Lisp, Snobol, Prolog
      and their descendants, some macro generators and the command languages based on
      them. Joy does it at least as well. In these languages programs can operate on
      other programs or on other data to produce other programs which may then be executed.
      Because of this, arithmetisation is not necessary, functions can take programs
      rather than Gödel numbers of programs as arguments, and metatheoretic proof become
      much easier. <a href="refs.html#{Phillips92}">{Phillips92}</a> writes
    </p>
    <blockquote>
      One might wonder how differently recursion theory might be viewed if it had arisen
      out of practical developments instead of predating them.
    </blockquote>
    Indeed, one might speculate how much more natural computability theory would have
    been if Lisp has been invented thirty years earlier. Readers might want to pursue
    this topic, see the discussion in
    <a href="refs.html#{Hofstadter85}">{Hofstadter85}</a> starting on p 444, and his
    very startling conclusion on p 449.
    <p>
      In Joy many metatheoretic proofs are easier still because there are no named formal
      parameters. Consequently the difficult operation of substituting actual parameters
      for formal parameters does not occur, and everything is algebra. Reasoning about
      Joy programs will now be illustrated with a number of classical theorems.
    </p>
    <p>
      A simple form of the <em>parametrisation theorem</em> states: there is a recursive
      function taking the Gödel number of an <em>
      n</em>-ary function F1 as one argument and taking the Gödel number of a numeral as
      a further argument such that the value of this recursive function is the Gödel
      number of an <em> n-1</em>-ary function F2 which is obtained by substituting the
      value of the numeral for the first argument of F1.
    </p>
    <p>
      Here is the same theorem for Joy. An <em>operand</em> is a numeral (or any other
      constant) or a quotation.
    </p>
    <pre>        For any program P and operand X
                there is a program Q such that
                    Q   ==   [Q] i  ==  X  P
    </pre>
    The required program <code>Q</code> is just the concatenation. But the theorem
    can be strengthened:
    <pre>        There is a program O such that
                for any program P and operand X
                    there is a program Q such that
                        X [P] O  ==  [Q] and
                        Q  ==  [Q] i  ==  X [P] i  ==  X P
    </pre>
    The required program <code>O</code> is <code>cons</code>:
    <pre>        X [P] O  ==  X [P] cons  ==  [X P]  ==  [Q]
    </pre>
    The theorem is rather trivial in Joy. The formalisation of the proof is an
    overkill. However, many proofs later on will have the same structure, and it may
    help to get used to that.
    <p>
      The parametrisation theorem generalises to any number <em> m</em> of arguments
      that are parametrised. Consequently it is often called the
      <em>S-m-n theorem</em>, see <a href="refs.html#{Rogers67}">{Rogers67}</a>. The
      "S" stands for "substitution" - it means that <em> m</em> of the <em> n</em> formal
      parameters are replaced by fixed values. In Joy notation repeated
      <code>cons</code> operations can parameterise for any <em> m</em>, simply by repeating
      <code>cons</code> <em> m</em> times.
    </p>
    <p>
      In recursive function theory it is possible for functions to take other functions
      as parameters, and since functions are untyped, they can take themselves as parameter.
      One consequence ot the S-m-n theorem is the <em>diagonalisation theorem</em>:
      There is a recursive function taking as argument the Gödel number of a function
      which takes at least one parameter, and giving as value the Gödel number of the
      function obtained from the given one by substituting itself for the parameter.
    </p>
    <p>
      Again, the counterpart in Joy is trivial.
    </p>
    <pre>        For any program P
                there is a program Q such that
                    [Q] i  ==  Q  ==  [P] P
    </pre>
    The required quoted <code>[Q]</code> is <code>[[P] P]</code>. The stronger
    form is:
    <pre>        There is a program O such that
                for any program P
                    there is a program Q such that
                        [P] O  ==  [Q]  and
                        [Q] i  ==  Q  ==  [P] dup i  ==  [P] P
    </pre>
    The required program <code>O</code> is <code>dup cons</code>. Proof:
    <pre>        [P] O  ==  [P] dup cons  ==  [P] [P] cons  ==  [[P] P]  ==  [Q]
            [Q] i  ==  [[P] P] i  ==  [P] P  ==  Q
    </pre>
    So in Joy the short program
    <pre>        dup  cons
    </pre>
    implements diagonalisation.
    <p>
      It may help to see diagonalisation in action for a small program:
    </p>
    <pre>        [dup reverse concat] dup cons i
        ==  [dup reverse concat] [dup reverse concat] cons i       (by dup)
        ==  [[dup reverse concat] dup reverse concat] i             (by cons)
        ==  [dup reverse concat] dup reverse concat                 (by i)
        ==  [dup reverse concat] [dup reverse concat] reverse concat(by dup)
        ==  [dup reverse concat] [concat reverse dup] concat        (by reverse)
        ==  [dup reverse concat concat reverse dup]                 (by concat)
    </pre>
    So the program <code>[dup reverse concat]</code> diagonalised and run produces
    its own palindrome. Most programs cannot be self-applied because it would breach
    typing. But here are a few, readers might like to see what they do:
    <pre>        []
            [reverse 42]
            [42 pop]
            [pop]
            [dup cons]
    </pre>
    <p>
      In <a href="refs.html#{Smullyan61}">{Smullyan61}</a> theory of formal systems of
      (character) strings, the
      <em> norm</em> or diagonalisation of a string <code>X</code> is defined to be <code>X</code>  followed by its own Gödel number in dyadic notation. In Joy the detour via Gödel
      number is eliminated by using quotations.
    </p>
    <p>
      We now consider two reductions. The first is this:
    </p>
    <pre>        [P]  dup  i
        ==  [P]  [P]  i                     (by dup)
        ==  [P]   P                         (by i)
    </pre>
    The second is this:
    <pre>        [P]  dup  cons  i
        ==  [P]  [P]  cons  i               (by dup)
        ==  [[P]  P]  i                     (by cons)
        ==  [P]  P                          (by i)
    </pre>
    So the two reductions come to the same, and hence their first lines are identical:
    <pre>        [P]  dup  i   ==   [P]  dup  cons  i
    </pre>
    But this holds for all <code>[P]</code>. So we may infer
    <pre>        dup  cons  i   ==   dup  i
    </pre>
    <h2>The fixpoint theorem and the y combinator</h2>
    An important result in computability is the <em>recursion theorem</em>, see for
    example
    <a href="refs.html#{Rogers67}">{Rogers67}</a>. It states:
    <blockquote>
      For every function P there is a Gödel number of a function Q such that the result
      of applying the function P to the Gödel number of Q is the Gödel number of a function
      identical with Q.
    </blockquote>
    The theorem says that for every function P which is used to edit code for computing
    functions, there is a program Q which will compute the same function before and after
    the editing. So Q is a fixpoint, a program not affected by P. Fixpoint theorems are
    about programs
    <code>P</code> (rather than about the functions which they compute).
    <p>
      Here is an equivalent version for Joy:
    </p>
    <pre>        For any program P
                there is a program Q such that
                    [Q] i   ==   Q   ==   [Q] P
    </pre>
    The required program <code>Q</code> is
    <pre>        [dup cons P] dup cons P
    </pre>
    The proof is as follows:
    <pre>        [            Q           ]  i
        ==  [[dup cons P]  dup cons P]  i                   (def Q)
        ==   [dup cons P]  dup cons P                       (by i)
        ==   [dup cons P] [dup cons P] cons P               (by dup)
        ==  [[dup cons P]  dup cons P]  P                   (by cons)
        ==  [            Q           ]  P                   (def Q)
    </pre>
    <p>
      The theorem may be strengthened. The transformation from
      <code>P</code> to <code>Q</code> can be done by a simple program
      <code>O</code>:
    </p>
    <pre>        There is a program O such that
                for any program P
                    there is a program Q such that
                        [P] O   ==   [Q]   and
                        [Q] i   ==   Q   ==   [Q] P
    </pre>
    The required program <code>O</code> is
    <pre>        [dup cons]  swap  concat  dup  cons
    </pre>
    The proof is as follows:
    <pre>        [P] O
        ==  [P]  [dup cons]  swap  concat  dup  cons        (def O)
        ==  [dup cons]  [P]        concat  dup  cons        (by swap)
        ==  [dup cons P]                   dup  cons        (by concat)
        ==  [dup cons P]  [dup cons P]          cons        (by dup)
        ==  [[dup cons P] dup cons P]                       (by cons)
        ==  [Q]                                             (def Q)
    </pre>
    The fixpoint finding program <code>O</code> is useful: henceforth it will
    be called the <kbd>fix</kbd> operator. We also define the
    <kbd>y</kbd> combinator for Joy:
    <pre>        y   ==   fix  i
    </pre>
    This is the Joy counterpart of Curry's "paradoxical" <em>Y
    combinator</em> (uppercase), see <a href="refs.html#{Curry58}">{Curry58}</a>. This
    combinator is well known in the literature on the lambda calculus and on combinatory
    logic.
    <p>
      The recursion theorem traces its ancestry to Epimenides, Russell and Grelling (for
      <code>[P]</code> put <code>[i not]</code>, and to Gödel. In its general form
      it is due to Kleene. Its proof is very cumbersome in just about all formalisms.
      As can be seen from the above, in Joy the proof is very simple.
    </p>
    <p>
      The S-m-n theorem is the basis for <em>partial evaluation</em> or
      <em>program specialisation</em>. A special case for this is the partial evaluator
      <em>mix</em> which can transform an interpreter into a compiler, and can transform
      itself into a compiler generator.
      <a href="refs.html#{Jones92}">{Jones92}</a> shows that such transformations can
      be done realistically only if the partial evaluator has primitives in terms of
      which the fixpoint constructions of the recursion theorem can be implemented efficiently.
      The two primitives chosen are in fact very close to Joy's <code>i</code> combinator
      and quotation.
    </p>
    <p>
      The recursion theorem leads in a few steps to Rice's theorem, see
      <a href="refs.html#{Rogers67}">{Rogers67}</a>, which encapsulates all the bad news
      of computability theory: for example the <em>halting problem</em>, or the impossibility
      of writing programs which check other programs - implementation, student exercises
      - for correctness.
    </p>
    <h2>Some simple cases</h2>
    The theorem, in both forms, speaks of <em> all</em> programs
    <code>P</code>. It is of some interest to see what happens when some simple actual
    programs are chosen. Two particularly simple programs are
    <ol>
      <li> the empty program, which computes the identity function, and
      </li>
      <li> the <code>i</code> combinator program, which dequotes and executes a program on
        top of the stack.
      </li>
    </ol>
    <p>
    </p>
    <ol>
      <li>
        A frequently paraded corollary of the recursion theorem is the existence of <em>self-reproducing program</em>s.
        When run, these program produce a replica of themselves. A suitably general definition
        of self-reproducing programs is this: a program
        <code>S</code> is self-reproducing if this conditions holds:
        <pre>        S  i   ==   S
    </pre>
        Note that <code>S</code> is allowed to be arbitrarily complex, it does
        not have to be just a quoted program. Such programs are obtained from the recursion
        theorem by making <code>P</code> compute the identity function. In Joy this is
        represented most simply by the empty program, in quoted form <code>[]</code>.
        (Alternatively, it is represented by the program <code>id</code>, in quoted form
        <code>[id]</code>.)
        <pre>        There is a program Q such that
                [Q] i   ==   [Q]
    </pre>
        Proof: let <code>Q</code> be the program
        <pre>            [dup cons] dup cons
    </pre>
        Then the derivation is as follows:
        <pre>        [[dup cons]  dup cons]  i
        ==   [dup cons]  dup cons                           (by i)
        ==   [dup cons] [dup cons] cons                     (by dup)
        ==  [[dup cons]  dup cons]                          (by cons)
    </pre>
        Readers might like to be reminded of a self-replicating C-program:
        <pre>
    p="p=%c%s%c;main(){printf(p,34,p,34);}";main(){printf(p,34,p,34);}
    </pre>
        (Author unknown. Proving correctness is not easy.)
        <p>
          Related to self-reproducing programs are <em>self-describing
          program</em>s. A program <code>S</code> is self-describing if running it produces
          a description of it. In Joy a program <code>S</code> is self-describing if
          this condition holds:
        </p>
        <pre>        S   ==   [S]
    </pre>
        Here is a self-describing program:
        <pre>        [dup cons] dup cons
        ==  [dup cons] [dup cons] cons                      (by dup)
        ==  [[dup cons] dup cons]                           (by cons)
    </pre>
        <p>
        </p>
      </li>
      <li>
        The other simple program to investigate is the <code>i</code> combinator. Then
        <code>[P]</code> is <code>[i]</code>, and
        <code>[Q]</code> is <code>[[dup cons i] dup cons i]</code>. This is what happens:
        <pre>        [[dup cons i]  dup cons i]  i
        ==   [dup cons i]  dup cons i                       (by i)
        ==   [dup cons i] [dup cons i]  cons i              (by dup)
        ==  [[dup cons i]  dup cons i]  i                   (by cons)
    </pre>
        So this is a program that runs forever. This is the Joy counterpart of
        what in the lambda calculus is selfapplication selfapplied. In both the reductions
        do not terminate. In the lambda calculus the rule used is beta-reduction, the
        substitution of actual for formal parameters. In Joy there are no formal parameters,
        just algebraic simplification.
        <p>
          The <code>dup cons</code> combination occurs so frequently that it is worth
          introducing an operator <kbd>duco</kbd> defined by
        </p>
        <pre>        duco   ==   dup  cons
    </pre>
        This will make proofs shorter both horizontally (because programs are shorter)
        and vertically (because two steps are condensed into one).
        <p>
        </p>
      </li>
      <li>
        The next kind of program is with <code>[P]</code> =
        <code>dup</code>. Then <code>[Q]</code> is the quotation in the first line below,
        and execution is as follows:
        <pre>        [[duco dup] duco dup]  i
        ==   [duco dup] duco dup                            (by i)
        ==  [[duco dup] duco dup] dup                       (by duco)
        ==  [[duco dup] duco dup] [[duco dup] duco dup]     (by dup)
    </pre>
        So this is an example of a program which when run produces two copies
        of itself. The program in the second line is another
        <em>self-describing program</em>, it produces two copies of itself.
        <p>
        </p>
      </li>
      <li>
        The next program uses <code>[P]</code> = <code>dup i</code>. Then execution starts
        like this:
        <pre>        [[duco dup i] duco dup i]  i
        ==   [duco dup i] duco dup i                                (by i)
        ==  [[duco dup i] duco dup i] dup i                         (by duco)
        ==  [[duco dup i] duco dup i] [[duco dup i] duco dup i] i   (by dup)
    </pre>
        So this is another program that runs forever. In addition it leaves earlier
        copies of itself on the stack. In an implementation it must run out of stack
        space. The program in the second line is again self-describing, but it never
        finishes what would be a description of infinitely many copies of itself.
        <p>
          Another program that does much the same is
        </p>
        <pre>        [[duco dup dip] duco dup dip]
    </pre>
        <p>
        </p>
      </li>
      <li>
        In the introduction a program was given which computes the factorial function without
        being defined recursively. Here are the first few steps in the execution of that
        program, those that are independent of the numeric parameter that is provided
        to the program. To save space, the <code>duco</code> operator is used.
        <pre>        [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            y
        ==  [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            fix  i                                                  (by y)
        ==  [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            [duco] swap concat duco  i                              (def fix)
        ==  [duco] [ [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            concat duco  i                                          (by swap)
        ==  [ duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            duco  i                                                 (by concat)
        ==  [[ duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
               duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            i                                                       (by duco)
        ==  [ duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte     (by i)
        ==  [[ duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
               duco [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte ]
            [pop 0 =] [pop pop 1] [[dup 1 -] dip i *] ifte          (by duco)
    </pre>
        At this point the numeric parameter for the computation will be needed.
        The <code>ifte</code> combinator will execute its if-part. That results in the
        long two-line quotation being popped off the stack and the parameter being compared
        with 0. If that evaluates to
        <code>true</code>, the then-part is executed with the parameters and the two-line
        quotation still on top of the stack, The then-part pops both and replaces them
        by 1. But if the if-part returns
        <code>false</code>, the else-part is executed, again with the parameter and the
        two-line quotation on top of the stack.
        <p>
          First the two-line quotation is set aside by <code>dip</code>, the parameter
          is duplicated and the top copy decremented. Only then the two-line quotation
          will be executed by <code>i</code>. The effect is to construct a clone of itself
          with <code>duco</code>, pushing the same if-part, then-part and else-part for
          the contained
          <code>ifte</code>. When that eventually returns, the old parameter and above
          it the factorial of the decremented parameter copy are finally multiplied to
          give the required factorial of the original parameter.
        </p>
      </li>
    </ol>
    <h2>Evaluation order</h2>
    Most theoretical and practical programming languages use <em>formal
    parameter</em>s in definitions of functions (and procedures). These functions are
    called with expressions as the <em>actual
    parameter</em>s. There are two ways of doing this: <em>normal
    order</em>, also known as <em>call by name</em>, and <em>applicative
    order</em>, also known as <em>call by value</em>. In normal order the unevaluated
    expressions are substituted for the formal parameters, and the expressions will be
    evaluated only if the body of the function requires it.
    <p>
      In applicative order the expressions are evaluated first and that value is substituted
      for the formal parameter. If the value of a parameter expression is used repeatedly
      in the body of the function, then normal order requires repeated evaluation of
      the expression, whereas applicative order requires only one evaluation. On the
      other hand, if the body does not require the value at all, then applicative order
      will have wasted time trying to evaluate the expression. If that evaluation does
      not terminate at all, then the call of the function will fail to terminate under
      applicative order although it would have terminated under normal order. Consequently
      there are some functions that are less defined under applicative order evaluation
      than they are under normal order.
    </p>
    <p>
      The Y combinator of the lambda calculus does not work at all for applicative order.
      No matter what the function is, the call with the Y combinator will try to do the
      unending sequence of substitutions and hence fail to terminate. Therefore a different
      version of the Y combinator has to be used, see <a href="refs.html#{Stoy77}">{Stoy77}</a>,
      <a href="refs.html#{Henson87}">{Henson87}</a>, <a href="refs.html#{Paulson92}">{Paulson92}</a>,
      <a href="refs.html#{Winskel93}">{Winskel93}</a>.
    </p>
    <p>
      In Joy there are no formal parameters, there is no substitution, and hence strictly
      speaking there is no evaluation order. Joy functions take their actual parameters
      as values from the stack, and in a way this <em> resembles</em> applicative order.
      The <code>y</code> combinator of Joy always terminates correctly provided that
      the quoted program and any of its actual parameters did get onto the stack, and
      provided that the quoted program terminates. So there is a difference between the
      Y combinator of the lambda calculus under applicative order, and the <code>y</code>  combinator of Joy. What is the reason? Consider again, for an arbitrary program
      <code>[P]</code>
    </p>
    <pre>        [P]  y
        ==  [P]  fix  i
        ==  [[duco P] duco P]  i
        ==  [duco P]  duco P
        ==  [[duco P] duco P]  P
    </pre>
    This point is always reached in the initial call, and it is independent of
    what <code>P</code> actually is. At this point there is a (double) quotation (containing
    <code>P</code> twice) on top of the stack, and <code>P</code> now has it available
    as a parameter. Quotations are never evaluated further, although they can be explicitly
    manipulated by operators or they can be explicitly called by combinators. Consequently
    the second <code>duco</code> inside the quotation will <em> not</em> be executed
    to yield
    <pre>    ==  [[[duco P] duco P] duco P]  P
    </pre>
    Here of course the second and third <code>duco</code> would have been the
    next candidates for execution, and so on. So the reason for the difference is that
    quotations in Joy are never evaluated automatically, whereas abstractions in the
    lambda calculus will be under applicative order evaluation.
    <p>
      It is possible to generalise fixpoint combinators for mutual recursion. For the lambda
      calculus this is done for example by
      <a href="refs.html#{Kogge91}">{Kogge91}</a>, shows how pairs of mutually recursive
      definitions can be eliminated by using a pair of rather complicated mutually recursive
      combinators Y1 and Y2. A similar technique is explained in
      <a href="refs.html#{Henson87}">{Henson87}</a>. Constructions such as these rely
      on the existence of
      <em>double fixpoints</em>, whose existence follows from a <em>double
      recursion theorem</em> (see for example <a href="refs.html#{Smullyan94}">{Smullyan94}</a>).
      Presumably these can be translated into Joy, too.
    </p>
    <h2>Rice's theorem</h2>
    Consider arbitrary sets of functions, and note that this does not mean sets of programs.
    Call such a set <em> non-trivial</em> if it is neither the universal set of all functions
    nor the null set of no functions. Given a non-trivial set <code>F</code> of partial
    functions and a Joy program <code>[Q]</code>, the question arises whether the function
    computed by <code>[Q]</code> is in <code>F</code> or not. Is there an algorithm for
    deciding such questions? More specifically, is there a Joy program, say <code>PF</code>,
    for deciding such questions? Such a program would have to satisfy
    <pre>    [Q]  PF   ==   true,  if the function computed by [Q] is in F
                  ==   false, if the function computed by [Q] is not in F
    </pre>
    The program <code>PF</code> is also expected to terminate for all inputs <code>[Q]</code>.
    Can there be such a program?
    <p>
      No. This is <em>Rice's theorem</em>:
    </p>
    <pre>        For all non-trivial sets F of partial functions,
                there is no program  PF  such that
                    for all programs  Q
                        PF can decide whether
                            the function computed by  Q  is in F.
    </pre>
    Proof: Let <code>F</code> be a non-trivial set of functions. Since
    <code>F</code> is non-trivial, there are some functions in
    <code>F</code> and some functions not in <code>F</code>. Let program
    <code>[E]</code> compute a function in <code>F</code> and let
    <code>[E']</code> compute a function not in <code>F</code>.
    <p>
      Now assume that a program <code>PF</code> exists, and that it always terminates.
      Next, consider the following Joy program:
    </p>
    <pre>        [PF]  [pop [E']]  [pop [E]]  ifte
    </pre>
    The program expects an arbitrary program <code>[Q]</code> on top of the stack
    and then pushes the three small quotations. The
    <kbd>ifte</kbd> operator then removes them again and executes the first short quotation
    <code>[PF]</code>. This will result in a truth value, <code>true</code> or <code>false</code>.
    In the first case the second short quotation is executed, it <code>pop</code>s the
    <code>[PF]</code> and replaces it by <code>[E']</code>. In the second case the third
    short quotation is executed, it <code>pop</code>s the
    <code>[PF]</code> and replaces it by <code>[E]</code>. So, if
    <code>[Q]</code> is in <code>F</code>, the program returns a program not in <code>F</code>,
    namely <code>[E']</code>. On the other hand, if <code>[Q]</code> is not in <code>F</code>,
    the program returns a program that is in <code>F</code>, namely <code>[E]</code>.
    In other words, no matter what the input program <code>[Q]</code> is, the output
    program is opposite as far as membership in <code>F</code> is concerned. Call the
    above program <code>OPF</code>.
    <p>
      By the fixpoint theorem, the program <code>OPF</code> must have a fixpoint, say
      <code>FIXOPF</code>, satisfying
    </p>
    <pre>        FIXOPF  ==  [FIXOPF]  OPF
    </pre>
    But if the program on the left computes a function in <code>F</code>, then
    the program on the right computes a function not in
    <code>F</code>, and vice versa. But this is a contradiction. So the program <code>OPF</code>fails for at least one program, its own fixpoint <code>FIXOPF</code>. We must conclude
    that the assumption was false. So there cannot be a program <code>PF</code>.
    <p>
      The above proof of Rice's theorem for Joy is adapted from a proof for recursive functions
      in <a href="refs.html#{Phillips92}">{Phillips92}</a>. Several well-known
      <em>paradox</em>es are instances of the recursion theorem, for example the <em>Liar paradox</em>  and <em>Grelling's paradox</em> use as the program <code>[P]</code> the simple
      program <code>[i not]</code>. Recent discussions of the Liar and related problems
      can be found in
      <a href="refs.html#{Martin70}">{Martin70}</a> and in <a href="refs.html#{Barwise-Etchemendy87}">{Barwise-Etchemendy87}</a>.
    </p>
    <h2>Other self-reproducing and self-describing programs</h2>
    There are variants of the programs in section 5 which are worth mentioning.
    <ol>
      <li>
        The following is a simplification of the first self-reproducing program. It is simpler
        because it uses an operand parameter which it leaves intact.
        <pre>        There is an operand Q1 and a program Q2 such that
                Q1  [Q2]  i   ==   Q1  [Q2]
    </pre>
        Proof: Let <code>Q1</code> = <code>[dup]</code> and let
        <code>Q2</code> = <code>dup</code>. Then the derivation is
        <pre>        [dup]  [dup]  i
        ==  [dup]   dup                             (by i)
        ==  [dup]  [dup]                            (by dup)
    </pre>
        This seemingly trivial self-reproducing program will be used to derive
        a version of recursion that is actually more efficient than the one based on
        the <code>y</code> combinator.
        <p>
        </p>
      </li>
      <li>
        The next uses the <code>b</code> combinator:
        <pre>        There are programs Q1 and Q2 such that
                [Q1] [Q2] b   ==   [Q1] [Q2]
    </pre>
        Proof: let Q1 and Q2 be the programs
        <pre>        [[] cons dup first]
             [] cons dup first
    </pre>
        Then the derivation is:
        <pre>        [[[] cons dup first]]  [[] cons dup first]  b
        ==   [[] cons dup first]    [] cons dup first           (by b)
        ==  [[[] cons dup first]]           dup first           (by cons)
        ==  [[[] cons dup first]] [[[] cons dup first]] first   (by dup)
        ==  [[[] cons dup first]]  [[] cons dup first]          (by first)
    </pre>
        It is useful to introduce an operator <kbd>codufi</kbd> by the definition:
        <pre>        codufi  ==  cons dup first
    </pre>
        The operator will be found useful in the next section.
        <p>
        </p>
      </li>
      <li>
        The next example of a self-reproducing program again uses the
        <code>i</code> combinator:
        <pre>        There is a program Q such that
                    [Q] i i   ==   [Q]   =/=   [Q] i
    </pre>
        Proof: let <code>Q</code> be the program
        <pre>        [duco [] cons] duco [] cons
    </pre>
        The execution now looks like this:
        <pre>         [[duco [] cons] duco [] cons]   i  i
        ==    [duco [] cons] duco [] cons  i                        (by i)
        ==   [[duco [] cons] duco [] cons] [] cons  i               (by duco)
        ==  [[[duco [] cons] duco [] cons]]  i                      (by cons)
        ==   [[duco [] cons] duco [] cons]                          (by i)
    </pre>
        Observe that the quoted programs in the first and fourth line differ by
        just the extra quoting in line four.
        <p>
          There is another program with the property. Let <code>Q</code> be the program
        </p>
        <pre>        [false [not] infra dup rest cons] [not] infra dup rest cons
    </pre>
        The combinator <kbd>infra</kbd> expects a program (here
        <code>[not]</code>) on top of the stack, and below that a quotation (here the
        first half of the program). It temporarily turns the quotation into the stack
        and executes the program (here it complements the truth value <code>false</code>    or <code>true</code> at the very beginning. An outline of the derivation is:
        <pre>    [[false [not] infra dup rest cons] [not] infra dup rest cons] i i
        [[true  [not] infra dup rest cons] [not] infra dup rest cons] i
        [[false [not] infra dup rest cons] [not] infra dup rest cons]
    </pre>
        (Each by 5 steps)
        <p>
          The quoted programs the first and second lines are examples of
          <em>mutually describing programs</em>, satisfying
        </p>
        <pre>        P  =  [Q]       and       Q  == [P]
    </pre>
        In detail:
        <pre>P  ==  [false [not] infra dup rest cons] [not] infra dup rest cons
    Q  ==  [true  [not] infra dup rest cons] [not] infra dup rest cons
    </pre>
      </li>
      <li>
        The previous program keeps an internal toggle (<code>true</code> or
        <code>false</code>) which is thrown every time it is called. The next program
        does the same with a counter, and consequently every generation is different
        from all previous ones: Let <code>Q</code> be the program
        <pre>    [0 [1 +] infra dup rest cons] [1 +] infra dup rest cons
    </pre>
        Successive executions using <code>i</code> cause the <code>0</code> to
        be incremented to <code>1</code>, <code>2</code> and so on.
        <p>
        </p>
      </li>
      <li>
        Almost all programs become ruined when maltreated. Cutting off bits and pieces would
        generally cause malfunction. Worms of course can regenerate from small pieces,
        but most programs are not like that. But programs can be written so that after
        each call they become more and more insensitive to mutilation. The mutilating
        operations are
        <code>first</code> and <code>rest</code> or sequences of such operations. There
        are programs which with every generation become less and less sensitive to longer
        and longer sequences of mutilations. Two such <code>Q</code> are
        <pre>        [duco duco] duco duco
            [cons duco] [cons duco] cons duco
    </pre>
        <p>
        </p>
      </li>
      <li>
        Kym Horsell commented that self-reproducing programs do not do anything useful. The
        idea would be that for a given program another program is to be found which is
        self-reproducing and at each generation executes the original program first.
        So the problem is to find, for arbitrary <code>P</code>, a program <code>Q</code>    such that
        <pre>        [Q]  i  i  ..  i   ==   P  P  ..  P  [Q]
    </pre>
        where the <code>i</code> on the left and the <code>P</code> on the right
        are repeated the same number of times. Here is one answer:
        <pre>        There is a program O such that
                for all programs P
                    there is a program Q such that
                            [P]  O   ==   [Q]   and
                            [Q]  i   ==   Q   ==   P  [Q]
    </pre>
        Proof: Let <code>O</code> be the program
        <pre>        [dup [first i] dip rest duco] cons duco
    </pre>
        Then for any <code>P</code>:
        <pre>    [P]  O
    ==  [P] [dup [first i] dip rest duco] cons duco         (by O)
    ==  [[P] dup [first i] dip rest duco] duco              (by cons)
    == [[[P] dup [first i] dip rest duco] [P] dup [first i] dip rest duco]
                                                            (by duco)
    </pre>
      </li>
    </ol>
    <h2>Another recursion combinator</h2>
    Apart from the <code>y</code> combinator there are other recursion combinators.
    One of them is given by the following theorem:
    <pre>        There is a program M such that
    (1)         [y] M  ==  [y] i  ==  y  and
                for some programs N and O
    (2a)             [M] [duco] swap concat  ==  [N]  and
    (2b)             [N] duco  ==  [O] and
    (3)              [M] y  ==  [N] dup i  ==  O  and
                     for all programs P
    (4)                  [P] O  ==  [P] y  and
                         there is a program Q such that
    (5)                     [P] [O] cons  ==  [Q]  and
    (6)                     [Q] i  ==  Q  ==  [Q] P
    </pre>
    The first line, (1), says that <code>y</code> is a fixpoint for
    <code>M</code>. Lines (2a) and (2b) show how to construct two further programs <code>N</code>and <code>O</code>. Line (3) expresses a relationship between the three programs
    <code>M</code>, <code>N</code> and <code>O</code>. Line (5) shows how to construct
    a program
    <code>Q</code> which depends on <code>P</code>. The last line of the theorem says
    that the <code>Q</code> is a fixpoint for <code>P</code>.
    <p>
      <b>Proof:</b> Only <code>M</code> need be given, because
      <code>N</code> and <code>O</code> are constructed. The required
      <code>M</code> is actually a combinator already seen in section 2:
    </p>
    <pre>        cons  dup  first  i
    </pre>
    But the first three operators can be replaced by <kbd>codufi</kbd> defined
    in the previous section. So we set:
    <pre>        M  ==  codufi i
    </pre>
    This is used to construct <code>N</code>:
    <pre>        [M] [duco] swap concat
        ==  [codufi i] [duco] swap concat                           (def M)
        ==  [duco] [codufi i]                                       (by swap)
        ==  [duco codufi i]                                         (by concat)
        ==  [N]                                                     (def N)
    </pre>
    So we have:
    <pre>        N  ==  duco codufi i
    </pre>
    This program can be used to construct <code>O</code>:
    <pre>        [N] duco
        ==  [duco codufi i] duco                                    (def N)
        ==  [[duco codufi i] duco codufi i]                         (by duco)
        ==  [O]                                                     (def O)
    </pre>
    So we have:
    <pre>        O  ==  [duco codufi i] duco codufi i
    </pre>
    This program can now be used to construct, for arbitrary
    <code>[P]</code> a corresponding <code>[Q]</code>:
    <pre>        [P] [O] cons
        ==  [P] [[duco codufi i] duco codufi i] cons                (def O)
        ==  [[P] [duco codufi i] duco codufi i]                     (by cons)
        ==  [Q]                                                     (def Q)
    </pre>
    So we have, for arbitrary <code>[P]</code>,
    <pre>        Q  ==  [P] [duco codufi i] duco codufi i
    </pre>
    It remains to be shown that <code>Q</code> is a fixpoint for <code>P</code>:
    <pre>        [Q]  i
        ==  [[P] [duco codufi i] duco codufi i]  i                  (def Q)
        ==   [P] [duco codufi i] duco codufi i                      (by i)
        ==  [P] [[duco codufi i] duco codufi i] codufi i            (by duco)
        ==  [[P] [duco codufi i] duco codufi i] [P] i               (by codufi)
        ==  [[P] [duco codufi i] duco codufi i]  P                  (by i)
        ==  [Q]  P                                                  (def Q)
    </pre>
    This shows that <code>Q</code> is indeed a fixpoint for <code>P</code>.
    <p>
      Different recursion combinators, and indeed a whole hierarchy of them, are well known
      in the literature on <em>lambda calculus</em> and
      <em>combinatory logic</em>; see for example <a href="refs.html#{Barendregt84}">{Barendregt84}</a>,
      <a href="refs.html#{Henson87}">{Henson87}</a>, <a href="refs.html#{Revesz88}">{Revesz88}</a>.
      Possibly one of the most satisfying introductions to combinatory logic is to be
      found in the remarkable little book <a href="refs.html#{Smullyan90}">{Smullyan90}</a>  <em> To Mock a Mockingbird</em> in which he manages to combine humour and rigour.
      Part III is a self-contained exposition to combinatory logic in which fancyful
      names are given to lambda calculus combinators.
    </p>
    <h2>Practical recursion combinators in Joy</h2>
    Here are three recursive definitions. The function
    <code>r-last</code> finds the <em>last</em> element of a list. The function <code>r-fac</code>computes the <em>factorial</em> of a number. The function <code>r-fib</code> computes
    the
    <em>Fibonacci</em> value of a number.
    <pre>    r-last  ==  [rest null] [first] [rest r-last] ifte
        r-fac  ==  [0 =] [succ] [dup pred r-fac *] ifte
        r-fib  ==  [small] [pop 1] [pred dup pred [r-fib] app2 +] ifte
    </pre>
    The following three functions also compute The last, the factorial and the
    Fibonacci of their parameter. Note that there is no definition; the recursion is
    taken care of by the <code>y</code> combinator.
    <pre>  [ [pop rest null] [pop first] [[rest] dip i] ifte ] y
      [ [pop 0 =] [pop succ] [[dup pred] dip i *] ifte ] y
      [ [pop small] [pop pop 1] [[pred dup pred] dip app2 +] ifte] y
    </pre>
    <p>
      But the <code>y</code> combinator is intrisically inefficient because of the way
      it operates. On every recursive call a certain program is popped off the stack
      to be executed. The first task of that program is to construct a copy of itself,
      in readiness for any further recursive calls. But this is really quite silly. It
      would be better more efficient if the program to be executed was <em> not</em>  popped off the stack at all but simply left there. Whereas most combinators remove
      their parameters from the stack, a new <kbd>x</kbd> combinator leaves it there
      as a parameter for itself.
    </p>
    <p>
      The following programs use the <code>x</code> combinator instead of the <code>y</code>  combinator. They are obtained from the first two of the previous programs by replacing
      the internal occurrences of the
      <code>i</code> combinator and the the external occurrence of the
      <code>y</code> combinator by the <code>x</code> combinator.
    </p>
    <pre>  [ [pop rest null] [pop first] [[rest] dip x] ifte ] x
      [ [pop 0 =] [pop succ] [[dup pred] dip x *] ifte ] x
    </pre>
    The <code>x</code> combinator <em> might</em> have been defined by
    <pre>        x  ==  dup i
    </pre>
    <p>
      Similar lambda calculus constructions are discussed in <a href="refs.html#{Tennent76}">{Tennent76}</a>,
      <a href="refs.html#{Bauer-Woessner82}">{Bauer-Woessner82}</a>, <a href="refs.html#{Schmidt86}">{Schmidt86}</a>  and <a href="refs.html#{Tennent91}">{Tennent91}</a>.
    </p>
    <p>
      The remainder of this section describes some further general and particular combinators
      of Joy which can be used to avoid recursive definitions.
    </p>
    <p>
    </p>
    <ol>
      <li>
        The <kbd>genrec</kbd> combinator takes four program parameters in addition to
        whatever data parameters it needs. Fourth from the top is an if-part, followed
        by a then-part. If the if-part yields true, then the then-part is executed and
        the combinator terminates. The other two parameters are the rec1-part and the
        rec2part. If the if-part yields <code>false</code>, the rec1-part is executed.
        Following that the four program parameters and the combinator are again pushed
        onto the stack bundled up in a quoted form. Then the rec2-part is executed, where
        it will find the bundled form. Typically it will then execute the bundled form,
        either with <code>i</code> or with
        <code>app2</code>, or some other combinator.
        <pre>    g-fac == [null ] [succ] [dup pred     ] [i *   ] genrec;
        g-fib == [small] [    ] [pred dup pred] [app2 +] genrec;
    </pre>
        <p>
        </p>
      </li>
      <li>
        The <kbd>linrec</kbd> combinator also takes four program parameters and is otherwise
        very similar to the <code>genrec</code> combinator. The essential difference
        is that the bundled up quotation is immediately called before the rec2-part.
        Consequently it can only be used for <em>linear recursion</em>. Here are programs
        for finding the
        <code>last</code> of an aggregate or the Fibonacci value of a natural number:
        <pre>    l-last == [rest null] [first] [rest    ] [ ] linrec;
        l-fac  == [null     ] [succ ] [dup pred] [*] linrec
    </pre>
        <p>
        </p>
      </li>
      <li>
        The <kbd>binrec</kbd> combinator is again similar, but it applies the bundled
        quotation twice, once to each of the two top values which the rec1-part has left
        on the stack. It implements <em>binary
        recursion</em>. Below it is used for the Fibonacci function and for a
        <em>quicksort</em> program for lists (or strings).
        <pre>  b-fib == [small] [] [pred dup pred   ] [+                 ] binrec;
    b-qsort == [small] [] [uncons [&gt;] split] [swap23 cons concat] binrec;
    </pre>
        <p>
        </p>
      </li>
      <li>
        The <kbd>tailrec</kbd> combinator is similar to the
        <code>linrec</code> combinator, except that it does not have a rec2-part. It
        can only be used for <em>tail recursion</em>, such as in the program below which
        returns the last element of an aggregate.
        <pre>    t-last == [rest null] [first] [rest] tailrec;
    </pre>
        <p>
        </p>
      </li>
      <li>
        The <kbd>primrec</kbd> combinator is for <em>primitive
        recursion</em>, it has the typical if-part built in. For numeric parameters and for
        aggregate parameters it tests for
        <code>null</code>. The rec1-part is also built in, for numeric parameters it
        returns the parameter and its predecessor, for aggregate parameters it returns
        the <code>first</code> of the aggregate and the
        <code>rest</code> of the aggregate. Recursion then occurs respectively on the
        predecessor or the rest, and the rudimentary rec2-part typically combines the
        results.
        <p>
          The first program below computes the factorial (again!). The second turns any aggregate
          into a list. The third turns a suitable list of small numbers into a set. The
          fourth and fifth capitalise lists or strings of lowercase letters and produce,
          respectively, a list or string of corresponding capital letters. The last program
          takes an aggregate as parameter and produces a list of every second element
          in the original order and then the other elements in the reverse order.
        </p>
        <pre>    p-fac      ==  [1 ]  [*              ]  primrec
        agg2list   ==  [[]]  [cons           ]  primrec
        list2set   ==  [{}]  [cons           ]  primrec
        capstring  ==  [""]  [[32 -] dip cons]  primrec
        caplist    ==  [[]]  [[32 -] dip cons]  primrec
        fancy      ==  [[]]  [reverse  cons  ]  primrec
    </pre>
      </li>
    </ol>
    <hr>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>