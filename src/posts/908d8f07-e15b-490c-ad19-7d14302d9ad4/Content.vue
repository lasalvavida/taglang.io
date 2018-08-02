<template>
  <div class="post-content">
    <p>
      Compress images in your browser using WebGL GPU accelerated k-means clustering for optimized palette generation.
    </p>
    <p>
      No upload necessary and no file size restrictions.
    </p>
    <div>
      <dropzone class="image-drop" v-bind:imageLoaded="imageDropped" v-bind:imageRemoved="imageRemoved"></dropzone>
    </div> 
    <div v-show="false">
      <canvas ref="imageCanvas"></canvas>
      <canvas ref="canvas3d"></canvas>
    </div>
    <div>
      <div v-if="loaded">
        <div>
          Slide to adjust palette size (quality): {{ paletteSize }}
        </div>
        <div>
          <input class="slider" type="range" min="2" max="256" v-model="paletteSize"/>
        </div>
      </div>
      <button class="button pure-button pure-button-primary" v-on:click="compute()" :disabled="!loaded">Compress</button>
      <div v-if="compressedSize > 0">
        <div>
          Compressed Size: {{ compressedSizeString }}
        </div>
        <div>
          Compression: {{ Math.floor((1.0 - (compressedSize / originalSize)) * 1e4) / 1e2 }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {compress, condensePalette, writePNG} from '../../../node_modules/webgl-png-compress/index'
import Dropzone from '../../components/Dropzone'

export default {
  components: {
    Dropzone
  },
  data () {
    return {
      computed: false,
      image: undefined,
      loaded: false,
      matrix: undefined,
      originalSize: 0,
      compressedSize: 0,
      paletteSize: 256,
      scaledWidth: 512
    }
  },
  computed: {
    compressedSizeString () {
      let compressedSize = Math.floor(this.compressedSize)
      let sizeString = compressedSize.toString()
      if (sizeString.length <= 3) {
        return sizeString + 'B'
      }
      compressedSize = Math.floor(compressedSize / 1e1) / 1e2
      sizeString = compressedSize.toString()
      if (sizeString.length <= 6) {
        return sizeString + 'KB'
      }
      compressedSize = Math.floor(compressedSize / 1e1) / 1e2
      sizeString = compressedSize.toString()
      if (sizeString.length <= 6) {
        return sizeString + 'MB'
      }
      compressedSize = Math.floor(compressedSize / 1e1) / 1e2
      sizeString = compressedSize.toString()
      if (sizeString.length <= 6) {
        return sizeString + 'GB'
      }
      compressedSize = Math.floor(compressedSize / 1e1) / 1e2
      return compressedSize.toString() + 'TB'
    },
    scaledHeight () {
      return Math.floor(this.image.height * this.scaledWidth / this.image.width)
    }
  },
  methods: {
    compute () {
      const imageCanvas = this.$refs.imageCanvas
      const context = imageCanvas.getContext('2d')
      const canvas3d = this.$refs.canvas3d
      canvas3d.width = this.scaledWidth
      canvas3d.height = this.scaledHeight

      const gl = canvas3d.getContext('webgl')
      gl.viewport(0, 0, this.scaledWidth, this.scaledHeight)

      imageCanvas.width = this.scaledWidth
      imageCanvas.height = this.scaledHeight
      context.drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight)
      const scaledImageData = context.getImageData(0, 0, this.scaledWidth, this.scaledHeight)

      let palette = compress(scaledImageData, this.scaledWidth, this.scaledHeight, gl, this.paletteSize, 4)
      palette = condensePalette(palette)

      imageCanvas.width = this.image.width
      imageCanvas.height = this.image.height

      context.drawImage(this.image, 0, 0)
      const imageData = context.getImageData(0, 0, this.image.width, this.image.height)
      const png = writePNG(imageData, palette, this.image.width, this.image.height)
      this.compressedSize = png.length
      this.computed = true
      this.download('compressed.png', png)
    },
    download (filename, data) {
      const element = document.createElement('a')
      element.setAttribute('href', URL.createObjectURL(new Blob([data], {
        type: 'image/png'
      })))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    imageDropped (image) {
      this.computed = false
      this.loaded = false
      this.image.src = image
      this.originalSize = image.length / 1.37
      this.paletteSize = 256
    },
    imageRemoved () {
      this.loaded = false
      this.compressedSize = 0
    },
    imageLoaded () {
      this.loaded = true
    }
  },
  mounted () {
    this.image = new Image()
    this.image.addEventListener('load', this.imageLoaded, false)
  }
}
</script>

<style scoped>
div {
  padding: 2px;
}

.image-drop {
  width: 300px;
  height: 300px;
  position: relative;
  margin-bottom: 10px;
}

.slider {
  width: 300px;
}

.button {
  width: 300px;
}
</style>
