<template>
  <article>
    <i> By Manfred von Thun </i>
    <h1> Introduction </h1>
    This paper shows how to write simple programs in Joy. Since Joy is very different
    from familiar programming languages, it takes a while to become used to writing programs
    in Joy. One way to start the learning process is by way of writing some simple generally
    useful library programs. In an implementation these may be part of an actual library,
    or they may be built into the language.
    <p>
      Some general <em>utility program</em>s include operators for manipulating the Joy
      stack just below the top element, further operators for manipulating aggregate
      values, and a few output programs. Generally useful are the
      <em>stack type</em> and the
      <em>queue type</em>. Values and operators of these two types are easily implemented
      as Joy lists and list operators.
    </p>
    <p>
      Another collection of useful operators take an aggregate as parameter and produce
      a list of subaggregates. These operators are <em>polymorphic</em> in the sense
      that the aggregate parameter can be a (small) set, a string, or a list. For example,
      one such operator can take a set as parameter and produces a list of its subsets.
      All of these operators are definable without recursion by using the <kbd>linrec</kbd>  combinator.
    </p>
    <p>
      Some <em>arithmetic operator</em>s are often used to illustrate recursive definitions,
      although it is well known that iterative execution is more efficient. In particular
      the use of <em>accumulating parameter</em>s can often replace recursion. This is
      easily done in Joy using various iteration combinators.
    </p>
    <p>
      Values of <em>sequence type</em>s, such as strings and lists, can be sorted, and
      sorted sequences can be merged. Programs for doing this are easily written in Joy
      without recursive definitions but using appropriate combinators instead.
    </p>
    <p>
      Joy's inbuilt <em>set type</em> is implemented just as bitstrings, and hence it
      is limited to small sets of small numbers. The more useful <em>big set type</em>,
      which allows large sets of elements of any type, can be implemented in any language
      which has lists. It is simple to do in Joy, and the usual set-theoretic operations
      are easily provided. A similar implementation can be used for the <em>dictionary type</em>,
      which uses lookup tables for finite functions.
    </p>
    <p>
      Also useful is the <em>tree type</em>, of lists, or lists of lists, or lists of
      lists of lists ... of elements other than lists.
    </p>
    <p>
      The remainder of this paper illustrates programming in Joy by way of simple examples.
      Many of the programs are first written in pseudo-code and the translated into Joy.
      Some of the Joy programs here have been adapted from the literature on ML or Miranda\footnote{"Miranda"
      is a trademark of Research Software Ltd}. The next section defines some useful
      general purpose operators and combinators. This is followed by a section on two
      little collections of operators for two datatypes, stacks and queues. A longer
      section deals with programs for creating and manipulating lists of subaggregates.
      A shorter section then illustrates the use of accumulating parameters for the efficient
      implementation of numeric functions. Then there is another section on sorting sequences
      and on merging sorted sequences. Another section gives an implementation of unrestricted
      sets and of lookup dictionaries.
    </p>
    <h1>Utility operators and combinators</h1>
    <p>
      This section describes some very simple utilities which are useful in very different
      settings. Joy definitions are of the form
    </p>
    <pre>        ATOM   ==   PROGRAM
    </pre>
    where the long equals <kbd>==</kbd> means that the atom on the left is being
    defined to cause the execution of the program on the right.
    <p>
      Joy has three important operations for manipulating the top few items of the stack:
      <kbd>pop</kbd> for removing the top item,
      <kbd>dup</kbd> for creating a copy of the top item, and <kbd>swap</kbd> for interchanging
      the top two items. Often it is necessary to perform similar operations further
      below the stack. The following define three similar operators which leave the top
      element of the stack intact and perform the work just below that. All three use
      the <kbd>dip</kbd> combinator which takes as a parameter a quoted program and below
      that a further item. The item is saved, the quoted program is executed and the
      item then restored.
    </p>
    <pre>        popd   ==  [pop ] dip
            dupd   ==  [dup ] dip
            swapd  ==  [swap] dip
    </pre>
    The <kbd>popd</kbd> operator removes the second item. The <kbd>dupd</kbd>operator duplicates the second item. The <kbd>swapd</kbd> operator interchanges the
    second and third item.
    <p>
      Three similar operators affect the order of the top three items on the stack. The
      <kbd>rollup</kbd> operator places items one, two and three from the top in the
      order two, three, one. The <kbd>rolldown</kbd> operator places items one, two and
      three in the order three, one, two. The <kbd>rotate</kbd> operator places them
      in the order three, two, one.
    </p>
    <pre>        rollup     ==  swap [swap] dip
            rolldown   ==  [swap] dip swap
            rotate     ==  swap [swap] dip swap
    </pre>
    <p>
      The next examples are for <em>unary operator</em>s which expect an item on the
      stack and replace it with either a set or a string or a list containing just that
      item. All three operators work by first pushing The <em> empty set </em> <kbd> {} </kbd>  or the <em>empty string</em> <kbd>""</kbd> or the <em>empty list</em> <kbd>[]</kbd>}
      on top of the stack. Then they use the <kbd>cons</kbd> operation to add the item
      below into the aggregate. The items have to be of the right type. The <kbd>unitset</kbd>  operator requires a small number, the <kbd>unitstring</kbd> operator requires a
      character, and the <kbd>unitlist</kbd> operator requires anything. If the items
      are not of the right type, an error occurs when the <code>cons</code> is executed.
    </p>
    <pre>        unitset     ==  {} cons
            unitstring  ==  "" cons
            unitlist    ==  [] cons
    </pre>
    The action of all three is reversed by the single standard operator
    <kbd>first</kbd>.
    <p>
      Analogously one may define three operators
      <kbd>pairset</kbd>, <kbd>pairstring</kbd> and <kbd>pairlist</kbd>, which form a
      set, string or list from <em> two</em> appropriate items on top of the stack:
    </p>
    <pre>        pairset     ==  {} cons cons
            pairstring  ==  "" cons cons
            pairlist    ==  [] cons cons
    </pre>
    The action of all three is reversed by a single operator <kbd>unpair</kbd>,
    which may be defined in either of two equivalent ways:
    <pre>        unpair  ==  uncons uncons pop
            unpair  ==  uncons first
    </pre>
    <p>
      Joy has two operators applicable to
      <em> non-empty</em> sets, strings and lists: The operator <kbd>first</kbd> extracts
      the first item of a string or list, and that item from a set which is the first
      in the underlying order. The operator <kbd>rest</kbd> removes the first item and
      returns the remaining set, string or list. Sometimes it is necessary to extract
      the
      <kbd>second</kbd> or <kbd>third</kbd> item. Suitable definitions are these:
    </p>
    <pre>        second  ==  rest first
            third  ==  rest rest first
    </pre>
    <p>
      The operators <kbd>uncons</kbd> and <kbd>unswons</kbd> undo what is done by
      <code>cons</code> and <code>swons</code>, Often it is useful to dissect not just
      one aggregate into its <code>first</code> and <code>rest</code>, but to dissect
      two aggregates. This can be done by <kbd>uncons2</kbd> and <kbd>unswons2</kbd>,
      defined as follows:
    </p>
    <pre>        uncons2   ==  [uncons ] dip uncons  swapd
            unswons2  ==  [unswons] dip unswons swapd
    </pre>
    Both expect two aggregates on top of the stack, both leave two <code>first</code>s
    and two <code>rest</code>s on the stack. For <code>uncons2</code> the two <code>first</code>s
    are items 3 and 4 on the stack, the two <code>rest</code>s are items 1 and 2. For
    <code>unswons2</code> it is the other way around.
    <p>
      Similarly, it is sometimes necessary to test whether at least one of two aggregates
      is empty, or whether at least one of two numeric values is equal to zero. For a
      single parameter this is done by <code>null</code>, for two parameters it is
      done by <kbd>null2</kbd>, defined in either of two equivalent ways:
    </p>
    <pre>        null2  ==  [null] [true] [pop null] ifte
            null2  ==  [ [[null] true] [pop null] ]  cond
    </pre>
    <p>
      Strings and lists are special kinds of aggregates, they are <em>sequence</em>s.
      Sometimes it is necessary to reverse sequences. The naive way of doing this is
      recursively as follows:
    </p>
    <pre>          To reverse a sequence S:
                     If    S is empty
                           then return the empty sequence
                           else    remove the first element
                                   reverse the rest of S
                                   append the first element of S at the tail
    </pre>
    It is easy to see that this is very inefficient because the append operation
    requires a lot of copying, and every element to be appended requires portions of
    the rest to be copied again and again. A well-known optimisation uses an extra parameter,
    an <em>accumulating parameter</em>, to obtain the same effect. The idea is to prepend
    the elements of the original list onto the accumulating parameter. Sometimes this
    is expressed by analogy with railways. The <kbd>shunt</kbd> operator takes two sequences
    as parameters and, starting at the front of the topmost parameter, moves all items
    onto the front of the second parameter. Joy has a combinator <kbd>step</kbd> for
    stepping through all items of its top parameter, and for each item executing a program
    that is given as a further parameter. That program has to take the item and add it
    to the accumulating parameter, so it is the <kbd>swons</kbd> operator. So this is
    how <code>shunt</code> can be defined:
    <pre>        shunt  ==  [swons] step
    </pre>
    To reverse a list or a string, an empty list or empty string has to be supplied
    as an accumulating parameter just below the list or string that is to be reversed.
    So here are definitions for <kbd>reverselist</kbd> and <kbd>reversestring</kbd>:
    <pre>        reverselist    ==  [] swap shunt
            reversestring  ==  "" swap shunt
    </pre>
    But there is something unsatisfactory about this, the reversal operation should
    be polymorphic. So the following version of <kbd>reverse</kbd> first tests whether
    the sequence to be reversed is a list or not, and inserts the appropriate accumulating
    parameter. The testing is done by the <kbd>iflist</kbd> combinator which takes two
    (here rather tiny) programs as parameters. and below that one other item, the list
    or string to be reversed. If the latter happens to be a list, then the first quoted
    program is executed, and it will push an empty list. Otherwise the second program
    is executed, and it will push an empty string. In either case the two top items are
    now
    <code>swap</code>ped and then <code>shunt</code>ed.
    <pre>        reverse  ==  [[]] [""] iflist swap shunt
    </pre>
    <p>
      It comes as a surprise that lists can be reversed in another way. The idea is this:
      When a list is executed by a combinator, all the members of the list will be literals,
      so they will each be pushed onto the stack. The last element of the list will end
      up on top of the stack. So the elements of the list will then be in reverse order.
      To make use of this idea we have to arrange that an initially empty list is treated
      as a stack. This is what the <kbd>infra</kbd> combinator does. It takes a list
      as one parameter and a program as the second. It uses the list as a temporary stack
      and executes the program. The resultant stack is then pushed as a list. For the
      reversal problem the program is the list to be reversed, and the other parameter
      has to be the empty list. That empty list first has to be inserted below the list
      to be reversed. So another program to reverse a list is this:
    </p>
    <pre>        reverselist  ==  [] swap infra
    </pre>
    What makes this version possible is that in Joy the principle that <em>program = data</em>is extended to <em>program = data = memory</em>. This version is actually more efficient
    than the one given earlier. Of course it cannot be adapted for reversing strings.
    <p>
      The two principal operators for explicit output are
      <kbd>put</kbd>, which prints a single value of any type, and <kbd>putch</kbd>,
      which prints a single stand alone character without quote symbol. Two useful little
      utility operators are worth defining. The <kbd>putchars</kbd> operator uses the
      <kbd>step</kbd> combinator to step through the characters in a list or string and
      writes them to the output file without the enclosing
      <code>[]</code> or <code>""</code>. The <kbd>newline</kbd> operator just outputs
      the newline character <code>\n</code> to terminate a line.
    </p>
    <pre>        putchars  ==  [putch] step
            newline     ==  '\n put
    </pre>
    <p>
      Using the <code>step</code> combinator it is easy to define several conversion
      operators which can be useful. The first two produce sets from aggregates of upper
      or lower case aggregates. The last two produce strings of upper or lower case characters
      from aggregates of small numbers.
    </p>
    <pre>        upper2set == {} swap [64 - swons] step
            lower2set == {} swap [96 - swons] step
            set2upper == "" swap [64 + swons] step
            set2lower == "" swap [96 + swons] step
    </pre>
    <p>
      The <kbd>dip</kbd> combinator expects a quotation and below that an item that will
      be saved before execution of the quotation and restored afterwards. Sometimes one
      wants to save and restore two or even three items, so it is useful to have further
      variants <kbd>dip2</kbd> and <kbd>dip3</kbd>, defined as follows:
    </p>
    <pre>        dip2  ==  [dip] cons dip
            dip3  ==  [dip] cons dip2
    </pre>
    Note that <kbd>cons</kbd> is being used to build a <em>constructed program</em>that is then supplied as a parameter to the last combinator.
    <h1>Stacks and queues</h1>
    <p>
      This section and the next two contain implementations of two simple data types. Members
      of the <em>stack type</em> are linear structures which allow read and write access
      at one end only, and members of the <em>queue type</em> are linear structures which
      allow read access at one end and write access at the other end. Both have this
      much in common: the stack or queue remains on the Joy stack, and any stack or queue
      operations using it leave it there. Of course it can be explicitly removed with
      <code>pop</code>.
    </p>
    <p>
      <em> 1.</em> First, the <em>stack type</em>. A stack is a linear structure that
      can grow by having items added, inspected and removed all from the same end. The
      simplest way to implement stacks in Joy is as lists. One essential operator is
      <kbd>st-new</kbd> for the creation of a new empty stack, which is just an empty
      list. So the definition is
    </p>
    <pre>        st-new  ==  []
    </pre>
    <p>
      Stacks can have additional items pushed onto them, and this is done by adding them
      to the front of the list. Since the stack is already there, the new item will typically
      be first pushed onto the Joy stack, and then it is to be pushed onto the stack.
      One way to do this is to <code>swap</code> the item and the stack and then perform
      a <code>cons</code> operation. But Joy has an operation which combines these two,
      namely <kbd>swons</kbd>. So the <kbd>st-push</kbd> operation can be defined by
    </p>
    <pre>        st-push  ==  swons
    </pre>
    An essential predicate is <kbd>st-null</kbd> for testing whether a stack is
    empty or null. However it will not do to just use <code>null</code>, since this will
    remove the stack --- but typically the stack is intended for further applications.
    So, to avoid losing the stack, it has to be <code>dup</code>licated first, and then
    the <code>null</code> test can be applied to the duplicate:
    <pre>        st-null  ==  dup null
    </pre>
    <p>
      The previous two operations both make sense when the stack is empty, but this is
      not the case for the stack operations to follow. The first of these is <kbd>st-top</kbd>  for extracting the top element of the stack, while leaving the stack itself unchanged.
      The second is <kbd>st-pop</kbd> for removing the top element. The third is <kbd>st-pull</kbd>  which combines the last two, it is the opposite of push. It extracts the top item
      and pops the stack. Ignoring the complication of an empty stack, the definitions
      would simply be:
    </p>
    <pre>        st-top   ==  dup first
            st-pop   ==  rest
            st-pull  ==  unswons
    </pre>
    To guard against an empty stack, a test has to be performed to determine whether
    the stack is empty. If it is, then an error message should be given, otherwise the
    operation should be performed. So for all three operations the structure will be
    of the form
    <pre>        ==   [null]  [ERROR-MESSAGE]  [PERFORM OPERATION]  ifte
    </pre>
    The error messages should state which of the operations was being attempted,
    but otherwise they should be the same. So the name of the operation is given as a
    string parameter to an error handling operation. That particular operation will be
    called
    <code>_st-error</code>, and we leave the details of its implementation till a little
    later. The leading underscore <code>_</code> in the name has been added because this
    operation is not intended to be used by the programmer; in the current implementation
    the <kbd>help</kbd> command hides identifiers with a leading underscore. The remaining
    stack operations are then:
    <pre>        st-top  == [null] ["st-top"  _st-error] [dup first] ifte
            st-pop  == [null] ["st-pop"  _st-error] [rest     ] ifte
            st-pull == [null] ["st-pull" _st-error] [unswons  ] ifte
    </pre>
    As may be seen, the three operations still have a lot in common, and one might
    consider extracting that further. However, the result is likely to be less clear
    to the human reader. It remains to implement the error operation. It should state
    that an error has occurred due to an empty stack, and this part is the same for all
    three operations. It should also state which of the operations failed. So a minimal
    implementation of <code>_st-error</code> would simply write one string which is common
    for any call, and another string which is the specific parameter. This is crude but
    very easy to implement:
    <pre>        _st-error  ==  "non_empty stack needed for " put put
    </pre>
    A minor improvement is to concatenate the two strings (in the right order),
    so that only one string has to be written. But the double quotation marks in the
    output still look silly. So instead of writing the one or two strings with <code>put</code>,
    it looks nicer to write their constituent characters with <kbd>putchars</kbd>. Also,
    the line should be terminated with <kbd>newline</kbd>. Finally, there is little sense
    in continuing the computation, so after the two parts of the error message have been
    displayed, it is best to <kbd>abort</kbd>, to return to the top level.
    <p>
      In a library implementation for the collection of definitions of stack operations
      might look like this:
    </p>
    <pre>LIBRA (* stack *)

    _st-error == "non-empty stack needed for " putchars putchars newline abort;
    st-new  == [];
    st-push == swons;
    st-null == dup null;
    st-top  == [null] ["st-top"  _st-error] [dup first] ifte;
    st-pop  == [null] ["st-pop"  _st-error] [rest     ] ifte;
    st-pull == [null] ["st-pull" _st-error] [unswons  ] ifte.
    </pre>
    As may be seen from the example, a library declaration begins with the word
    <kbd>LIBRA</kbd> and terminates with a period. In between is a sequence of definitions
    separated by semicolons <kbd>;</kbd>. A definition consists of an atomic symbol and
    then the symbol <kbd>==</kbd> followed by a Joy program. Note again that the <code>_st-error</code>operator is not really intended to be used outside the remaining definitions. It
    could well be hidden completely from outside. A mechanism for this will be illustrated
    below.
    <p>
      <em> 2.</em> Next, the <em>queue type</em>. A queue is a linear structure that
      can grow by having items added at one end, and inspected or removed from the other
      end. A simple minded implementation would consists of a single Joy list to which
      items are added at the end and removed from the front. But adding something at
      the end requires copying the entire list every time. Nothing would be gained by
      reversing the role of front and end, because in that case the removal requires
      copying of (almost) the entire list. A better implementation uses <em> two</em>  lists. Conceptually one is the front of the queue, and items are removed at the
      front. Conceptually the other list is the back of the queue, but in reverse, and
      items are added to the front of this list. If at any time the list implementing
      the front of the queue becomes empty, the other list gets explicitly reversed and
      it becomes the front, and the empty list becomes the rear. There are two auxiliary
      operators that need only be visible to the remaining operators but not to the outside;
      in the following they are hidden in the private part of this module. Because they
      are hidden, there is no need to choose names which indicate the datatype on which
      they operate.
    </p>
    <pre>LIBRA (* queue *)

    HIDE
      error   == "non_empty queue needed for " putchars putchars newline abort;
      prepare == [null] [swap reverse] [] ifte
    IN
      q-new   == [] [];
      q-add   == swap [swons] dip;
      q-addl  == swap [shunt] dip;
      q-null  == prepare dup null;
      q-front == prepare [null] ["q-front" error] [dup first] ifte;
      q-rem   == prepare [null] ["q-rem "  error] [unswons  ] ifte
    END.
    </pre>
    <p>
      As may be seen, such a declaration consists of the word <kbd>HIDE</kbd>, followed
      by a sequence of definitions, then the word <kbd>IN</kbd> followed by another sequence
      of definitions, and then the word <kbd>END</kbd>. A sequence of definitions is
      again separated by semicolons <kbd>;</kbd>. The whole declaration can occur inside
      a library declaration where a single definition can occur. Any hiding declaration
      can occur wherever a single definition can occur, so they can be nested.
    </p>
    <p>
      The first auxiliary error reporting procedure, <code>error</code>, is similar to
      the one for stacks. The second auxiliary operation, <code>prepare</code>, prepares
      the two lists: if the list implementing the front happens to be empty, the roles
      of the two lists are interchanged. If the front list is not empty, nothing is done.
    </p>
    <p>
      A new queue is created by <kbd>q-new</kbd> in the form of two empty lists. An item
      can be added (to the "rear of the queue") by <kbd>q-add</kbd> which adds it to
      the front of the second list. The members of a whole list can be added to the rear
      by <kbd>q-addl</kbd>. The operator <kbd>q-null</kbd> first prepares the two lists
      so that the list implementing the front is not empty, if that is possible at all.
      It then tests the front list. The operator <kbd>q-front</kbd> and <kbd>q-rem</kbd>  extract respectively a copy of the front element or the front element itself. The
      copy or the original are left above the two lists. Both operators require the queue
      to be prepared so that the list implementing the front is not empty. Also, both
      operators need to check whether the front really is non-empty. If it is not, the
      error operator is called.
    </p>
    <p>
      The definitions for stacks and queues are part of the library file
      <kbd>TYPLIB.JOY</kbd>.
    </p>
    <h1>Lists of subaggregates</h1>
    The <em>aggregate type</em>s of Joy comprise sets of small numbers, or strings of
    characters, or lists of items of any kind. Much of this section deals with lists
    of aggregates constructed from a given aggregate. The principal tool is the <kbd>linrec</kbd>combinator. It expects four program parameters on the stack, an if-part, a then-part,
    a rec1-part and a rec2-part. Execution begins by saving the four parts and then executing
    the if-part. If that produces the truth value <code>true</code> on top of the stack,
    the then-part is executed and the combinator exits. Otherwise the rec1-part is executed,
    then the combinator calls itself with the same four parts, and then the rec2-part
    is executed.
    <p>
      The first definition below is for an operator <kbd>restlist</kbd> which takes any
      aggregate as parameter and produces the list of all those subaggregates that would
      be formed by repeatedly taking the <kbd>rest</kbd>s of the aggregate. Such an operator
      can of course be defined recursively and this could be done in any language. But
      in Joy it is possible to use a non-recursive definition using the <code>linrec</code>  combinator. Here is some pseudocode:
    </p>
    <pre>1.      If    the aggregate is empty
    2.            then  form its unitlist
    3.            else    take a copy and the rest of that,
                          recurse using this rest,
                          eventually forming a list of aggregates,
    4.                    use cons to add the original aggregate
                          to the front of this list
    </pre>
    The above pseudocode translates directly into a recursive form in any language,
    but in Joy a non-recursive definition is also possible. The four program parameters
    for the <code>linrec</code> combinator correspond exactly to the labelled lines.
    Nothing corresponds to the unlabelled line, the <code>linrec</code> combinator recurses
    here automatically.
    <pre>    restlist  ==
    1.        [ null ]
    2.        [ unitlist ]
    3.        [ dup rest ]
    4.        [ cons ]
              linrec
    </pre>
    <p>
      The next program also takes an aggregate as parameter and produces a list of subaggregates.
      But the subaggregates are those obtained by successively deleting the last elements.
      In analogy with the previous operator it will be called the <kbd>frontlist</kbd>  operator. For empty aggregate parameters again the unitlist has to be returned,
      so the if-part and the then-part are the same as before. Also, for non-empty aggregates
      the aggregate has to be taken apart in the rec1-part. This can be done in two ways.
      We can take the front aggregate and the last element, but that would require defining
      a suitable operator, and it would require expensive copying in the case of list
      or string aggregates. Alternatively we can just <code>uncons</code>. This leaves
      only the rec2-part to be written. But it will be more complicated than for the
      previous operator. Let us ignore for the moment that the operator is intended to
      be used for aggregates of any of the three types. When the anonymous recursion
      has completed, the stack will contain the first item of the non-empty aggregate
      and above that the <code>frontlist</code> of its rest. The first item has to be
      <code>cons</code>ed into each member of the frontlist, and that is best done by
    </p>
    <pre>        [cons]  map
    </pre>
    Then that first item, which is now still the second element on the stack,
    has to be deleted. This can be done by a variant of <code>pop</code>, namely <code>popd</code>.
    Finally, assuming that the operator is to be used for lists, the empty list has to
    be added to the frontlist, and the easiest way is by <code>[] swap cons</code>, or
    simply by <code>[] swons</code>. This gives the following provisional rec2-part:
    <pre>        [ [cons] map   popd   [] swons ]
    </pre>
    But the assumption that the operator is to be used only for lists is unnecessarily
    restrictive. The final part, adding an empty aggregate, should depend on what the
    initial aggregate was, a set, a string or a list. This can be achieved by looking
    up the first element of the frontlist, it is a one element aggregate and taking its
    rest produces the required empty aggregate of that type. So the required rec2-part
    is:
    <pre>        [ [cons] map   popd   dup first rest swons ]
    </pre>
    The entire definition for <code>frontlist</code>, applicable to any aggregate,
    now is:
    <pre>    frontlist ==
            [ null ]
            [ unitlist ]
            [ uncons ]
            [ [cons] map popd dup first rest swons ]
            linrec
    </pre>
    <p>
      The next program defines an operator <kbd>subseqlist</kbd> which is in some ways
      a combination of the preceding ones. Again it takes any aggregate as parameter
      and returns a list of subaggregates. This time the subaggregates are all those
      obtainable from the parameter aggregate by deleting first or last elements. For
      ordered aggregates, lists and strings, the resulting subaggregates will still contain
      elements in the same order as the parameter. It is tempting to define the operator
      very simply by
    </p>
    <pre>        ==   frontlist  [restlist]  map
    </pre>
    But this produces not a list of subsequences but a list of list of subsequences.
    This list of lists could then be flattened to a single list, even if this is somewhat
    inefficient. However, a different solution is possible.
    <p>
      The if-part and the then-part are as for <code>restlist</code> and <code>frontlist</code>,
      of course. The rec2-part is easy, it is only necessary to <code>concat</code>enate
      two lists that were produced by the rec1-part. But the rec1-part is rather complex,
      and this is what it has to do: the first element of the aggregate has to be extracted
      and later it has to be <code>cons</code>ed into every subaggregate of the <code>frontlist</code>  of the rest of the aggregate. But also the rest of the aggregate has to be made
      available for the <code>linrec</code> combinator to work on. So the rec1-part must
      <code>uncons</code> the aggregate, and produce a second copy of the rest. The second
      copy has to be kept aside by using the <code>dip</code> combinator to work on the
      original copy. So an intermediate draft of the rec1-part looks like this:
    </p>
    <pre>        [ uncons  dup
              [ ... ]
              dip ]
    </pre>
    The <code>[...]</code> program must take the <code>frontlist</code> (of the
    original copy of the rest) and then <code>cons</code> the first element into each
    of the members of the result. We already know how to do that, and how to delete the
    hidden first member. So the rec2-part is the following:
    <pre>        [ uncons  dup
              [ frontlist  [cons] map  popd ]
              dip ]
    </pre>
    The entire program now is this:
    <pre>    subseqlist ==
            [ null ]
            [ unitlist ]
            [ uncons dup [frontlist [cons] map popd] dip ]
            [ concat ]
            linrec
    </pre>
    The program uses <code>frontlist</code>, but because the latter is defined
    without recursion, it is possible to simply use the RHS of the definition of <code>frontlist</code>and insert that textually into the definition of <code>subseqlist</code>. The <code>frontlist</code>and <code>subseqlist</code> operators were adapted from recursive programs in \AX{Thompson}{1991
    p 247}{Thompson:91}.
    <p>
      The next program defines a unary operator <kbd>powerlist</kbd> which for any aggregate
      returns a list of all subaggregates. If the parameter aggregate has <var>N</var>  members, the resulting list of subaggregates has <var>2^N</var> members.
    </p>
    <pre>    powerlist ==
            [ null ]
            [ unitlist ]
            [ uncons ]
            [ dup swapd [cons] map popd swoncat ]
            linrec
    </pre>
    It uses the <code>linrec</code> combinator and the same if-part and then-part
    as the previous programs. It also uses the same rec1-part as the <code>frontlist</code>program: before recursing, the parameter is split into its first and its rest by
    <code>uncons</code>. The recursion then produces the powerlist of the rest. The rec2-part
    then uses that result to produce two copies, using <code>dup</code>. One copy is
    left untouched, the other has the original first element
    <code>cons</code>ed before every sublist using <code>map</code>. For this to work,
    the original first element has to be placed in the right position by <code>swapd</code>and eventually deleted by <code>popd</code>. The two resultant lists are finally
    combined with
    <code>swoncat</code>. This produces the list of subaggregates starting with the empty
    one; if <code>concat</code> is used instead of <code>swoncat</code>, the list ends
    with the empty one. Neither method yields the subsequences sorted according to <code>size</code>;
    but see the later section on sorted sequences.
    <p>
      The next program defines a binary operator <kbd>insertlist</kbd>. This operator
      expects a list or a string as a parameter and below that a potential list member
      or a character. It returns a list whose elements are either lists or strings, each
      with the potential member or character inserted once at all possible positions.
      So if the original list or string has <var>N</var> members, the resultant list
      has <var>N+1</var> lists or strings as members.
    </p>
    <pre>    insertlist ==       (*   Item  Sequence   -&gt;   List(Sequence) *)
            cons
            [ small ]
            [ unitlist ]
            [ dup                           (* keep original *)
              unswons [uncons] dip swons ]  (* take out second *)
            [ swap [swons] cons map         (* swons in second *)
              cons ]                        (* cons in original *)
            linrec
    </pre>
    The operator can also be used, with a set parameter instead of a string or
    list. Then it produces a list of <var>N+1</var> identical sets, each with the new
    member added. But such a use will rarely be wanted.
    <p>
      The <kbd>permlist</kbd> operator expects a sequence and returns the list of all
      <em>permutation</em>s of that sequence. So if the original sequence has <var>N</var>  members, the result list has factorial(<var>N</var>) members.
    </p>
    <pre>    permlist ==
            [ small ]
            [ unitlist ]
            [ uncons ]
            [ swap [swap insertlist] cons map
              flatten ]
            linrec
    </pre>
    Note again that in the two preceding programs the <code>map</code> combinator
    uses a <em>constructed program</em>.
    <p>
      The <kbd>zip</kbd> operator expects two aggregate parameters, not necessarily of
      the same type, and not necessarily of the same <code>size</code>. It produces a
      list of two element lists by combining corresponding elements from the two aggregates.
      The result list contains as many pairs as the smaller of the two parameter aggregates.
      Here is the definition:
    </p>
    <pre>    zip ==
            [ null2 ]
            [ pop pop [] ]
            [ uncons2 ]
            [ [pairlist] dip cons ]
            linrec
    </pre>
    This might be paraphrased as: If one or the other of the two parameter aggregates
    is <code>null</code>, then <code>pop</code> them both and return the empty list <code>[]</code>,
    otherwise take out the two <code>first</code> elements and the two <code>rest</code>s,
    recurse with the two <code>rest</code>s producing a result list of two element lists
    of that, then <code>dip</code> below that result list to combine the two previous
    <code>first</code>s with <kbd>pairlist</kbd> to form a two element list, and <code>cons</code>that into the front of the result list.
    <p>
      Related to this is the more general <kbd>zipwith</kbd> combinator, adapted from
      \AX{Bird and Wadler}{1988 p 57}{Bird:88}. It takes three parameters, two aggregates
      and one quotation which can be used to combine members of the aggregates. The program
      again uses the <code>linrec</code> combinator which needs four quoted programs
      as parameters. The fourth quotation now has to be a <em>constructed program</em>,
      it is built from the program parameter of <code>zipwith</code> and the program
      stub <code>[dip cons]</code> already seen for <code>zip</code>. The other three
      program parameters for <code>linrec</code> first have to be <code>dip</code>ped
      below the parameter of <code>zipwith</code>. The definition for this combinator
      thus is:
    </p>
    <pre>    zipwith ==
    1.       [ [ null2 ]
    2.         [ pop pop [] ]
    3.         [ uncons2 ] ]
             dip
    4.       [ dip cons ] cons
             linrec
    </pre>
    <p>
      A list of sequences can be concatenated into a single sequence by the unary operator
      <kbd>flatten</kbd>. The code is straightforward: if the parameter list is empty,
      then there is nothing to concatenate, leave it as it is. Otherwise use <code>uncons</code>  to take out its first and its rest, recurse anonymously on the rest to produce
      the <code>flatten</code>ed result of that, and finally <code>concat</code>enate
      the saved first part to the front of the last result.
    </p>
    <pre>    flatten  ==  [null]  []  [uncons]  [concat] linrec
    </pre>
    <p>
      A two dimensional <em>matrix</em> can be implemented as a list of lists. One important
      matrix operation is the interchange of rows and columns, performed by the unary
      operator <kbd>transpose</kbd>. A draft of the program is the following:
    </p>
    <pre>          To transpose a list of lists LL :
    1                If    LL is empty or some sublist of LL is empty
    2                      then     pop  it off and return the empty list  [] 
                           else    (all sublists are non-empty)
    3a                             construct a list of all the  first s of sublists
    3b                             construct a list of all the  rest s of sublists
                                   recurse anonymously on the list of  rests
    4                               cons  the list of  firsts into the result.
    </pre>
    This version has been adapted from \AX{Reade}{1989 p 133}{Reade:89}. To test
    the disjunction whether LL is empty or some of its sublists are empty, we use the
    conditional combinator <kbd>ifte</kbd>. The if-part has to test whether LL is empty,
    and if it is, then the then-part has to return <code>true</code>. Otherwise the then-part
    will have to determine whether some sublists of LL are empty. This is best done with
    the combinator <kbd>some</kbd>. So part 1 of the Joy version is:
    <pre>1        [null]  [true]  [[null] some]  ifte
    </pre>
    For parts 3a and 3b it is necessary to use the parameter LL to produce two
    lists, of the <code>first</code>s and the <code>rest</code>s. Either of these two
    can be obtained with the <kbd>map</kbd> combinator. To obtain the two lists, the
    <kbd>cleave</kbd> combinator can be used, it takes two quotation parameters and a
    further parameter, and produces two values, one from each of the two quotations.
    So parts 3a and 3b are just:
    <pre>3a      [ [first] map ]
    3b      [ [rest ] map ]
            cleave
    </pre>
    The entire Joy program thus is:
    <pre>    transpose ==
    1       [ [null] [true] [[null] some] ifte ]
    2       [ pop [] ]
    3       [ [[first] map] [[rest] map] cleave ]
    4       [ cons ]
            linrec;
    </pre>
    <p>
      Alternatively, line 1 can be replaced by the following:
    </p>
    <pre>1        [ [null] [[null] some] disjoin i ]
    </pre>
    Here the two tests are first <kbd>disjoin</kbd>ed to form a single test predicate.
    This is the called by the <code>i</code> combinator. The net effect is exactly the
    same as in the version given earlier.
    <p>
      A common binary operation on aggregates is that of forming the <em>Cartesian product</em>.
      It will take two aggregates as parameters and produce the list of two element list
      which each contain one element from each of the two aggregates. If the two aggregates
      have <var>M</var> and <var>N</var> members respectively, then the resultant list
      has <var>M \times N</var> elements. In order to form the Cartesian product, it
      is necessary to consider each of the members of one aggregate with each of the
      members of the other aggregate. This is like <code>step</code>ping through an aggregate,
      except that there are two aggregate to be stepped through. It will be useful first
      to define a combinator <kbd>step2</kbd> which does just that, leaving at each step
      two items on top of the stack. Then the Cartesian product operator will just form
      their pairs, and then form a list of all these pairs. An application of the <code>step2</code>  combinator will look like this:
    </p>
    <pre>        A1   A2   [P]   step2
    </pre>
    The implementation is based on the simple idea that
    <code>A2</code> and <code>[P]</code> be used to construct a program which is then
    used by the ordinary <code>step</code> combinator to step through the elements of
    <code>A1</code>:
    <pre>        A1   [ .. A2 .. [P] .. ]   step
    </pre>
    We now fill in the dots. The program to be constructed has to <code>step</code>through the members of <code>A2</code> using a program which depends on <code>[P]</code>.
    It has to do this for each member of <code>A1</code>, and when it has done that the
    current member of <code>A1</code> can be <code>pop</code>ped off. So the program
    will have to look like this:
    <pre>        A1   [ A2  [ .. P ]  step  pop ]   step
    </pre>
    Since <code>P</code> must be allowed to consume a current member of
    <code>A1</code> but this still has to be available for the next inner <code>step</code>,
    that member of <code>A1</code> first has do be duplicated, below the current member
    of <code>A2</code>. So the dots are just <code>[dup] dip</code>. In sum, the required
    program is
    <pre>        A1   [ A2  [ [dup]  dip  P ]  step  pop ]   step
    </pre>
    The definition of <kbd>step2</kbd> must construct that program from <code>A2</code>and <code>[P]</code> and then call <code>step</code> with just two parameters, the
    program just constructed and below that the other aggregate <code>A1</code>. The
    definition looks like this:
    <pre>    step2  ==
            [[dup] dip]  swoncat            (* form inner quote *)
            [step pop]  cons                (* form outer quote *)
            cons                            (* insert A2 *)
            step                            (* through A1 *)
    </pre>
    <p>
      It is now relatively easy to define the <em>Cartesian product</em> operator as
      follows. First we need to insert an <em>accumulating parameter</em>, an empty list
      <code>[]</code>. It has to be inserted <em> below</em> the two aggregates of which
      the Cartesian product is to be computed. This is easily done with <code>[] rollup</code>.
      The program which is then used by the <code>step2</code> combinator has to form
      the <code>pairlist</code> of the two items on top of the stack. The resultant pair
      has to be inserted into the accumulator with
      <code>swons</code>. But between the accumulator and the just formed pair is the
      current original member of the first aggregate which must be left intact. So the
      pair and the member have to be <code>swap</code>ped, and the <code>swons</code>  has to be done below the member, by <code>dip</code>. This is the program that
      is given as the parameter for <code>step2</code>. So the definition for the <kbd>cartproduct</kbd>  operator is
    </p>
    <pre>    cartproduct  ==
            [] rollup
            [pairlist swap [swons] dip]
            step2
    </pre>
    The program works for aggregates of any type, and the two aggregates do not
    have to be of the same type. If both are lists of numbers or sets of small numbers,
    other variations are possible: By changing the pairing operator <code>pairlist</code>to, say, multiplication <code>*</code>, we obtain a program which produces a list
    of all products. By further changing the accumulator <code>[]</code> to the number
    <code>0</code> and the insertion operation <code>swons</code> to, say, addition <code>+</code>,
    we obtain a program which produces the sum of all <var>M \times N</var> products.
    For two numeric aggregates of the same size, say <var>N</var>, another binary operator
    can be defined, the <kbd>scalarproduct</kbd>:
    <pre>        scalarproduct  ==
                0 rollup                             (* accumulator *)
                [ null2 ]
                [ popd ]
                [ uncons2 [* +] dip2 ]
                tailrec
    </pre>
    It produces the sum of all <var>N</var> products of pairs taken from corresponding
    positions in the two aggregates.
    <h1>Arithmetic operators</h1>
    <p>
      This section gives efficient implementation of several well-known functions which
      are often used in the literature for demonstration purposes: the <em>factorial</em>,
      the <em>Fibonacci</em>-function,
      <em>exponentiation</em> and the <em>greatest common divisor</em>. All of them are
      often defined recursively, and of course they can be defined recursively in Joy.
      Using one of several suitable recursion combinators they can be computed recursively
      in Joy without a recursive definition. But recursive execution in any language
      can be inefficient.
    </p>
    <p>
      There are well known techniques for <em>removing linear recursion</em>, see for
      example \AX{Bauer and W\"ossner}{1982 Chapter 4}{Bauer-Woessner:82}. The same topic
      is discussed in \AX{Henson}{1987 Chapter 4}{Henson:87} using the useful concept
      of <em>eureka definition</em>s due to Burstall and Darlington. These involve creative
      steps in the production of more efficient versions of programs, and hence would
      be difficult to perform by an optimising program.
    </p>
    <p>
      Several of the functions to be defined require a little program to be executed a
      number of times. A useful combinator for this is <kbd>times</kbd>. It requires
      the program to be repeated as the top element of the stack and the required number
      of repetitions to be the second element on the stack.
    </p>
    <p>
      The factorial of a number <var>n</var> is simply the product of <var>n</var> factors
      from <var>1</var> to <var>n</var>. To compute it using <code>times</code>, a small
      program has to be pushed on top of the number <var>n</var> which is the parameter.
      The number itself will be consumed by <code>times</code>. The program works on
      two other numbers on the stack. One of these is the accumulating parameter, it
      has to start at <var>1</var>. The other is the next factor to be used by the program
      with which to multiply the accumulator. The multiplication has to be done without
      losing the factor, so it has to be duplicated first. Apart from doing the multiplication,
      the program also has to increment the factor using the successor operator <kbd>succ</kbd>.
      The program which is the parameter to <code>times</code> thus is
    </p>
    <pre>        [dup  [*]  dip  succ]
    </pre>
    Before the <code>times</code> combinator can get to work on the parameter
    <var>n</var> and the quoted program, the accumulator and the first factor have to
    be placed in position, below the parameter <var>n</var>. Both begin with the value
    <var>1</var>, so the <code>rolldown</code> operator can be used to push these two
    values below <var>n</var>. Finally, after <code>times</code> has completed, the stack
    will contain the required accumulator value but also on top of that the next factor.
    The latter is simply <code>pop</code>ped off. The entire definition of <kbd>fact</kbd>is:
    <pre>        fact == 1 1 rolldown [dup [*] dip succ] times pop
    </pre>
    <p>
      The <em>Fibonacci</em> function can be computed in a similar way. Again there is
      a certain computation that has to be repeated a number of times as given by the
      parameter <var>n</var>. Again the computation involves two further numbers, the
      larger one is to be replaced by their sum, and the smaller one is to be replaced
      by the former larger one. Adding the two must not destroy the original larger number,
      so again it has to be <code>dup</code>licated. The addition is then performed under
      the control of <code>dip</code>. Then the two numbers are <code>swap</code>ped.
      This describes the little program that serves as the parameter to the <code>times</code>  combinator. Before it can start, the two initial values <var>0</var> and <var>1</var>  have to be placed below the parameter <var>n</var> with <code>rolldown</code>.
      When it has completed, the required accumulated sum is the second element, and
      the top element, the useless next summand, is <code>pop</code>ped. So this is the
      definition of <kbd>fib</kbd>:
    </p>
    <pre>        fib  ==  0 1 rolldown [dup [+] dip swap] times pop
    </pre>
    This version of the Fibonacci function requires a computation time which is
    a linear function of the parameter <var>n</var>.
    <p>
      The recursive version of the Fibonacci function requires quadratic computation time.
      Since the result values are not very large, it is often used as a test program.
      What is of interest is the number of recursive calls made during the computation,
      to be divided by the total time it took. To obtain the number of recursive calls
      it is often convenient to use a variant of the Fibonacci function, sometimes called
      <kbd>nfib</kbd>. It has the property that the value returned is the same as the
      number of calls made during recursive execution. The following are recursive definitions
      of Fibonacci and its variant:
    </p>
    <pre>    r-fib  ==  [small] []      [pred dup pred [r-fib ] app2 +     ] ifte
        r-nfib ==  [small] [pop 1] [pred dup pred [r-nfib] app2 + succ] ifte
    </pre>
    These are recursive definitions which of course are intended to run in quadratic
    time. The following is a definition of <kbd>nfib</kbd> which uses accumulators to
    run in linear time. Of course it does not measure its own runtime, it is included
    here to illustrate a programming technique.
    <pre>        nfib  ==  1 1 rolldown [dup [+ succ] dip swap] times pop
    </pre>
    <p>
      The next two programs are for <em>binary operator</em>s which compute functions
      of two parameters: the <em>exponentiation</em> function and the <em>greatest common divisor</em>.
      Exponentiation can be computed by performing a certain operation as many times
      as given by the exponent. This description again suggests using the <code>times</code>  combinator to execute a quoted program several times. The operation to be repeated
      consists in multiplying an accumulator by the base which is the second parameter.
      So it is necessary to construct a little program from the base which for every
      call will multiply by the base. Assuming that the base is in the right position
      on the stack, the program is easily constructed, by
    </p>
    <pre>        [*] cons
    </pre>
    Before the <em>constructed program</em> can be handed to <code>times</code>,
    the initial value <var>1</var> has to be placed as an accumulator below the two numbers
    which are the two parameters, the base and the exponent. This is done by <code>1 rollup</code>.
    To get the two parameters into the order appropriate for <code>cons</code> it is
    necessary to perform a <code>rotate</code> first. So here is the <kbd>exp</kbd> operator:
    <pre>        exp  ==  1 rotate [*] cons times
    </pre>
    The technique of first constructing a program (here by <code>cons</code>)
    and then supplying it to a combinator (here <code>times</code>) is very useful in
    Joy.
    <p>
      The next program computes the greatest common divisor of two numbers, using <em>Euclid's algorithm</em>.
      The algorithm uses two numbers and repeatedly takes the remainder after dividing
      one by the other. The remainder obtained is then used to replace the dividend.
      The process is repeated as long as the potential divisor is positive. So, unlike
      the previous programs, we cannot use the <code>times</code> combinator. Instead
      a combinator called <code>while</code> is used which resembles while-loops in imperative
      languages. It takes two parameters: the while-part is a quoted program which must
      return a truth value, and the do-part is a quoted program which can compute anything.
      The while-part in the following <kbd>gcd</kbd> program is of course very similar
      to a corresponding part in the <code>fib</code> program.
    </p>
    <pre>    gcd  ==  [0 &gt;] [dup [rem] dip swap] while pop
    </pre>
    <p>
      Two other arithmetic functions that are sometimes useful are for computing the <kbd>sum</kbd>  or the <kbd>product</kbd> of a set or a list of numbers. Both are best implemented
      by <kbd>step</kbd>ping through all members of the set or list, doing additions
      or multiplications with an accumulator every time. The initial accumulator value,
      <code>0</code> or <code>1</code>, is first pushed onto the stack below the parameter
      set or list. For comparison, the third line below gives a definition of the <kbd>size</kbd>  operator which is applicable to any aggregate. The fourth line below gives a definition
      of a similar operator
      <kbd>size2</kbd> for determining the total number of elements in a list of aggregates.
      If these aggregates are themselves lists, then their members are counted but not
      the members of their sublists.
    </p>
    <pre>    sum     ==  0  swap  [+       ]  step
        product ==  1  swap  [*       ]  step
        size    ==  0  swap  [pop succ]  step
        size2   ==  0  swap  [size  + ]  step
    </pre>
    A generalisation of <code>size2</code> for counting the leaves in recursive
    lists or trees is <kbd>treesize</kbd>, defined later.
    <h1>Sorted sequences</h1>
    <p>
      The <em>sequence type</em>s of Joy are the <em>string type</em> and the <em>list type</em>.
      Values of these types can be ordered. Strings contain just characters, but lists
      may contain anything. So for lists it only makes sense to speak of ordering if
      the elements are characters or integers or something else that has an ordering
      defined on it.
    </p>
    <p>
      An informal description of the <em>quicksort</em> algorithm is this:
    </p>
    <pre>To sort a sequence S :
    1       If    S is small (has only 0 or 1 element)
    2             then it is sorted already, leave it alone
                  else    (S has at least one element)
    3                     using     the first of S
                                    as a "pivot" for comparison,
                                    split the rest of S into two portions -
                                    those that are less than the pivot
                                    and those that are not
                          separately sort both portions P1 and P2
    4                     concatenate    the now sorted lesser portion,
                                         the pivot, and
                                         the sorted other portion.
    </pre>
    The following is a definitions of an operator <kbd>qsort</kbd> which uses
    the above algorithm. But instead of using explicit <em>binary recursion</em> it uses
    the <kbd>binrec</kbd> combinator. This is like the <code>linrec</code> combinator
    except that it recurses twice, once each on the top two element of the stack. The
    recursions again occur between the rec1-part and the rec2-part. The program also
    uses another combinator <kbd>split</kbd> which takes as parameter an aggregate and
    above that a quoted program which must return a truth value. The <code>split</code>combinator returns two aggregates, containing those elements for which the test yields
    <code>false</code> and those for which it yields <code>true</code>. The <code>split</code>combinator has access to the remainder of the stack which in this case contains the
    pivot. So the test determines whether the pivot is <code>&gt;</code> than the element
    being examined.
    <pre>    qsort  ==
    1       [ small ]
    2       [ ]
    3       [ uncons [&gt;] split ]
    4       [ swap23 cons concat ]
            binrec
    </pre>
    <p>
      Sometimes it is required to sort a list of aggregates on the basis of their first
      elements. In that case it is necessary to supply to the comparison operator <code>&gt;</code>  not the pivot and the element to be apportioned by <code>split</code>, but their
      first elements instead. This is conveniently done by the <kbd>app2</kbd> combinator
      which applies a quoted program to two elements on top of the stack and replaces
      them by whatever values the programs return.
    </p>
    <pre>    qsort1  ==
    1       [ small ]
    2       [ ]
    3       [ uncons [[first] app2 &gt; ] split ]
    4       [ swap23 cons concat ]
            binrec
    </pre>
    <p>
      Note that in part 3 when the first element of the pivot has to be compared with the
      first element of the aggregate to be apportioned, the first element of the pivot
      is being extracted every time. It would perhaps be more efficient if the first
      element of the pivot is extracted just once, as soon as the pivot is available.
      In that case it is necessary to take the pivot apart with
      <code>unswons</code>, but this has to be done by <code>dip</code>ping below the
      rest of the list still to be sorted. Then the quotation parameter to <code>split</code>  just needs to take out the <code>first</code> of the current aggregate and compare
      it with the first of the pivot. After <code>split</code> has done its job, the
      pivot has to be re-assembled by <code>swons</code>, but this now has to be done
      below the two portions with <kbd>dip2</kbd>. So part 3 can be replaced by
    </p>
    <pre>3       [ uncons [unswons] dip [first &gt;] split [swons] dip2 ]
    </pre>
    <p>
      Sometimes it might be necessary to sort a list of items on the basis not of their
      first element but on their size or their second or third element or even the size
      of the second of the third element. For the last example it would only be necessary
      to use <code>[third second size]</code> instead of <code>[first]</code> in the
      <code>qsort1</code> program. But it would be impossible to anticipate all alternative
      sorting bases for a library, and it would be awkward to have to write the appropriate
      sorting program on every special occasion. It is possible to write a general quicksort
      program which takes as an additional parameter something like
      <code>[first]</code> or <code>[third second size]</code>. The <kbd>mk-qsort</kbd>  combinator does just that:
    </p>
    <pre>    mk_qsort ==
            [ [small] [] ] dip
            [ app2 &gt;] cons [split] cons [uncons] swoncat
            [ swap23 cons concat ]
            binrec
    </pre>
    It begins in line 1 by inserting the standard if-part and then-part below
    its parameters. In line 2 it uses the parameter to build a <em>constructed program</em>,
    the required rec1-part. Then in line 3 it pushes the standard rec2-part. At this
    point the top five elements of the stack are the list to be sorted and above that
    the four program parts needed for <code>binrec</code>. The latter now executes. For
    example the program
    <pre>        [third second size]  mk-qsort
    </pre>
    will sort a list of lists of three or more elements whose third member are
    aggregates of two or more elements. It will sort according to the size of the second
    of the third element.
    <p>
      The binary operator <kbd>insert</kbd> takes a sorted sequence and a potential new
      member as parameters, it returns a new sequence with the additional member inserted
      in the appropriate position. Here is a draft program:
    </p>
    <pre>To insert an item into a sorted sequence :
    1       If    the sequence is empty or
                   its first element is &gt;= than the item
    2             then add the new item in the front of the sequence
    3             else    set aside the first item of the sequence
                          recurse with the rest of the sequence and the new item
    4                     add the previously set aside first item to the front
    </pre>
    The disjunction in line 1 is best handled by the <kbd>disjoin</kbd> operator
    on programs. It expects two quoted programs which return a truth value, and it returns
    a single quoted program which computes their disjunction. So line 1 consists of two
    quoted programs one of them tests whether the sequence is empty, the other tests
    whether its first element is <code>&gt;=</code> than the item to be inserted. The
    <code>disjoin</code> operator then produces their disjunction. The resulting program
    is the if-part for the <code>linrec</code> combinator. The other three parts are
    now quite obvious. So the definition in Joy is:
    <pre>    insert ==
    1       [ pop null ]  [ [first] dip ]  disjoin
    2       [ swons ]
    3       [ [uncons] dip ]
    4       [ cons ]
            linrec
    </pre>
    <p>
      Two sorted sequences can be <kbd>merge</kbd>d into a single sequence which respects
      the original ordering. Here is a very informal algorithm for a recursive version:
    </p>
    <pre>To merge two sorted sequences : 
            If    the first sequence is empty,
                  then throw it away and return the second sequence.
            If the second sequence is empty,
                  then throw it away and return the first sequence.
            (Both sequences are non-empty, so both have a first element:)
            If the first of the first sequence is less than the first of the second,
                  then    set the lesser element aside,
                          recurse using the rest of the first sequence,
                          prepend the previously set aside element.
            If the first of the first sequence is greater than the first of the second,
                  then set the lesser element aside,
                          recurse using the rest of the second sequence,
                          prepend the previously set aside element.
           (The two first elements of the sequences are equal:)
            Default  
                  set both first elements aside,
                  recurse using the rests of both sequences,
                  prepend the two previously set aside elements.
    </pre>
    <p>
      Like just about all programming languages, Joy has an if-then-else construct (<code>ifte</code>)
      for two-way branching. Multiway branching can be achieved by nested <code>ifte</code>s,
      but this can become difficult to read. Joy has another combinator for multi-way
      branching borrowed from Lisp. The combinator <kbd>cond</kbd> expects one parameter
      which is a list of cases. The last case is the default case, the other cases each
      consist of a condition or if-part and a program or then-part The condition is a
      quoted program in front of the program. Execution of the <code>cond</code> combinator
      tests successive conditions, and for the first condition that yields
      <code>true</code> the associated program is executed. If none of the conditions
      is true, the default case is executed. The informal algorithm given earlier now
      translates into the following recursive definition of <kbd>r-merge</kbd>:
    </p>
    <pre>    r-merge  ==
            [ [ [null] pop]
              [ [pop null] swap pop]
              [ [unswons2 &lt;] [uncons] dip r-merge cons]
              [ [unswons2 &gt;] uncons swap23 r-merge cons]
              [ uncons2 r-merge cons cons] ]
            cond
    </pre>
    <p>
      As may be seen from the earlier informal version and the above Joy version, for each
      case the program recurses at most once. Therefore the program has the pattern of
      <em>linear recursion</em>. However, because there are three cases in which recursion
      occurs, it is not possible to use the <code>linrec</code> combinator. However,
      Joy has a combinator <kbd>condlinrec</kbd> which has features of <code>cond</code>  and <code>linrec</code>. The combinator <code>condlinrec</code> also expects one
      parameter which is a list of cases. Again the last case is the default case, and
      the other cases consist of a list of two or three quoted programs. If there are
      just two parts, then they are called the if-part and the then-part. Their meaning
      is as for <code>cond</code>. If there are three parts, then they are called the
      if-part, the rec1-part and the rec2-part. In that case linear recursion occurs
      between execution of the rec1-part and the rec2-part. The following is a non-recursive
      definition of <kbd>merge</kbd>:
    </p>
    <pre>    merge ==
            [ [ [null] [pop] ]
              [ [pop null] [swap pop] ]
              [ [unswons2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 &gt;] [uncons swap23] [cons] ]
              [ [uncons2] [cons cons] ] ]
            condlinrec;
    </pre>
    <p>
    </p>
    <p>
      Sometimes it is necessary to merge two lists of aggregates on the basis of their
      first elements. In that case the comparisons <code>&lt;</code> and <code>&gt;</code>  should not be applied to the elements of the sequences but to their first members.
      A simple solution is to replace the two comparisons respectively by the following
      two:
    </p>
    <pre>        [first] app2 &lt;              [first] app2 &gt;
    </pre>
    So the definition of the <kbd>merge1</kbd> operator could be
    <pre>    merge1 ==
            [ [ [null] [pop] ]
              [ [pop null] [swap pop] ]
              [ [unswons2 [first] app2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 [first] app2 &gt;] [uncons swap23] [cons] ]
              [ [uncons2] [cons cons] ] ]
            condlinrec
    </pre>
    The definition of <code>merge</code> (and especially <code>merge1</code>)
    could be optimised so that the <code>unswons</code> (and the <code>first</code>)
    is not done repeatedly for each comparison. As the definitions stand, they are easy
    to understand and work correctly.
    <h1>Big sets and dictionaries</h1>
    <p>
      Computer words are short bit-sequences and a common size is 32. These can be used
      to implement small sets of small numbers 0..31, with a few common set operations
      implemented in hardware. Joy uses this in its <em>set type</em>. But often it
      is necessary to have either much larger sets or sets of larger elements. Such a
      <em>big set type</em> can be implemented in various ways: as unordered lists, as
      ordered lists, as unbalanced trees or as balanced trees. Each implementation method
      has its advantages and disadvantages. The following implementation of big sets
      in terms of ordered lists has been adapted from \AX{Bird and Wadler}{1988 p 230
      ff}{Bird:88}.
    </p>
    <p>
      The empty set is represented as an empty list, in this library it is written as <kbd>bs-new</kbd>.
    </p>
    <pre>LIBRA (* big sets *)

    bs-new == [];
    </pre>
    <p>
      One very important binary set operation is <em>union</em>. The two parameters are
      sorted lists, and the returned value also has to be a sorted list. It would appear
      that the two lists should be simply
      <kbd>merge</kbd>d. But if they have an element in common, then the returned list
      would then contain the element twice. However, in sets any element should occur
      at most once. This consideration affects the default case, the last case of the
      program list which is the parameter. The case occurs when the first elements of
      the two parameter lists are equal. So in the definition of <kbd>bs-union</kbd>  instead of saving and later restoring both, only one is saved and later restored.
    </p>
    <pre>bs-union ==
            [ [ [null] [pop] ]
              [ [pop null] [swap pop] ]
              [ [unswons2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 &gt;] [uncons swap23] [cons] ]
              [ [rest [uncons] dip] [cons] ] ]
            condlinrec;
    </pre>
    <p>
      The same situation arises for <em>insert</em>ing or adding a new member to a set.
      If the new member is already in the set, then it should not be inserted again.
      So if the first member of the current list is equal to the candidate new member,
      then the candidate is just popped off in the third line below. In the definition
      of <kbd>bs-insert</kbd> the only recursion occurs in the last, the default case.
    </p>
    <pre>bs-insert ==
            [ [ [pop null] [swons] ]
              [ [[first] dip &gt;] [swons] ]
              [ [[first] dip =] [pop] ]
              [ [[uncons] dip] [cons] ] ]
            condlinrec;
    </pre>
    <p>
      The next operator tests for <em>member</em>ship, so it must return a truth value.
      If the list is null or its first element is <code>&gt;</code> than the candidate,
      then <code>false</code> is returned. If the first element is <code>=</code> to
      the candidate, then <code>true</code> is returned. In the default case, when the
      relation is <code>&lt;</code>, the list has to be inspected recursively further
      down. So the case must contain two programs to effect the recursion. However, on
      the way back from the recursion, the last returned truth value is the one to be
      used. Hence no further action is required, and the second program is just <code>[]</code>.
      This is the definition of <kbd>bs-member</kbd>:
    </p>
    <pre>bs-member ==
            [ [ [pop null] [pop2 false] ]
              [ [[first] dip &gt;] [pop2 false] ]
              [ [[first] dip =] [pop2 true] ]
              [ [[rest] dip] [] ] ]
            condlinrec;
    </pre>
    <p>
      The same device is used in the default case of the definition of <kbd>bs-differ</kbd>  for finding the <em>difference</em> between two sets. As may be seen, there are
      two further recursive cases, for <code>&lt;</code> and <code>&gt;</code>, and one
      of them uses the same device again.
    </p>
    <pre>bs-differ ==
            [ [ [null] [pop]]
              [ [pop null] [pop pop []] ]
              [ [unswons2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 &gt;] [rest] [] ]
              [ [[rest] dip rest] [] ] ]
            condlinrec;
    </pre>
    <p>
      The next definition is for <kbd>bs-delete</kbd>, it <em>delete</em>s a specified
      member from a set, if it is a member at all. The only recursive case is the default
      case.
    </p>
    <pre>bs-delete ==
            [ [ [pop null] [pop] ]
              [ [[first] dip &gt;] [pop] ]
              [ [[first] dip =] [pop rest] ]
              [ [[uncons] dip] [cons] ] ]
            condlinrec.
    </pre>
    <p>
      The operations of inserting or deleting members into or from a set are essentially
      special cases of taking unions or differences with unitsets. So the following definitions
      might have been given instead of the earlier, more efficient definitions:
    </p>
    <pre>    bs-insert  ==  unitlist bs-union;
        bs-delete  ==  unitlist bs-differ;
    </pre>
    <p>
      A dictionary is a way of implementing finite functions as argument-value pairs. A
      pair is best implemented in Joy as a two element list. The totality of pairs is
      then essentially a big set, and any of the ways of implementing these is suitable
      here. If the argument part of pairs is subject to an ordering relation, the sets
      of pairs can be implemented as lists ordered in accordance with the first element,
      the argument of the pairs. Not surprisingly then, some of the code to follow is
      reminiscent of code for <code>qsort1</code> and <code>merge1</code>. The following
      is a library for the <em>dictionary type</em>. A new dictionary is created by <kbd>d-new</kbd>.
      A predicate <kbd>d-null</kbd> returns <code>true</code> or <code>false</code> according
      as the parameter dictionary is empty or not. New pairs are added by <kbd>d-add</kbd>,
      they are inserted in the correct place based on the ordering of the first member
      of the pairs. The union or difference of two dictionaries is given by the two binary
      operators <kbd>d-union</kbd> and <kbd>d-differ</kbd>. A single pair is removed
      by the binary operator <kbd>d-rem</kbd>, it removes the pair whose first member
      matches the given query parameter. Instead of a test for membership there is a
      binary operator
      <kbd>d-look</kbd> which extracts the first pair whose first element matches the
      query.
    </p>
    <p>
      Only the program for one of the operators will be developed here, the program for
      <kbd>d-union</kbd>:
    </p>
    <pre>To form the union of two dictionaries D1 and D2:
    1       If D2 is empty, pop it off and return just D1
    2       If D1 is empty, retain D2, pop D1 and return D2
    3       Extract    the first pairs from D1 and D2,
                       from both pairs compare their firsts with &lt;
            If the comparison is true,
                       below D2, uncons D1 into its first
                       and rest
                       recurse anonymously on the rest of D1 and D2
                       cons the saved first pair from D1
                       into the result
    4       Extract    the first pairs from D1 and D2,
                       from both pairs compare their firsts with &gt;
            If the comparison is true,
                       uncons D2, put its first below D2
                       recurse anonymously on D1 and the rest of D2
                       cons the saved first pair from D2
                       into the result
            Default (the firsts of the first pairs of D1 and D2
                        are =):
                       uncons both D1 and D2 into their
                       first and rest,
                       recurse on the two rests to form their union,
                       cons the two saved firsts into the result.
    </pre>
    In the default case both first pairs are retained, so that if one is deleted,
    the other one, which may well have a different second component, is still available.
    <p>
      As may be seen, the <kbd>d-union</kbd> operator is very similar to the <code>bs-union</code>  operator. The other three operators <kbd>d-differ</kbd>, <kbd>d-look</kbd> and
      <kbd>d-rem</kbd> are similar to their counterparts for big sets. The entire library
      is the following:
    </p>
    <pre>LIBRA (* dictionary *)

    d_new   == [];
    d_null  == null;
    d_add   ==
            [ [ [pop null] [swons] ]
              [ [[first] dip [first] app2 &gt;=] [swons] ]
              [ [[uncons] dip] [cons] ] ]
            condlinrec;
    d_union ==
            [ [ [null] [pop] ]
              [ [pop null] [popd] ]
              [ [unswons2 [first] app2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 [first] app2 &gt;] [uncons swap23] [cons] ]
              [ [uncons2] [cons cons] ] ]
            condlinrec;
    d_differ ==
            [ [ [null] [pop]]
              [ [pop null] [pop pop []] ]
              [ [unswons2 [first] app2 &lt;] [[uncons] dip] [cons] ]
              [ [unswons2 [first] app2 &gt;] [rest] [] ]
              [ [[rest] dip rest] [] ] ]
            condlinrec;
    d_look  == [dup] dip
            [ [ [pop null] [pop pop "not found"] ]
              [ [[first first] dip &gt;] [pop pop "not found"] ]
              [ [[first first] dip =] [pop first] ]
              [ [[rest] dip] [] ] ]
            condlinrec;
    d_rem   ==
            [ [ [pop null] [pop] ]
              [ [[first first] dip &gt;] [pop] ]
              [ [[first first] dip =] [pop rest] ]
              [ [[uncons] dip] [cons] ] ]
            condlinrec.
    </pre>
    The definitions of big sets and dictionaries are part of the library file
    <kbd>TYPLIB.JOY</kbd>.
    <h1>Trees</h1>
    <p>
      Apart from the <em>aggregate type</em>s it is useful to have another type, the
      <em>tree type</em>. These are lists which can contain lists as members which might
      contain lists as members and so on. Formally define a <em> leaf</em> to be anything
      which is not a list. Then a <em> tree</em> is defined to be either a leaf or a
      list of trees. Sometimes one needs the concept of a <em> proper tree</em> -- this
      is just a list of trees. Trees are similar to other aggregates, but since the tree
      datatype is recursive, a special treatment is generally needed.
    </p>
    <p>
      Just as there is the <code>step</code> combinator to step through the elements
      of an aggregate, so there is a <kbd>treestep</kbd> combinator to step through the
      leaves of a tree. For example, the following are the already familiar program for
      computing the sum of the numbers in an aggregate and a similar program for computing
      the sum of the numbers in a tree:
    </p>
    <pre>            sum  ==  0 swap [+]     step
            treesum  ==  0 swap [+] treestep
    </pre>
    In the same way, the following are a familiar program and a new one for determining
    the <code>size</code> of an aggregate and the <kbd>treesize</kbd> of a tree:
    <pre>            size  ==  0 swap [pop succ]     step
            treesize  ==  0 swap [pop succ] treestep
    </pre>
    Similarly, the following are a familiar program and a new one for shunting
    members of an aggregate or a tree, respectively, into an initially empty list:
    <pre>            shunt  ==  [swons]     step
            treeshunt  ==  [swons] treestep
    </pre>
    For the binary operator <kbd>treeshunt</kbd> the all leaves will appear in
    the result list, but in reverse order.
    <p>
      A tree may be flattened completely, losing its entire internal structure but retaining
      the order of the leaves by the unary operator
      <kbd>treeflatten</kbd>:
    </p>
    <pre>        treeflatten  ==  [] swap treeshunt reverse
    </pre>
    <p>
      From a given tree we can obtain the reverse list of its leaves by
    </p>
    <pre>        []  swap  treeshunt
    </pre>
    But this may not be what is wanted. To reverse the tree while retaining its
    structure it is necessary to reverse the top level list, reverse the second level
    lists, reverse the third level lists and so on. For tasks such as this Joy has a
    ternary combinator <kbd>treegenrec</kbd> for general recursion through trees. It
    is used like this:
    <pre>        [O1]  [O2]  [C]  treerecgen
    </pre>
    Here <code>[O1]</code> must be a program applicable to leaves,
    <code>[O2]</code> must be an operator applicable to lists, and <code>[C]</code> must
    be a combinator applicable to lists with operators such as <code>[O2]</code>. Different
    choices of the three quotation parameters yield surprisingly different operators
    for trees or combinators applicable to trees. Using this combinator the unary <kbd>treereverse</kbd>operator is defined by
    <pre>        treereverse  ==  [] [reverse] [map] treegenrec
    </pre>
    <p>
      The same <code>treegenrec</code> combinator can be used to define a unary combinator
      <kbd>treemap</kbd> which takes a tree and quoted program as parameters and returns
      a tree of the same structure but with each leaf as modified by the program parameter.
    </p>
    <pre>        treemap  ==  [] [map] treegenrec
    </pre>
    <p>
      The same combinator can be used to define a unary combinator
      <kbd>treefilter</kbd> which expects a tree and a quoted predicate. What is returned
      is a tree of the same structure but with only those leaves which pass the test
      predicate.
    </p>
    <pre>        treefilter  ==  [] swap orlistfilter [map] treegenrec
    </pre>
    The first portion, <code>[] swap</code> just inserts the required <code>[O1]</code>which in this case does nothing. Following that is a modification of the test predicate,
    to be explained presently. The rest of the definition is familiar.
    <pre>        treefilter  ==  [] swap orlistfilter [map] treegenrec
    </pre>
    The <code>[O2]</code> operator to be used here is constructed from the test
    predicate <code>[P]</code> by <kbd>orlistfilter</kbd>, which constructs
    <pre>        [ [ [list] [P] disjoin ]  filter ]
    </pre>
    The <code>orlistfilter</code> is defined in two steps:
    <pre>        orlist  ==  [list] swap disjoin
            orlistfilter  ==  orlist [filter] cons
    </pre>
    An operator to remove all leaves from a tree, but retaining its list structure
    is <kbd>treestrip</kbd>, defined as follows:
    <pre>        treestrip  ==  [list] treefilter
    </pre>
    <p>
      Trees cannot have lists as leaves, but otherwise they are very flexible. In particular
      they can be used as queues. The following is a small collection of operations for
      manipulating trees when the focus is only on their leaves. A new empty tree is
      generated by <kbd>t-new</kbd>. A new leaf or a whole tree of leaves is added
      to an existing tree by the operator <kbd>t-add</kbd>; it always ensures that the
      tree is of a form suitable for the remaining operators. The tree predicate <kbd>t-null</kbd>  tests whether the tree is empty. It first has to prepare the tree by ensuring that
      it does not consist of lists of lists and so on which ultimately only contain the
      empty list. Since this is also required by two other operators, the preparing is
      done by a hidden unary operator. Two other operator <kbd>t-front</kbd> and <kbd>t-rem</kbd>  produce, respectively, the first leaf together with the remainder of the tree,
      or just the remainder of the tree after removing the first leaf. Both operators
      first have to check that the tree is non-empty; if it is, then an error is reported.
      A leaf or proper tree can be turned into a suitable form by <kbd>t-reset</kbd>.
    </p>
    <p>
      The implementation is as follows. A proper tree is always a list, and an empty tree
      starts off by <kbd>t-new</kbd> as an empty list. Anything can be added by <kbd>t-add</kbd>  to an existing tree, and this has to ensure that the result has a suitable standard
      form. The same is true for <kbd>t-reset</kbd> which firstmakes a copy of an existing
      tree. The other operators, <kbd>t-null</kbd>, <kbd>t-front</kbd> and <kbd>t-rem</kbd>  all require the tree to be in a suitable standard form. This is done by <code>prepare</code>  which is defined using <kbd>condlinrec</kbd>. If the tree is <code>null</code>,
      it is left as it is. If the <code>first</code> is <code>null</code>, then the <code>rest</code>  is taken and <code>condlinrec</code> recurses. If the <code>first</code> of the
      <code>first</code> is a list, then that is <code>unswonsed</code>, <code>condlinrec</code>  recurses and on return does nothing further. In all other cases the tree is left
      as it is.
    </p>
    <pre>HIDE                                                    (* tree *)
        error        ==  "non-empty tree needed for" putchars putchars abort;
        prepare      ==  [ [ [null] [] ]
                         [ [first null] [rest] [] ]
                         [ [first first list] [[unswons] infra] [] ]
                         [ [] ] ]
                         condlinrec
    IN
        t-new        ==  [];
        t-reset      ==  dup  unitlist unitlist;
        t-add        ==  unitlist unitlist cons;
        t-null       ==  prepare
                         dup null;
        t-front      ==  prepare
                         [null]
                         ["t-front\n" error]
                         [dup first first]
                         ifte;
        t-rem        ==  prepare
                         [null]
                         ["t-rem\n" error]
                         [unswons unswons [swons] dip]
                         ifte
    END
    </pre>
    <p>
      The definitions of trees is partof the library file <kbd>TYPLIB.JOY</kbd>.
    </p>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>