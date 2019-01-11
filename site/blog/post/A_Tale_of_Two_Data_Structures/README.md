---
title: A Tale of Two Data Structures
date: 2017-02-16 0:00.00
---

# {{ $page.frontmatter.title }}

**{{ new Date($page.frontmatter.date).toDateString() }}**

Today I had something a bit odd happen, and I wanted to share it because
I think sometimes as software developers we can get caught up in the
algorithmic beauty of something and forget about what it actually means
in terms of implementation.

I was reviewing some C++ code and suggested to use a *std::map*
instead of a *std::unordered_map* for speed.
I got a response back that this couldn't possibly be a good idea because
an unordered map uses hashing with O(1) lookup times, so surely it must be
faster than dusty old O(log n)?

Well as it happens, I actually was asked this in an interview once.
The question was framed to me as such:
   
We reached a point where our tests were taking a long time to run. This
was really a symptom of a larger problem; our codebase needed optimizing
and cleaning. So, we went nuts with the profiler, replaced all of our
lookup tables with hash maps from binary trees, and got much better
performance... most of the time. However, in some cases, the tests
ran slower than they did with the old binary tree implementation.
Why do you think that could be?
   
And I didn't know the answer. I think I said something along the lines
that there had to be some other slowdown in those parts of the code.
I learned something that day. I learned that hashing isn't a fix-all
hammer for data structures.
  
Some of you may be smarter than I was and already know the answer;
in that case, the benchmarks at the bottom may interest you. If not,
I guess just say something snarky and disparaging about me and go
read something else.

The reality is that in use cases with small sets and especially in ones
that use string keys, binary tree searches can be faster than hash table
lookups. Hash functions aren't magic; they are real algorithms that take
time to run. Computing a hash of a string requires going character by
character through the string and performing a computation at each index.
It is only O(1) complexity once you have the index to do the lookup.
If the string is longer, it takes longer to compute the hash. With search
and compare, we only have to look at as many characters as it takes to
tell that the strings aren't a match, and then we can move on to the next
string. In practice, this can give the binary tree faster runtimes.

### Benchmarks

I decided to run some benchmarks just to see for myself. I randomly
generated a set of 32 character keys, and added them to both a *std::map*
and a *std::unordered_map*. I then performed 100000 random
lookups from that key set on both and timed the duration. You can see my results in the table below.

| # of Keys | map    | unordered_map |
| --------- | ------ | ------------- |
| 1         | 425 ms | 605 ms        |
| 2         | 544 ms | 701 ms        |
| 3         | 566 ms | 798 ms        |
| 4         | 573 ms | 790 ms        |
| 5         | 611 ms | 716 ms        |
| 6         | 638 ms | 694 ms        |
| 7         | 667 ms | 717 ms        |
| 8         | 668 ms | 700 ms        |
| 9         | 702 ms | 608 ms        |
| 10        | 720 ms | 613 ms        |
| 11        | 750 ms | 653 ms        |

*Windows 10, MSVC++ 14.0, Intel(R) Core(TM) i7-4700MQ CPU @ 2.40GHz*

As you can see, ordered maps with only a few
elements (on my machine < 9) have a faster runtime for lookups than
their hashier counterparts. You can grab a copy of my benchmark code
[here](/benchmark.cpp) to run for yourself if you're not
convinced.

### Conclusions

If you're indexing any sizeable quantity of data, then please use a container with
hashing.

Is the typical use case for your data structure that it
only has a few elements in it? Then, in my opinion it probably isn't worth
the memory overhead, and your performance will thank you for using a binary tree.

<BlogPostNav/>
