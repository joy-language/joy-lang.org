<template>
  <article>
    <p>
      Joy is a purely functional language, and yet it is often useful to think in imperative
      mode when writing Joy programs. This rsults from the fact that Joy is based on
      the composition of functions, and not on the application of functions. This was
      first made explicit by Billy Tanksley (2000) in his preamble to the mailing group
      concatenative:
      <br>
      <a href="http://groups.yahoo.com/group/concatenative">
      http://groups.yahoo.com/group/concatenative</a>
      <br>
    </p>
    <p>
      This note illustrates imperative thinking for five Joy programs. In the literature
      these are often written recursively. But they either are tail recursive or can
      be rewritten in a tail recursive form, possibly using accumulators. Consequently
      these programs can also be written in an imperative style without recursion but
      using loops. In this note the imperative version is used as the starting point
      which is then translated into purely functional Joy.
    </p>
    <p>
      The first two programs are for computing the <strong>factorial</strong> and the
      <strong>Fibonacci</strong> functions. Both use the <strong>times</strong> combinator
      of Joy. The third and fourth program are for computing the greatest common divisor
      function <strong>gcd</strong> and the predicate for determining whether a number
      is <strong>prime</strong>. Both use the <strong>while</strong> combinator of Joy.
      The last program is a combinator for Newton's method of finding arguments for which
      a given function returns a zero value. The method works by starting with a guessed
      argument and improving it until it has the required magnitude. This Joy program
      also uses the <strong>while</strong> combinator. The method can also be used to
      compute inverses of functions, for example for finding cube-roots when given a
      cubing function.
    </p>
    <p>
      All five programs were developed using corresponding Scheme programs in Abelson and
      Sussman (19??) as a guide.
    </p>
    <h2>The <em>times</em> combinator for the <em>factorial</em> function</h2>
    The factorial function is often given a recursive definition to illustrate either
    recursion in general or definitions in a particular language. But it is well known
    that recursion is not necessary, and that at least a "tail-recursive" variant is
    more efficient. For a given positive integer N, the factorial of N is just the product
    of the first N positive integers. The product of no numbers should be the identity
    element for multiplication, so the factorial of 0 is set to 1. Hence for any non-negative
    N the factorial can be computed by a simple imperative program (here in a fantasy
    language):
    <br>
    <pre>
        factorial(N) =
      VAR P := 1
      VAR I
      FOR I := 1 TO N DO
          P := P * I
            RETURN P
    </pre>
    The upper limit N ensures that the body of the loop will be executed exactly
    N times. In addition, the FOR-loop will increment the variable I exactly as required.
    But we could do the incrementing explicitly:
    <br>
    <pre>
        factorial(N) =
      VAR P := 1
      VAR I := 1
      N TIMES DO
          P := P * I
          I := I + 1
      RETURN P
    </pre>
    To translate this into Joy, here is a first draft. The TIMES-loop will be
    executed by the times combinator of Joy. The body of the loop will need to be expressed
    in Joy, but we do that later. Before the loop there will need to be some initialisation
    corresponding to the imperative program. And after the loop there will need to be
    some finalisation corresponding to the RETURN.
    <br>
    <pre>    factorial  ==
      "initialise"
      [ "body of loop" ]
      times
      "finalise"
    </pre>
    A call to the factorial function will be of the form
    <br>
    <pre> N  factorial
    </pre>
    where the N will have to be available for the times combinator. That means
    that the simulation initialisation of the two variables P and I will have to be below
    the N. In the imperative program both were initialised to 1. So below the parameter
    N there will need to be two further stack elements, both 1, that are pushed under
    the control of the dip combinator. Hence the initialisation is:
    <br>
    <pre> [ 1 1 ]  dip
    </pre>
    The body of the Joy loop has to do what the body of the imperative loop does:
    <br>
    <pre>     P := P * I
          I := I + 1
    </pre>
    The counterpart of P has to be multiplied by the counterpart of I, but there
    has to be another copy of I available to be incremented by 1. So the body of the
    Joy loop has to start with a dup operator to make that copy. Then thecounterpart
    of P has to be multiplied by the original counterpart of I, and this has to occur
    below the new copy of the counterpart of I. That is easily done by the combination
    [*] dip. Finally, corresponding to the incrementing of I, the successor of the top
    element is taken. Hence the body of the Joy loop is
    <br>
    <pre> dup  [*]  dip  succ
    </pre>
    The loop is executed N times, and when that is done the imperative program
    returns P, whose counterpart is the second element from the top of the stack. So
    the finalisation of the Joy program is
    <br>
    <pre> pop
    </pre>
    Putting the three pieces together, we have the definition
    <br>
    <pre>    factorial  ==
      [1 1] dip
      [ dup [*] dip succ ]
      times
      pop
    </pre>
    This completes the Joy program. In the Joy library numlib.joy it is just a
    one-liner:
    <br>
    <pre>    fact == [1 1] dip [dup [*] dip succ] times pop;
    </pre>
    <h2>The <em>times</em> combinator for the <em>Fibonacci</em> function</h2>
    <p>
      The Fibonacci function is also often given a recursive definition, generally just
      to test efficiency of an implementation because a non-recursive definition would
      be more efficient. The usual recursive definition is inefficient because the same
      values have to be computed many times over. The following is a design of a non-recursive
      version.
    </p>
    <p>
      The Fibonacci function for the first two natural numbers 0 and 1 as arguments has
      the values 0 and 1, and for any larger numbers as arguments it values is just the
      sum of its values for the two preceding numbers. The following gives the arguments
      and the values:
      <br>
    </p>
    <pre>        arguments     0   1   2   3   4   5   6   7   8   ...
            values        0   1   1   2   3   5   8  13  21   ...
    </pre>
    Note that to compute the later values only the values for the <em>two</em>preceding numbers are needed. This helps in the following consideration, where the
    values are now arranged in a staircase:
    <br>
    <pre>        arguments     values
                    0     0   1
        1         1   1
        2             1   2
        3                 2   3
        4                     3   5
        5                         5   8
        6                             8  13
    </pre>
    Each step of the staircase consists of two numbers, the left and the right,
    hereafter called L and R. Three observations can be made: (1) In the first, topmost
    step L and R are respectively the Fibonacchi values for 0 and 1. (2) The two numbers
    L and R of any step other than the first are obtained from the L and R of the preceding
    step - the two numbers L and R are interchanged and then a new R is obtained by adding
    L to it. (3) The Fibonacci value of N is on the N-th step from the top in the L number.
    The three observations suffice for the following program. Again it uses a TIMES-loop
    to execute (2) as often as required by the parameter N.
    <br>
    <pre>    fibonacchi(N) =
      VAR L := 0
      VAR R := 1
      N TIMES DO
          L =:= R
          R := L + R
      RETURN L
    </pre>
    The mutual assignment operator "=:=" swaps the values of the two variables.
    It might be implemented instead by
    <br>
    <pre> TEMP := L; L := R; R ;= TEMP
    </pre>
    <p>
      The program translates readily into Joy. A call to the Joy program will be of the
      form
      <br>
    </p>
    <pre> N  fibonacci
    </pre>
    and hence the N will have to be available for the times loop. So the initialisation
    has to take place just below the parameter N, with
    <br>
    <pre> [0  1]  dip
    </pre>
    Now the N will be consumed by the times combinator, and that will expose two
    numbers corresponding to the values of L and R, with the value of R topmost. The
    times combinator requires a quotation which corresponds to the body of the imperative
    TIMES loop. The quotation has to swap the two numbers on top of the stack, and then
    replace the top value by two sum of the two, but without consuming the second value.
    This replacement can be done by [+] unary. So the quotation required is
    <br>
    <pre> [ swap  [+]  unary ]
    </pre>
    Finally, the value to be returned is what corresponds to L in the imperative
    program, and that is the second value from the top of the stack. So the finalisation
    is simply
    <br>
    <pre> pop
    </pre>
    <p>
      Putting the pieces together, this is the definition:
      <br>
    </p>
    <pre>    fibonacchi  ==
             [1 0] dip
             [swap [+] unary]
             times
             pop
    </pre>
    In the Joy library numlib.joy this is also just a one-liner:
    <br>
    <pre>    fib == [1 0] dip [swap [+] unary] times pop;
    </pre>
    <h2>The <em>while</em> combinator for the <em>gcd</em> function</h2>
    The greatest common divisor (gcd) of two natural numbers is that number which divides
    the two given numbers without remainder. Euclid's famous algorithm for finding the
    gcd is based on the observation that
    <br>
    <pre> gcd(I,J)   ==   gcd(J, I rem J)
    </pre>
    where <kbd>I rem J</kbd> is the remainder of dividing I by J. For J = 0 the
    gcd is I. The steps for finding the gcd of 48 and 90 are:
    <br>
    <pre>      step     values
              1     48  90
        2         90  48
        3             48  42
        4                 42   6
        5          6   0
    </pre>
    Again there is a staircase with two values on each step, hereafter L and R.
    The first step consists of the two arguments. On every succeeding step L is what
    was the R of the preceding step, and the R is L rem R of the preceding step. This
    might be written in an imperative language with a WHILE-loop as
    <br>
    <pre>    gcd(L, R)  =
      VAR TEMP
      WHILE R &gt; 0 DO
          TEMP := R
          R := L rem R
          L := TEMP
      RETURN L
    </pre>
    The program might even be written without the TEMP variable but with mutual
    assignment like this:
    <br>
    <pre>    gcd(L, R)  =
      WHILE R &gt; 0 DO
          L := L rem R
          L =:= R
      RETURN L
    </pre>
    We now have to translate this into Joy. The call to the gcd program in Joy
    will look like this:
    <br>
    <pre> 48  90  gcd
    </pre>
    Joy has a while combinator with takes two quotation parameters, a while-part
    and a do-part. The structure of the program will be
    <br>
    <pre>    gcd  ==
      [ "while-part" ]
      [ "do-part" ]
      while
      "finalise"
    </pre>
    So the while-part will have to test whether the number on top of the stack
    is positive, and that is done with the quotation
    <br>
    <pre> [ 0 &gt; ]
    </pre>
    The do-part will have to take the two parameters on top of the stack and simulate
    the effect of the assignment statements of one or the other of the imperative versions.
    (1) The top element on the stack will have to become the result of the rem operation.
    (2) The second element on the stack will have to be what was the first element. Since
    the rem operattion in (1) consumes the top element, but (2) needs it, that top element
    will have to be saved by a dup (similar to using the TEMP). After the dup the second
    and third element will have to available for the rem operation, and below the result
    of that will have to be the saved or duplicated first element. So before the rem
    the top three elements have to be shuffled by rollup, which moves the second and
    third element up by one and the first element down by two. Thus the do-part is
    <br>
    <pre> [ dup  rollup  rem ]
    </pre>
    The finalisation of course just pops off the 0 which is now on top of the
    stack.
    <p>
      So the entire definition is:
      <br>
    </p>
    <pre>    gcd  ==
      [ 0 &gt;]
      [ dup rollup rem ]
      while
      pop
    </pre>
    In the Joy library numlib.joy this is also just a one-liner:
    <br>
    <pre>    gcd == [0 &gt;] [dup rollup rem] while pop;
    </pre>
    <h2>The <em>while</em> combinator for the <em>prime</em> predicate</h2>
    <p>
      One number N has another D as a divisor if and only if N divided by D leaves no remainder,
      or a remainder of 0. A number N has a proper divisor D if and only if N has a divisor
      D where D is other than 1 or N. A number N is prime if and only if it has no proper
      divisors. If a number is not prime, then it has a proper divisor D no greater than
      the square root of N, or equivalently the square of D is no greater than N.
    </p>
    <p>
      So, given a number N, the search for a proper divisor could start with a test integer
      T = 2 and go up to that value of T for which N is greater than the square of T.
      During each step a test needs to be made to determine whether the remainder of
      dividing N by T is positive. After each step T is incremented. The loop continues
      while N is greater than the square of T AND T is not a divisor of N. The loop stops
      when the preceding conjunction becomes false. Since there are two conjuncts, there
      are two possible reasons why the conjunction has become false. If the second conjunct
      fails then N is not prime, even if the first conjunct, N &gt; T * T, is true. On
      the other hand, if the first conjunct failed, then T has already been incremented
      beyond the search range and hence N is prime. So N is prime if and only if the
      loop has terminated with N &lt; T * T. This algorithm can be expressed in an imperative
      language as:
      <br>
    </p>
    <pre>    prime(N) =
      VAR T := 2
      WHILE (N &gt; T * T) AND (N rem T &gt; 0) DO
          T := T + 1;
      RETURN N &lt; T * T
    </pre>
    <p>
      The program translates well into Joy. Clearly it must have the structure
      <br>
    </p>
    <pre>    prime ==
      "initialise"
      [ "termination-conjunction" ]
      [ "increment-test-value" ]
      while
      "finalise"
    </pre>
    It is important that the conjunction and the incrementation of the loop be
    done efficiently. This affects whether the initial test value 2 should be inserted
    above or below the given number on top of the stack. Individually the two conjuncts
    for the termination are best written as
    <br>
    <pre> dup * &gt;
      rem 0 &gt;
    </pre>
    which suggests that the test value is above the argument. Hence the initialisation
    should simply push the inital test value 2. Also, the test value should remain above
    the argument, and the incrementing is done simply by the succ operator. But the termination
    has to be a conjunction of the two conjuncts above, so they have to produce a truth
    value each which are then conjoined by the and operator. One way is to use the nullary
    combinator on the first conjunct to produce the first truth value without using up
    the two arguments. Then the two arguments can be used for the other conjunct with
    the dip combinator. So the entire termination conjunction is
    <br>
    <pre> [ [dup * &gt;] nullary  [rem 0 &gt;] dip  and ]
    </pre>
    The finalisation translates easily from the imperative program:
    <br>
    <pre> dup  *  &lt;
    </pre>
    <p>
      So the entire program is as follows, as it appears in the library numlib.joy:
      <br>
    </p>
    <pre>    prime ==
      2
      [ [dup * &gt;] nullary  [rem 0 &gt;] dip  and ]
      [ succ ]
      while
      dup * &lt; ;
    </pre>
    <h2>The <em>while</em> combinator for the <em>newton</em> combinator</h2>
    <p>
      Given a differentiable function F of one variable, one sometimes needs to find its
      roots, those values x for which F(x) = 0. One famous method, due to Newton, is
      the following: Start with a guess G for what that value x might be. Compute F(G),
      and if that is close enough to zero, take G to be the solution. Otherwise, use
      the current guess and the function F to find a better guess. Repeat this process
      until the latest guess is acceptable. This is essentially a WHILE loop.
    </p>
    <p>
      So Newton's method is a general algorithm which takes two parameters, an initial
      guess G and a function F. In imperative style an outline is this:
      <br>
    </p>
    <pre>    newton(G,F) =
      WHILE "F(G) is not close enough to 0" DO
          "Use F and G to find a new G"
      RETURN G
    </pre>
    For the WHILE-part it is necessary to specify a criterion for what counts
    as close enough to 0. Some small value can be built into the algorithm. It is also
    possible to make the value a further parameter. For simplicity this version will
    select the value 0.0001 hardwired into the program. Since the function F can return
    a positive or a negative value for the current guess, it is necessary to take the
    absolute value instead. So the refinement for the WHILE-part is this:
    <br>
    <pre> abs(F(G)) &gt; 0.0001
    </pre>
    The DO-part is more complicated. To find a better guess, it is necessary use
    the old guess to determine whether the new guess should be larger or smaller, and
    by how much. In Newton's method the slope of the function F at the old guess is used.
    The new guess is then computed by subtracting from the old guess a value that depends
    on (1) the value of F at the old guess, and (2) the slope of F at the old guess.
    It is the slope that determines how close the new guess will be to the old guess.
    The slope of F at the old guess is of course the value of the derivative of F, which
    might be written as deriv(F). So the DO-part refines to
    <br>
    <pre> G  :=  G - F(G)/deriv(F,G)
    </pre>
    Combining the parts the imperative version of Newton's method is the following.
    <br>
    <pre>    newton(G,F) =
      WHILE  abs(F(G)) &gt; 0.0001  DO
          G   :=  G  -  F(G)/deriv(F,G)
      RETURN G
    </pre>
    For the derivative of the function F we again have to select a small number
    - ideally "infinitesimal" - say 0.001. Then F has to be applied to two values, x
    plus 0.001 and x. The difference between the two results is divided by 0.001 to get
    an approximation to the true slope of F at x. A definition might look like this:
    <br>
    <pre>    deriv(F,x) =
      (F(x + 0.001) - F(x)) / 0.001
    </pre>
    The imperative newton program and the second order derivative function are
    now to be translated into Joy. It so turns out that the derivative of a function
    F is useful elsewhere. The most general form would be one which takes as a parameter
    a quotation, say [F], and which returns a quotation [D]. Both quotations would have
    to compute unary functions, and either quotation would be used by some combinator,
    quite possibly the i combinator. From the above formula we see that F is to be applied
    separately to two arguments, firstly to x + 0.001, and secondly to just x alone.
    Since x is needed twice, the argument has to be duplicated, and the small value 0.001
    added to one of them. That is essentially
    <br>
    <pre> dup  0.001  +
    </pre>
    After the given quotation [F] has been applied to these two arguments, their
    difference has to be divided by 0.001. But the difference has to be computed in the
    right order, so a swap is needed before the subtraction. This fragment of the program
    thus is:
    <br>
    <pre> app2  swap  -  0.001  /
    </pre>
    A call to the derivative program takes a parameter [F] as argument and it
    produces another quotation:
    <br>
    <pre> [F]  deriv   ==&gt; [ dup 0.001 + [F] app2 swap - 0.001 / ]
    </pre>
    The required quotation is constructed from [F] by the following program:
    <br>
    <pre>    deriv == [app2 swap - 0.001 /] cons  [dup 0.001 +] swoncat;
    </pre>
    For example, the value of the derivative of the cube function for the argument
    3.14 can be computed by
    <br>
    <pre> 3.14   [ dup dup * * ]  deriv  i     ==&gt;     29.5882
    </pre>
    <p>
      We now return to the construction of the newton program. The functional argument
      F will be a quotation, and the guess argument will be a number. Since the Joy program
      takes a quotation as an argument, it is really a combinator, and combinators generally
      expect the quotation to be on top of the stack, and any further arguments below.
      So a call to the Joy program newton will normally take the form
      <br>
    </p>
    <pre> G  [F]  newton
    </pre>
    When the program exits it must leave behind a number on top of the stack which
    could be fed into F to yield a small number very close to zero,
    <br>
    <pre> G  [F]  newton  F            ==&gt;   0  (+/- 0.0001)
    </pre>
    The Joy program will have the structure
    <br>
    <pre>    newton ==
      "initialise"
      [ "while-part" ]
      [ "do-part" ]
      while
      "finalise"
    </pre>
    The do-part will require the quotation [F] and another quotation [D] for computing
    the derivative at the current guess. The quotation [D] is best constructed once and
    for all, and of course it needs to be constructed from [F]. This has to be done in
    the initialisation, so before the loop is entered and after it exits the stack looks
    like this:
    <br>
    <pre> G  [F]  [D]
    </pre>
    with [D] topmost. When the loop exits the [F] and [D] quotations are no longer
    needed, and the stack element below them is the value to be returned. This already
    settles the finalistion:
    <br>
    <pre> pop  pop
    </pre>
    In the initialisation the [D] quotation has to be constructed from the [F]
    parameter using the deriv program. Now the initialisation can bewritten quite simply
    as
    <br>
    <pre> dup  deriv
    </pre>
    The while-part has to determine whether the current guess, the third element
    from the top of the stack, when supplied as an argument to F, gives a value close
    enough to zero. The first element on the stack is actually the quotation [D], so
    that has to be popped off. Below that are [F] and the current guess, just in the
    right order for the i combinator. The result value might be positive or negative,
    so the absolute value is taken and compared with 0.0001. So the transliteration of
    the imperative program gives the following while-part for the Joy program:
    <br>
    <pre> [ pop i abs 0.0001 &gt; ]
    </pre>
    The do-part is more complicated than that. This is partly because the computation
    of the new guess has to use the two quotations [F] and [G] but also retain them for
    possible further use. Another reason is that, as can be seen from the DO-part of
    the imperative version, the current guess is needed three times to compute the new
    guess. It so turns out that it only has to be duplicated once, but that has to be
    done below the [F] and the [D], by [[dup] dip] dip, or equivalently by
    <br>
    <pre> [ dupd ]  dip
    </pre>
    Following that, the two quotations [F] and [D] have to be duplicated for future
    use by a special duplication operator dup2. So the stack at this point looks like
    this:
    <br>
    <pre> guess  guess  [F]  [D]  [F]  [D]
    </pre>
    After these preliminaries the new guess has to be computed so that afterwards
    the stack looks like this:
    <br>
    <pre> newguess  [F]  [D]
    </pre>
    in readiness for possibly another sweep through the loop. Following the assignment
    statement of the imperative version, the quotations [F] and [D] can be applied to
    the uppermost copy of current guess to produce two values whose ratio is to be subtracted
    from the lower copy of the current guess. The result is the new guess:
    <br>
    <pre> cleave  /  -
    </pre>
    But the preceding fragment has to be executed below the two quotations [F]
    and [D] that were saved for possible later use. So the fragment has to be executed
    under the control of a double dip:
    <br>
    <pre> [ [cleave / -]  dip]
      dip
    </pre>
    This concludes the design of the do-part, which now is the following:
    <br>
    <pre> [ [dupd] dip
        dup2
        [[cleave / -] dip]
        dip ]
    </pre>
    Finally, assembling the initialisation, the while-part, the do-part and the
    finalisation we have the entire newton program as it appears in the numlib.joy standard
    library.
    <br>
    <pre>    newton ==    (*  Usage: guess [F] newton   *)
      dup deriv   (* guess [F] [D]    *)
      [ pop i abs 0.0001 &gt; ] (* too big ?      *)
      [ [dupd] dip        (* guess guess [F] [D]    *)
        dup2      (* guess guess [F] [D] [F] [D]  *)
        [[cleave / - ] dip]
        dip  ]    (* newguess [F] [D]   *)
      while
      pop pop;
    </pre>
    <p>
      Newton's algorithm finds arguments for which given function has a value close to
      zero. It is easy enough to use the algorithm to find arguments for which the given
      function has a particular value other than zero. For such usage the desired particular
      value has to be subtracted from the value given by Newton's method. Also, a quite
      arbitrary initial guess has to be supplied. In this way Newton's method can be
      used to compute the inverse of a given function. In Joy the required program is
      <br>
    </p>
    <pre>    use-newton == [[-] cons] dip  swoncat  1 swap newton;
    </pre>
    For example, the cube-root function is the inverse of the cube function, and
    we can define
    <br>
    <pre>    cube-root == [dup dup * *] use-newton;
    </pre>
  </article>
</template>
<style src="~/assets/articles.css" scoped></style>