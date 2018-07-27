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
    <div>
      <canvas v-show="false" ref="imageCanvas"></canvas>
    </div>
    <div>
      <canvas v-show="false" ref="canvas3d"></canvas>
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
          Compression: {{ Math.floor(-compressedSize / originalSize * 1e4) / 1e2 + 100 }}%
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
      drawing: false,
      image: undefined,
      loaded: false,
      matrix: undefined,
      originalSize: 0,
      compressedSize: 0,
      paletteSize: 256
    }
  },
  computed: {
    compressedSizeString () {
      let compressedSize = Math.floor(this.compressedSize)
      let sizeString = compressedSize.toString()
      if (sizeString.length <= 3) {
        return sizeString + 'B'
      }
      compressedSize = Math.floor(compressedSize / 1e3)
      sizeString = compressedSize.toString()
      if (sizeString.length <= 3) {
        return sizeString + 'KB'
      }
      compressedSize = Math.floor(compressedSize / 1e3)
      sizeString = compressedSize.toString()
      if (sizeString.length <= 3) {
        return sizeString + 'MB'
      }
      compressedSize = Math.floor(compressedSize / 1e3)
      sizeString = compressedSize.toString()
      if (sizeString.length <= 3) {
        return sizeString + 'GB'
      }
      compressedSize = Math.floor(compressedSize / 1e3)
      return compressedSize.toString() + 'TB'
    }
  },
  methods: {
    compute () {
      const imageCanvas = this.$refs.imageCanvas
      const width = this.image.width
      const height = this.image.height
      const canvas3d = this.$refs.canvas3d
      canvas3d.width = width
      canvas3d.height = height
      const gl = canvas3d.getContext('webgl')
      gl.viewport(0, 0, width, height)
      const data = compress(this.image, imageCanvas, gl, this.paletteSize, 4)
      const palette = condensePalette(data.palette)
      const png = writePNG(data.pixelData, palette, width, height)
      this.compressedSize = png.length
      this.computed = true
      this.download('compressed.png', png)
    },
    download (filename, data) {
      const element = document.createElement('a')
      element.setAttribute('href', 'data:image/png;base64,' + data.toString('base64'))
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
    },
    imageRemoved () {
      this.loaded = false
    },
    imageLoaded () {
      const imageCanvas = this.$refs.imageCanvas
      const width = this.image.width
      const height = this.image.height
      imageCanvas.width = width
      imageCanvas.height = height

      var context = imageCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
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
