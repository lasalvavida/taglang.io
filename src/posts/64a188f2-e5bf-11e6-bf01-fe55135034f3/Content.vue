<template>
  <div class="post-content">
    <select v-model="selectedKernel">
      <option v-for="option in kernelOptions" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
    <input type="number" v-model.number="rows"/>
	  <input type="number" v-model.number="columns"/>
	  <div>
      <div class="mat">
        <div v-for="i in rows">
          <input v-for="j in columns" class="mat-cell" type="number" v-model.number="kernel[(i - 1) * columns + (j - 1)]">
        </input>
        </div>
      </div>
	  </div>
    <canvas ref="originalCanvas" width="250" height="250"></canvas>
    <canvas ref="modifiedCanvas" width="250" height="250"></canvas>
  </div>
</template>

<script>
import {Kernel, Image as VImage, Matrix2d} from 'visionjs'
import drawLoading from '../../lib/drawLoading'

export default {
  computed: {
    kernel: function () {
      var rows = this.rows
      if (rows % 2 !== 1) {
        rows++
      }
      var columns = this.columns
      if (columns % 2 !== 1) {
        columns++
      }
      var kernel = Kernel.fromName(this.selectedKernel, rows, columns)
      var finalKernel = new Matrix2d(this.rows, this.columns)
      finalKernel.apply(function (row, column) {
        this.set(row, column, kernel.get(row, column))
      })
      return finalKernel
    }
  },
  data () {
    return {
      selectedKernel: 'identity',
      kernelOptions: [
        { text: 'Identity', value: 'identity' },
        { text: 'Average', value: 'average' },
        { text: 'Gaussian', value: 'gaussian' },
        { text: 'Sobel X', value: 'sobelX' },
        { text: 'Sobel Y', value: 'sobelY' },
        { text: 'Laplacian', value: 'laplacian' },
        { text: 'Laplacian of Gaussian', value: 'laplacianOfGaussian' }
      ],
      image: undefined,
      rows: 3,
      columns: 3,
      drawing: false,
      dirty: false
    }
  },
  methods: {
    imageLoaded () {
      var originalCanvas = this.$refs.originalCanvas
      var modifiedCanvas = this.$refs.modifiedCanvas

      var originalContext = originalCanvas.getContext('2d')
      var modifiedContext = modifiedCanvas.getContext('2d')

      originalContext.drawImage(this.image, 0, 0, originalCanvas.width, originalCanvas.height)
      modifiedContext.drawImage(this.image, 0, 0, modifiedCanvas.width, modifiedCanvas.height)
    },
    draw () {
      if (this.drawing) {
        this.dirty = true
        return
      }
      this.drawing = true
      var originalCanvas = this.$refs.originalCanvas
      var modifiedCanvas = this.$refs.modifiedCanvas
      var width = originalCanvas.width
      var height = originalCanvas.height

      var originalContext = originalCanvas.getContext('2d')
      var modifiedContext = modifiedCanvas.getContext('2d')

      var imageData = originalContext.getImageData(0, 0, width, height)
      var loading = drawLoading(modifiedContext, width, height, {
        imageData: modifiedContext.getImageData(0, 0, width, height)
      })
      var image = VImage.fromRawData(width, height, imageData.data)
      var options = {
        iterations: 512,
        duration: 10,
        chunk: true
      }
      var modifiedImage = new VImage(width, height)
      var that = this
      image.convolveAsync(this.kernel.clone(), options, modifiedImage)
        .then(function (result) {
          var channels = modifiedImage.channels
          for (var n = 0; n < channels.length; n++) {
            var channel = channels[n]
            var min = channel.min()
            var max = channel.max()
            if (min < 0 || max > 255) {
              channel.apply(function (row, column) {
                this.set(row, column, Math.floor(this.get(row, column) - min) / (max - min) * 255)
              })
            }
          }
          loading.running = false
          modifiedImage.writeRawData(imageData.data)
          modifiedContext.putImageData(imageData, 0, 0)
          that.drawing = false
          if (that.dirty) {
            that.dirty = false
            that.draw()
          }
        })
    }
  },
  mounted () {
    this.image = new Image()
    this.image.addEventListener('load', this.imageLoaded)
    this.image.src = require('../../images/Lenna.png')
  },
  watch: {
    kernel (val) {
      this.draw()
    }
  }
}
</script>

<style scoped>
.mat-cell {
  width : 60px;
  padding : 2px;
  margin : 2px;
  display : inline-block;
  border : 2px solid #ccc;
  border-radius : 5px;
  box-sizing : border-box;
}

.mat {
  position : relative;
  display : inline-block;
  margin : 10px;
}

.mat:before, .mat:after {
  content : "";
  position : absolute;
  top : 0;
  border : 1px solid #000;
  width : 6px;
  height : 100%;
}

.mat:before {
  left : -6px;
  border-right : 0px;
}

.mat:after {
  right : -6px;
  border-left : 0px;
}
</style>
