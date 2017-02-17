<template>
  <div class="post-content">
    <p>
      Today I had something a bit odd happen, and I wanted to share it because
      I think sometimes as software developers we can get caught up in the
      algorithmic beauty of something and forget about what it actually means
      in terms of implementation.
    </p>
    <p>
      I was reviewing some C++ code and suggested to use a <i>std::map</i>
      instead of a <i>std::unordered_map</i> for speed.
      I got a response back that this couldn't possibly be a good idea because
      an unordered map uses hashing with O(1) lookup times, so surely it must be
      faster than dusty old O(log n)?
    </p>
    <p>
      Well as it happens, I actually was asked this in an interview once.
      The question was framed to me as such:
    </p>
    <p>
      <i>
        We reached a point where our tests were taking a long time to run. This
        was really a symptom of a larger problem; our codebase needed optimizing
        and cleaning. So, we went nuts with the profiler, replaced all of our
        lookup tables with hash maps from binary trees, and got much better
        performance... most of the time. However, in some cases, the tests
        ran slower than they did with the old binary tree implementation.
        Why do you think that could be?
      </i>
    </p>
    <p>
      And I didn't know the answer. I think I said something along the lines
      that there had to be some other slowdown in those parts of the code.
      I learned something that day. I learned that hashing isn't a fix-all
      hammer for data structures.
    </p>
    <p>
      Some of you may be smarter than I was and already know the answer;
      in that case, the benchmarks at the bottom may interest you. If not,
      I guess just say something snarky and disparaging about me and go
      read something else.
    </p>
    <p>
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
    </p>
    <h3>Benchmarks</h3>
    <p>
      I decided to run some benchmarks just to see for myself. I randomly
      generated a set of 32 character keys, and added them to both a <i>std::map</i>
      and a <i>std::unordered_map</i>. I then performed 100000 random
      lookups from that key set on both and timed the duration. You can see my results in the table below.
    </p>
    <p>
      <table class="pure-table">
        <thead>
          <tr>
            <th># of Keys</th>
            <th>map</th>
            <th>unordered_map</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>425 ms</td>
            <td>605 ms</td>
          </tr>
          <tr>
            <td>2</td>
            <td>544 ms</td>
            <td>701 ms</td>
          </tr>
          <tr>
            <td>3</td>
            <td>566 ms</td>
            <td>798 ms</td>
          </tr>
          <tr>
            <td>4</td>
            <td>573 ms</td>
            <td>790 ms</td>
          </tr>
          <tr>
            <td>5</td>
            <td>611 ms</td>
            <td>716 ms</td>
          </tr>
          <tr>
            <td>6</td>
            <td>638 ms</td>
            <td>694 ms</td>
          </tr>
          <tr>
            <td>7</td>
            <td>667 ms</td>
            <td>717 ms</td>
          </tr>
          <tr>
            <td>8</td>
            <td>668 ms</td>
            <td>700 ms</td>
          </tr>
          <tr>
            <td>9</td>
            <td>702 ms</td>
            <td>608 ms</td>
          </tr>
          <tr>
            <td>10</td>
            <td>720 ms</td>
            <td>613 ms</td>
          </tr>
          <tr>
            <td>11</td>
            <td>750 ms</td>
            <td>653 ms</td>
          </tr>
        </tbody>
      </table>
    </p>
    <p>
      <i>Windows 10, MSVC++ 14.0, Intel(R) Core(TM) i7-4700MQ CPU @ 2.40GHz</i>
    </p>
    <p>
      As you can see, ordered maps with only a few
      elements (on my machine < 9) have a faster runtime for lookups than
      their hashier counterparts. You can grab a copy of my benchmark code
      <a href="static/benchmark.cpp" download>here</a> to run for yourself if you're not
      convinced.
    </p>
    <h3>Conclusions</h3>
    <p>
      If you're indexing any sizeable quantity of data, then please use a container with
      hashing.
    </p>
    <p>
      Is the typical use case for your data structure that it
      only has a few elements in it? Then, in my opinion it probably isn't worth
      the memory overhead, and your performance will thank you for using a binary tree.
    </p>
  </div>
</template>

<script>
</script>

<style>
</style>
