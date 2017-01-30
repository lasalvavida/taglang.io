<template>
  <div class="post-content">
    <p>
      This demo will compute the hessian determinant across the image
      using the discrete 9x9 approximation for the Laplacian of Gaussian
      Kernel with the integral image optimization. We'll talk about that
      more in Part 2.
    </p>
    <p>
      Press 'Start' to run the computation. After that, the threshold will
      be set to an optimal level. The threshold can be adjusted manually
      using the slider. You can also use your own images using the upload dialog.
    </p>
    <div class="container">
      <canvas class="image-canvas" ref="imageCanvas" width="300" height="300"></canvas>
      <dropzone class="image-drop" v-bind:imageLoaded="imageDropped"></dropzone>
    </div>
    <div v-show="computed">
      <input class="slider" type="range" min="0" max="256" v-model="threshold" v-on:mousemove="drawThresholded"/>
    </div>
    <div>
      <button class="button" v-on:click="compute()" :disabled="!loaded">Start</button>
    </div>
  </div>
</template>

<script>
import {Matrix2d, SURF, Image as VImage, otsu} from 'visionjs'
import Dropzone from '../../components/Dropzone'
import drawLoading from '../../lib/drawLoading'

export default {
  components: {
    Dropzone
  },
  data () {
    return {
      computed: false,
      drawing: false,
      image: undefined,
      loaded: false,
      matrix: undefined,
      threshold: 0
    }
  },
  methods: {
    compute: function () {
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var context = imageCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
      var imageData = context.getImageData(0, 0, width, height)

      var loading = drawLoading(context, width, height, {
        imageData: imageData
      })

      var vImage = VImage.fromRawData(width, height, imageData.data)
      var r = vImage.channels[0]
      var g = vImage.channels[1]
      var b = vImage.channels[2]
      this.vImage = vImage
      var gray = new Matrix2d(r.rows, r.columns)

      gray.apply(function (row, column) {
        this.set(row, column, Math.round((r.get(row, column) +
          g.get(row, column) +
          b.get(row, column)) / 3))
      })

      var integral = gray.integral()
      var options = {
        chunk: true,
        iterations: 512,
        duration: 10
      }

      var that = this
      SURF.hessianDeterminantAsync(integral, 0, 0, options)
        .then(function (result) {
          var matrix = result
          matrix.apply(function (row, column) {
            this.set(row, column, Math.abs(this.get(row, column)))
          })
          var min = matrix.min()
          var max = matrix.max()
          matrix.apply(function (row, column) {
            var value = Math.round((matrix.get(row, column) - min) / (max - min) * 255)
            matrix.set(row, column, value)
          })
          var histogram = matrix.histogram(256)
          var threshold = otsu(histogram, matrix.length)

          that.threshold = threshold
          that.matrix = matrix
          that.computed = true
          loading.running = false
          that.drawThresholded()
        })
    },
    drawThresholded: function () {
      if (this.drawing) {
        return
      }
      this.drawing = true
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var context = imageCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
      var imageData = context.getImageData(0, 0, width, height)
      var threshold = this.threshold

      this.matrix.apply(function (row, column) {
        var value = Math.abs(this.get(row, column))
        var index = (this.columns * row + column) * 4
        if (value > threshold) {
          imageData.data[index] = 0.0
          imageData.data[index + 1] = 0.0
          imageData.data[index + 2] = 0.0
          imageData.data[index + 3] = 1.0
        }
      })
      context.putImageData(imageData, 0, 0)
      this.drawing = false
    },
    imageDropped: function (image) {
      this.computed = false
      this.loaded = false
      this.image.src = image
    },
    imageLoaded: function () {
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var context = imageCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
      this.loaded = true
    }
  },
  mounted: function () {
    this.image = new Image()
    this.image.addEventListener('load', this.imageLoaded, false)
    this.image.src = require('../../images/simple-shapes.png')
  }
}
</script>

<style scoped>
.container {
  float: left;
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
}

.image-canvas {
  float: left;
  position: relative;
}

.image-drop {
  float: left;
  clear: right;
  width: 300px;
  height: 300px;
  position: relative;
  margin-left: 10px;
}

.slider {
  width: 300px;
}

.button {
  width: 300px;
}
</style>
