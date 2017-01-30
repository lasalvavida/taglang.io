<template>
  <div class="post-content">
    <h3>Background</h3>
    <p>
      My last post comes along with a ton of improvements to
      <a href="https://github.com/lasalvavida/visionjs">VisionJS</a>
      in the way of making chunking a generic process that can be applied
      to any cell operation.
    </p>
    <p>
      Javascript is by it's nature single-threaded (with the exception of some
      web worker implementations that enable native multi-threading), and there
      is no process management by default. This means that if you have a long-running
      task, the javascript engine will just execute that long-running task until it
      completes, which will lock up other resources on the page.
    </p>
    <p>
      Image processing can take some time, and as a result, the first version of
      my kernel convolution demo that I wrote was unusable. I wrote a one-off
      version of convolution that supported chunking for that demo.
      After the specified number of operations, the convolution is paused briefly
      to let the javascript engine do other things, like updating UI, etc.
    </p>
    <p>
      However, for this last post, I wanted to compare the runtime for computing an
      average filter with kernel convolution vs. using integral images, and in order
      for that to be a fair comparison, the computation for the integral image filter
      needed to be chunked the same way that the kernel convolution was. After some
      hefty re-architecturing, it is now possible to chunk any matrix operation.
    <h3>Procedure</h3>
    <p>
      What are integral images and why are they so much faster?
      The integral image is a transform of an image where each pixel is set equal to the sum
      of the rectangle of pixels from the pixel to the origin.
    </p>
    <p v-html="integralImageMatrix"/>
    <p>
      We can compute the integral image in constant time (relative to the size of
      the image), by iterating over each row in the image beginning at the origin.
      Set each cell equal to the sum of its value, the value of the cell above it,
      and the value of the cell to its left. Out of bounds cells are treated as zeros.
    </p>
    <p>
      An <span v-html="nTimesM"/> average filter kernel can be written as <span v-html="kernelAverageFilter"/>.
      At each pixel, we are effectively taking the sum of the pixels in the area covered by
      the kernel and dividing by the area covered.
    </p>
    <p>
      Instead of computing the sum at each pixel via convolution, we can use the pre-computed
      integral image to quickly find the sum of any area with top corner <span v-html="wX"/> and
      bottom corner <span v-html="yZ"/>.
    </p>
    <p v-html="integralEvaluation">
    <p>
      This formula represents the process of taking the total area from the origin to the bottom
      corner, and then subtracting from the top of the area to the top row, and subtracting
      from the left side of the area to the left-most column. Finally, we must add back
      the overlap between these subtractions, producing the sum over the area.
    </p>
    <p>
      By pre-computing the integral image, an average filter of any size can be performed
      with no time dependence on the size of the filter.
    </p>
    <h3>Results</h3>
    <p>
      The runtime for kernel convolution vs. integral images may vary somewhat from machine
      to machine, but in general you should see a significant performance boost from integral
      images, especially at large kernel sizes.
    </p>
    <p>
      This is extremely useful for an algorithm like SURF which approximates the Laplacian of
      Gaussian filter as a set of large box filters which must be computed at multiple
      resolutions. We'll get into that more next time.
    </p>
  </div>
</template>

<script>
  import katex from 'katex'
  require('../../../node_modules/katex/dist/katex.css')

  export default {
    data () {
      return {
        integralImageMatrix: katex.renderToString('' +
          'I(J \\times K) \\rightarrow \\int I = ' +
          '\\begin{bmatrix}' +
            'I(0, 0) &' +
            '\\sum\\limits_{m=0}^{1} I(0,m) &' +
            '\\cdots &' +
            '\\sum\\limits_{m=0}^{K} I(0,m) \\\\' +
            '\\sum\\limits_{n=0}^{1} I(n, 0) &' +
            '\\sum\\limits_{n=0}^{1} \\sum\\limits_{m=0}^{1} I(n,m) &&' +
            '\\vdots \\\\' +
            '\\vdots &&' +
            '\\ddots &' +
            '\\vdots \\\\' +
            '\\sum\\limits_{n=0}^{J} I(n,0) &' +
            '\\cdots &' +
            '\\cdots &' +
            '\\sum\\limits_{n=0}^{J} \\sum\\limits_{m=0}^{K} I(n,m) \\\\' +
          '\\end{bmatrix}'),
        nTimesM: katex.renderToString('n \\times m'),
        kernelAverageFilter: katex.renderToString('K(i, j) = \\frac{1}{n \\cdot m}'),
        wX: katex.renderToString('(w, x)'),
        yZ: katex.renderToString('(y, z)'),
        integralEvaluation: katex.renderToString('\\sum\\limits_{n=w}^{y} \\sum\\limits_{m=x}^{z}' +
          'I(n,m) = \\int I(y,z) - \\int I(w-1,z) - \\int I(y,x-1) + \\int I(w-1, x-1)')
      }
    }
  }
</script>

<style>
</style>
