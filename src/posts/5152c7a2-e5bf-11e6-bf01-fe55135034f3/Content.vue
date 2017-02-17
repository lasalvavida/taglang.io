<template>
  <div class="pure-g">
    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
      <div class="l-box">
        <div>Original</div>
        <div><canvas ref="originalCanvas" width="250" height="250"></canvas></div>
        <div>
          <form class="pure-form">
            <fieldset>
              <label>Size:</label>
              <select v-model="size">
                <option v-for="option in sizeOptions" v-bind:value="option.value">
                  {{ option.text }}
                </option>
              </select>
              <button class="pure-button pure-button-primary" v-on:click="compute">Start</button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
      <div class="l-box">
        <div>Kernel Convolution Average Filter</div>
        <div><canvas ref="kernelCanvas" width="250" height="250"></canvas></div>
        <div v-show="kernelTime !== undefined">Time:&nbsp;<span> {{ kernelTime }} </span></div>
      </div>
    </div>
    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-3">
      <div class="l-box">
        <div>Integral Image Average Filter</div>
        <div><canvas ref="integralCanvas" width="250" height="250"></canvas></div>
        <div v-show="integralTime !== undefined">Time:&nbsp;<span> {{ integralTime }} </span></div>
      </div>
    </div>
    <div class="pure-u-1-1">
      <div class="l-box">
        <canvas ref="barChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import {Image as VImage, Kernel} from 'visionjs'
import drawLoading from '../../lib/drawLoading'

export default {
  data () {
    return {
      barChart: undefined,
      chartData: {
        labels: [],
        datasets: [{
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
          data: [],
          label: 'Kernel Convolution Average Filter'
        }, {
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
          data: [],
          label: 'Integral Image Average Filter'
        }]
      },
      size: 3,
      kernelTime: undefined,
      integralTime: undefined,
      image: undefined,
      loaded: false,
      sizeOptions: [
        { text: '3x3', value: 3 },
        { text: '5x5', value: 5 },
        { text: '7x7', value: 7 },
        { text: '9x9', value: 9 }
      ],
      indexForValue: {}
    }
  },
  methods: {
    compute: function () {
      var originalCanvas = this.$refs.originalCanvas
      var originalContext = originalCanvas.getContext('2d')
      var width = originalCanvas.width
      var height = originalCanvas.height
      var imageData = originalContext.getImageData(0, 0, width, height)
      var originalImage = VImage.fromRawData(width, height, imageData.data)
      var size = this.size
      var halfSize = Math.floor(size / 2)
      var options = {
        chunk: true,
        iterations: 512,
        duration: 10
      }

      var kernelCanvas = this.$refs.kernelCanvas
      var kernelContext = kernelCanvas.getContext('2d')
      var kernelImage = new VImage(width, height)

      var integralCanvas = this.$refs.integralCanvas
      var integralContext = integralCanvas.getContext('2d')
      var integralImage = new VImage(width, height)

      var loading = drawLoading(kernelContext, width, height, {
        fillStyle: 'gray'
      })
      var startTime = Date.now()
      var time
      var kernel = Kernel.average(size, size)
      var that = this
      originalImage.convolveAsync(kernel, options, kernelImage)
        .then(function (result) {
          loading.running = false
          result.writeRawData(imageData.data)
          kernelContext.putImageData(imageData, 0, 0)
          time = Date.now() - startTime
          that.kernelTime = time + ' ms'
          that.chartData.datasets[0].data[that.indexForValue[size]] = time
          that.barChart.update()
        })
        .then(function () {
          loading = drawLoading(integralContext, width, height, {
            fillStyle: 'gray'
          })
          startTime = Date.now()

          var integral = originalImage.integral()
          var args = [
            function (row, column, func, args, options, result) {
              var topRow = row - (halfSize + 1)
              var topColumn = column - (halfSize + 1)
              if (topRow < 0) {
                topRow = 0
              }
              if (topColumn < 0) {
                topColumn = 0
              }
              var bottomRow = row + halfSize
              var bottomColumn = column + halfSize
              if (bottomRow >= this.rows) {
                bottomRow = this.rows - 1
              }
              if (bottomColumn >= this.columns) {
                bottomColumn = this.columns - 1
              }
              var area = (bottomRow - topRow) * (bottomColumn - topColumn)
              result.set(row, column, (this.get(bottomRow, bottomColumn) -
                this.get(bottomRow, topColumn) -
                this.get(topRow, bottomColumn) +
                this.get(topRow, topColumn)) / area)
            },
            undefined,
            options
          ]
          args[1] = args
          startTime = Date.now()
          return integral.applyAsync('applyAsync', args, integralImage)
        })
        .then(function (result) {
          loading.running = false
          result.writeRawData(imageData.data)
          integralContext.putImageData(imageData, 0, 0)
          time = Date.now() - startTime
          that.integralTime = time + ' ms'
          that.chartData.datasets[1].data[that.indexForValue[size]] = time
          that.barChart.update()
        })
    },
    imageLoaded: function () {
      var originalCanvas = this.$refs.originalCanvas
      var width = originalCanvas.width
      var height = originalCanvas.height

      var context = originalCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
      this.loaded = true
    }
  },
  mounted: function () {
    this.image = new Image()
    this.image.addEventListener('load', this.imageLoaded, false)
    this.image.src = require('../../images/Lenna.png')

    var canvas = this.$refs.barChart
    this.barChart = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: this.chartData
    })

    for (var i = 0; i < this.sizeOptions.length; i++) {
      var option = this.sizeOptions[i]
      this.chartData.labels.push(option.text)
      this.chartData.datasets[0].data.push(0)
      this.chartData.datasets[1].data.push(0)
      this.indexForValue[option.value] = i
    }
  }
}
</script>

<style scoped>
div {
  text-align: center;
}
</style>
