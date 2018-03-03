<template>
  <article>
    JOY - compiled at 16: 57: 51 on Mar 17 2003(BDW) Copyright 2001 by Manfred von Thun
    <title> The Joy Programming Language - By Manfred Von Thun </title>
    <dl>
      literal
      <dt> truth value type <code> : </code> -&gt;  B </dt>
      <dd> The logical type, or the type of truth values
        .It has just two literals: true and false.
      </dd>
      <dt> character type <code>      :  </code > -&gt;
        C
      </dt>
      <dd> The type of characters.Literals are written with a single quote.Examples: 'A '
        7 '; and so on. Unix style
        escapes are allowed.
      </dd>
      <dt> integer type <code>      :  </code > -&gt;
        I
      </dt>
      <dd> The type of negative, zero or positive integers.Literals are written in decimal notation.Examples:
        -123 0
        42.
      </dd>
      <dt> set type <code>      :  </code > -&gt; {...
        } 
      </dt>
      <dd> The type of sets of small non - negative integers.The maximum is platform dependent,
        typically the range is
        0..31. Literals are written inside curly braces.Examples: {} {
        0
        } {
        1 3 5
        } {
        19 18 17
        }.
      </dd>
      <dt> string type <code>      :  </code > -&gt;
        "..." 
      </dt>
      <dd> The type of strings of characters.Literals are written inside double quotes.Examples: ""
        "A"
        "hello world"
        "123".Unix style escapes are accepted.
      </dd>
      <dt> list type <code>      :  </code > -&gt;
        [...] 
      </dt>
      <dd> The type of lists of values of any type(including lists), or the type of quoted programs which may contain
        operators or combinators.Literals of this type are written inside square brackets.Examples: [][3 512 - 7]
        [john mary]['A '
        C['B]] [dup *].
      </dd>
      <dt> float type <code>      :  </code > -&gt; F </dt>
      <dd> The type of floating - point numbers
        .Literals of this type are written with embedded decimal points(like 1.2) and optional exponent specifiers(
        like 1.5E2)
      </dd>
      <dt> file type <code>      :  </code > -&gt; FILE:
      </dt>
      <dd> The type of references to open I / O streams, typically but not necessarily files.The only literals of this type are stdin,
        stdout, and stderr.operand
      </dd>
      <dt>false <code>      :  </code > -&gt; false </dt>
      <dd> Pushes the value false.
      </dd>
      <dt>true <code>      :  </code > -&gt; true </dt>
      <dd> Pushes the value true.
      </dd>
      <dt>maxint <code>      :  </code > -&gt; maxint </dt>
      <dd> Pushes largest integer(platform dependent)
        .Typically it is 32 bits.
      </dd>
      <dt>setsize <code>      :  </code > -&gt; setsize </dt>
      <dd> Pushes the maximum number of elements in
        a set(platform dependent).Typically it is 32, and set members are in the range 0..31.
      </dd>
      <dt>stack <code>      :  </code > ..X Y Z -&gt;..X Y Z[Z Y X..] </dt>
      <dd> Pushes the stack as a list
        .
      </dd>
      <dt>conts <code>      :  </code > -&gt;
        [
        [P][Q]..
        ] 
      </dt>
      <dd> Pushes current continuations.Buggy, do not use.
      </dd>
      <dt>autoput <code>      :  </code > - &
        gt; I 
      </dt>
      <dd> Pushes current value of flag
        for automatic output, I = 0..2.
      </dd>
      <dt>undeferror <code>      :  </code > -&gt; I </dt>
      <dd> Pushes current value of undefined -
        is - error flag.
      </dd>
      <dt>undefs <code>      :  </code > -&gt; </dt>
      <dd> Push a list of all undefined symbols in
        the current symbol table.
      </dd>
      <dt>echo <code>      :  </code > -&gt; I </dt>
      <dd> Pushes value of echo flag, I = 0..3.
      </dd>
      <dt>clock <code>      :  </code > -&gt; I </dt>
      <dd> Pushes the integer value of current CPU usage in
        hundreds of a second.
      </dd>
      <dt>time <code>      :  </code > -&gt; I </dt>
      <dd> Pushes the current time( in seconds since the Epoch)
        .
      </dd>
      <dt>rand <code>      :  </code > -&gt; I </dt>
      <dd> I is a random integer.
      </dd>
      <dt>stdin <code>      :  </code > -&gt; S </dt>
      <dd> Pushes the standard input stream.
      </dd>
      <dt>stdout <code>      :  </code > -&gt; S </dt>
      <dd> Pushes the standard output stream.
      </dd>
      <dt>stderr <code>      :  </code > -&gt; S </dt>
      <dd> Pushes the standard error stream.operator
      </dd>
      <dt>id <code>      :  </code > -&gt; </dt>
      <dd> Identity
        function, does nothing.Any program of the form P id Q is equivalent to just P Q.
      </dd>
      <dt>dup <code>      :  </code > X -&gt; X X </dt>
      <dd> Pushes an extra copy of X onto stack.
      </dd>
      <dt>swap <code>      :  </code > X Y -&gt; Y X </dt>
      <dd> Interchanges X and Y on top of the stack
        .
      </dd>
      <dt>rollup <code>      :  </code > X Y Z -&gt; Z X Y </dt>
      <dd> Moves X and Y up, moves Z down
      </dd>
      <dt>rolldown <code>      :  </code > X Y Z -&gt; Y Z X </dt>
      <dd> Moves Y and Z down, moves X up
      </dd>
      <dt>rotate <code>      :  </code > X Y Z -&gt; Z Y X </dt>
      <dd> Interchanges X and Z
      </dd>
      <dt>popd <code>      :  </code > Y Z -&gt; Z </dt>
      <dd> As
        if defined by: popd == [pop] dip
      </dd>
      <dt>dupd <code>      :  </code > Y Z -&gt; Y Y Z </dt>
      <dd> As
        if defined by: dupd == [dup] dip
      </dd>
      <dt>swapd <code>      :  </code > X Y Z -&gt; Y X Z </dt>
      <dd> As
        if defined by: swapd == [swap] dip
      </dd>
      <dt>rollupd <code>      :  </code > X Y Z W -&gt; Z X Y W </dt>
      <dd> As
        if defined by: rollupd == [rollup] dip
      </dd>
      <dt>rolldownd <code>      :  </code > X Y Z W -&gt; Y Z X W </dt>
      <dd> As
        if defined by: rolldownd == [rolldown] dip
      </dd>
      <dt>rotated <code>      :  </code > X Y Z W -&gt; Z Y X W </dt>
      <dd> As
        if defined by: rotated == [rotate] dip
      </dd>
      <dt>pop <code>      :  </code > X -&gt; </dt>
      <dd> Removes X from top of the stack.
      </dd>
      <dt>choice <code>      :  </code > B T F -&gt; X </dt>
      <dd> If B is true, then X = T
        else X = F.
      </dd>
      <dt>or <code>      :  </code > X Y -&gt; Z </dt>
      <dd> Z is the union of sets X and Y,
        logical disjunction
        for truth values.
      </dd>
      <dt>xor <code>      :  </code > X Y -&gt; Z </dt>
      <dd> Z is the symmetric difference of sets X and Y,
        logical exclusive disjunction
        for truth values.
      </dd>
      <dt>and <code>      :  </code > X Y -&gt; Z </dt>
      <dd> Z is the intersection of sets X and Y,
        logical conjunction
        for truth values.
      </dd>
      <dt>not <code>      :  </code > X -&gt; Y </dt>
      <dd> Y is the complement of set X, logical negation
        for truth values.
      </dd>
      <dt>+ <code>      :  </code > M I -&gt; N </dt>
      <dd> Numeric N is the result of adding integer I to numeric M
        .Also supports float.
      </dd>
      <dt>- <code>      :  </code > M I -&gt; N </dt>
      <dd> Numeric N is the result of subtracting integer I from numeric M
        .Also supports float.
      </dd>
      <dt>* <code>      :  </code > I J -&gt; K </dt>
      <dd> Integer K is the product of integers I and J
        .Also supports float.
      </dd>
      <dt>/ <code> : </code> I J  -&gt;  K </dt>
      <dd> Integer K is the(rounded) ratio of integers I and J
        .Also supports float.
      </dd>
      <dt>rem <code>      :  </code > I J -&gt; K </dt>
      <dd> Integer K is the remainder of dividing I by J
        .Also supports float.
      </dd>
      <dt>div <code>      :  </code > I J -&gt; K L </dt>
      <dd> Integers K and L are the quotient and remainder of dividing I by J
        .
      </dd>
      <dt>sign <code>      :  </code > N1 -&gt; N2 </dt>
      <dd> Integer N2 is the sign(-1 or 0 or +
        1) of integer N1, or float N2 is the sign(-1.0 or 0.0 or 1.0) of float N1.
      </dd>
      <dt>neg <code>      :  </code > I -&gt; J </dt>
      <dd> Integer J is the negative of integer I.Also supports float
        .
      </dd>
      <dt>ord <code>      :  </code > C -&gt; I </dt>
      <dd> Integer I is the Ascii value of character C(
        or logical or integer).
      </dd>
      <dt>chr <code>      :  </code > I -&gt; C </dt>
      <dd> C is the character whose Ascii value is integer I(
        or logical or character).
      </dd>
      <dt>abs <code>      :  </code > N1 -&gt; N2 </dt>
      <dd> Integer N2 is the absolute value(0, 1,
        2..) of integer N1, or float N2 is the absolute value(0.0..) of float N1
      </dd>
      <dt>acos <code>      :  </code > F -&gt; G </dt>
      <dd> G is the arc cosine of F.
      </dd>
      <dt>asin <code>      :  </code > F -&gt; G </dt>
      <dd> G is the arc sine of F.
      </dd>
      <dt>atan <code>      :  </code > F -&gt; G </dt>
      <dd> G is the arc tangent of F.
      </dd>
      <dt>atan2 <code>      :  </code > F G -&gt; H </dt>
      <dd> H is the arc tangent of F / G.
      </dd>
      <dt>ceil <code>      :  </code > F -&gt; G </dt>
      <dd> G is the float ceiling of F.
      </dd>
      <dt>cos <code>      :  </code > F -&gt; G </dt>
      <dd> G is the cosine of F.
      </dd>
      <dt>cosh <code>      :  </code > F -&gt; G </dt>
      <dd> G is the hyperbolic cosine of F.
      </dd>
      <dt>exp <code>      :  </code > F -&gt; G </dt>
      <dd> G is e(2.718281828...) raised to the Fth power
        .
      </dd>
      <dt>floor <code>      :  </code > F -&gt; G </dt>
      <dd> G is the floor of F.
      </dd>
      <dt>frexp <code>      :  </code > F -&gt; G I </dt>
      <dd> G is the mantissa and I is the exponent of F
        .Unless F = 0, 0.5 & lt; = abs(G) & lt; 1.0.
      </dd>
      <dt>ldexp <code>      :  </code > F I -&gt; G </dt>
      <dd> G is F times 2 to the Ith power.
      </dd>
      <dt>log <code>      :  </code > F -&gt; G </dt>
      <dd> G is the natural logarithm of F.
      </dd>
      <dt>log10 <code>      :  </code > F -&gt; G </dt>
      <dd> G is the common logarithm of F.
      </dd>
      <dt>modf <code>      :  </code > F -&gt; G H </dt>
      <dd> G is the fractional part and H is the integer part(
        but expressed as a float) of F.
      </dd>
      <dt>pow <code>      :  </code > F G -&gt; H </dt>
      <dd> H is F raised to the Gth power.
      </dd>
      <dt>sin <code>      :  </code > F -&gt; G </dt>
      <dd> G is the sine of F.
      </dd>
      <dt>sinh <code>      :  </code > F -&gt; G </dt>
      <dd> G is the hyperbolic sine of F.
      </dd>
      <dt>sqrt <code>      :  </code > F -&gt; G </dt>
      <dd> G is the square root of F.
      </dd>
      <dt>tan <code>      :  </code > F -&gt; G </dt>
      <dd> G is the tangent of F.
      </dd>
      <dt>tanh <code>      :  </code > F -&gt; G </dt>
      <dd> G is the hyperbolic tangent of F.
      </dd>
      <dt>trunc <code>      :  </code > F -&gt; I </dt>
      <dd> I is an integer equal to the float F truncated toward zero
        .
      </dd>
      <dt>localtime <code>      :  </code > I -&gt; T </dt>
      <dd> Converts a time I into a list T representing local time: [
        year month day hour minute second isdst yearday weekday
        ].Month is 1 = January...12 = December; isdst is a Boolean flagging daylight savings / summer time; weekday is 0 =
        Monday...7 = Sunday.
      </dd>
      <dt>gmtime <code>      :  </code > I -&gt; T </dt>
      <dd> Converts a time I into a list T representing universal time: [
        year month day hour minute second isdst yearday
        weekday
        ].Month is 1 = January...12 = December; isdst is false; weekday is 0 = Monday...7 = Sunday.
      </dd>
      <dt>mktime <code>      :  </code > T -&gt; I </dt>
      <dd> Converts a list T representing local time into a time I
        .T is in the format generated by localtime.
      </dd>
      <dt>strftime <code>      :  </code > T S1 -&gt; S2 </dt>
      <dd> Formats a list T in the format of localtime or gmtime using string S1 and pushes the result S2
        .
      </dd>
      <dt>strtol <code>      :  </code > S I -&gt; J </dt>
      <dd> String S is converted to the integer J using base I
        .If I = 0, assumes base 10, but leading "0"
        means base 8 and leading "0x"
        means base 16.
      </dd>
      <dt>strtod <code>      :  </code > S -&gt; R </dt>
      <dd> String S is converted to the float R
        .
      </dd>
      <dt>format <code>      :  </code > N C I J -&gt; S </dt>
      <dd> S is the formatted version of N in
        mode C('d or '
        i = decimal, 'o = octal, '
        x or 'X = hex with lower or upper
        case letters) with maximum width I and minimum width J.
      </dd>
      <dt>formatf <code>      :  </code > F C I J -&gt; S </dt>
      <dd> S is the formatted version of F in
        mode C('e or '
        E = exponential, 'f = fractional, '
        g or G = general with lower or upper
        case letters) with maximum width I and precision J.
      </dd>
      <dt>srand <code>      :  </code > I -&gt; </dt>
      <dd> Sets the random integer seed to integer I
        .
      </dd>
      <dt>pred <code>      :  </code > M -&gt; N </dt>
      <dd> Numeric N is the predecessor of numeric M
        .
      </dd>
      <dt>succ <code>      :  </code > M -&gt; N </dt>
      <dd> Numeric N is the successor of numeric M
        .
      </dd>
      <dt>max <code>      :  </code > N1 N2 -&gt; N </dt>
      <dd> N is the maximum of numeric values N1 and N2
        .Also supports float.
      </dd>
      <dt>min <code>      :  </code > N1 N2 -&gt; N </dt>
      <dd> N is the minimum of numeric values N1 and N2
        .Also supports float.
      </dd>
      <dt>fclose <code>      :  </code > S -&gt; </dt>
      <dd> Stream S is closed and removed from the stack
        .
      </dd>
      <dt>feof <code>      :  </code > S -&gt; S B </dt>
      <dd> B is the end - of - file status of stream S
        .
      </dd>
      <dt>ferror <code>      :  </code > S -&gt; S B </dt>
      <dd> B is the error status of stream S.
      </dd>
      <dt>fflush <code>      :  </code > S -&gt; S </dt>
      <dd> Flush stream S, forcing all buffered output to be written
        .
      </dd>
      <dt>fgetch <code>      :  </code > S -&gt; S C </dt>
      <dd> C is the next available character from stream S
        .
      </dd>
      <dt>fgets <code>      :  </code > S -&gt; S L </dt>
      <dd> L is the next available line(as a string) from stream S
        .
      </dd>
      <dt>fopen <code>      :  </code > P M -&gt; S </dt>
      <dd> The file system object with pathname P is opened with mode M(
        r, w, a, etc.) and stream object S is pushed;
        if the open fails, file: NULL is pushed.
      </dd>
      <dt>fread <code>      :  </code > S I -&gt; S L </dt>
      <dd> I bytes are read from the current position of stream S and returned as a list of I integers
        .
      </dd>
      <dt>fwrite <code>      :  </code > S L -&gt; S </dt>
      <dd> A list of integers are written as bytes to the current position of stream S
        .
      </dd>
      <dt>fremove <code>      :  </code > P -&gt; B </dt>
      <dd> The file system object with pathname P is removed from the file system
        .is a boolean indicating success or failure.
      </dd>
      <dt>frename <code>      :  </code > P1 P2 -&gt; B </dt>
      <dd> The file system object with pathname P1 is renamed to P2
        .B is a boolean indicating success or failure.
      </dd>
      <dt>fput <code>      :  </code > S X -&gt; S </dt>
      <dd> Writes X to stream S, pops X off stack
        .
      </dd>
      <dt>fputch <code>      :  </code > S C -&gt; S </dt>
      <dd> The character C is written to the current position of stream S
        .
      </dd>
      <dt>fputchars <code>      :  </code > S "abc.." -&gt; S </dt>
      <dd> The string abc..(no quotes) is written to the current position of stream S
        .
      </dd>
      <dt>fputstring <code>      :  </code > S "abc.." -&gt; S </dt>
      <dd>= = fputchars, as a temporary alternative
        .
      </dd>
      <dt>fseek <code>      :  </code > S P W -&gt; S </dt>
      <dd> Stream S is repositioned to position P relative to whence -
        point W, where W = 0, 1, 2
        for beginning, current position, end respectively.
      </dd>
      <dt>ftell <code>      :  </code > S -&gt; S I </dt>
      <dd> I is the current position of stream S
        .
      </dd>
      <dt>unstack <code>      :  </code > [X Y..] -&gt;..Y X </dt>
      <dd> The list[X Y..] becomes the new stack
        .
      </dd>
      <dt>cons <code>      :  </code > X A -&gt; B </dt>
      <dd> Aggregate B is A with a new member X(
        first member
        for sequences).
      </dd>
      <dt>swons <code>      :  </code > A X -&gt; B </dt>
      <dd> Aggregate B is A with a new member X(
        first member
        for sequences).
      </dd>
      <dt>first <code>      :  </code > A -&gt; F </dt>
      <dd> F is the first member of the non -
        empty aggregate A.
      </dd>
      <dt>rest <code>      :  </code > A -&gt; R </dt>
      <dd> R is the non - empty aggregate A with its first member removed
        .
      </dd>
      <dt>compare <code>      :  </code > A B -&gt; I </dt>
      <dd> I( = -1, 0, +1) is the comparison of aggregates A and B
        .The values correspond to the predicates & lt; = , = , & gt; = .
      </dd>
      <dt>at <code>      :  </code > A I -&gt; X </dt>
      <dd> X( = A[I]) is the member of A at position I
        .
      </dd>
      <dt>of <code>      :  </code > I A -&gt; X </dt>
      <dd> X( = A[I]) is the I - th member of aggregate A
        .
      </dd>
      <dt>size <code>      :  </code > A -&gt; I </dt>
      <dd> Integer I is the number of elements of aggregate A
        .
      </dd>
      <dt>opcase <code>      :  </code > X[..[X Xs]..] -&gt;
        [Xs] 
      </dt>
      <dd> Indexing on type of X, returns the list[Xs].
      </dd>
      <dt>case <code>      :  </code > X[..[X Y]..] -&gt; Y i </dt>
      <dd> Indexing on the value of X,
        execute the matching Y.
      </dd>
      <dt>uncons <code>      :  </code > A -&gt; F R </dt>
      <dd> F and R are the first and the rest of non -
        empty aggregate A.
      </dd>
      <dt>unswons <code>      :  </code > A -&gt; R F </dt>
      <dd> R and F are the rest and the first of non -
        empty aggregate A.
      </dd>
      <dt>drop <code>      :  </code > A N -&gt; B </dt>
      <dd> Aggregate B is the result of deleting the first N elements of A
        .
      </dd>
      <dt>take <code>      :  </code > A N -&gt; B </dt>
      <dd> Aggregate B is the result of retaining just the first N elements of A
        .
      </dd>
      <dt>concat <code>      :  </code > S T -&gt; U </dt>
      <dd> Sequence U is the concatenation of sequences S and T
        .
      </dd>
      <dt>enconcat <code>      :  </code > X S T -&gt; U </dt>
      <dd> Sequence U is the concatenation of sequences S and T with X inserted between S and T( ==
        swapd cons concat)
      </dd>
      <dt>name <code>      :  </code > sym -&gt;
        "sym" 
      </dt>
      <dd> For operators and combinators, the string "sym"
        is the name of item sym,
        for literals sym the result string is its type.
      </dd>
      <dt>intern <code>      :  </code > "sym" -&gt; sym </dt>
      <dd> Pushes the item whose name is "sym"
        .
      </dd>
      <dt>body <code>      :  </code > U -&gt;
        [P] 
      </dt>
      <dd> Quotation[P] is the body of user - defined symbol U.predicate
      </dd>
      <dt>null <code>      :  </code > X -&gt; B </dt>
      <dd> Tests
        for empty aggregate X or zero numeric.
      </dd>
      <dt>small <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether aggregate X has 0 or 1 members,
        or numeric 0 or 1.
      </dd>
      <dt>&gt;= <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X greater than or equal to Y.Also supports float.
      </dd>
      <dt>&gt; <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X greater than Y.Also supports float.
      </dd>
      <dt>&lt;= <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X less than or equal to Y.Also supports float.
      </dd>
      <dt>&lt; <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X less than Y.Also supports float.
      </dd>
      <dt>!= <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X not equal to Y.Also supports float.
      </dd>
      <dt>= <code>      :  </code > X Y -&gt; B </dt>
      <dd> Either both X and Y are numeric or both are strings or symbols
        .Tests whether X equal to Y.Also supports float.
      </dd>
      <dt>equal <code>      :  </code > T U -&gt; B </dt>
      <dd> (Recursively) tests whether trees T and U are identical
        .
      </dd>
      <dt>has <code>      :  </code > A X -&gt; B </dt>
      <dd> Tests whether aggregate A has X as a member
        .
      </dd>
      <dt>in <code>      :  </code > X A -&gt; B </dt>
      <dd> Tests whether X is a member of aggregate A
        .
      </dd>
      <dt>integer <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is an integer.
      </dd>
      <dt>char <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a character.
      </dd>
      <dt>logical <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a logical.
      </dd>
      <dt>set <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a set.
      </dd>
      <dt>string <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a string.
      </dd>
      <dt>list <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a list.
      </dd>
      <dt>leaf <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is not a list.
      </dd>
      <dt>user <code>      :  </code > X -&gt; B </dt>
      <dd> Tests whether X is a user - defined symbol
        .
      </dd>
      <dt>float <code>      :  </code > R -&gt; B </dt>
      <dd> Tests whether R is a float.
      </dd>
      <dt>file <code>      :  </code > F -&gt; B </dt>
      <dd> Tests whether F is a file.combinator
      </dd>
      <dt>i <code>      :  </code > [P] -&gt;... </dt>
      <dd> Executes P.So, [P] i == P.
      </dd>
      <dt>x <code>      :  </code > [P] i -&gt;... </dt>
      <dd> Executes P without popping[P].So, [P] x == [
        P
        ] P.
      </dd>
      <dt>dip <code>      :  </code > X[P] -&gt;...X </dt>
      <dd> Saves X, executes P, pushes X back
        .
      </dd>
      <dt>app1 <code>      :  </code > X[P] -&gt; R </dt>
      <dd> Executes P, pushes result R on stack without X
        .
      </dd>
      <dt>app11 <code>      :  </code > X Y[P] -&gt; R </dt>
      <dd> Executes P, pushes result R on stack
        .
      </dd>
      <dt>app12 <code>      :  </code > X Y1 Y2[P] -&gt; R1 R2 </dt>
      <dd> Executes P twice, with Y1 and Y2,
        returns R1 and R2.
      </dd>
      <dt>construct <code>      :  </code > [P][
        [P1][P2]..
        ] -&gt; R1 R2.. 
      </dt>
      <dd> Saves state of stack and then executes[P].Then executes each[Pi] to give Ri pushed onto saved stack
        .
      </dd>
      <dt>nullary <code>      :  </code > [P] -&gt; R </dt>
      <dd> Executes P, which leaves R on top of the stack
        .No matter how many parameters this consumes, none are removed from the stack.
      </dd>
      <dt>unary <code>      :  </code > X[P] -&gt; R </dt>
      <dd> Executes P, which leaves R on top of the stack
        .No matter how many parameters this consumes, exactly one is removed from the stack.
      </dd>
      <dt>unary2 <code>      :  </code > X1 X2[P] -&gt; R1 R2 </dt>
      <dd> Executes P twice, with X1 and X2 on top of the stack
        .Returns the two values R1 and R2.
      </dd>
      <dt>unary3 <code>      :  </code > X1 X2 X3[P] -&gt; R1 R2 R3 </dt>
      <dd> Executes P three times,
        with Xi, returns Ri(i = 1..3).
      </dd>
      <dt>unary4 <code>      :  </code > X1 X2 X3 X4[P] -&gt; R1 R2 R3 R4 </dt>
      <dd> Executes P four times,
        with Xi, returns Ri(i = 1..4).
      </dd>
      <dt>app2 <code>      :  </code > X1 X2[P] -&gt; R1 R2 </dt>
      <dd> Obsolescent. == unary2
      </dd>
      <dt>app3 <code>      :  </code > X1 X2 X3[P] -&gt; R1 R2 R3 </dt>
      <dd> Obsolescent. ==
        unary3
      </dd>
      <dt>app4 <code>      :  </code > X1 X2 X3 X4[P] -&gt; R1 R2 R3 R4 </dt>
      <dd> Obsolescent. ==
        unary4
      </dd>
      <dt>binary <code>      :  </code > X Y[P] -&gt; R </dt>
      <dd> Executes P, which leaves R on top of the stack
        .No matter how many parameters this consumes, exactly two are removed from the stack.
      </dd>
      <dt>ternary <code>      :  </code > X Y Z[P] -&gt; R </dt>
      <dd> Executes P, which leaves R on top of the stack
        .No matter how many parameters this consumes, exactly three are removed from the stack.
      </dd>
      <dt>cleave <code>      :  </code > X[P1][P2] -&gt; R1 R2 </dt>
      <dd> Executes P1 and P2, each with X on top,
        producing two results.
      </dd>
      <dt>branch <code>      :  </code > B[T][F] -&gt;... </dt>
      <dd> If B is true, then executes T
        else executes F.
      </dd>
      <dt>ifte <code>      :  </code > [B][T][F] -&gt;... </dt>
      <dd> Executes B.If that yields true,
        then executes T
        else executes F.
      </dd>
      <dt>ifinteger <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is an integer,
        executes T
        else executes E.
      </dd>
      <dt>ifchar <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a character, executes T
        else executes E.
      </dd>
      <dt>iflogical <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a logical or truth value,
        executes T
        else executes E.
      </dd>
      <dt>ifset <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a set, executes T
        else executes E.
      </dd>
      <dt>ifstring <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a string, executes T
        else executes E.
      </dd>
      <dt>iflist <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a list, executes T
        else executes E.
      </dd>
      <dt>iffloat <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a float, executes T
        else executes E.
      </dd>
      <dt>iffile <code>      :  </code > X[T][E] -&gt;... </dt>
      <dd> If X is a file, executes T
        else executes E.
      </dd>
      <dt>cond <code>      :  </code > [..[
        [Bi] Ti
        ]..[D]] -&gt;... 
      </dt>
      <dd> Tries each Bi.If that yields true, then executes Ti and exits.If no Bi yields true,
        executes
        default D.
      </dd>
      <dt>while <code>      :  </code > [B][D] -&gt;... </dt>
      <dd> While executing B yields true executes D
        .
      </dd>
      <dt>linrec <code>      :  </code > [P][T][R1][R2] -&gt;... </dt>
      <dd> Executes P.If that yields true,
        executes T.Else executes R1, recurses, executes R2.
      </dd>
      <dt>tailrec <code>      :  </code > [P][T][R1] -&gt;... </dt>
      <dd> Executes P.If that yields true,
        executes T.Else executes R1, recurses.
      </dd>
      <dt>binrec <code>      :  </code > [B][T][R1][R2] -&gt;... </dt>
      <dd> Executes P.If that yields true,
        executes T.Else uses R1 to produce two intermediates, recurses on both, then executes R2 to combines their results
        .
      </dd>
      <dt>genrec <code>      :  </code > [B][T][R1][R2] -&gt;... </dt>
      <dd> Executes B,
        if that yields true executes T.Else executes R1 and then[[B][T][R1][R2] genrec] R2.
      </dd>
      <dt>condlinrec <code>      :  </code > [
        [C1][C2]..[D]
        ] -&gt;... 
      </dt>
      <dd> Each[Ci] is of the forms[[B][T]] or[[B][R1][R2]].Tries each B.If that yields true and there is just a[
        T], executes T and exit.If there are[R1] and[R2], executes R1, recurses, executes R2.Subsequent
        case are ignored.If no B yields true, then[D] is used.It is then of the forms[[T]] or[[R1][R2]].For the former,
        executes T.For the latter executes R1, recurses, executes R2.
      </dd>
      <dt>step <code>      :  </code > A[P] -&gt;... </dt>
      <dd> Sequentially putting members of aggregate A onto stack,
        executes P
        for each member of A.
      </dd>
      <dt>fold <code>      :  </code > A V0[P] -&gt; V </dt>
      <dd> Starting with value V0,
        sequentially pushes members of aggregate A and combines with binary operator P to produce value V.
      </dd>
      <dt>map <code>      :  </code > A[P] -&gt; B </dt>
      <dd> Executes P on each member of aggregate A,
        collects results in sametype aggregate B.
      </dd>
      <dt>times <code>      :  </code > N[P] -&gt;... </dt>
      <dd> N times executes P.
      </dd>
      <dt>infra <code>      :  </code > L1[P] -&gt; L2 </dt>
      <dd> Using list L1 as stack, executes P and returns a new list L2
        .The first element of L1 is used as the top of stack, and after execution of P the top of stack becomes the first element of L2
        .
      </dd>
      <dt>primrec <code>      :  </code > X[I][C] -&gt; R </dt>
      <dd> Executes I to obtain an initial value R0
        .For integer X uses increasing positive integers to X, combines by C
        for new R.For aggregate X uses successive members and combines by C
        for new R.
      </dd>
      <dt>filter <code>      :  </code > A[B] -&gt; A1 </dt>
      <dd> Uses test B to filter aggregate A producing sametype aggregate A1
        .
      </dd>
      <dt>split <code>      :  </code > A[B] -&gt; A1 A2 </dt>
      <dd> Uses test B to split aggregate A into sametype aggregates A1 and A2
        .
      </dd>
      <dt>some <code>      :  </code > A[B] -&gt; X </dt>
      <dd> Applies test B to members of aggregate A,
        X = true
        if some pass.
      </dd>
      <dt>all <code>      :  </code > A[B] -&gt; X </dt>
      <dd> Applies test B to members of aggregate A,
        X = true
        if all pass.
      </dd>
      <dt>treestep <code>      :  </code > T[P] -&gt;... </dt>
      <dd> Recursively traverses leaves of tree T,
        executes P
        for each leaf.
      </dd>
      <dt>treerec <code>      :  </code > T[O][C] -&gt;... </dt>
      <dd> T is a tree.If T is a leaf,
        executes O.Else executes[[O][C] treerec] C.
      </dd>
      <dt>treegenrec <code>      :  </code > T[O1][O2][C] -&gt;... </dt>
      <dd> T is a tree.If T is a leaf,
        executes O1.Else executes O2 and then[[O1][O2][C] treegenrec] C.miscellaneous commands
      </dd>
      <dt>help <code>      :  </code > -&gt; </dt>
      <dd> Lists all defined symbols, including those from library files
        .Then lists all primitives of raw Joy(There is a variant: "_help"
        which lists hidden symbols).
      </dd>
      <dt>helpdetail <code>      :  </code > [S1 S2..] </dt>
      <dd> Gives brief help on each symbol S in
        the list.
      </dd>
      <dt>manual <code>      :  </code > -&gt; </dt>
      <dd> Writes this manual of all Joy primitives to output file
        .
      </dd>
      <dt>setautoput <code>      :  </code > I -&gt; </dt>
      <dd> Sets value of flag
        for automatic put to I(
        if I = 0, none;
        if I = 1, put;
        if I = 2, stack.
      </dd>
      <dt>setundeferror <code>      :  </code > I -&gt; </dt>
      <dd> Sets flag that controls behavior of undefined functions(
        0 = no error, 1 = error).
      </dd>
      <dt>setecho <code>      :  </code > I -&gt; </dt>
      <dd> Sets value of echo flag
        for listing.I = 0: no echo, 1: echo, 2: with tab, 3: and linenumber.
      </dd>
      <dt>gc <code>      :  </code > -&gt; </dt>
      <dd> Initiates garbage collection.
      </dd>
      <dt>system <code>      :  </code > "command" -&gt; </dt>
      <dd> Escapes to shell, executes string "command"
        .The string may cause execution of another program.When that has finished, the process returns to Joy.
      </dd>
      <dt>getenv <code>      :  </code > "variable" -&gt;
        "value" 
      </dt>
      <dd> Retrieves the value of the environment variable "variable".
      </dd>
      <dt>argv <code>      :  </code > -&gt; A </dt>
      <dd> Creates an aggregate A containing the interpreter 's command line arguments.
      </dd>
      <dt>argc <code>      :  </code > -&gt; I </dt>
      <dd> Pushes the number of command line arguments
        .This is quivalent to 'argv size'.
      </dd>
      <dt>get <code>      :  </code > -&gt; F </dt>
      <dd> Reads a factor from input and pushes it onto stack
        .
      </dd>
      <dt>put <code>      :  </code > X -&gt; </dt>
      <dd> Writes X to output, pops X off stack.
      </dd>
      <dt>putch <code>      :  </code > N -&gt; </dt>
      <dd> N: numeric, writes character whose ASCII is N
        .
      </dd>
      <dt>putchars <code>      :  </code > "abc.." -&gt; </dt>
      <dd> Writes abc..(without quotes)
      </dd>
      <dt>include <code>      :  </code > "filnam.ext" -&gt; </dt>
      <dd> Transfers input to file whose name is "filnam.ext"
        .On end - of - file returns to previous input file.
      </dd>
      <dt>abort <code>      :  </code > -&gt; </dt>
      <dd> Aborts execution of current Joy program,
        returns to Joy main cycle.
      </dd>
      <dt>quit <code>      :  </code > -&gt; </dt>
      <dd> Exit from Joy.
      </dd>
    </dl>
  </article>
</template>

<style src="~/assets/articles.css" scoped>
</style>