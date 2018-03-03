<template>
  <article>
    Joy compared with other functional languages
    <p>
      By Manfred von Thun
    </p>
    <p>
      Joy is a functional programming language
      which is not based on the application
      of functions to arguments
      but on the composition of functions.
      This paper compares and contrasts Joy with
      the theoretical basis of other functional formalisms
      and the programming languages based on them.
      One group comprises the lambda calculus
      and the programming languages Lisp, ML and Miranda.
      Another comprises combinatory logic and the language FP by Backus.
      A third comprises Cartesian closed categories.
      The paper concludes that Joy is
      significantly different from any of these formalisms
      and programming languages.
    </p>
    <h1>Introduction</h1>
    <p>
      This paper outlines the principal
      similarities and differences between Joy
      and other high-level and low-level functional languages.
    </p>
    <p>
      The best known functional languages
      are the <em>lambda calculus</em> and, based on it,
      the programming languages Lisp
      and its descendants.
      All of them rely heavily on two operations,
      abstraction and application,
      which are in some sense inverses of each other.
      Abstraction binds free variables in an expression,
      and it yields a function which is a first class value.
      The bound variables are the formal parameters of the function,
      and, importantly, they are named.
      Application of an abstracted function to some actual parameters
      can be understood as resulting in a substitution
      of actual for formal parameters and then evaluation
      of the modified expression.
      More efficiently application can be implemented using an <em>environment</em>
      of name-value pairs.
      The lambda calculus
      does not need definitions,
      but all functional programming languages allow them as a matter
      of convenience.
      Definitions also use named formal parameters,
      and in applications these have to be substituted
      or an environment has to be maintained.
    </p>
    <p>
      Two other functional languages are the <em>combinatory logic</em> of Curry
      and the <em>FP system</em> of Backus.
      They are not based on the lambda calculus,
      they eliminate abstraction completely and hence
      do not have to deal with substitution and environments.
      As a result these languages can be manipulated using simple
      algebraic techniques.
      But like the lambda calculus and the languages derived from it,
      both are based on the application of functions to arguments.
      However, application does not have attractive algebraic properties,
      and hence there is no theoretical reason for preferring
      one concrete notation over another.
    </p>
    <p>
      The languages of <em>category</em> theory comprises another group of functional
      languages.
      Whereas the other functional languages use function application,
      these use function composition.
      No high level programming language has been based on this formalism,
      but it has been used as a low level machine language
      as a target for compilation from a (typed) lambda calculus source.
      Joy is a high level programming language which
      resembles the categorical languages more than it resembles
      any of the other functional languages.
    </p>
    <p>
      The remainder of this paper is organised as follows:
      The next section gives an overview of the lambda calculus
      and of the programming languages that are based on it.
      The section after that describes combinatory logic
      which eliminates lambda abstraction.
      Following that is a section on the FP language of Backus.
      The next section then outlines the language of categories
      in which even function application is eliminated.
      In each of these sections the principal difference
      between these systems and Joy is outlined.
      There is also a final section on programming in the large;
      most structuring devices could be adapted to Joy in the future.
    </p>
    <h1>The lambda calculus and its descendants</h1>
    <p>
      For the present purposes is is sufficient
      to consider only the <em>abstract syntax</em> of the lambda calculus.
      A <em>lambda expression</em> is built from variables and constants
      by two constructions, abstraction and application.
      Constants are values such as number or lists,
      or they are functions such as addition and concatenation.
      In an expression an occurrence of a variable can be <em>free</em>
      or <em>bound</em>.
      Specifically in an expression consisting of just a variable
      that variable occurs free.
      In an expression consisting just of a constant
      there are no variables at all.
      An expression which is a <em>lambda abstraction</em>
      consists of a variable and a body which is an expression.
      The abstraction construction binds any free occurrences
      of that variable in the body.
      An expression which is an <em>application</em>
      consists of two expressions,
      the function and the argument (or actual parameter).
      Occurrences of free and bound variables in the
      function and the argument are also free and bound in the applicative expression.
    </p>
    <p>
      Functions of several variables can be abstracted
      by successive abstractions,
      and they can be applied to several arguments
      by successive applications.
      Each application returns a function of one less
      argument than the original.
      This device of replacing standard functions by their <em>curried</em> form
      allows the theory to concentrate exclusively
      on functions of one argument.
    </p>
    <p>
      Incidentally,
      a similar effect is achieved in Joy not by application
      but by <em>composition</em>.
      The program
    </p>
    <pre>        3  +
    </pre>
    denotes the composition of two functions from stacks to stacks.
    The first pushes the number 3,
    the second adds two number on top of the stack.
    The entire program denotes a function which adds 3
    to the top number of the stack.
    The space between the 3 and the <code>+</code> is not application 
    written in reverse but composition.
    <p>
      The <em>lambda calculus</em> uses several syntactic operations called
      <em>reduction</em>s.
      The most important of these is <em>beta reduction</em>
      of applicative expressions.
      If the function is an abstraction
      then the applicative expression
      reduces to the body of the function
      but with all free occurrences of the abstracted variable
      replaced by the argument of the application.
      Beta reduction corresponds exactly to calling a function
      in the terminology of programming languages.
      The difference with Joy is already apparent here,
      since Joy does not have any variables to be used in abstractions
      and beta reduction does not occur in Joy.
    </p>
    <p>
      Abstraction creates anonymous functions,
      and the pure lambda calculus does not have any facility
      for defining functions.
      In particular, it cannot be used to give <em>recursive definition</em>s
      of functions.
      But to compute recursive functions it is possible
      to introduce a single device,
      the <em>Y combinator</em>.
      This might have been defined recursively if that were possible,
      or it can be provided as one of the constants.
      However, it also turns out to be equivalent to a particular
      lambda expression.
    </p>
    <p>
      The simple lambda calculus can therefore be used to compute
      all recursive functions,
      and hence to compute any function that can be computed by a
      <em>Turing machine</em>.
      Even constants are not really necessary,
      since truth values, numerals, list operations
      and the like can be expressed as particular lambda expressions.
      It comes as a surprise that all <em>computable function</em>s
      can be expressed in the lambda calculus with just variables, abstraction
      and application, and can then be computed by reduction.
      However,
      any efficient implementation will need constants,
      and all practical programming languages based
      on the lambda calculus provide them.
    </p>
    <p>
      The lambda calculus can be extended with simple <em>let-expression</em>s
      and recursive <em>letrec-expression</em>s
      and with definitions.
      The additions make programming significantly easier,
      and this is approximately the level
      of the core of (pure) <em>Lisp</em> and its earlier descendants.
    </p>
    <p>
      Other extensions are <em>pattern matching</em> of formal and actual
      parameters,
      and static but <em>polymorphic</em> type checking.
      The best known functional programming languages
      that have these features are <em>ML</em> and 
      <em>Miranda</em>.
      Being descendants of Lisp and ultimately the lambda calculus,
      they are also based on abstraction and application.
    </p>
    <p>
      Peyton Jones (1987 Chapter 2) 
      contains a good exposition to the lambda calculus,
      including many extensions.
      The survey paper
      Hudak (1989) 
      compares many features of different functional languages,
      with a minor emphasis on <em>Haskell</em>.
      A very elegant general introduction to modern functional programming
      in a non-Lisp language can be found in
      Hughes (1990) .
      A recent introduction to Miranda
      is in
      Turner (1990) .
    </p>
    <p>
      A notable variation on the lambda calculus is described in
      Cartwright (1991) .
      Normally the binding operators (such as lambda )
      are special forms rather than operators in a semantic algebra.
      Here lambda is taken to be a true function;
      the universe of models is enlarged to include
      environments,
      and variables are interpreted as selector functions mapping
      environments to values.
    </p>
    <p>
      All languages mentioned in this section were based
      on application and abstraction.
      By contrast, Joy uses neither of these,
      instead it is based on composition and quotation.
      Brus   et al (1987 p 364) 
      write "if one wants to have a computational model
      for functional languages which is also close to their implementations,
      pure lambda calculus is not the obvious choice anymore".
      They present the language <em>Clean</em> in which programs
      consist of rewrite rules (for graphs)
      using pattern matching extensively.
      The implementation uses the rewrite rules
      more or less directly.
      Joy accepts the spirit of the above quotation,
      but draws a very different consequence.
    </p>
    <h1>Combinatory logic</h1>
    <p>
      Robinson (1969 p 125) 
      remarked:
      "whatever can be expressed in a language based on application
      <em> and</em> abstraction as fundamental notions
      can be expressed in a far simpler language
      <em> based on application alone</em>."
      The simpler language is <em>combinatory logic</em>.
      It is not a way of doing logic in a combinatory way,
      but it deals with the logic of combinators
      which denote higher order functions.
      The key idea came from
      Sch\"{o}nfinkel (1924) 
      but was greatly expanded by Curry.
      The classic reference,
      Curry and Feys (1958) 
      uses the same notation as is used today.
      A recent short exposition of the basic combinators is given for example in
      Henson (1987) .
    </p>
    <p>
      The calculus of combinators can be understood without reference
      to its connection with the lambda calculus,
      as indeed it is done in many expositions.
      But for the present purposes it is best to keep
      in mind the goal of eliminating abstraction from the lambda calculus
      while retaining <em>Turing completeness</em>.
    </p>
    <p>
      Abstraction is a construction in the <em>object language</em>,
      the lambda calculus.
      In combinatory logic this construction is replaced by
      an operation in the <em>metalanguage</em>.
      This new operation is called <em>bracket abstraction</em>.
      It takes an object language variable
      and an object language expression as arguments
      and it yields a new object language expression as value.
      The new expression will contain some function symbols
      specific to combinatory logic.
      If all object language lambda abstraction are removed from
      a lambda expression by this process of metalanguage bracket abstraction,
      then the final result will be equivalent to the original expression.
      So this process should be seen as a compilation.
      Since all lambda calculus expressions can be compiled in this manner,
      the language of combinators is again Turing complete.
    </p>
    <p>
      The astonishing feature of this compilation is that it only needs
      two new function constants or combinators.
      However, to understand the rationale,
      it is best to start with three combinators.
      The three arise naturally from considering
      the cases of lambda expressions
      on which bracket abstraction with respect to a variable
      is to be performed.
      These will be lambda expressions without lambda abstractions,
      so they are just variables or applications.
    </p>
    <p>
      Let <code>x</code> be the variable to be abstracted.
      1) If the expression is the same variable <code>x</code>,
      then the bracket abstraction should give the  <em>identity function</em>
      which just returns its argument.
      So the unary <em>I combinator</em> is introduced as the translation,
      it will receive its argument only when the abstracted
      expression is applied.
      2) If the expression is a different variable <code>y</code>,
      then the abstraction should give a constant function
      which ignores its argument <code>x</code> and just returns <code>y</code>.
      A single binary <em>K combinator</em> is introduced
      and given the argument <code>y</code>.
      The translation will receive its second argument
      only when the abstracted expressions is applied,
      and then it will ignore that argument.
      3)
      If the expression is an application of a function <code>f</code>
      to an argument <code>g</code>,
      then both the function and the argument first have to be
      abstracted with respect to <code>x</code>,
      The final bracket abstraction will be applied to an argument
      and then it has to make this argument available to both
      subabstracts.
      A ternary <em>S combinator</em> is introduced
      which does just that.
      It is given as arguments the two subabstract from <code>f</code> and <code>g</code>.
      The translation will receive its third argument
      only when the translation is applied to its argument.
      At that point it will supply that argument to
      the translation of <code>f</code> and <code>g</code>
      and then apply the result from <code>f</code> to the result from <code>g</code>.
    </p>
    <p>
      These are the three principal combinators arising naturally.
      It so happens that the I combinator can actually be defined
      in terms of the other two.
      So any lambda calculus expression can be translated
      into a combinatory expression in which
      there are no variables but just two combinators K and S.
      Since lambda calculus even <em> without constants</em>
      is Turing complete,
      combinatory logic with just K and S and <em> no other constants</em>
      is also Turing complete.
      This is all the more surprising since
      an expression consisting exclusively of K and S
      is really just a tree in which the leaves hold only one bit.
    </p>
    <p>
      Here are some links to web pages.
      An introduction to combinatory calculus, by Brent Kerby,
      a valued contributor to the concatenative mailing group:
    </p>
    <ul>
      <li><a href="http://tunes.org/~iepos/introduction-to-logic/chap00/sect00.html">Functions and Currying</a>
      </li>
      <li><a href="http://tunes.org/~iepos/introduction-to-logic/chap00/sect01.html">Common Combinators: B, C, W, K, I, S</a>
      </li>
      <li><a href="http://tunes.org/~iepos/introduction-to-logic/chap00/sect02.html">Lambda Construct and Completeness</a>
      </li>
      <li><a href="http://tunes.org/~iepos/introduction-to-logic/chap00/sect03.html">Iterators: Combinatory Numbers</a>
      </li>
      <li><a href="http://tunes.org/~iepos/introduction-to-logic/chap00/sect04.html">Other Interesting Combinators</a>
      </li>
    </ul>
    Another interesting discussion on combinators, by Peter Hancock:
    <ul>
      <li><a href="http://www.dcs.ed.ac.uk/home/pgh/arithmetic.lhs">
        AMEN combinators</a>
      </li>
    </ul>
    <p>
      The simple compilation scheme yields translations
      whose length can be exponential
      in the length of the source expression.
      Optimisations have been known for a long time
      which produce translations of only quadratic length.
      These optimisations use further combinators that are
      special cases of the S combinator.
      But the size of the translation result was still
      prohibitive for any but the smallest lambda expressions.
    </p>
    <p>
      Turner (1979) 
      introduced some optimisations
      into the standard translator from lambda calculus
      to combinator notation.
      With these optimisations the size of the combinatory code
      was kept within an acceptable limit.
      The interpreter for the combinatory code
      used <em>normal graph reduction</em>,
      one form of <em>lazy implementation</em>
      in which actual parameters are evaluated only once.
      Turner's implementation method using combinators has been used
      to build a hardware reduction machine,
      the <em>CURRY chip</em>, see
      Ramsdell (1986) .
    </p>
    <p>
      Peyton Jones (1987 Chapter 16) 
      contains a good exposition on the translation
      from the lambda calculus to combinators
      and many details of the implementation of Miranda.
      Hindley and Seldin (1986) 
      provide a very complete parallel account
      of the lambda calculus, combinatory logic and their relationship.
      Robinson (1969) 
      shows how the language of Sch\"{o}nfinkel and Curry
      can be used in the mechanisation
      of theorem proving in higher order logic.
      Fradet and Le M\'{e}tayer (1989) 
      show how to compile lambda calculus into conventional machine code.
      Fradet (1991) 
      uses what are described as low level indexed combinators
      as a target language to implement a lambda calculus language.
      Expressions using these combinators lend themselves to rewriting techniques,
      including optimisations.
      Impressive execution times are reported.
      The target code is again not intended to be read by human users.
    </p>
    <p>
      The variables of the lambda calculus
      are very similar to the variables of predicate logic.
      The notions of free and bound variables are essentially the same
      in both fields,
      and so is the operation of substituting a term
      for a free variable.
      Henkin, Monk and Tarski (1971) 
      show how simultaneous substitution for variables
      can be eliminated in terms of the <em>identity relation</em>.
      The idea is that every formula which uses variables
      in some arbitrary order
      is replaced by another formula in which all variables
      occur exactly once and in strictly alphabetical order.
      The replacement formula will typically contain
      more variables than the original.
      The replacement formula is then to be conjoined with several
      identity sentences of the form <code>x=y</code>.
      It can be shown that the resulting conjunction is
      logically equivalent to the original formula.
      It may be that this idea can be adapted to the lambda calculus.
      As an implementation technique it would amount to
      something like this:
      A lambda term is replaced by another term using consecutive
      variables, and the replacement is associated with
      some identity statements which guide the values.
      There may be some connection with <em>director strings</em>
      used in some implementations of functional languages,
      (see for example
      Peyton Jones (1987 p 274) ).
      But it is unlikely that a high level programming
      language could be designed which uses these principles.
    </p>
    <h1>Combinatory logic and Joy</h1>
    <p>
      The difference between combinatory logic and Joy is best explained
      by a simple example.
      To multiply two numbers, say <code>2</code> and <code>3</code>, in Joy one writes
    </p>
    <pre>        2  3  *
    </pre>
    In combinatory logic one writes
    <pre>        *  2  3
    </pre>
    and there seems to be no significant difference between the two notations
    apart from the order of operators and operands.
    But this is deceptive.
    In combinatory logic a two-argument function like multiplication
    is understood to be <em>curried</em>.
    The binary <code>*</code> function is first applied to <code>2</code>,
    yielding a function which doubles its argument.
    That function is then applied to <code>3</code> yielding the result <code>6</code>.
    Fully parenthesised the expression is
    <pre>        (* 2)  3
    </pre>
    However, the convention is that application associates to the left,
    so the parentheses are not needed.
    <p>
      To compute the square of a number, say <code>3</code>, it has to be multiplied by itself.
      In combinatory logic and in Joy one can write, respectively,
    </p>
    <pre>        *  3  3                                  3  3  *
    </pre>
    But in both notations it is possible to modify the
    binary multiplication
    function to turn it into the unary squaring function.
    In combinatory logic the <em>W combinator</em>
    can be applied to a function which then duplicates the (first)
    argument of the function.
    It is defined by
    <pre>        (W f) x   =   (f x) x
    </pre>
    Again the parentheses are not needed.
    So the square of <code>3</code> is given by
    <pre>        (W *) 3
    </pre>
    In Joy the simplest way to compute the square of <code>3</code> is by
    <pre>        3  dup  *
    </pre>
    To facilitate the comparison between the two languages it is also
    possible to define a <kbdw< kbd="" combinator="" in="" joy:="" <pre="">
    w   ==   [dup] dip
    Then the square of <code>3</code> is also computed in Joy by
    <pre>        3  [*]  w
    </pre>
    <p>
      In both languages one can introduce a mapping combinator to apply
      a function to a list.
      In the examples to follow the list will be just <code>[1 2 3 4]</code>.
      In combinatory logic one might define a <em>Map combinator</em> by
    </p>
    <pre>        Map  f  []   =   []
            Map  f  [X | Xs}   =   [f X | Map f Xs]
    </pre>
    where the bar <code>|</code> separates the first element of the list
    from the rest.
    Then the list of squares of the given list is computed by
    <pre>        Map  (W *)  [1 2 3 4]
    </pre>
    Note that the parentheses around <code>(X *)</code> are necessary.
    The same computation is expressed in Joy by
    <pre>        [1 2 3 4]  [[*] w]  map
    </pre>
    Superficially one version is just the reverse of the other.
    Combinatory logic uses prefix notation,
    and Joy uses what looks like postfix notation.
    <p>
      But the apparent similarity is deceptive.
      To see this it will help to write both versions with the hidden
      operators made explicit.
      In combinatory logic the hidden binary operator is <em>application</em>
      of a function to an argument,
      which might be written explicitly as infix <code>"@"</code>.
      Fully parenthesised the combinatory version thus is
    </p>
    <pre>        (Map  @  (W  @ *))  @  [1 2 3 4]
    </pre>
    In Joy the hidden binary operator is <em>composition</em>
    of functions,
    which might be written explicitly as infix <code>"."</code>.
    The Joy version thus is
    <pre>        [1 2 3 4]  .  [[*]  .  w]  .  map
    </pre>
    There are as many compositions in the Joy version as there are
    applications in the combinatory logic version.
    Since composition is associative, it does not matter how the
    expression is parenthesised.
    <p>
      Because of associativity the following is also meaningful in Joy:
    </p>
    <pre>        [1 2 3 4]  .  [[*]  .  w]
    </pre>
    It denotes a function which pushes two items,
    a list and a quotation, onto the stack.
    By contrast its combinatory counterpart
    <pre>        (W  @  *)  @  [1 2 3 4]
    </pre>
    is not meaningful.
    This is because the squaring function on the left,
    <code>(W @ *)</code>,
    expects to be applied to a <em> number</em> on the right,
    and not a <em> list</em>.
    <p>
      Another way of noting the difference between combinatory logic and
      Joy is in the following equations,
      here again with application and composition left implicit:
    </p>
    <pre>        Map  (W  *)  [1 2 3 4]   =   [1 4 9 16]
            [1 2 3 4]  [[*] w]  map   ==   [1 4 9 16]
    </pre>
    The combinatory logic version denotes the identity of objects,
    in this case lists.
    The Joy version denotes the identity of functions,
    in this case functions which,
    when applied to a stack, will push a list.
    Stacks are the arguments to which all Joy functions are applied,
    but this application plays no role in the construction of programs.
    By contrast, application is the principal program constructor
    in combinatory logic,
    even if the application operator is left implicit.
    <p>
      Wald (1993) 
      develops a theory of 'unary pairfunctions'
      with primitives <code>L</code>, <code>S</code>, <code>D</code> and <code>B</code>
      satisfying
    </p>
    <pre>    L(&lt;a,b&gt;) = a                    S(&lt;a,b&gt;) = &lt;b,a&gt;
            D(a) = &lt;a,a&gt;                    B(&lt;a,&lt;b,c&gt;&gt;) = &lt;&lt;a,b&gt;,c&gt;
    </pre>
    He gives a finite presentation (69 axioms)
    of a <em>semigroup</em> of such functions under composition.
    The theory is not intended as the basis of an implementation,
    but it would appear that there are some connections
    with Joy that are worth exploring.
    <h1>Backus' FP systems</h1>
    <p>
      In his Turing award lecture
      Backus (1978) 
      introduced his <em>FP system</em>,
      short for "Functional Programming system".
      The system is not about programming using functions,
      as Lisp and its descendents are,
      but about programming with functionals,
      also known as higher order functions or
      combinators or, in his terminology, <em> functional forms</em>.
    </p>
    <p>
      Backus builds his FP systems on three kinds of entities.
      Firstly, there are <em>object</em>s.
      These are built recursively from atomic objects such as
      truth values and numbers,
      and the only constructor is that of forming sequences or lists of objects.
      Secondly there are <em>primitive function</em>s.
      These comprise the usual arithmetic operations and relations
      and several powerful operations on lists.
      Importantly all primitive functions are unary functions
      technically,
      since functions requiring several arguments are provided
      with a single list of these arguments.
      Furthermore, all functions are first order.
      Thirdly there are <em>functional form</em>s,
      and these are the essential novelty of the system.
      They are second order functions used to build
      more complex functions from simpler ones.
      Since all primitive functions are unary,
      and the combining forms preserve this property,
      all functions in the system are unary.
      Combining forms, however,
      can have several functions as parameters.
      In detail, the combining forms are as follows.
    </p>
    <p>
      The <em>composition form</em> requires two functions.
      The resulting functions is that function which applied
      to its argument always gives the same value
      as applying first the one function and then the other.
      The <em>conditional form</em> takes three functions as parameters,
      an if-function, a then-function and an else-function.
      The if-function is applied to the argument,
      if that yields true the the value returned is that
      given by applying the then-function,
      otherwise it is that of applying the else-function.
      The <em>construction form</em> takes as single parameter
      a list of functions.
      Applied to one argument the resulting function
      returns a list of values,
      each obtained by applying the functions to the argument.
      The <em>apply-to-all form</em>
      is essentially the same as <kbdmap< kbd="" in="" other="" languages.="" it="" takes="" a="" single="" function="" as="" parameter.="" the="" resulting="" can="" only="" be="" applied="" to="" list,="" and="" then="" returns="" list="" of="" values="" obtained="" by="" applying="" parameter="" each="" member="" list.="" construction="" apply-to-all="" are="" some="" sense="" complementary.="" <em="">insert form is sometimes called
      <em>reduce</em> or <kbdfold< kbd="" in="" other="" languages.="" it="" also="" takes="" a="" single="" function="" as="" parameter,="" one="" which="" pairs="" arguments.="" the="" resulting="" can="" be="" applied="" to="" non-empty="" list,="" and="" then="" returns="" object="" obtained="" by="" applying="" parameter="" repeatedly="" adjacent="" members="" of="" list="" argument.="" finally,="" <em="">constant form
      takes as parameter an object
      (considered as a function of no arguments).
      The resulting unary function ignores its argument
      and always returns the parameter object.
      There is no facility for user-defined forms;
      Backus held the view that this would lead to obscure programs.
      However, new functions may be defined, even recursively.
      </kbdfold<></kbdmap<>
    </p>
    <p>
      The combining forms as operations on unary functions
      constitute a rich but unfamiliar algebra.
      Importantly, the arguments of the functions
      do not play any role at all.
      Backus gives an elaborate axiomatisation of the algebra;
      in  Williams (1982)  a smaller version is given
      comprising just 11 axioms.
      Two axioms deal with the interplay between composition and conditional,
      two deal with composition, construction and insert,
      and one deals with just composition and construction.
      Two deal with construction and indexing into a list.
      Another concerns nested conditionals with the same if-function.
      Two deal with the <em> append-left</em> function
      (elsewhere known as <kbd>cons</kbd>)
      and the apply-to-all form.
      A final one deals with composition and constant.
      As may be seen, each combining form
      has a significant relationship
      with at least some other combining form.
    </p>
    <p>
      The FP system is further explained and expanded in
      Williams (1982) .
      A very useful exposition to the FP systems is found in
      Henson (1987 Chapter 5) .
      The book also gives a very extensive bibliography.
      For a good exposition to the
      relation between the lambda calculus, combinatory logic
      and the FP systems of Backus see
      Revesz (1988 section 5.3) .
      Givler and Kieburtz (1984) 
      present methods for automatically and reliably
      transforming clear and correct
      but possibly inefficient FP programs
      into possibly obscure but efficient equivalent programs.
      Bellegarde (1984) 
      presents a set of convergent rewriting rules
      for the algebra of FP programs but without conditionals.
      Whereas FP is a <em>strict</em> language,
      Dosch and M\"{o}ller (1984) 
      describe the algebraic semantics of a <em>lenient</em> variant of FP
      allowing infinite objects
      and using both busy and lazy evaluation.
      Sheeran (1984) 
      uses a variant of FP as a VLSI design language
      for describing semantics and physical layout of hardware.
      For a critique of the FP systems, see
      Harland (1984 section 18.4) .
    </p>
    <p>
      A recent descendant of the FP system by Backus
      is the <em>FL language</em> described in
      Backus, Williams and Wimmers (1990) 
      Another variant is the language <em>GRAAL</em>
      which implements ("infinite") streams
      using call-by-need;
      it is described in
      Bellot and Robinet (1985) .
    </p>
    <p>
      In FP there are three kinds of semantic entities,
      the objects, the functions and the combining forms.
      They correspond fairly well to three kinds of functions in Joy:
      those denoted by literals,
      by operators and by combinators.
      But the Joy functions are all of the same kind,
      they are functions taking one stack as argument
      and giving a new stack as value.
      In FP combining forms are applied to functions
      and the resulting functions are applied to objects.
      In Joy there is no <em>application</em> of functions to arguments at all,
      there is just <em>composition</em> of functions.
      In FP the function parameters of combining forms cannot depend
      on any objects supplied
      as arguments to functions.
      In Joy the <em>quotation</em> parameters of combinators
      can be manipulated at run time.
      Hence it is possible to call <em>constructed program</em>s
      which have been built on the fly.
    </p>
    <p>
      In his Turing award lecture Backus also introduces another language,
      <em>FFP system</em>, short for "Formal Functional Programming system".
      In addition to objects as in FP there are now explicit expressions.
      In addition to the listforming constructor as in FP
      there is now a new binary constructor to form <em>application</em>s
      consisting of an operator and an operand.
      Operator expressions which are atoms of course denote functions
      which can be applied to an argument.
      Operator expressions which are lists must have as their first
      element an expression denoting a function.
      When such an expression is applied to an argument,
      the function is applied to a pair consisting
      of the original list and the argument.
    </p>
    <p>
      This last rule, <em>metacomposition</em>, is immensely powerful.
      It can be used to define arbitrary new functional forms,
      including of course the fixed forms from FP.
      The rule also makes it possible to compute recursive functions
      without a recursive definition.
      This is because in the application
      the functions is applied to a pair which includes the original
      list operand which in turn contains as its first element
      the expression denoting the very same function.
      The method is considerably simpler than the
      use of the <em>Y combinator</em>.
      Williams (1982) 
      extends the method to mutually recursive functions,
      even ones that are not <em>primitive recursive</em>.
    </p>
    <p>
      Joy is in fact closer to FFP than any of the languages mentioned
      so far.
      Both replace abstraction by other mechanisms,
      both rely heavily on higher order functions,
      and both obey the principle that <em>program = data</em>.
      Both permit construction of first order
      and higher order recursive and non-recursive functions
      without ever using named formal parameters.
      An effect similar to metacomposition
      is achieved in Joy with the <kbdx< kbd=""> combinator,
      which expects a quoted program on top of the stack
      and executes it without popping it off.
      </kbdx<>
    </p>
    <p>
      One important difference is that FFP still uses <em>application</em>
      as an essential operation,
      whereas Joy uses <em>composition</em>.
      It appears that this makes the algebra of Joy considerably simpler.
    </p>
    <h1>Categorical combinators</h1>
    <p>
      Meertens (1989 p 72) 
      speaks of
      "the need of a suitable system of combinators
      for making functions out of component functions
      without introducing extra names in the process.
      Composition should be the major method, and not application."
    </p>
    <p>
      Meertens (1989 p 71)  writes
      "The basic problem is that the basic operation of the classical combinator
      calculus (and also of the closely related lambda calculus)
      is application instead of composition.
      Application has not a single property.
      Function composition is associative
      and has an identity element
      (if one believes in the 'generic' identity function)."
      He develops a system of combining functions
      that is more suitable to formal manipulation
      than the classical combinators.
      It is worth noting that in <em>monad</em>s
      the monadic composition operator is associative.
    </p>
    <p>
      A <em>category</em> consists of a collection of <em>object</em>s
      and for any two objects a collection of <em>morphism</em>s,
      each having the one object as their <em>source</em>
      and the other object as their <em>target</em>.
      For any single object, the morphisms must include an
      <em>identity morphism</em> with that single object
      as source and target.
      For any object and two morphisms having it as source and target
      respectively, there must be a <em>composite morphism</em>
      having as source the source of one morphism and as target
      the target of the other.
      This <em>composition of morphisms</em> must be associative,
      with identity morphisms as left and right unit elements.
    </p>
    <p>
      An object is a <em>terminal object</em> in a category
      if for each object as source there is exactly one
      morphism with that object as target.
      An object is a <em>product object</em>
      of two given objects
      if there are two special <em>projection morphisms</em>
      having the product as source.
      For any arbitrary morphism having an arbitrary object as source
      and either of the two given objects as target
      there must be a corresponding morphism
      having the same arbitrary object as source
      and the product object as target.
      That arbitrary morphism must then be the composition
      of that corresponding morphism and the appropriate
      projection morphism.
    </p>
    <p>
      In a category with products there may also be <em>exponential object</em>s
      of a given source object and a given target object.
      Such an exponential object must have a special <em>evaluation morphism</em>
      having the product of the given source object
      and the exponential object as source
      and the given target object as target.
      For any arbitrary morphism
      having the product of the source object and an arbitrary object
      as source there must be exactly one corresponding ("curried")
      morphism.
      That arbitrary morphism must then be (essentially)
      the composition of the corresponding morphism
      and the evaluation morphism.
    </p>
    <p>
      A <em>Cartesian closed category</em>
      is one which has a terminal object,
      and for any two objects their product and exponential,
      together with their projection and evaluation morphisms.
      In the category of sets,
      products are Cartesian products,
      exponentials are functions from sets to sets,
      and evaluation morphisms are the application
      of a function to a value.
      In the category of logical systems,
      products are conjunctions,
      exponentials are conditionals,
      projections are and-elimination rules
      and evaluation morphisms are the <em> modus ponens</em> rule.
    </p>
    <p>
      The language of categories is another functional language.
      If it has products,
      then it can deal with functions of several variables.
      If it has exponentials,
      then functions are "<em>first class citizen</em>s".
      The language is therefore an alternative
      to the (typed) lambda calculus and to combinatory logic.
      Whereas the lambda calculus needs variables,
      the combinatory language and the categorical language do not.
    </p>
    <p>
      Cartesian closed categories are explained for example in
      Barr and Wells (1990 Chapter 6) 
      and in
      Poigne (1992) .
      Barr and Wells give an example of a simple lambda expression
      with variables and a complicated looking categorical equivalent formula.
      They suggest an acceptable reformulation of the categorical formula.
      Both categorical versions
      essentially replace occurrences of variables by
      use of projection functions.
    </p>
    <p>
      Could the language of categories be used for writing programs?
      Any lambda expression can be translated into a categorical expression,
      so the language of categories is expressively complete.
      But this does not make it a suitable language for writing
      programs.
      As it stands it is a very low-level language.
    </p>
    <p>
      On the other hand,
      category theory has given rise to another model of computation:
      the <em>CAM</em> or <em>Categorical Abstract Machine</em>,
      described in
      Cousineau   et al (1985) ,
      Cousineau   et al (1987) 
      and in
      Curien (1986) .
      The machine language of the CAM is very elegant,
      but programs in that language
      look as inscrutable as low level programs in other
      machine languages.
      The language is of course suitable as the target language
      for compilation from any functional language.
      A very compact but comprehensive exposition
      of a compiler from (a mini-) ML to CAM is described in
      Clement   et al (1986) .
      Mauny and Su\'{a}rez (1986) 
      describe compilers from a strict and a nonstrict
      version of ML
      to an eager and a lazy version of the CAM.
    </p>
    <p>
      The original translation from lambda expressions
      to categorical combinators was quadratic in the worst case, but
      Lins (1987) 
      introduces a linear translation to a simplified abstract machine code.
      Hannan (1991) 
      uses a variant of the CAM for generating more concrete
      code suitable for register-level implementation
      or even micro-coding on conventional architectures.
      An extension of ML for data-parallel computation has been implemented by
      Hains and Foisy (1993) 
      to run on a distributed version of the CAM.
    </p>
    <p>
      Combinatory languages should be seen as abstract machine languages.
      In contrast, Joy was designed to be a high level language
      to be used by the human programmer.
    </p>
    <h1>Programming in the large</h1>
    <p>
      In all high level languages a program consists of a possibly
      large collection of definitions and a comparatively small
      main program.
      The collection of definitions and their interrelations
      can become very difficult to comprehend and maintain.
      Many languages provide some mechanisms
      for giving additional structure to the definitions
      of functions and their interrelations.
      One kind of interrelation is due to their mutual calling patterns.
      The main program calls functions at level one,
      and these call each other or functions at level two,
      and so on.
      A second structure that can be exploited is that due to
      common types.
      For example, functions which concatenate two strings
      and reverse a string will not call each other
      but belong together in an implementation of strings.
      A third possible device only makes sense in imperative languages
      because procedures have additional interrelations
      due to global assignable variables
      which might be written by one procedure and read by another.
    </p>
    <p>
      One of the simplest but very powerful structuring mechanisms
      is <em>block structure</em>.
      It was already used in the earliest <em>Lisp</em> and in <em>Algol 60</em>,
      and later in <em>Pascal</em>.
      It has been retained almost all their descendants.
      A block consists of any number of definitions followed by a body,
      and a definition consists of a header and a block.
      So definitions can contain local definitions and so on,
      with no intrinsic limit to the levels of nesting.
      Hence any definition can at least provide some
      <em>hiding of information</em>
      that is not needed outside.
      This hiding could be used even in cases where what is defined
      does not take any parameters at all.
      (Thus it could be used in context-free grammars,
      but apparently never is.)
      More importantly, if there are parameters
      in the header of a definition,
      then the bodies of any enclosed definition can access those parameters.
      Additionally, for an imperative language,
      if there are assignable variables in a block,
      then the bodies of any enclosed block can access these variables.
      Access to non-local parameters and variables is automatic
      via a static chain or a display.
      This mechanism achieves what otherwise would have to be handled by
      explicitly passing them as parameters.
    </p>
    <p>
      Joy currently does not have block structure,
      but it would be easy to implement.
      Since Joy does not have formal parameters and no assignable
      variables, block structure would only provide the benefit
      of information hiding.
    </p>
    <p>
      The popular imperative <em>C language</em> does not have block structure
      but it does address the problem of hiding information about
      assignable variables from function bodies that do not need this
      information.
      One such mechanism is that of <em>own variable</em>s,
      or <em> internal static</em> variables in C-terminology.
      Such a variable can be declared, initialised and used within a single
      function body and not be visible outside.
      The value of the variable persists between successive calls
      of the function.
      The other mechanism is that of independent compilation units.
      These are just files containing declarations of global variables
      and functions without a main program.
      The variables can be made invisible from outside their unit.
      A complete program then consists of very few variables
      visible everywhere,
      and several files each containing a collection of variables
      and procedures that belong together.
    </p>
    <p>
      In Joy the first mechanism does not even make sense
      because Joy as a functional language does not have any assignable
      variables.
      The second mechanism could still allow related functions to be kept
      together in one file.
      The current implementation of Joy does not use a single input file
      but a stack of such files.
      A new file can be opened and become the current input file
      by an <kbdinclude< kbd=""> directive.
      But no information hiding occurs through this mechanism,
      there is only one global namespace.
      Hiding only occurs in explicit <kbdhide< kbd="" declarations..="" <p="">
      Independent compilation units in files are not without problems.
      One criticism is that in order to achieve independence,
      programs have to be spread over too many files.
      Another concerns security,
      since a simple compiler does not check type conformity of
      formal parameters in the declarations of in one unit
      and the actual parameters in the calls of another unit.
      A third criticism is that such units cannot be nested.
      The language <em>Modula2</em> overcomes these problems.
      A collection of declarations and definitions can be
      wrapped up inside a <em>module</em>.
      A single file can contain several modules.
      In addition to a detailed <em>implementation module</em>
      there is a short <em>definition module</em> containing
      only type information, especially about formal parameters.
      This interface is used to check type conformity with calls
      from another module.
      Finally, modules can be nested.
      A module specifies explicitly which of its identifiers
      are to be exported and made visible to the outside.
      Any others remain hidden.
      But the total number of identifiers exported from various
      modules in a program can still be very large.
      Moreover, if different modules were written by different
      programmers, the exported identifiers might clash.
      To avoid this problem,
      Modula2 allows use of qualified names which are similar to record
      notation.
      Such names consist of the name of the module together with
      the name of the exported identifier.
      </kbdhide<></kbdinclude<>
    </p>
    <p>
      Structuring devices similar to modules would benefit any language
      for programming in the large.
      Because Joy is so weakly typed,
      definition modules would be almost pointless.
      However, implementation modules with selective export would hide
      utility functions of a module that are not needed outside the module.
      Qualified names would then be as in Modula2.
      A crude substitute for a hiding facility and for qualified names
      is already used in the Joy libraries.
      Hidden functions are given names that are not displayed by the
      <kbdhelp< kbd-facility,="" and="" exported="" functions="" have="" names="" beginning="" with="" the="" name="" of="" module.="" modules="" are="" a="" simplified="" version="" older="" concept="" <em="">class
      which first occurred in <em>Simula</em>, an early descendant of Algol 60.
      Classes are a generalisation of record types,
      but in addition to fields for assignable variables
      there are fields for procedures and functions.
      Instances of a class type are called <em>object</em>s,
      they consists of instance specific assignable variables of their type.
      From the outside objects are manipulated only by the procedures
      and functions of their class.
      This is the essence of <em>object oriented programming</em>,
      it emphasises hiding of implementation details
      so that only <em>abstract data type</em>s
      are visible from the outside.
      Two other notions are <em>inheritance</em>
      of properties of objects from other objects,
      and making functions and procedures <em>re-usable</em> and <em>polymorphic</em>.
      the ability of an object to respond to actual
      parameters of different types.
      The <em>C++ language</em> has made these concepts
      extremely popular. It is being used to build extensive libraries
      containing re-usable components.
      </kbdhelp<>
    </p>
    <p>
      Since Joy does not have any assignable variables,
      the notion of class and objects are not applicable.
      However, hiding, inheritance and polymorphism would still be
      useful.
      Many operators in Joy are already polymorphic,
      and it is possible to write libraries
      which retain or even extend this property.
    </p>
    <p>
      One of the most sophisticated devices for structuring programs
      is to be found in the language ML.
      For a good introduction, see
      Paulson (1992 Chapter 7) 
      and
      Sokolowski (1991 Chapters 8 and 9) .
      A <em>signature</em> is very much like an definition module
      in Modula2,
      it specifies parameter types and result types of functions,
      but it does not specify their bodies.
      A <em>structure</em> is like an implementation module,
      it specifies the bodies of functors
      but does not hide implementation details.
      Real hiding and hence real abstraction is provided by <em>functor</em>s,
      inspired by category theory.
      In their simplest form they simply hide implementation detail.
      But they can also take one or more other structures
      as formal parameters and produce other structures as value.
      The bodies of functions can access all the functions in
      the formal structure parameters.
      Functors must be instantiated with actual structures
      before they can be used,
      and they can be instantiated several times with
      different actual parameters.
      Instantiation of functors thus resembles calling a function
      with actual parameters,
      but like the generics of Ada, it occurs at compile time.
      However, the functors of ML are far more powerful than
      the generics of Ada.
      Functors are again structuring devices for programming in the large.
      They could be used not just for functional languages
      but equally well for procedural,
      logical or actor languages.
      A mathematically very mature treatment of modules
      in terms of category theory is given in
      Ehrig and Mahr (1990) .
    </p>
    </kbdw<></body>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>