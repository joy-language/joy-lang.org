<template>
  <article>
    <i> by Manfred von Thun</i>
    <p>
      This short paper contains the design of a Joy interpreter written in Joy itself.
    </p>
    <p>
      Let L1 and L2 be two languages. An interpreter for language L1 , written in language
      L2 is a program P which takes as a parameter any program written in L1 and executes
      it in the same way as a processor for L1 would have. If the two languages are the
      same language L , such an interpreter is called <em>metacircular</em>. Languages
      in which <em>program = data</em> make it particularly easy to write an interpreter
      in its own language. The best known example is the <em>Lisp</em> interpreter <code>eval</code>.
      A metacircular interpreter for Joy can also be written.
    </p>
    <p>
      The remainder of this paper assumes some familiarity with Joy.
    </p>
    <h1> A Joy interpreter written in Joy </h1>
    <p>
      A Joy interpreter in Joy is a program which expects a quoted program on top of the
      stack and executes it. The following is the design of Joy interpreter <kbd>joy</kbd>  written in Joy itself. The first version of the interpreter is merely a reminder
      that Joy already has a combinator, the <code>i</code> combinator, which removes
      a program from the top of the stack and executes it.
    </p>
    <pre> 
    joy  ==  i 
    </pre>
    <p>
      The next version makes explicit the fact that Joy programs are sequences which are
      executed by <kbd>step</kbd>ping through the members of the sequence. For each
      member in the sequence an appropriate action is taken. The <code>step</code> combinator
      will indiscriminately leave literals, operators and combinators on top of the stack.
      But any operators and combinators <em>on top of the stack</em> cannot actually
      be executed. However, their <kbd>unitlist</kbd> can be executed by the <kbd>i</kbd>  combinator. So this is the next version of the interpreter:
    </p>
    <pre> 
    joy  == 
            [ unitlist 
              i ] 
            step 
    </pre>
    <p>
      The last interpreter does not actually <em>specify</em> what is to be done what
      a particular element of the sequence has appeared on top of the stack. A better
      one should say things like this for the <em>operator</em>s:
    </p>
    <pre>If the top element is "+" 
        then pop off the "+" and add the two numbers below 
    If the top element is "rest" 
        then pop off the "rest" and take the rest of the aggregate below 
    </pre>
    For the <em>literal</em>s it is even simpler:
    <pre>If the top element is any number 
        then leave it there and do not do anything 
    If the top number is any list 
        then leave it there and do not do anything 
    </pre>
    Essentially we need a way of examining what is on top of the stack and executing
    the appropriate action. So in the previous version of the interpreter we must replace
    the <code>unitlist</code> by something more specific. It has to consist of several
    cases, for the various literals, operators and combinators. The <kbd>opcase</kbd>operator
    is suitable for just that. It expects any kind of item on top of the stack, and above
    that a list of cases. Each case is a list consisting of a test item and a (possibly)
    empty rest. The effect of the <code>opcase</code>operator is to remove the top item
    and the list of cases, and to leave behind the rest of case for which the item matched
    the test item. The last case in the list is the default, it does not have a test
    item. The default is returned if there was no match. For the present design step
    the default does nothing. The following is what has to replace the <code>unitlist</code>in the interpreter:
    <pre> 
          [ [ 0 ]                           (* sample number *) 
            [ [] ]                          (* sample list *) 
            [ + pop + ]                     (* addition operator *) 
            [ rest pop rest ]               (* rest operator *) 
            [ ] ]                           (* default, do nothing *) 
          opcase 
    </pre>
    It is an easy matter to add the other cases for <em>literal</em>s. They have
    to be treated just like numbers and list:
    <pre> 
            [ 'A ]                          (* sample character *) 
            [ true ]                        (* sample truth value *) 
            [ "" ]                          (* sample string *) 
            [ {} ]                          (* sample set *) 
    </pre>
    Similarly, other operators have to be added such as
    <pre> 
            [ swap pop swap ]               (* swap operator *) 
            [ cons pop cons ]               (* cons operator *) 
    </pre>
    <p>
      For the combinators it is tempting to treat them just like operators:
    </p>
    <pre> 
            [ dip pop dip ]                 (* dip combinator - WRONG *) 
            [ map pop map ]                 (* map combinator - WRONG *) 
    </pre>
    This will work correctly, but it just uses the Joy system
    <em>inside</em> the quoted program that is being called by
    <code>i</code> or <code>map</code>. Instead it should use the Joy-in-Joy interpreter
    that we are writing. To achieve that effect, the program parameter <code>[P]</code>for the combinator has to be replaced by <code>[[P] joy]</code>. For <code>i</code>,
    <code>dip</code> and <code>map</code> and other <em>unary combinator</em>s this is
    quite easy: after the <code>pop</code> execute <code>[joy] cons</code>. This gives
    cases like the following:
    <pre> 
            [ i    pop [joy] cons  i   ]    (* i combinator *) 
            [ dip  pop [joy] cons  dip ]    (* dip combinator *) 
            [ map  pop [joy] cons  map ]    (* map combinator *) 
    </pre>
    The case for the <code>i</code> combinator is unnecessarily inefficient, it
    could be optimised to
    <pre> 
            [ i    pop             joy ]    (* i combinator *) 
    </pre>
    However, for uniformity this optimisation will not be used here.
    <p>
      So that we do not lose track, here is the interpreter as designed so far:
    </p>
    <pre> 
    joy  ==                                 (* literals *) 
        [ [ [ 0    ] 
            [ []   ] 
            [ true ] 
            [ 'A   ] 
            [ ""   ] 
            [ {}   ] 
                                            (* operators *) 
            [ +             pop     +    ] 
            [ rest          pop     rest ] 
            [ dup           pop     dup  ] 
            [ swap          pop     swap ] 
            [ pop           pop     pop  ] 
            [ -             pop     -    ] 
            [ and           pop     and  ] 
            [ cons          pop     cons ] 
                                            (* unary combinators *) 
            [ i             pop [joy] cons    i      ] 
            [ dip           pop [joy] cons    dip    ] 
            [ map           pop [joy] cons    map    ] 
            [ filter        pop [joy] cons    filter ] 
            [ ] ]                           (* provisional default *) 
          opcase 
          i ] 
        step 
    </pre>
    <p>
      The interpreter is getting close to its final shape now, but several things need
      to be fixed. Obviously the <em>binary combinator</em>s have to be treated in
      a way that is similar to the unary ones: The two program parameters <code>[P]</code>  and
      <code>[Q]</code> have to be replaced by <code>[[P] joy]</code> and <code>[[Q] joy]</code>.
      This is best done by using the <kbd>app2</kbd> combinator as follows:
    </p>
    <pre> 
            [[joy] cons]  app2 
    </pre>
    So for the binary combinators the cases look like this:
    <pre> 
                                            (* binary combinators *) 
            [ branch        pop [[joy] cons] app2   branch ] 
            [ cleave        pop [[joy] cons] app2   cleave ] 
    </pre>
    For the <em>ternary combinator</em>s and <em>quaternary combinator</em>s the
    pattern is much the same, there are now three or four program parameters that need
    to be modified. This is easily done using the <kbd>app3</kbd>and <kbd>app4</kbd>combinators to effect the modification.
    <pre> 
                                            (* ternary combinators *) 
            [ ifte          pop [[joy] cons] app3   ifte ] 
                                            (* quaternary combinators *) 
            [ linrec        pop [[joy] cons] app4   linrec ] 
            [ binrec        pop [[joy] cons] app4   binrec ] 
    </pre>
    <p>
      There are still two major amendments needed for the interpreter. The first concerns
      user defined symbols as they might occur in the standard library, the personal
      library or in the preamble to a particular run. All Joy symbols have an internal
      tag, and the tags differ individually only for the operators and combinators. However,
      <em>all</em> numbers have the same internal tag,
      <em>all</em> characters have the same tag,
      <em>all</em> lists have the same tag and so on. Similarly <em>all</em> defined
      symbols have the same tag. The
      <code>opcase</code> operator looks at these tags, so all that is needed is one
      new case for user defined symbols. Just as any number will do as the prototype
      for numbers, so any user defined symbol will do as the prototype for defined symbols.
      We might as well choose "joy". When a defined symbol has been encountered, it is
      necessary to find its definition, which is the program that constitutes the body
      of that definition. The <kbd>body</kbd> operator will find that, it expects a user
      defined symbol on top of the stack and returns the defining program in quoted form.
      The Joy interpreter now has to execute this. But it is essential that the Joy interpreter
      should execute inside that quotation. So it will not do to use the <code>i</code>  combinator, but the <code>joy</code> interpreter itself has to be used. Hence the
      case for user defined symbols is just
    </p>
    <pre> 
            [ joy           body joy ] 
    </pre>
    The single most common case will be the call of a defined atom rather than
    an inbuilt one. To improve efficiency this case (with <code>joy</code>) is placed
    to the front of the caselist.
    <p>
      It always possible that the interpreter is used for programs which contain operators
      or combinators that are part of the language (not used defined) but have not been
      given cases in the interpreter itself, either intentionally or through neglect.
      The joy interpreter should be able to perform reasonably for those operators and
      combinators. So this is where the default clause for the <code>opcase</code>  operator comes in handy. When none of the listed case apply, treat the symbol as
      we did in the second version of the interpreter: take the <code>unitlist</code>  and use the <code>i</code> combinator to execute that. Instead of using <code>unitlist</code>  it is better to use its definition <code>[] cons</code>. So the default clause
      looks like this:
    </p>
    <pre> 
            [               [] cons i ]     (* default *) 
    </pre>
    <p>
      This completes the working design of the interpreter. The following is its structure
      with the last two additions written out fully:
    </p>
    <pre> 
    joy  == 
        [ [ [ joy           body joy ]      (* user defined *) 
            ...                             (* literals *) 
            ...                             (* operators *) 
            ...                             (* unary combinators *) 
            ...                             (* binary combinators *) 
            ...                             (* ternary combinators *) 
            ...                             (* quaternary combinators *) 
            [               [] cons i ] ]   (* default *) 
          opcase 
          i ] 
        step 
    </pre>
    <p>
      Before we write out a more complete version of the interpreter, it is useful to make
      a number of changes to the design.
    </p>
    <p>
      Firstly, the cases for the combinators of various arities contain common code which
      is repeated again and again. The interpreter becomes more readable if such instances
      are factored out and defined separately. There are cases for unary, binary, ternary
      and quaternary combinators, and for each of these the common code will be called
      <code>cr1</code>, <code>cr2</code>, <code>cr3</code> and <code>cr4</code>. For
      uniformity the code for <code>cr1</code> is assimilated to that of the others,
      using <kbd>app1</kbd>. Since they are not likely to be wanted anywhere else, their
      definitions are given inside a <kbd>HIDE</kbd> declaration.
    </p>
    <p>
      Secondly, it could be useful if the default case does its job not silently but traces
      out each symbol that it hands over to the Joy system. Such symbols are <code>dup</code>licated
      and then written out by <kbd>put</kbd>. This now makes the default case
    </p>
    <pre> 
            [               dup put [] cons i ] 
    </pre>
    <p>
      The interpreter <kbd>joy</kbd> now looks like this:
    </p>
    <pre> 
    HIDE 
      cr1  ==  pop [[joy] cons] app1; 
      cr2  ==  pop [[joy] cons] app2; 
      cr3  ==  pop [[joy] cons] app3; 
      cr4  ==  pop [[joy] cons] app4 
    IN 
      joy  == 
        [ [ [ joy           body    joy       ] 
            [ []                              ] 
            [ 0                               ] 
            ... 
            [ dup           pop     dup       ] 
            [ +             pop     +         ] 
            [ cons          pop     cons      ] 
            [ put           pop     put       ] 
            ... 
            [ i             cr1     i         ] 
            [ dip           cr1     dip       ] 
            [ map           cr1     map       ] 
            [ filter        cr1     filter    ] 
            [ app1          cr1     app1      ] 
            [ app2          cr1     app2      ] 
            ... 
            [ ifte          cr3     ifte      ] 
            [ linrec        cr4     linrec    ] 
            [ binrec        cr4     binrec    ] 
            ... 
            [               dup put [] cons i ] ] 
          opcase 
          i ] 
        step 
    END 
    </pre>
    <p>
      The interpreter has appropriate cases for all literals and for quite a few operators
      and combinators. Most operators and combinators are still missing and will therefore
      be handled by the default clause. However, it is straightforward to make the interpreter
      more comprehensive and even complete.
    </p>
    <p>
      It is of some interest to write an interpreter that is just adequate to interpret
      itself and leaves everything else to the default clause. The following is the minimal
      Joy interpreter <kbd>joy0</kbd>; for variety it uses the optimisation for the
      <code>i</code> combinator mentioned earlier.
    </p>
    <pre> 
    joy0  == 
        [ [ [ joy0          body            joy0     ] 
            [ []                                     ] 
            [ pop           pop             pop      ] 
            [ cons          pop             cons     ] 
            [ opcase        pop             opcase   ] 
            [ body          pop             body     ] 
            [ i             pop             joy0     ] 
            [ step          pop [joy0] cons step     ] 
            [               [] cons         i        ] ] 
          opcase 
          i ] 
        step 
    </pre>
    <p>
      The two versions <kbd>joy</kbd> and <kbd>joy0</kbd> are in the file
      <a href="jp-joyjoy.joy"> Joy in Joy </a>.
    </p>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>