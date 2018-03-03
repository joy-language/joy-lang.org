<template>
  <article>
    <h1> Atomic Programs of Joy </h1>
    <i> by Manfred von Thun </i>
    <p>
      <em> Abstract: </em> Joy is a functional programming language based on the composition
      of functions taking one stack as argument and yielding one stack as value. Stacks
      can contain values of simple types such as truth values, characters and integers,
      and values of aggregate types such as sets, character strings and quoted programs
      with lists as a special case. The stack functions include the usual operations
      such as addition, comparison and list manipulation, but also many new kinds of
      functions which dequote quoted programs in various ways. These new functions behave
      like higher order functions, such as conditionals, various forms of recursion,
      and for aggregates the map, fold and filter functions. This paper gives an overview
      of the basic programs from which others are built by composition and quotation.
    </p>
    <p>
      Keywords: functional programming, function composition, higher order functions, quotation
      and dequotation of programs, combinators.
    </p>
    <hr>
    <h1>Introduction</h1>
    The design of Joy was motivated mainly by <a href="refs.html#{Backus78}">{Backus78}</a>who argued that language concepts should be selected on the basis of yielding strong
    and clean mathematical laws. This paper describes the atomic programs of Joy from
    which larger programs are concatenated, it does not describe the algebra or other
    theoretical issues related to Joy.
    <p>
      Joy programs denote functions which take <em>state</em>s as arguments and as values.
      Programs are built from atomic programs which also denote functions which take
      states as arguments and as values. The meaning of compound programs has to be given
      in terms of the meanings of atomic programs. It is useful to classify atomic programs
      into categories depending on what kind of function they denote. A coarse classification
      distinguishes just three, called 1) the
      <em>literal</em>s, 2) the <em>operator</em>s and 3) the
      <em>combinator</em>s.
    </p>
    <p>
      Firstly, the <em>literal</em> atomic programs are those which look like constants
      in conventional languages. They comprise literal numbers (or, more correctly, numerals)
      such as integers, and other literals of type character, string, truth value and
      set. Literals do not denote numbers, characters, strings and so on, but they denote
      functions which take one state as argument and yield as value another state which
      is like the argument state except that the value of the literal has been pushed
      onto the stack component.
    </p>
    <p>
      Secondly, the <em>operator</em> atoms are those which look like <em>
      n</em>-ary operators in other languages. They include the operations such as for
      addition and the other arithmetical operations, and for the various operations
      on other types. Like all programs, operators denote functions from states to states,
      but the functions are not defined on all states. An <em> n</em>-ary operator (such
      as the binary addition operator) denotes a function which is defined only on states
      whose stack component has <em> n</em> items (such as two integers) on top.
    </p>
    <p>
      The function yields as value another state which is like the argument state except
      that the <em> n</em> items on the stack have been replaced by the result (such
      as the sum).
    </p>
    <p>
      Also included as operators are those atoms denoting mere structural functions of
      the stack component such as <code>dup</code>,
      <code>swap</code> and <code>pop</code>, and those that involve input and output
      such as <code>get</code> and <code>put</code>.
    </p>
    <p>
      Thirdly, the <em>combinator</em> atoms are like operators in that they require
      the top of the stack to contain certain items. But unlike operators, they do not
      treat these items as passive data. Instead they execute these items - and hence
      those items must be quoted programs. So, combinators also denote functions which
      are defined only on states having the appropriate number of quoted programs on
      top of the stack. They yield as values another state which depends on the argument
      state, including the quoted programs, and on the combinator itself.
    </p>
    <p>
      Literals, operators and combinators can be concatenated to form
      <em>program</em>s. These may then be enclosed in square brackets to form literal
      <em>quotation</em>s. Such literals are not atomic, but if they occur in a program
      they are treated just like other literals: they cause the quoted program to be
      pushed onto the stack. So, literal quotations denote functions which take any stack
      as argument and yield as value another stack which is like the argument stack except
      that it has the quotation pushed on top. Quotations on top of the stack can be
      treated like other values, they can be manipulated, taken apart and combined, but
      they can also be executed by combinators. If a quotation contains only literals,
      then it is a value of the <em>list type</em>. The component literals do not have
      to be of the same type, and they may include further quotations. If a list is executed
      by a combinator, then its components are pushed onto the stack.
    </p>
    <p>
      The remainder of this paper is organised as follows: The next section describes the
      principal types of Joy and their literals. Following that are four sections on
      operators, the general ones applicable to all types, then those applicable to simple
      types such as integers, characters and truth values, then those applicable to aggregate
      types such as strings, sets and lists, and finally the predicates which return
      truth values. The following three sections deal with combinators, first those that
      are independent of any typing, then those specialised to simple types, and finally
      those specialised to aggregate types.
    </p>
    <h1>Types and Literals</h1>
    Joy programs are built from smaller programs by means of concatenation. The ultimate
    building blocks are atomic programs which do not have any programs as parts. Like
    all programs, atoms denote unary functions. It is useful to classify atoms on the
    basis of what kinds of functions they denote. Three broad classes can be distinguished
    in terms of their domain and range. For expository purposes it is helpful to adopt
    procedural terminology for a while, and to express the classification in terms of
    what the atoms do to the stack component of the state.
    <p>
      Some atoms can be applied to any stack and their effect is to push something on the
      stack. The items that can be pushed are of various types. There are <em>simple type</em>s
      such as integers, characters and truth values. There are also <em>aggregate type</em>s
      such as strings, sets and quoted programs. Atomic programs which push a simple
      or aggregate value onto the stack will be called
      <em>literal</em>s. A different kind of atom can be applied only to a non-empty
      stack. Their effect is to re-organise the top few elements of the stack.
    </p>
    <p>
      Some, like <kbd>dup</kbd>, <kbd>swap</kbd> and <kbd>pop</kbd>, just edit the top
      few elements. Others expect the top few elements to be of certain types and their
      effect is to replace these elements by the result of applying a function to them
      as arguments. These include the arithmetic and relational operators for addition,
      multiplication and comparisons, and the truthfunctional operators. They also include
      list operations like concatenation. Collectively all of them will be called <em>operator</em>s.
      A third kind of atoms expect quoted programs on the top of the stack. Like the
      operators, they pop the quoted programs off the stack. But they do not treat them
      as passive data structures in the way operators do. Instead they cause the quoted
      programs to be executed. These are called
      <em>combinator</em>s.
    </p>
    <p>
      After this rough exposition of the classification it is important to suppress any
      procedural reading and to revert to the official interpretation of Joy programs
      as denoting unary functions. So the three classes of atoms, namely literals, operators
      and combinators, all denote unary functions from and to states which include a
      stack as a principal component. The remainder of this section will deal with literals.
    </p>
    <p>
      First, the literals of the <em>integer type</em>. The following is the offical
      semantics of those atoms that look like numerals:
    </p>
    <blockquote>
      A digit string such as "<code>123</code>" denotes not a <em>
      number</em> but a <em> function</em> from states to states. For any state S1 as argument
      this function yields as its value another state S2 which is like S1 except that
      its stack component has an additional item, the <em> number</em> 123 pushed onto
      it.
    </blockquote>
    The semantics for the <em>truth value type</em> is similar: The two symbols <kbd>true</kbd>and <kbd>false</kbd> denote functions which for any state as argument yields as value
    another state which is like the argument state except that the logical constant <code>true</code>or <code>false</code> has been pushed onto the stack. Literals of the
    <em>character type</em> can be treated just like small numbers. So, a quoted character
    such as <code>'A</code> denotes a function taking any state into another state with
    that character pushed onto the stack.
    <p>
      The three types of truth values, characters and integers constitute what will be
      called simple types. They are simple in that their values do not have parts. There
      are also aggregate types which do have parts. The parts can be extracted by suitable
      operators and the aggregates can be constructed from their parts. Joy has three
      different aggregate types: sets of small numbers, strings of characters, and quoted
      programs, which have lists as a special case.
    </p>
    <p>
      The <em>set type</em> comprises the usual unordered collections familiar from set
      theory. The elements of a set are written inside curly braces, such as <code>{1 3 5}</code>.
      The whole is a literal atom, and it denotes a function pushing that set onto the
      stack. For most implementations on current machines the elements of sets will be
      small numbers in the range <code>0</code> .. <code>31</code>, The
      <em>string type</em> of character strings constitutes another aggregate type. Its
      literals are written as zero or more characters enclosed in double quotes, such
      as <code>"Hello"</code>. Such a literal again denotes a function, one which pushes
      that string.
    </p>
    <p>
      The third aggregate type is that of <em>quoted program</em>s, or briefly, <em>quotation</em>s.
      Its literals are written inside square brackets. A program consists of zero or
      more literals, operators or combinators. Enclosing it in square brackets turns
      it into a quoted program. Quotations denote functions which push the quoted program;
      the quoted program is not executed, it is pushed onto the stack in "suspended animation".
      The following are quotations:
    </p>
    <pre>        [1 2 3]                         ['A 'B "CDE" {10 11 12}]
            [pop dup *]                     [[[]]]
            [peter paul mary]               ["" {} [] [hello "Hello"]
    </pre>
    A value of the <em>list type</em> is just a special case of a quotation in
    which the elements are themselves literals. Quotations can contain other quotations,
    and hence lists can contain other lists.
    <p>
      The following concern connections between quotations and the stack. The stack is
      normally a sequence of values of various types. This sequence is just a special
      list which is modified by programs. Since it is a list, it should be possible to
      put this list on top of the stack - that is to say, on top of itself. Also, it
      should be possible to make the list on top of the stack become the stack. Finally,
      it should be possible to create a new, empty stack. There are three operators that
      do just that:
    </p>
    <pre>        stack     unstack    newstack
    </pre>
    The <kbd>stack</kbd> operator pushes onto the stack a list containing all
    the elements of the stack. The <kbd>unstack</kbd> operator expects a list on top
    of the stack and makes that the stack. The
    <code>unstack</code> operator undoes what the <code>stack</code> operator does, but
    the reverse is true only in special cases. The
    <kbd>newstack</kbd> operator deletes the entire stack and replaces it with a new,
    empty one. Also, it should be noted that the stack is not always a sequence of values,
    it can also contain operators and combinators. So, strictly speaking the stack is
    always a quotation, and the <code>stack</code> operator pushes a quotation onto the
    stack, and the <code>unstack</code> operator expects a quotation on the stack and
    makes that the new stack.
    <p>
      It is sometimes useful to treat several types together. The
      <em>numeric</em> types are integers and characters, the
      <em>Boolean</em> types are truth values and sets, and the
      <em>sequence</em> types are strings and lists. A <em>leaf</em> is anything which
      is not a list, and a <em>tree</em> is either a leaf or a (possibly empty) list
      of trees.
    </p>
    <p>
      This completes the brief survey of the six principal types and their literals. Other
      types might be included in more elaborate versions of Joy. Obvious simple types
      to add are real (and perhaps complex) numbers, and an enumeration type as in Pascal.
      It is less clear what new aggregate types are useful since lists already are so
      versatile. Records and arrays are certainly possible. Only files will be considered
      briefly below.
    </p>
    <h1>General Operators</h1>
    An <em>operator</em> is a function which expects as argument one stack whose top
    few elements satisfy some condition and which returns a stack in which the top few
    elements have been replaced by something else, and which otherwise is like the argument
    stack. For most operators the top few elements are replaced by just one element,
    but there are some for which they are replaced by none or by two. In fact, operators
    may be defined in which any number (0, 1 ...) of elements on the argument stack are
    replaced by any number (0, 1 ...) of elements on the result stack. A <em>unary operator</em>is one whose argument stack requires at least one element. A <em>binary
    operator</em> is one whose argument stack requires at least two elements. There are
    even some <em>ternary operator</em>s.
    <p>
      First, the following unary operators are defined on all stacks containing at least
      one element:
    </p>
    <pre>        pop     dup
    </pre>
    The top element does not have to satisfy any particular condition, it can
    be of any type. The <kbd>pop</kbd> operator removes the top element. The <kbd>dup</kbd>operator pushes a duplicate on top, so it replaces the one original by two copies.
    <p>
      The following binary operators are defined on all stacks containing at least two
      elements:
    </p>
    <pre>        swap    popd    popop    dupd
    </pre>
    The <kbd>swap</kbd> operator interchanges the top two elements. The
    <kbd>popd</kbd> operator removes the second element. The
    <kbd>popop</kbd> operator removes the first and the second element. The <kbd>dupd</kbd>operator duplicates the second element.
    <p>
      The following ternary operators are defined for all stacks containing at least three
      elements:
    </p>
    <pre>        swapd    rollup    rolldown
    </pre>
    The <kbd>swapd</kbd> operator interchanges the second and third elements but
    leaves the first element in place. The <kbd>rollup</kbd> operator moves the third
    and second element into second and third position and moves the first element into
    third position. The
    <kbd>rolldown</kbd> operator moves the second and first element into third and second
    position and moves the third element into first position.
    <p>
      There is another <em>ternary operator</em>:
    </p>
    <pre>        choice
    </pre>
    The <kbd>choice</kbd> operator expects three values on top of the stack, say
    <code>X</code>, <code>Y</code> and <code>Z</code>, with
    <code>Z</code> on top. The third value from the top, <code>X</code>, has to be a
    truth value. If it is <code>true</code>, then the
    <code>choice</code> operator just leaves <code>Y</code> on top of the stack, and
    <code>X</code> and <code>Z</code> disappear. On the other hand, if <code>X</code>is false, then the <code>choice</code> operator just leaves <code>Z</code> on top
    of the stack, and <code>X</code> and
    <code>Y</code> disappear. This operator is related to two combinators
    <code>ifte</code> and <code>branch</code> which are explained in the next sections.
    <p>
      There is another operator for multi-choices. It expects a non-empty list of non-empty
      lists on top of the stack and below that one further item.
    </p>
    <pre>        opcase
    </pre>
    The <kbd>opcase</kbd> operator matches the type of the item with the
    <code>first</code> members of the lists. When a match is found, the
    <code>rest</code> of that list is pushed onto the stack. If no match is found, then
    the last list is used as the default.
    <p>
      The following two operators handle input and output:
    </p>
    <pre>        put    get
    </pre>
    The <kbd>put</kbd> operator expects one item on top of the stack, it removes
    it and writes it to the output file. The <kbd>get</kbd> operator expects one item
    in the input file, it reads it from there and pushes it on top of the stack.
    <h1>Operators for Simple Types</h1>
    The following binary operators are defined for all numeric types. They have their
    usual meaning, and the result is given the type of the second parameter.
    <pre>        +    -    *    /    %    max    min
    </pre>
    The following unary operators are defined for all numeric types.
    <pre>        succ    pred    abs    sign
    </pre>
    The <kbd>succ</kbd> and <kbd>pred</kbd> operators yield the
    <em>successor</em> and <em>predecessor</em>, respectively. The
    <kbd>abs</kbd> operator computes the <em>absolute value</em>, and the
    <kbd>sign</kbd> operator returns the <em>signum</em> value, an integer which is <code>-1</code>,
    <code>0</code> or <code>+1</code> depending on whether the parameter is negative,
    zero or positive.
    <p>
      The following mathematical functions are provided:
    </p>
    <pre>        fact    exp    fib    nfib    gcd
    </pre>
    The unary <kbd>fact</kbd> operator computes the <em>factorial</em> function.
    The binary <kbd>exp</kbd> operator computes the
    <em>exponentiation</em> function, the exponent is the top parameter. The binary <kbd>fib</kbd>operator computes the <em>Fibonacci</em> function. The binary <kbd>nfib</kbd> operator
    computes a similar function, which is the number of calls which a recursive implementation
    of the Fibonacci function would need; if this function is implemented recursively,
    then the number of its calls is the same. The binary <kbd>gcd</kbd> operator computes
    the <em>greatest common
    divisor</em>.
    <p>
      The type of truth values is one of the Boolean types. The operators are
    </p>
    <pre>        and    or    xor    not
    </pre>
    The three binary operators <kbd>and</kbd>, <kbd>or</kbd> and
    <kbd>xor</kbd> compute the logical <em>conjunction</em>, <em>inclusive
    disjunction</em> and <em>exclusive disjunction</em>. The unary
    <kbd>not</kbd> operator computes the <em>negation</em>.
    <h1>Operators for Aggregate Types</h1>
    The following unary operators expect a non-empty aggregate on top of the stack:
    <pre>        first    second    third    rest
    </pre>
    The <kbd>first</kbd> operator extracts the first element of values of the
    sequence types string and list. For sets it extracts the first member using the underlying
    ordering. The <kbd>second</kbd> operator expects an aggregate of at least two elements,
    for sequences it extracts the second element, for sets it extracts the second element
    under the ordering. The <kbd>third</kbd> operator expects an aggregate of at least
    three members, it extracts the third element. The <kbd>rest</kbd> operator expects
    an aggregate with at least one member, it returns an aggregate which is like the
    parameter aggregate but has its first element removed.
    <p>
      The following binary operators require an aggregate and a potential member on top
      of the stack:
    </p>
    <pre>        cons     swons
    </pre>
    The <kbd>cons</kbd> operator expects the aggregate on top of the stack and
    the potential member below. The effect is to add the potential member into the aggregate.
    In the case of strings and lists the potential member is added in front. In the case
    of sets the potential member is added only in case it is not already a member. The
    <kbd>swons</kbd> operator does essentially the same except that it expects the potential
    member on top and the aggregate below. Essentially <code>swons</code> is equivalent
    to the composition
    <code>swap cons</code>, and hence its name. The two operators are
    <em>converse</em>s of each other.
    <p>
      The following unary operators also require a non-empty aggregate on top of the stack:
    </p>
    <pre>        uncons     unswons
    </pre>
    The <kbd>uncons</kbd> operator replaces the aggregate element by two elements,
    the first and the rest, with the rest on top. The
    <kbd>unswons</kbd> operator does the same, but with the first on top. These two operators
    differ from other operators in that they leave
    <em> two</em> values on top of the stack. Such operators would not make much sense
    in other notations. Their names were chosen because their effect is to undo the effect
    of the two binary operators
    <code>cons</code> and <code>swons</code>.
    <p>
      There are two operators for <em>index</em>ing in various ways:
    </p>
    <pre>        at    of    drop    take
    </pre>
    These four binary operators expect an aggregate and a number. That number
    is used for indexing into the aggregate. The <kbd>at</kbd> operator expects the aggregate
    <tt>A</tt> and above that a number <tt>N</tt>, it returns that member of the aggregate
    which is at the <tt>N</tt>-th position in the aggregate. The <kbd>of</kbd> operator
    expects a number <tt>N</tt> and above that an aggregate <tt>A</tt>, it returns the
    <tt>N</tt>-th member of <tt>A</tt>. So the two operators are <em>converse</em>s of
    each other. The
    <kbd>drop</kbd> and <kbd>take</kbd> operators both expect an aggregate
    <tt>A</tt> and above that a number <tt>N</tt>. The <code>drop</code> operator returns
    an aggragate like <tt>A</tt> except that the first <tt>N</tt> elements have been
    removed. The <code>take</code> operator returns an aggregate like
    <tt>A</tt> except that only the first <tt>N</tt> elements have been retained. For
    all four operators in the case of sequences the sequence ordering is used, and for
    sets the underlying ordering is used.
    <p>
      The following are some general operators for aggregates:
    </p>
    <pre>        size     reverse    concat    swoncat
            zip    flatten    transpose
    </pre>
    The unary <kbd>size</kbd> operator determines the number of elements of any
    aggregate, and for lists this means top level members. The unary <kbd>reverse</kbd>operator reverses strings and lists, it has no effect on sets. The binary <kbd>concat</kbd>operator concatenates two sequences of the same type, it appends the top parameter
    to the second parameter. The <kbd>swoncat</kbd> operator does the same except that
    it executes a <code>swap</code> first. The binary
    <kbd>zip</kbd> operator expects two aggregates of the same type. It returns a list
    of lists of two elements, each pair taken from corresponding elements in the aggregates.
    The size of the result list is the same as the size of the smaller of the two parameter
    aggregates. The unary <kbd>flatten</kbd> operator expects a list of sequences and
    combines them by concatenation. The unary
    <kbd>transpose</kbd> operator is for matrix manipulation. It also expects a list
    of lists <tt>L1, L2 ...</tt> and returns a list of lists. The first sublist contains
    the first members of the <tt>Li</tt>, the second sublist contains the second members,
    and so on. The list returned has as many members as the shortest of the <tt>Li</tt>.
    <p>
      The type of sets is another of the Boolean types. The operators are
    </p>
    <pre>        and    or    xor    not
    </pre>
    The three binary operators <kbd>and</kbd>, <kbd>or</kbd> and
    <kbd>xor</kbd> compute the <em>intersection</em>, <em>union</em> and
    <em>symmetric difference</em>. The unary <kbd>not</kbd> operator computes the <em>complement</em>.
    For most implementations on current machines the complement will be with respect
    to the largest set,
    <code>{0..31}</code>.
    <p>
      The following operators on sequences deal with ordering of their elements:
    </p>
    <pre>        qsort    qsort1    merge
    </pre>
    The unary <kbd>qsort</kbd> operator uses the <em>quicksort</em> algorithm
    to return a sorted version of the parameter. The
    <kbd>qsort1</kbd> operator does the same, except that it expects a list of sequences
    which it sorts according to the first element of the sequences. The binary <kbd>merge</kbd>operator is like the
    <code>concat</code> operator in that it produces a single sequence. The difference
    is that it picks elements from the two sequences in accordance with their order.
    If the two sequences were sorted, then the result of merging them is also sorted.
    <p>
      The following are arithmetic operations for lists of numbers:
    </p>
    <pre>        sum    product    scalarproduct
    </pre>
    The first two expect a list of numbers, the <kbd>sum</kbd> operator adds them
    up, the <kbd>product</kbd> operator multiplies them, and for empty lists the results
    are 0 and 1 respectively. The
    <kbd>scalarproduct</kbd> operator expects a list of two lists of numbers. It multiplies
    corresponding elements of the two lists and returns the sum of these products.
    <p>
      The following unary operators expect an aggregate on top of the stack and leave a
      list of various subaggregates on top of the stack:
    </p>
    <pre>        frontlist    restlist    powerlist    subseqlist    permlist
    </pre>
    Let the size of the aggregate be (N). The <kbd>frontlist</kbd> and
    <kbd>restlist</kbd> operators return a list of <tt>N+1</tt> subaggregates. The <code>frontlist</code>operator returns a list, beginning with the empty aggregate, obtained by successively
    adding the last, second last ... first member of the original aggregate. The <code>restlist</code>operator returns a list, beginning with the original aggregate, by successively removing
    the first, second ... last member of the original aggregate. The <kbd>powerlist</kbd>operator returns a list of all 2^N subaggregates such that for each member of the
    original aggregate there will be one subaggregate in the list containing it and one
    not containing it. The <kbd>subseqlist</kbd> operator is similar, but it returns
    a shorter list of (N * (N-1) / 2 + 1 ) subaggregates containing only consecutive
    members of the original aggregate. The <kbd>permlist</kbd> only applies to sequence
    aggregates, it returns a list of all the <tt>N!</tt> (<tt>N</tt> factorial) permutations
    of the sequence.
    <p>
      A related binary operator is
    </p>
    <pre>        insertlist
    </pre>
    The <kbd>insertlist</kbd> operator expects a sequence and above that another
    potential member. It returns the list of all sequences obtained by inserting the
    potential member in all possible positions in the sequence.
    <p>
      A related binary operator for finding the <em>cartesian product</em> is
    </p>
    <pre>        cartproduct
    </pre>
    which expects two aggregates that do not have to be of the same type. The
    <kbd>cartproduct</kbd> operator returns a list of all pairs (as two element lists)
    of elements taken from the two aggregates. If the aggregates have <tt>M</tt> and
    <tt>N</tt> members, there will be <tt>M × N</tt> pairs in the result list.
    <p>
      The following unary operators expect a tree:
    </p>
    <pre>      treeflatten    treestrip    treereverse    treesize
    </pre>
    The <kbd>treeflatten</kbd> operator turns a tree into a flat list containg
    the leaves of the tree. The <kbd>treestrip</kbd> operator returns a tree with the
    same structure but with all leaves removed. The <kbd>treereverse</kbd> operator returns
    a tree in which (recursively) all internal lists have been reversed. The
    <kbd>treesize</kbd> operator returns an integer which is the number of leaves.
    <h1>Predicates</h1>
    A <em>predicate</em> is a function which leaves a truth value on the stack. The
    following unary predicates are defined for all numeric types:
    <pre>        odd    even    positive    negative
    </pre>
    The <kbd>odd</kbd> and the <kbd>even</kbd> predicate return
    <code>true</code> or <code>false</code> just in case the parameter is odd or even.
    The <kbd>positive</kbd> and the <kbd>negative</kbd> predicate return <code>true</code>or <code>false</code> just in case the parameter is positive or negative -- note
    that truth values and characters are never negative.
    <p>
      The following binary predicates are defined for all numeric types, they have their
      usual meaning:
    </p>
    <pre>        =    !=    &lt;    &lt;=    &gt;    &gt;=
    </pre>
    The following are two unary predicates defined for all types:
    <pre>        null    small
    </pre>
    The <kbd>null</kbd> predicate is true if its simple parameter is numerically
    zero or its aggregate parameter is empty. The
    <kbd>small</kbd> predicate is true if its simple parameter is numerically zero or
    1, or its aggregate parameter contains at most one element.
    <p>
      The following binary predicates test aggregates for members:
    </p>
    <pre>      in    has
    </pre>
    The <kbd>in</kbd>-predicate is true if the second parameter is in the top
    aggregate parameter. The <kbd>has</kbd>-predicate is true if the aggregate second
    parameter has the top parameter as a member. The two predicates are <em>converse</em>s
    of each other.
    <p>
      The following binary predicate is defined for two aggregates of the same kind:
    </p>
    <pre>        equal
    </pre>
    The <code>equal</code> predicate is true if the two aggregates have the same
    members. For strings and lists this means same members in the same positions. For
    lists this means recursive equality.
    <p>
      Sometimes it is necessary to test a parameter for its type. This is done by the following
      unary predicates:
    </p>
    <pre>        logical    char    integer    set    string    list    leaf
    </pre>
    The predicates <kbd>logical</kbd>, <kbd>char</kbd>,
    <kbd>integer</kbd>, <kbd>set</kbd>, <kbd>string</kbd> and
    <kbd>list</kbd> are true if the parameter is a true value, character, integer, set,
    string or list, respectively. The predicate
    <kbd>leaf</kbd> is true if the parameter is not a list.
    <p>
      Sometimes it is useful to operate on quoted predicates to obtain another quoted predicate.
      There are three such operators:
    </p>
    <pre>        conjoin    disjoin    negate
    </pre>
    The two operators <kbd>conjoin</kbd> and <kbd>disjoin</kbd> expect two quoted
    predicates and return one quoted predicate. If that is ever called it will compute
    the conjunction or disjunction of the two parameters. The other operator is <kbd>negate</kbd>which expects one quoted predicate and returns a quoted predicate which computes
    the negation.
    <h1>General Combinators</h1>
    Most functional languages are based on the lambda calculus. As one of their fundamental
    operations they use the <em>application</em> of a function to its arguments or parameters.
    The formal parameters of functions have explicit names, and application requires
    the substitution of the actual parameters for the formal parameters. In Joy there
    are no named formal parameters, and most of the work of application is done instead
    by
    <em>combinator</em>s. Combinators behave like higher order functions -- they take
    other functions as parameters. However, they take those other functions in the form
    of quoted programs from the stack. Hence combinators are like literals and operators
    in that they denote first order functions from states to states. This is possible
    because the property of being higher order is transferred to (the stack component
    of) the state. So, combinators require that the top of the stack contains one or
    more quotations.
    <p>
      Combinators can be classified in many ways: in terms of the number of expected quotations,
      in terms of the total number of expected parameters, quotations and others, in
      terms of their behaviour, and so on. To fix the terminology, combinators will be
      called <em>
      unary</em>, <em> binary</em>, <em> ternary</em> and so on, if they expect one or
      two or three quotations, and so on. But note that many combinators expect further
      parameters below the quotations which they will execute. The following are some
      simple <em>unary
      combinator</em>s which require the top of the stack to be <em>
      one</em> quotation.
    </p>
    <pre>        i     x     y
    </pre>
    <p>
      The <kbd>i</kbd> combinator pops the quotation off the stack and executes it, effectively
      by <em>dequoting</em>. The <kbd>x</kbd> combinator leaves the quotation on the
      stack and executes it. Consequently the <code>x</code> combinator will be executing
      on a stack which has as its top element the very same quotation which it is currently
      executing. The <kbd>y</kbd> combinator first converts the quotation <code>[P]</code>  into a different quotation <code>[Q]</code> with the following strange property:
      if <code>[Q]</code> is ever called by some combinator, then it builds a copy of
      itself on top of the stack and then executes the <code>[P]</code>-part of itself.
      After this conversion, the <code>y</code> combinator calls the
      <code>[Q]</code> it has constructed. In this way the <code>y</code> combinator
      builds some of the behaviour of the <code>x</code> combinator into the <code>[Q]</code>.
    </p>
    <p>
      Another unary combinator is
    </p>
    <pre>        nullary
    </pre>
    No matter how many parameters the quotation consumes from the stack when <kbd>nullary</kbd>executes it, they are all restored and the final value calculated by the execution
    of the quotation is pushed on top of that.
    <p>
      The next unary combinators allow manipulation of the stack below the top few elements:
    </p>
    <pre>        dip    dipd    dipdd
    </pre>
    The <kbd>dip</kbd> combinator requires a further element <code>X</code> to
    be below the quotation. It removes the quotation and
    <code>X</code>, saves <code>X</code> somewhere, executes the quotation on the remainder
    of the stack, and finally restores <code>X</code>. The <kbd>dipd</kbd> and the <kbd>dipdd</kbd>combinator are similar. They expect two or three elements, (X) and (Y), or (X), (Y)
    and (Z) below the quotation. The two or three elements are saved and restored after
    the execution of the quotation.
    <p>
      Three further unary combinators are
    </p>
    <pre>        app1    app2    app3
    </pre>
    Apart from the quotation which they expect on top of the stack, they require
    one or two or three further elements on the stack. So the
    <code>app2</code> combinator requires two further elements, say
    <code>X</code> and <code>Y</code>. In this case the quotation will be executed twice,
    once with <code>X</code> on top of the stack and once with <code>Y</code> on top
    of the stack. The executions could be done in any order, even concurrently, provided
    there are no side effects. If both executions terminate, both should leave behind
    a non-empty stack with respectively <code>X'</code> and <code>Y'</code> on top.
    <p>
      These two values, in their order, are then pushed onto the stack in place of <code>X</code>  and <code>Y</code>. The two other combinators
      <code>app1</code> and <code>app3</code> behave analogously: The
      <code>app1</code> combinator causes just one execution of the quotation, and it
      replaces <code>X</code> by <code>X'</code>. The
      <code>app3</code> combinator cases three executions of the quotation, and it replaces
      <code>X</code>, <code>Y</code> and <code>Z</code> by
      <code>X'</code>, <code>Y'</code> and <code>Z'</code>, maintaining the order.
    </p>
    <p>
      The <em>binary combinator</em>s expect two quotations on top of the stack.
    </p>
    <pre>        b     cleave
    </pre>
    The <kbd>b</kbd> combinator expects two quotations <code>[P]</code> and
    <code>[Q]</code>, with <code>[Q]</code> on top. It removes the two quotations and
    executes first <code>[P]</code> and then
    <code>[Q]</code>. The <kbd>cleave</kbd> combinator also expects two quotations, and
    below that an item <code>X</code>. It also first executes <code>[P]</code>, with
    <code>X</code> on top, and then saves the top result element, say <code>P(X)</code>.
    Then it executes
    <code>[Q]</code>, again with <code>X</code>, and saves the top result as
    <code>Q(X)</code>. Finally it restores the stack to what it was below
    <code>X</code> and pushes the two results <code>P(X)</code> and
    <code>Q(X)</code>.
    <p>
      The <em>ternary combinator</em>s expect three quotations on top of the stack. One
      of the most important is
    </p>
    <pre>        ifte
    </pre>
    The <kbd>ifte</kbd> ("if-then-else") combinator performs branching. Its third
    parameter is the if-part, its second parameter is the then-part, its first parameter,
    on top, is the else-part. It executes the if-part, which must yield a truth value.
    It saves that value and restores the stack to what it was before the if-part was
    executed. If the saved value was <code>true</code> the then-part is executed, otherwise
    the else-part is executed.
    <p>
      There are two combinators for doing simple looping:
    </p>
    <pre>        whiledo    tailrec
    </pre>
    The binary <kbd>whiledo</kbd> combinator is similar to the
    <code>ifte</code> combinator in that it has a test, the while-part, which is second
    on the stack. The combinator repeatedly executes the while-part and while that yields
    <code>true</code> it executes the other part, the do-part. The ternary <kbd>tailrec</kbd>("tail-recursion") combinator also has a test, the third parameter. If that yields
    true, the second parameter is executed and the combinator exits, otherwise the top
    parameter is executed and after that the process is repeated.
    <p>
      The <em>quaternary combinator</em>s expect four quotations on top of the stack.
    </p>
    <pre>        linrec     binrec    genrec
    </pre>
    The <kbd>linrec</kbd> combinator for <em>linear recursion</em> expects an
    if-part, a then-part, an else1-part and on top an else2-part. Like the <code>ifte</code>combinator it executes the if-part, and if that yields true it executes the else-part.
    Otherwise it executes the else1-part, then it recurses with all four parts, and finally
    it executes the else2-part. The <kbd>binrec</kbd> combinator for
    <em>binary recursion</em> is similar, except that the else1-part has to produce two
    values. The recursion with all four parts is executed an the two values separately.
    The else2-part then has available the two results from these two executions. The
    <kbd>genrec</kbd> combinator for <em>general recursion</em> is also has an if-part,
    a then-part and two else-parts.
    <p>
      It differs from the other two combinators in that after the execution of the else1-part
      nothing in particular is executed, but a program consisting of the four parts and
      the combinator is pushed onto the stack. The else2-part thus has it available as
      a parameter.
    </p>
    <p>
      For linear recursion the if-part often is <code>[null]</code> and the else1-part
      often is either <code>[pred]</code> for numeric types or
      <code>[uncons]</code> for aggregate types. The two parts are built into
    </p>
    <pre>        primrec
    </pre>
    for <em>primitive recursion</em>. The binary <kbd>primrec</kbd> combinator
    expects two quotations, a start-part (similar to the else-part of the earlier combinators)
    and a combine-part (similar to the else2-part of the earlier combinators. Below that
    it expects a value of any type. The combinator essentially supplies the other two
    parts.
    <p>
      There are several combinators which do not have a fixed number of quotation parameters.
      Instead they use a list of quotations. They are
    </p>
    <pre>        cond    condlinrec
    </pre>
    The <kbd>cond</kbd> combinator is like the one in Lisp, it is a generalisation
    of the <code>ifte</code> combinator. It expects a non-empty list of programs, each
    consisting of a quoted if-part followed by a then-part. The various if-parts are
    executed until one is found that returns <code>true</code>, and then its corresponding
    then-part is executed.
    <p>
      The last program in the list is the default which is executed if none of the if-parts
      yield <code>true</code>. The <kbd>condlinrec</kbd> combinator is similar, it
      expects a list of pairs or triples of quoted programs. Pairs consist of an if-part
      and a then1-part, and triples have an additional then2-part. Again the first if-part
      that yields
      <code>true</code> selects its corresponding then1-part for execution. If there
      is a then2-part, the combinator first recurses and then executes the then2-part.
      The last program is the default, it does not have an if-part.
    </p>
    <p>
      The <code>cleave</code> combinator also has a generalisation:
    </p>
    <pre>        construct
    </pre>
    expects two parameters, a quotation and above that a list of quotations. Each
    quotation in the list will produce a value that will eventually be pushed onto the
    stack, and the first quotation determines the stack onto which these values will
    be pushed.
    <h1>Combinators for Simple Types</h1>
    Some combinators expect values of specific types below their quotation parameters.
    The combinators in this section expect values of simple types.
    <p>
      The following binary combinator expects a truth value below its two quotation parameters:
    </p>
    <pre>        branch
    </pre>
    The <kbd>branch</kbd> combinator resembles the <code>choice</code> operator
    and the <code>ifte</code> combinator. The truth value below the two quotations determines
    which of the two quotations will be executed. If the truth value is <code>true</code>,
    then the if-part, the second parameter, is executed, otherwise the then-part, the
    top parameter, is executed.
    <p>
      The following unary combinator expects a numeric value below its quotation parameter:
    </p>
    <pre>        times
    </pre>
    The <kbd>times</kbd> combinator executes its quotation parameter as many times
    as indicated by the numeric value; if the value is zero or less, then the quotation
    is not executed at all.
    <h1>Combinators for Aggregate Types</h1>
    The combinators in this section expect aggregates below their quotation parameters.
    <p>
      The stack is just a list, so any list could serve as the stack, including a list
      which happens to be on top of the stack. The following unary combinator expects
      a list below its quotation parameter:
    </p>
    <pre>        infra
    </pre>
    The <kbd>infra</kbd> combinator temporarily discards the remainder of the
    stack and takes the list to be the stack. It then executes the quotation which yields
    a result stack. This result is then pushed as a list onto the original stack replacing
    the original list. Hence any quotation can serve as a complex unary operation on
    lists.
    <p>
      The following unary combinator expects an aggregate below its quotation parameter:
    </p>
    <pre>        step
    </pre>
    The <kbd>step</kbd> combinator removes the aggregate and the quotation, and
    then repeatedly puts the members of the aggregate on top of the remaining stack and
    executes the quotation. For sequential aggregates such as strings, lists or more
    generally, quotations, the members are selected in the order of their occurrance
    in the aggregate. For sets the members are selected on the basis of their underlying
    order. So the quotation is executed as many times as the aggregate has members. What
    happens to the members depends entirely on the quotation. In the simplest though
    unlikely case where the quotation does nothing, the members are left on the stack
    in the order in which they occurred in the aggregate with the last member on top.
    <p>
      There is a related combinator for stepping through two aggregates:
    </p>
    <pre>        step2
    </pre>
    The <kbd>step2</kbd> expects two aggregates which do not have to be of the
    same type. Above that it expects a quotation. It steps through the lower aggregate
    and for each member it steps through the higher aggregate. The pairs of members are
    then made available to the quoted program. If the aggregates have <tt>M</tt> and
    <tt>N</tt> members, there will be <tt>M
    × N</tt> pairs.
    <p>
      The following combinators for aggregates are mostly familiar from list processing
      languages:
    </p>
    <pre>        map    fold     filter     split
    </pre>
    All four step through the members of the aggregate in the same manner as the
    <code>step</code> combinator. The <kbd>map</kbd> combinator combines the results
    of applying the quotation to create a new aggregate of the same type as the original.
    The <kbd>fold</kbd> combinator expects a quotation which computes a binary function,
    below that a value, the <em> initial</em> value, and below that an aggregate. It
    uses the binary function to combine the members of the aggregate into one single
    value, and if the aggregate happens to be empty it returns the initial value.
    <p>
      The <kbd>filter</kbd> combinator needs a quotation which computes a truth value,
      so it is a test. It applies the test to each member of the aggregate and creates
      a new aggregate containing those members of the original which pass the test. The
      resulting aggregate is of the same types as the parameter. The <kbd>split</kbd>  combinator only makes sense in a language in which a function can return two values.
    </p>
    <p>
      It is like the <code>filter</code> combinator except that it returns two aggregates
      - one containing the members of the original which did not pass the test, and above
      that another containing those which did pass the test. The resulting aggregates
      are of the same type as the parameter. In both result aggregates the ordering of
      the original aggregate is preserved in case they are strings or lists.
    </p>
    <p>
      The following unary combinators expect an aggregate below their quotation parameter
      which must compute a truth value:
    </p>
    <pre>        some    all
    </pre>
    The <kbd>some</kbd> combinator returns <code>true</code> if some members of
    the aggregate pass the test of the quotation, otherwise it returns <code>false</code>.
    The <kbd>all</kbd> combinator returns
    <code>true</code> if all members of the aggregate pass the test of the quotation,
    otherwise it returns <code>false</code>. For empty aggregates <code>some</code> returns
    <code>false</code> and
    <code>all</code> returns <code>true</code>.
    <p>
      The following unary combinator expects two aggregates and above that a program suitable
      for combining their respective elements:
    </p>
    <pre>        zipwith
    </pre>
    The <kbd>zipwith</kbd> combinator produces a list which is as long as the
    smaller of the two aggregate parameters. The elements of the resultlist are obtained
    by using the program parameter to combine corresponding members of the two aggregates.
    <p>
      The following unary combinators expect a program and below that a tree:
    </p>
    <pre>        treestep    treemap    treefilter    treefold
    </pre>
    They all resemble corresponding combinators for aggregates. The
    <kbd>treestep</kbd> combinator uses the program to process the leaf nodes in the
    same way as <code>step</code> handles members of an aggregate. The <kbd>treemap</kbd>combinator uses the program to compute replacement leaves for a tree which has the
    same structure. The <kbd>treefilter</kbd> combinator needs a program that yields
    a truth value, it produces a tree of only those leaves which pass the test. The <kbd>treefold</kbd>combinator expects an <em> initial</em> value above the tree and above that the quotation
    which is used to combine the leaves with the initial value.
    <p>
      There are two tree combinators which are similar to the
      <code>genrec</code> combinator:
    </p>
    <pre>        treerec    treerecgen
    </pre>
    and above that two quotations, <code>[O]</code> and <code>[C]</code>. If the
    tree is a leaf, then <code>[O]</code> is executed, typically an operation on a leaf.
    If the tree is not a leaf, then then combinator
    <code>[C]</code> is executed, and it will find on top of the stack the program <code>[[O] [C] treerec]</code>.
    The slightly more general
    <kbd>treerecgen</kbd> combinator also expects a tree but above that three quotations:
    <code>[O1]</code>, <code>[O2]</code> and
    <code>[C]</code>. If the tree is a leaf, then <code>[O1]</code> is executed. If it
    is not a leaf, then first <code>[O2]</code> is executed, and then the combinator
    <code>[C]</code> is executed which will find <code>[[O1] [O2] [C] treerecgen]</code>on top of the stack.
    <hr>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>