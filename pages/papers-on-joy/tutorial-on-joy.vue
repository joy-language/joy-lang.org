<template>
  <article>
    <h1>An informal tutorial on Joy</h1>
    <i> by Manfred von Thun</i>
    <p>Revised February 2003
      <br> This revision includes references to John Cowan's (2001) extension.
    </p>
    <p>
      <em>Abstract:</em> Joy is a functional programming language which is not based
      on the application of functions to arguments but on the composition of functions.
      It does not use lambda-abstraction of expressions but instead it uses quotation
      of expressions. A large number of what are called combinators are used to perform
      dequotation, they have the effect of higher order functions. Several of them
      can be used to eliminate recursive definitions. Programs in Joy are compact
      and often look just like postfix notation. Writing programs and reasoning about
      them is made easy because there is no substitution of actual for formal parameters.
    </p>
    <p>
      This tutorial describes basic features of the language Joy which are likely to be
      the same in all implementations.
    </p>
    <p>
      <em>Keywords:</em> functional programming, higher order functions, composition
      of functions, combinators, elimination of recursive definitions, variable free
      notation
    </p>
    <hr>
    <h2>Introduction</h2>
    Although the theory of Joy is of interest, this tutorial exposition avoids theory
    as much as possible.
    <p>
      The remainder of this paper is organised as follows: This introductory section continues
      with a very short outline of some distinguishing features of the language.
      The next two sections introduce the basic data types and operations on them.
      The section after that returns to the central feature of Joy: quotations of
      programs and their use with combinators. After a short section on definitions
      the next section resumes the discussion of combinators, in particular those
      that can eliminate the need for recursive definitions. In the final section
      several short programs and one larger program are used to illustrate programming
      with aggregates in Joy.
    </p>
    <p>
      To add two integers, say 2 and 3, and to write their sum, you type the program
      <br>
    </p>
    <pre>  
            2  3  +
    </pre>
    This is ordinary postfix notation, a reverse form of a notation first
    used by Polish logicians in the 1920s. Its advantage is that in complex expressions
    no parentheses are needed. Internally it works like this: the first numeral causes
    the integer 2 to be pushed onto a stack. The second numeral causes the integer
    3 to be pushed on top of that. Then the addition operator pops the two integers
    off the stack and pushes their sum, 5. The system reads inputs like the above
    and executes them when they are terminated by a period <code>"."</code>, like
    this:
    <br>
    <pre>  
            2  3  + .
    </pre>
    In the default mode there is no need for an explicit output instruction,
    so the numeral <code>5</code> is now written to the output file which normally
    is the screen. So, in the default mode the terminating <code>"."</code> may be
    taken to be an instruction to write the top element of the stack. In what follows
    the terminating period will not be shown any further.
    <p>
      Apart from integers, the current version of Joy as extended by John Cowan has real
      numbers or "floats". Arithmetic operations on floats are just like those on
      integers. The following multiplies two numbers
      <br>
    </p>
    <pre>  
            2.34  5.67  *
    </pre>
    and leaves their product, <code>13.2678</code>, on top of the stack. (So,
    to see the result on the terminal, the above line has to terminated by a period.)
    <p>
      To compute the square of an integer, it has to be multiplied by itself. To compute
      the square of the sum of two integers, the sum has to be multiplied by itself.
      Preferably this should be done without computing the sum twice. The following
      is a program to compute the square of the sum of 2 and 3:
      <br>
    </p>
    <pre>  
            2  3  +  dup  *
    </pre>
    After the sum of 2 and 3 has been computed, the stack just contains the
    integer 5. The <kbd>dup</kbd> operator then pushes another copy of the 5 onto
    the stack. Then the multiplication operator replaces the two integers by their
    product, which is the square of 5. The square is then written out as 25. Apart
    from the <code>dup</code> operator there are several others for re-arranging
    the top of the stack. The <kbd>pop</kbd> operator removes the top element, and
    the
    <kbd>swap</kbd> operator interchanges the top two elements. This is quite different
    from proper postfix notation, because the stack manipulators only make sense
    in the presence of a stack. Such notation is also used in some pocket calculators,
    the Unix utility dc, the typesetting language Postscript and the general purpose
    language Forth. Billy Tanksley has suggested that this be called concatenative
    notation. The theory of this notation is a topic unto itself, but it will not
    be dealt with in this tutorial.
    <p>
      A <em>list</em> of integers is written inside square brackets. Just as integers
      can be added and otherwise manipulated, so lists can be manipulated in various
      ways. The following <kbd>concat</kbd>-enates two lists:
      <br>
    </p>
    <pre>  
            [1 2 3]  [4 5 6 7]  concat
    </pre>
    The two lists are first pushed onto the stack. Then the
    <code>concat</code> operator pops them off the stack and pushes the list <code>[1 2 3 4 5 6 7]</code>    onto the stack. There it may be further manipulated or it may be written to the
    output file.
    <p>
      The elements of a list need not be all of the same type, and the elements can be
      lists themselves. The following uses a list containing one integer, two floats
      and one list of three integers.
      <br>
    </p>
    <pre>  
            [ 3.14  42  [1 2 3]  0.003 ]   dup  concat
    </pre>
    The <kbd>dup</kbd> operator will push a copy of the list on top of the
    stack, where the two lists will then be concatenated into one.
    <p>
      Joy makes extensive use of <em>combinator</em>s. These are like operators in
      that they expect something specific on top of the stack. But unlike operators
      they execute what they find on top of the stack, and this has to be the <em>quotation</em>      of a program, enclosed in square brackets. One of these is a combinator for
      <kbd>map</kbd>ping elements of one list via a function to another list. Consider
      the program
      <br>
    </p>
    <pre>  
            [1 2 3 4]  [dup *]  map
    </pre>
    It first pushes the list of integers and then the quoted program onto
    the stack. The <code>map</code> combinator then removes the list and the quotation
    and constructs another list by applying the program to each member of the given
    list. The result is the list <code>[1 4 9
    16]</code> which is left on top of the stack.
    <p>
      In <em>definition</em>s of new functions no formal parameters are used, and
      hence there is no substitution of actual parameters for formal parameters.
      After the following definition
      <br>
    </p>
    <pre>  
            square   ==   dup  *
    </pre>
    the symbol <code>square</code> can be used in place of <code> dup *
    </code>.
    <p>
      Definitions occur in blocks such as the following:
      <br>
      <br>
    </p>
    <pre>  
        DEFINE
            square  ==  dup * ;
      cube    ==  dup dup * * .
    </pre>
    As the example shows, definition mode is initiated by the reserved word
    <code>DEFINE</code> and extends to the period. Individual definitions are separated
    by semicolons. In libraries the initiator
    <code>LIBRA</code> is used instead of
    <code>DEFINE</code>. In the remainder of this paper the initiator, the separator
    and the terminator will generally not be shown any further.
    <p>
      As in other programming languages, definitions may be recursive, for example in the
      definition of the factorial function. That definition uses a certain recursive
      pattern that is useful elsewhere. In Joy there is a combinator for <em>primitive recursion</em>      which has this pattern built in and thus avoids the need for a definition.
      The
      <kbd>primrec</kbd> combinator expects two quoted programs in addition to a
      data parameter. For an integer data parameter it works like this: If the data
      parameter is zero, then the first quotation has to produce the value to be
      returned. If the data parameter is positive then the second has to combine
      the data parameter with the result of applying the function to its predecessor.
      For the factorial function the required quoted programs are very simple:
      <br>
    </p>
    <pre>  
            [1]  [*]  primrec
    </pre>
    computes the factorial recursively. There is no need for any definition.
    For example, the following program computes the factorial of
    <code>5</code>:
    <br>
    <br>
    <pre>  
            5  [1]  [*]  primrec
    </pre>
    It first pushes the number <code>5</code> and then it pushes the two short
    quoted programs. At this point the stack contains three elements. Then the <code>primrec</code>    combinator is executed. It pops the two quotations off the stack and saves them
    elsewhere. Then
    <code>primrec</code> tests whether the top element on the stack (initially the
    <code>5</code>) is equal to zero. If it is, it pops it off and executes one of
    the quotations, the <code>[1]</code> which leaves <code>1</code> on the stack
    as the result. Otherwise it pushes a decremented copy of the top element and
    recurses. On the way back from the recursion it uses the other quotation, <code>[*]</code>,
    to multiply what is now a factorial on top of the stack by the second element
    on the stack. When all is done, the stack contains
    <code>120</code>, the factorial of <code>5</code>.
    <p>
      As may be seen from this program, the usual branching of recursive definitions is
      built into the combinator. The
      <code>primrec</code> combinator can be used with many other quotation parameters
      to compute quite different functions. It can also be used with data types other
      than integers.
    </p>
    <p>
      Joy has many more combinators which can be used to calculate many functions without
      forcing the user to give recursive or non-recursive definitions. Some of the
      combinators are more data-specific than
      <code>primrec</code>, and others are far more general.
    </p>
    <h2>Integers, floats, characters and truth values</h2>
    The data types of Joy are divided into simple and aggregate types. The <em>simple</em>    types comprise integers, floats (or reals), characters and the truth values.
    The aggregate types comprise sets, strings and lists. Literals of any type cause
    a value of that type to be pushed onto the stack. There they can be manipulated
    by the general stack operations such as <kbd>dup</kbd>, <kbd>pop</kbd> and
    <kbd>swap</kbd> and a few others, or they can be manipulated by operators specific
    to their type. This section introduces literals and operators of the simple types.
    <p>
      An <em>integer</em> is just a whole number. Literals of this type are written
      in decimal notation. The following binary operations are provided:
      <br>
    </p>
    <pre>  
            +        -        *        /        rem
    </pre>
    The first four have their conventional meaning, the last is the operator
    for the remainder after division. Operators are written after their operands.
    Binary operators remove two values from the top of the stack and replace them
    by the result. For example, the program
    <br>
    <pre>  
            20  3  4  +  *  6  -  100  rem
    </pre>
    evaluates to 34, and this value is left on top of the stack. There are
    also some unary operators specific to integers like the
    <kbd>abs</kbd> operator which takes the absolute value, and the
    <kbd>signum</kbd> operator which yields
    <code>-1</code>,
    <code>0</code> or <code>+1</code>, depending on whether its parameter is negative,
    zero or positive.
    <p>
      Apart from the positive and negative integers or whole numbers, Joy has floating
      point numbers or "floats". Literals of this type are written with a decimal
      point and at least one digit after that. Optionally the last digit may be followed
      by 'E' or 'e' and then a positive or negative exponent. Here are some examples:
      <br>
    </p>
    <pre>  
            3.14     314.0     3.14E5    3.14e-5
    </pre>
    The last two are equivalent to 314000.0 and 0.0000314 . Most operators
    on integers work in the same way for floats. John Cowan's extension also provides
    a large number of functions for floats, but these are outside the scope of this
    tutorial.
    <p>
      A <em>character</em> is a letter, a digit, a punctuation character, in fact
      any printable character or one of a few white space characters. Literals of
      type character are written as a single quote followed by the character itself.
      Values of type character are treated very much like small numbers. That means
      that other numbers can be added to them, for example 32 to change letter from
      upper case to lower case. There are two unary operators which are defined on
      characters and on integers:
      <kbd>pred</kbd> takes the predecessor,
      <kbd>succ</kbd> takes the successor. For example,
      <br>
    </p>
    <pre>  
            'A  32  +  succ  succ
    </pre>
    evaluates to <code>'c</code>, the third lower case letter.
    <p>
      The type of <em>truth value</em>s is what in some languages is called
      <em>Boolean</em>. The following are the two literals, the unary negation operator
      and two binary operators for conjunction and disjunction:
      <br>
    </p>
    <pre>  
            true        false        not        and        or
    </pre>
    For example, the program
    <br>
    <br>
    <pre>  
            false  true  false  not  and  not  or
    </pre>
    evaluates to <code>false</code>.
    <p>
      Values of type integer and character can be compared using the following <em>relational operator</em>s:
      <br>
    </p>
    <pre>  
            =        &lt;        &gt;        !=        &lt;=        &gt;=
    </pre>
    The <kbd>!=</kbd> operator returns the negation of what the <kbd>=</kbd>    operator returns. The others have the conventional meaning. As all operators,
    they are written in postfix notation. The result is always a truth value. For
    example,
    <br>
    <pre>  
            'A  'E  &lt;  2  3  +  15  3  /  =  and
    </pre>
    evaluates to <code>true</code>.
    <h2>Sets, strings and lists</h2>
    The <em>aggregate</em> types are the unordered type of sets and the ordered
    types of strings and lists. Aggregates can be built up, combined, taken apart
    and tested for membership. This section introduces literals and operators of
    the aggregate types.
    <p>
      A <em>set</em> is an unordered collection of zero or more small integers. Literals
      of type set are written inside curly braces, and the empty set is written as
      an empty pair of braces. For set literals the ordering of the elements is irrelevant
      and duplication has no effect. The operators for conjunction and disjunction
      are also defined on sets. For example, the two equivalent programs
      <br>
    </p>
    <pre>  
            {1 3 5 7}  {2 4 6 8}  or  {}  or  {3 4 5 6 7 8 9 10}  and
            {3 7 5 1}  {2 4 6 8}  or  {}  or  {3 4 5 6 7 8 9 10 10} and
    </pre>
    evaluate to <code>{3 4 5 6 7 8}</code>. The negation operator
    <kbd>not</kbd> takes complements relative to the largest expressible set, which
    in most implementations will have a maximum of 32 members: from <code>0</code>    to
    <code>31</code>.
    <p>
      A <em>string</em> is an ordered sequence of zero or more characters. Literals
      of this type string are written inside double quotes, and the empty string
      is written as two adjacent double quotes with nothing inside:
      <code>""</code>. Note that this is different from the string containing just
      the blank: <code>" "</code>. Two strings can be concatenated, and a string
      can be reversed. For example,
      <br>
    </p>
    <pre>  
        "dooG"  reverse  " morning"  " "  concat concat  "world"  concat
    </pre>
    evaluates to <code>"Good morning world"</code>.
    <p>
      For many operators an implementation can choose whether to make it a primitive or
      define it in a library. Apart from execution speed, to the user it makes no
      difference as to which choice has been made. In the current implementation
      the <code>reverse</code> operator is defined in a library.
    </p>
    <p>
      A <em>list</em> is an ordered sequence of zero or more values of any type.
      Literals of type list are written inside square brackets, the empty list is
      written as an empty pair of brackets. Lists can contain lists as members, so
      the type of lists is a recursive data type.
    </p>
    <p>
      Values of the aggregate types, namely sets, strings and lists can be constructed
      from existing ones by adding a new member with the
      <kbd>cons</kbd> operator. This is a binary operator for which the first parameter
      must be a possible new member and the second parameter must be an aggregate.
      For sets the new member is added if it is not already there, and for strings
      and lists the new member is added in front. Here are some examples. The programs
      on the left evaluate to the literals on the right.
      <br>
    </p>
    <pre>  
            5  3 {2 1}  cons  cons  3  swap  cons                {1 2 3 5}
            'E  'C  "AB"  cons  cons  'C  swap  cons               "CECAB"
            5  [6]  [1 2]  cons  cons  'A  swap  cons       ['A 5 [6] 1 2]
    </pre>
    As the examples show, the <code>cons</code> operator is most useful for
    adding elements into an aggregate which is already on the stack below the aggregate.
    To add new elements that have just been pushed, the new elements and the aggregate
    have to be <code>swap</code>ped first before the new element can be <code>cons</code>ed
    into the aggregate. To facilitate this, Joy has another operator,
    <kbd>swons</kbd>, which first performs a <code>swap</code> and then a
    <code>cons</code>.
    <p>
      Whereas the <code>cons</code> and <code>swons</code> operators builds up aggregate
      values, the two unary operators <kbd>first</kbd> and
      <kbd>rest</kbd> take them apart. Both are defined only on non-empty aggregate
      values. For the two ordered aggregate types, strings and lists, the meaning
      is obvious: the first operator returns the first element and the rest operator
      returns the string or list without the first element:
      <br>
    </p>
    <pre>  
            "CECAB"  first                                              'C
            "CECEB"  rest                                           "ECAB"
            ['A 5 [6] 1 2]  first                                       'A
            ['A 5 [6] 1 2]  rest                               [5 [6] 1 2]
    </pre>
    But sets are unordered, so it does not make sense to speak of their first
    members <em>as sets</em>. But since their members are integers, the ordering
    on the integers can be used to determine what the first member is. Analogous
    considerations apply to the <code>rest</code> operator.
    <br>
    <pre>  
            {5 2 3}  first                                                2
            {5 2 3}  rest                                             {3 5}
    </pre>
    <p>
      For all three types of aggregates the members other than the first can be extracted
      by repeatedly taking the rest and finally the first of that. This can be cumbersome
      for extracting member deep inside. An alternative is to use the <kbd>at</kbd>      operator to <em>index</em> into the aggregate, by extracting a member <b> at</b>      a numerically specified position. For example, the following are two equivalent
      programs to extract the fifth member of any aggregate:
      <br>
    </p>
    <pre>  
            rest  rest  rest  rest  first
            5  at
    </pre>
    <p>
      There is a unary operator which determines the <kbd>size</kbd> of any aggregate
      value. For sets this is the number of members, for strings its is the length,
      and for lists it is the length counting only top level members. The
      <code>size</code> operator yields zero for empty aggregates and a positive
      integer for others. There is also a unary
      <kbd>null</kbd> operator, a predicate which yields the truth value
      <code>true</code> for empty aggregates and <code>false</code> for others. Another
      predicate, the <kbd>small</kbd> operator, yields
      <code>true</code> just in case the size is <code>0</code> or
      <code>1</code>.
    </p>
    <p>
      Apart from the operators which only affect the stack, there are two for explicit
      input and output. The <kbd>get</kbd> operator reads an item from the
      input file and pushes it onto the stack. The
      <kbd>put</kbd> operator pops an item off the stack and writes it to the screen
      or whatever the output file is. The next program reads two pairs of integers
      and then compares the sum of the first pair with the sum of the second pair.
      <br>
    </p>
    <pre>  
            get  get  +  get  get  +  &gt;  put
    </pre>
    The two <kbd>get</kbd> operators attempt to read two items and push them
    onto the stack. There they are immediately added, so they have to be integers.
    This is repeated for the second pair. At this point the stack contains the two
    sums. Then the comparison operator pops the two integers and replaces them by
    a truth value, <kbd>true</kbd> or <kbd>false</kbd>, depending on whether the
    first sum is less than the second sum. The <kbd>put</kbd> operator pops that
    truth value and writes it. The stack is now as it was before the program was
    run, only the input file and the output file are changed.
    <p>
      For another example, the following conducts a silly little dialogue:
      <br>
      <br>
    </p>
    <pre>  
            "What is your name?" put "Hello, " get concat put
    </pre>
    First the question string is pushed on the stack and then popped to be
    written out to the screen. Then the <tt>'"Hello, "'</tt> string is pushed. Next,
    the <code>get</code> operator reads an item from the keyboard and pushes it onto
    the stack. That item has to be another string, because it will be concatenated
    with what is below it on the stack. The resultant string is then written out.
    So, if in answer to the question a user types <tt>'"Pat"'</tt>, the program finally
    writes out
    <tt>'"Hello, Pat"'</tt>.
    <p>
      In addition to the compound data types set, string and list, John Cowan's extension
      provides a large number of operators for manipulating the file system: opening,
      closing, deleting files, and various input-output operators. These are outside
      the scope of this tutorial.
    </p>
    <h2>Quotations and Combinators</h2>
    Lists are really just a special case of <em>quoted program</em>s. Lists only
    contain values of the various types, but quoted programs may contain other elements
    such as operators and some others that are explained below. A <em>quotation</em>    can be treated as passive data structure just like a list. For example,
    <br>
    <pre>  
            [ +  20  *  10  4  - ]
    </pre>
    has size <code>6</code>, its second and third elements are
    <code>20</code> and <code>*</code>, it can be reversed or it can be concatenated
    with other quotations. But passive quotations can also be made active by <em>dequotation</em>.
    <p>
      If the above quotation occurs in a program, then it results in the quotation being
      pushed onto the stack - just as a list would be pushed. There are many other
      ways in which that quotation could end up on top of the stack, by being concatenated
      from its parts, by extraction from a larger quotation, or by being read from
      the input. No matter how it got to be on top of the stack, it can now be treated
      in two ways: passively as a data structure, or actively as a program. The square
      brackets prevented it from being treated actively. Without them the program
      would have been executed: it would expect two integers which it would add,
      then multiply the result by 20, and finally push 6, the difference between
      10 and 4.
    </p>
    <p>
      Joy has certain devices called <em>combinator</em>s which cause the execution
      of quoted programs that are on top of the stack. This section describes only
      a very small proportion of them.
    </p>
    <p>
      One of the simplest is the <kbd>i</kbd> combinator. Its effect is to execute
      a single program on top of the stack, and nothing else. Syntactically speaking,
      its effect is to remove the quoting square brackets and thus to expose the
      quoted program for execution. Consequently the following two programs are equivalent:
      <br>
    </p>
    <pre>  
            [ +  20  *  10  4  - ]  i
              +  20  *  10  4  -
    </pre>
    The <code>i</code> combinator is mainly of theoretical significance, but
    it is used occasionally. The many other combinators are essential for programming
    in Joy.
    <p>
      One of the most well-known combinators is for branching. The
      <kbd>ifte</kbd> combinator expects three quoted programs on the stack, an if-part,
      a then-part and an else-part, in that order, with the else-part on top. The
      <code>ifte</code> combinator removes and saves the three quotations and then
      performs the following on the remainder of the stack: It executes the if-part
      which should leave a truth value on top of the stack. That truth value is saved
      and the stack is restored to what it was before the execution of the if-part.
      Then, if the saved truth value was <code>true</code>, the <code>ifte</code>      combinator executes the then-part, otherwise it executes the else-part.
    </p>
    <p>
      In most cases the three parts would have been pushed in that order just before the
      <code>ifte</code> combinator is executed. But any or all of the three parts
      could have been constructed from other quotations.
    </p>
    <p>
      In the following example the three parts are pushed just before the
      <code>ifte</code> combinator is executed. The program looks at a number on
      top of the stack, and if it is greater than 1000 it will halve it, otherwise
      it will triple it.
      <br>
    </p>
    <pre>  
            [1000 &gt;]  [2 /]  [3 *]  ifte
    </pre>
    <p>
      Some combinators require that the stack contains values of certain types. Many are
      analogues of higher order functions familiar from other programming languages:
      <kbd>map</kbd>,
      <kbd>filter</kbd> and
      <kbd>fold</kbd>. Others only make sense in Joy. For example, the
      <kbd>step</kbd> combinator can be used to access all elements of an aggregate
      in sequence. For strings and lists this means the order of their occurrence,
      for sets it means the underlying order. The following will
      <code>step</code> through the members of the second list and <code>swons</code>      them into the initially empty first list. The effect is to reverse the non-empty
      list, yielding
      <code>[5 6 3 8
      2]</code>.
      <br>
    </p>
    <pre>  
            []  [2 8 3 6 5]  [swons]  step
    </pre>
    <p>
      The <kbd>map</kbd> combinator expects an aggregate value on top of the stack,
      and it yields another aggregate of the same size. The elements of the new aggregate
      are computed by applying the quoted program to each element of the original
      aggregate. An example was already given in the introduction.
    </p>
    <p>
      Another combinator that expects an aggregate is the <kbd>filter</kbd> combinator.
      The quoted program has to yield a truth value. The result is a new aggregate
      of the same type containing those elements of the original for which the quoted
      program yields <code>true</code>. For example, the quoted program <code>['Z &gt;]</code>      will yield truth for characters whose numeric values is greater than that of
      <code>Z</code>. Hence it can be used to remove upper case letters and blanks
      from a string. So the following evaluates to
      <code>"ohnmith"</code>:
      <br>
    </p>
    <pre>  
            "John Smith"   ['Z &gt;]   filter
    </pre>
    <p>
      Sometimes it is necessary to add or multiply or otherwise combine all elements of
      an aggregate value. The <kbd>fold</kbd> combinator can do just that.
      It requires three parameters: the aggregate to be folded, the quoted value
      to be returned when the aggregate is empty, and the quoted binary operation
      to be used to combine the elements. In some languages the combinator is called
      reduce (because it turns the aggregate into a single value), or insert (because
      it looks as though the binary operation has been inserted between any two members).
      The following two programs compute the sum of the members of a list and the
      sum of the squares of the members of a list. They evaluate to 10 and 38, respectively.
      <br>
    </p>
    <pre>  
            [2 5 3]  0  [+]  fold
            [2 5 3]  0  [dup * +]  fold
    </pre>
    <p>
      To compute the average or arithmetic mean of the members of a set or a list, we have
      to divide the sum by the size. (Because of the integer arithmetic, the division
      will produce an inaccurate average.) The aggregate needs to be looked at twice:
      once for the sum and once for the size. So one way to compute the average is
      to duplicate the aggregate value first with the <kbd>dup</kbd> operator.
      Then take the
      <code>sum</code> of the top version. Then use the <kbd>swap</kbd> operator
      to interchange the position of the sum and the original aggregate, so that
      the original is now on top of the stack. Take the size of that. Now the stack
      contains the sum and the size, with the size on top. Apply the division operator
      to obtain the average value.
      <br>
    </p>
    <pre>  
            dup  0  [+]  fold  swap  size  /
    </pre>
    One nice feature of this little program is that it works equally for set
    values as for list values. This is because the constituents
    <code>fold</code> and <code>size</code> work for both types.
    <p>
      But there are two aspects of this program which are unsatisfactory. One concerns
      the <code>dup</code> and
      <code>swap</code> operators which make the program hard to read. The other
      concerns the sequencing of operations: The program causes the computation of
      the sum to occur before the computation of the size. But it does not matter
      in which order they are computed, in fact on a machine with several processors
      the sum and the size could be computed in parallel. Joy has a combinator which
      addresses this problem: there is <b>
      one</b> data parameters, the aggregate, which is to be fed to <b> two</b> functions.
      From each of the functions a value is to be constructed, by calling both functions
      by means of a combinator
      <b>cleave</b> which produces two values, one for the sum and one for the size.
      The program for the average looks like this:
      <br>
    </p>
    <pre>  
            [0 [+] fold]   [size]   cleave   /
    </pre>
    <h2>Definitions</h2>
    In conventional languages the definition of a function of one or more arguments
    has to name these as formal parameters
    <code>x</code>,
    <code>y</code> ... For example, the squaring function might be defined by some
    variation of any of the following:
    <br>
    <pre>  
            square(x)  =  x * x
            (defun (square x)  (* x x))
            square  =  lambda x.x * x
    </pre>
    In Joy formal parameters such as <code>x</code> above are not required,
    a definition of the squaring function is simply
    <br>
    <pre>  
            square   ==   dup  *
    </pre>
    This is one of the principal differences between Joy and those languages
    that are based on the lambda calculus. The latter include (the purely functional
    subsets of) Lisp, Scheme, ML and Haskell. All of these are based on the application
    of functions to arguments or actual parameters.
    <p>
      In definitions and abstractions of functions the formal parameters have to be named
      - <code>x</code>, <code>y</code> and so on, or something more informative.
      This is different in Joy. It is based on the composition of functions and not
      on the application of functions to arguments. In definitions and abstractions
      of functions the arguments do not need be named and as formal parameters indeed
      cannot be named. One consequence is that there are no
      <em>environment</em>s of name-value pairs. Instead the work of environments
      is done by higher order functions called combinators.
    </p>
    <p>
      Finally, the concrete syntax of the language is an integral part of the language
      and aids in reasoning about Joy programs in the metalanguage.
    </p>
    <p>
      Suppose it is required to transform a list of numbers into the list of their cubes.
      The cube of a single number is of course computed by
      <br>
    </p>
    <pre>  
            dup  dup  *  *
    </pre>
    It would be possible to introduce a definition of the cube function. But
    that would introduce another name, <code>cube</code>. If the cube function is
    used only once for computing the cubes of a list of numbers, then it may not
    be desirable to give a definition of it at all. In Joy the list of cubes is computed
    by the first line below, but it is also possible to give an explicit definition
    as in the second line.
    <br>
    <pre>  
            [dup dup * *]  map
            cubelist   ==   [dup dup * *] map
    </pre>
    In a language that is based on the lambda calculus both would need a lambda
    abstraction with a variable, say
    <code>x</code>, for the number to be cubed. And of course the second line would
    need an additional formal parameter, say <code>l</code>, or a lambda abstraction
    with a variable <code>l</code> for the list to which the cubelist function is
    to be applied.
    <p>
      Suppose now that it is required to transform a <em>list of lists</em> of numbers
      into the <em>list of lists</em> of their cubes. One might give the definition
      <br>
    </p>
    <pre>  
            cubelistlist   ==   [ [dup dup * *] map ]  map
    </pre>
    Of course, if that function is only to be used once, one might not bother
    to give a definition at all but use the right hand side directly. In languages
    based on abstraction, at least two formal parameters are needed just for the
    right hand side, and another for the definition itself. For example, in Scheme
    the definition looks like this:
    <br>
    <pre>  
            (define (cubelistlist ll)
                    (map (lambda (l)
                         (map (lambda (n) (* n (* n n)))
                               l ) )
                     ll )
    </pre>
    Here the two formal parameters are <code>n</code> for the number and
    <code>l</code> for the list of numbers on the right hand side, and
    <code>ll</code> for the list of lists of numbers in the definition itself.
    <p>
      As in other languages, definitions can be recursive in Joy. In the first line below
      is a recursive definition of the factorial function in one of many variants
      of conventional notation. In the second line is a recursive definition in Joy.
      <br>
    </p>
    <pre>  
            factorial(x)  =  if x = 0 then 1 else x * factorial(x - 1)
            factorial  ==  [0 =] [pop 1] [dup 1 - factorial *] ifte
    </pre>
    Again the Joy version does not use a formal parameter <code>x</code>.
    It works like this: The definition uses the <kbd>ifte</kbd> combinator immediately
    after the if-part, the then-part and the else-part have been pushed.
    <p>
      The <code>ifte</code> combinator then does this: it executes the if-part, in
      this case <code>[0 =]</code>, which tests whether the (anonymous) integer parameter
      is equal to zero. If it is, then the if-part is executed, in this case <code>[pop 1]</code>,
      which pops the parameter off the stack and replaces it by one. Otherwise the
      else-part is executed, in this case <code>[dup 1 - factorial
      *]</code>. This uses <code>dup</code> to make another copy of the parameter and
      subtracts one from the copy. Then the
      <code>factorial</code> function is called recursively on that. Finally the
      original parameter and the just computed factorial are multiplied.
    </p>
    <p>
      The definition could be shortened and made a little more efficient by using the inbuilt
      predicate <kbd>null</kbd> which tests for zero and the <kbd>pred</kbd>      operator which takes the predecessor of a number. But these changes are insignificant.
    </p>
    <p>
      For more complex functions of several arguments it is necessary to be able to access
      the arguments anywhere in the definition. Joy avoids formal parameters altogether,
      and hence in general arbitrary access has to be done by mechanisms more sophisticated
      than <code>dup</code>,
      <code>swap</code> and <code>pop</code>.
    </p>
    <p>
      Here are some more definitions that one might have:
      <br>
      <br>
    </p>
    <pre>  
            sum   ==   0  [+]  fold
            product   ==   1  [*]  fold
            average   ==   [sum]  [size]  constr12  /
            concatenation   ==   ""  [concat]  fold
    </pre>
    The last definition is for an operator which yields a single string which
    is the concatenation of a list of strings.
    <h2>Recursive Combinators</h2>
    If one wanted to compute the list of factorials of a given list, this could
    be done by
    <br>
    <pre>  
            [ factorial ]  map
    </pre>
    But this relies on an external definition of factorial. It was necessary
    to give that definition explicitly because it is recursive. If one only wanted
    to compute factorials of lists of numbers, then it would be a minor nuisance
    to be forced to define factorial explicitly just because the definition is recursive.
    <p>
      A high proportion of recursively defined functions exhibit a very simple pattern:
      There is some test, the if-part, which determines whether the ground case obtains.
      If it does, then the non-recursive then-part is executed. Otherwise the recursive
      else-part has to be executed. In the else-part there is only <em>one</em>      recursive call, and there can be something before the recursive call and something
      after the recursive call. It helps to think of the else-part to have two components,
      the else1-part before the recursive call, and the else2-part after the recursive
      call. This pattern is called
      <em>linear recursion</em>, and it occurs very frequently.
    </p>
    <p>
      Joy has a useful device, the <kbd>linrec</kbd> combinator, which allows computation
      of anonymous functions that <em>might</em> have been defined recursively using
      a linear recursive pattern. Whereas the <code>ifte</code> combinator requires
      three quoted parameters, the
      <code>linrec</code> combinator requires four: an if-part, a then-part, an else1-part
      and an else2-part. For example, the factorial function could be computed by
      <br>
    </p>
    <pre>  
            [null]  [succ]  [dup pred]  [*]  linrec
    </pre>
    There is no need for a definition, the above program can be used directly.
    <br>
    <p>
      Very frequently the if-part of a linear recursion tests for a simple base condition
      which depends on the type of the parameter. For numbers that condition tends
      to be being zero, for sets, strings and lists that condition tends to be being
      empty. The else1-part frequently makes the parameter smaller in some way. For
      numbers it decrements them, for sets, strings and lists it takes the
      <kbd>rest</kbd>.
    </p>
    <p>
      Joy has another useful combinator which has the appropriate if-part and else1-part
      built in. This is the
      <kbd>primrec</kbd> combinator, which only has to be supplied with two quotation
      parameters, the (modified) then-part and the else2-part of linear recursion.
      For the factorial function the two quotation parameters are very simple:
      <br>
    </p>
    <pre>  
            [1]  [*]  primrec
    </pre>
    computes the factorial function. So, if one wanted to compute the list
    of factorial of a given list of numbers this can be done by either of the following:
    <br>
    <pre>  
            [ [null]  [succ]  [dup pred]  [*]  linrec ]   map
            [ [1]  [*]  primrec ]   map
    </pre>
    The factorial of a number is the product of successive natural numbers
    up to the actual parameter. The following compute instead their sums and the
    sum of their squares:
    <br>
    <pre>  
            [0]  [+]  primrec
            [0]  [dup * +]  primrec
    </pre>
    Many of the Joy combinators are polymorphic in the sense that they can
    be applied to parameters of quite different types. The combinator
    <code>primrec</code> can be applied not only to numbers but also to lists. For
    example, applied to the list
    <code>[1 2 3]</code> the program
    <br>
    <pre>  
            [[]]  [[] cons cons]  primrec
    </pre>
    produces the list <code>[1 [2 [3 []]]]</code>. Lisp programmers will recognise
    a similarity to "dotted pairs". In the following, the first turns a set of numbers
    into a list, the second turns a list of numbers into a set:
    <br>
    <pre>  
            [[]]  [cons]  primrec
            [{}]  [cons]  primrec
    </pre>
    In fact, the first can also be applied to a list and the second can also
    be applied to a set. But in that case they just compute the identity. They can
    even be applied to numbers - and then they produce a list or a set of numbers
    from the parameter down to 1.
    <p>
      In many recursive definitions there are two recursive calls of the function being
      defined. This is the pattern of <em>binary
      recursion</em>, and it is used in the usual definitions of quicksort and of the
      Fibonacci function. Joy has a facility that eliminates the need for a recursive
      definition, the <kbd>binrec</kbd> combinator.
    </p>
    <p>
      The following will <em>quicksort</em> a list whose members can be a mixture
      of anything except lists. The program easily fits onto one line, but for reference
      it is here written over several numbered lines:
      <br>
    </p>
    <pre>  
        1           [small]
        2           []
        3           [uncons [&gt;] split]
        4           [[swap] dip cons concat]
        5           binrec
    </pre>
    This is how it works: Lines 1..4 each push a quoted program. In line 5
    the <code>binrec</code> combinator is called, and it will make use of the four
    quoted programs and below that the list to be sorted. The four quoted programs
    are saved elsewhere, and the <code>binrec</code> combinator begins by executing
    the program from line 1. This tests whether the list to be sorted is small, i.e.
    has at most one member. If indeed it is small, then it is sorted already.
    <p>
      The <code>binrec</code> combinator now executes the program from line 2, which
      does nothing and hence leaves the small list as it is. On the other hand, if
      the list is not small, then the programs in lines 3 and 4 will be executed.
      The program in line 3 removes the first element from the list and uses it as
      a pivot to split the rest of the list into two sublists, by using the comparison
      function in
      <code>[&gt;]</code> and the <code>split</code> combinator.
    </p>
    <p>
      At this point the <code>binrec</code> combinator calls itself recursively on
      the two sublists and sorts them both. Finally the program in line 4 combines
      the two sorted versions and the original pivot into a single sorted list. The
      three items are not quite in the required order, so the <code>[swap] dip</code>      part puts the pivot in between the two sorted lists.
    </p>
    <p>
      Then <code>cons</code> puts the pivot in front of the topmost string or list,
      and finally <code>concat</code> combines everything into one single sorted
      list. Since all operations in the program also work on strings, the program
      itself can equally well be used to sort a string.
    </p>
    <p>
      In fact, the program can be used on sets too, but this of course is pointless. The
      program is useful, it is part of the Joy system library under the name of <kbd>qsort</kbd>.
    </p>
    <p>
      Many other functions are often defined by recursive definitions that use binary recursion.
      In Joy they can all be computed with the
      <code>binrec</code> combinator without the need for a definition. For example,
      the following computes the
      <em>Fibonacci</em> function; it implements the usual inefficient algorithm:
      <br>
    </p>
    <pre>  
            [small]  []  [pred dup pred]  [+]  binrec
    </pre>
    The system library of course contains the well known efficient algorithm.
    <p>
      There are only a few second order combinators, ones which require a first order combinator
      as parameter. One of the is <kbd>treerec</kbd> for recursing through
      <em>tree</em>s. These are either anything but a list, or lists of trees. For
      example, in the following
      <code>treerec</code> is given <code>[map]</code> as a parameter, which in turn
      will be given <code>[dup *]</code> as a parameter when
      <code>treerec</code> encounters a list. The function to be applied to numbers
      possibly deeply embedded within lists is the squaring function
      <code>[dup *]</code>.
    </p>
    <p>
      Here is an example:
      <br>
      <br>
    </p>
    <pre>  
            [ 1 [2 3] [[[4]]] 5 ]  [dup *]  [map]  treerec
    </pre>
    produces
    <br>
    <br>
    <pre>  
            [ 1 [2 9] [[[16]]] 25 ]
    </pre>
    <p>
      All of these combinators can be defined in other functional languages, but they are
      less useful there. This is because their parameters have to be abstractions
      with variables, and not quotations as in Joy.
    </p>
    <h2>Programming with aggregates</h2>
    The <em>aggregate</em> types of Joy are lists, sets and strings. There are several
    unary operators which take an aggregate as parameter and produce as value a list
    of subaggregates. One of these is the
    <kbd>powerlist</kbd> operator. For an aggregate of size <tt>N</tt> it produces
    a list of all the <tt>2^N</tt> subaggregates.
    <p>
      Here is an example:
      <br>
      <br>
    </p>
    <pre>  
            [1 2 3]  powerlist
    </pre>
    produces as result
    <br>
    <pre>  
            [ [1 2 3] [1 2] [1 3] [1] [2 3] [2] [3] [] ]
    </pre>
    If the ordering does not suit, the result list can always be rearranged,
    for example it can be reversed. For another example, one can sort the list according
    to size. The
    <kbd>mk_qsort</kbd> combinator expects an aggregate and a quoted operator as
    parameters and it applies the operator to each member of the aggregate to use
    as the basis for sorting them.
    <br>
    <pre>  
            [1 2 3]  powerlist  [size]  mk_qsort
    </pre>
    produces as a result
    <br>
    <br>
    <pre>  
            [ [] [1] [2] [3] [1 2] [1 3] [2 3] [1 2 3] ]
    </pre>
    <p>
      The powerlist operators can also be applied to a string. The result is a list of
      all substrings. In the following the result list is
      <kbd>filter</kbd>ed to retain only those substrings whose size is greater than
      3. This is achieved by the
      <kbd>filter</kbd> combinator which expects an aggregate and a quoted predicate.
      The first line is the program, the second line is the result:
      <br>
    </p>
    <pre>  
            "abcde"  powerlist  [size 3 &gt;]  filter
            [ "abcde" "abcd" "abce" "abde" "acde" "bcde" ]
    </pre>
    <p>
      The powerlist operators can also be applied to a set. In the program on the first
      line below the list of subsets is then filtered to retain only those of size
      3; the result is the list of subsets in the second line:
      <br>
    </p>
    <pre>  
            {1 2 3 4}  powerlist  [size 3 =]  filter
            [ {1 2 3} {1 2 4} {1 3 4} {2 3 4} ]
    </pre>
    <p>
      Suppose it is required to find the list, in ascending order, of all sums of any three
      distinct numbers taken from a given set of numbers. We already know how to
      get the list of all three-membered subsets. Each should be replaced by its
      sum, and that can be done with the
      <kbd>map</kbd> combinator applied to the whole list. The resulting list of
      sums then needs to be sorted. The example in the first line does just that,
      giving the result in the second line:
      <br>
    </p>
    <pre>  
            {1 2 3 4 5}  powerlist  [size 3 =] filter  [sum] map  qsort
            [6 7 8 8 9 9 10 10 11 12]
    </pre>
    <p>
      In the remainder of this section a small program is to be constructed which takes
      one sequence as parameter and returns the list of all
      <em>permutation</em>s of that sequence. Here is a first draft:
      <br>
    </p>
    <pre>  
    1         If  S has only zero or one member
    2             then it has only one permutation, so take its unit list
    3             else  take the first and rest of S,
                        recurse to construct the permutations of the rest
    4                   insert the first in all positions in all permutations
    </pre>
    <p>
      The recursion pattern is linear, so we can use the <kbd>linrec</kbd> combinator
      to arrive at this first incomplete program:
      <br>
    </p>
    <pre>  
    1       [ small ]
    2       [ unitlist ]
    3       [ uncons ]
    4       [ "insert the first in all positions in all permutations" ]
    5       linrec
    </pre>
    The anonymous recursion between steps 3 and 4 will have left a list of
    permutations of the rest of <code>S</code> on top of the stack.
    <p>
      Next, it is necessary to insert the original first of <code>S</code> into all
      positions into all these resulting permutations. This involves replacing each
      single permutation by a list of permuations with the original first inserted
      in all places.
    </p>
    <p>
      This calls for the <kbd>map</kbd> combinator to apply a
      <em>constructed program</em> to each permutation. The original first is currently
      the second item on the stack. to make it available to the program to be constructed,
      it is <code>swap</code>ped to the top. The required program consists of a constant
      part and a variable part.
    </p>
    <p>
      The constant part now has to be pushed onto the stack. Then the first is <code>cons</code>ed
      into the required program. Then
      <code>map</code> will create a list of list of permutations. But this is a
      two-level list, and it should be one-level. So the two level list has to be
      flattened to a one-level list.
      <br>
    </p>
    <pre>  
    4.1             [ swap
    4.2               [ "the constant part of the program" ]
    4.3               cons map
    4.4               "flatten the resulting list of lists of sequences" ]
    </pre>
    <p>
      The constant part of the constructed program has to be written next. The constructed
      program will be used to <code>map</code> all permutations of the rest,
      and in each case it will begin by pushing the original first on top of the
      current permutation being mapped. It then has to insert this first into all
      positions of the current permutation.
    </p>
    <p>
      This again calls for a linear recursion with
      <kbd>linrec</kbd>. One way to do this is to give this anonymous recursive function
      just one parameter, the current permutation with the original first
      <code>swons</code> in as an initial element. So the task is now to insert this
      inital element into all positions in the remainder which is the current permutation.
      <br>
    </p>
    <pre>  
    4.2.2.1         If  the current sequence is small
    4.2.2.2             then return just its unit list
    4.2.2.3             else  keep  1. a copy
                                    2. its second and
                                    3. the sequence without its second
                              anonymously recurse on 3.
    4.2.2.4                   construct a program to insert the second
                              use <code>map</code> to do the insertion
                              use <code>cons</code> to add the copy from 1.
    </pre>
    So the constant part 4.2 looks like this:
    <br>
    <pre>  
    4.2.1             [ swons
    4.2.2.1             [ small ]
    4.2.2.2             [ unitlist ]
    4.2.2.3             [ dup unswons [uncons] dip swons ]
    4.2.2.4             [ swap [swons] cons map cons ]
    4.2.2.5             linrec ]
    </pre>
    <p>
      The only other part that needs to be written is for flattening. This should be trivial
      by now: If the list is small, then take its unit list else take its first and
      its rest anonymously recurse on the rest, concatenate the saved first into
      the result.
    </p>
    <p>
      Here is the required program:
      <br>
      <br>
    </p>
    <pre>  
    4.4             [ null ] [ ] [ uncons ] [ concat]  linrec
    </pre>
    <p>
      The entire program now is the following:
      <br>
      <br>
    </p>
    <pre>  
    1               [ small ]
    2               [ unitlist ]
    3               [ uncons ]
    4.1             [ swap
    4.2.1             [ swons
    4.2.2.1             [ small ]
    4.2.2.2             [ unitlist ]
    4.2.2.3             [ dup unswons [uncons] dip swons ]
    4.2.2.4             [ swap [swons] cons map cons ]
    4.2.2.5             linrec ]
    4.3               cons map
    4.4               [null] [] [uncons] [concat] linrec ]
    5               linrec.
    </pre>
    <p>
      An essentially identical program is in the Joy library under the name
      <kbd>permlist</kbd>. It is considerably shorter than the one given here because
      it uses two subsidiary programs
      <kbd>insertlist</kbd> and
      <kbd>flatten</kbd> which are useful elsewhere. The program given above is an
      example of a non-trivial program which uses the
      <kbd>linrec</kbd> combinator three times and the <kbd>map</kbd> combinator
      twice, with <em>constructed program</em>s as parameters on both occasions.
    </p>
    <p>
      Of course such a program can be written in lambda calculus languages such as <em>Lisp</em>,
      <em>Scheme</em>, <em>ML</em> or
      <em>Haskell</em>, but it would need many recursive definitions with attendant
      named formal parameters.
    </p>
    <h2>Miscellaneous</h2>
    The current implementation has many other features that are best described in
    more specialised documentation. For a brief glance at what is available, see
    the output from the
    <a href="allhelp">online help</a> command. This gives just a list of
    the names of primitives and defined functions when all libraries are loaded.
    For an actual description of the current primitives, see the output from the
    <a href="plain-manual">online manual</a> command. For definitions of
    the defined functions, consult the various libraries in section 3 of the main
    page.
    <p>
    </p>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>