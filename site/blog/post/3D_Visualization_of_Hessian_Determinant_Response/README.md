---
title: 3D Visualization of Hessian Determinant Response
date: 2016-12-01 0:00.00
---

# {{ $page.frontmatter.title }}

**{{ new Date($page.frontmatter.date).toDateString() }}**

This demo uses [three.js](https://threejs.org/) to show the 3D Hessian Determinant Response of the classic Lenna image.

<div>
  <b-container ref="container">
    <div v-show="ready" ref="canvasContainer"/>
    <canvas class="placeholder" v-show="loading" ref="loadingCanvas"/>
    <div class="placeholder enable" v-show="!enabled">
      <button v-on:click="enable()" class="pure-button">Enable</button>
    </div>
  </b-container>
</div>

<canvas class="image-canvas" ref="imageCanvas" width="300" height="300" v-show=false></canvas>

<BlogPostNav/>

<script>
var Three = require('three')
import {Matrix2d, SURF, Image as VImage} from 'visionjs'
import OrbitControls from 'three-orbit-controls'
import drawLoading from '../../../lib/drawLoading'

var Controls = OrbitControls(Three)

export default {
  data () {
    return {
      enabled: false,
      image: undefined,
      loading: false,
      ready: false
    }
  },
  methods: {
    imageLoaded () {
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var context = imageCanvas.getContext('2d')
      context.drawImage(this.image, 0, 0, width, height)
    },
    enable () {
      var that = this
      this.enabled = true
      this.loading = true
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var container = this.$refs.container
      var loadingCanvas = this.$refs.loadingCanvas
      loadingCanvas.width = container.offsetWidth
      loadingCanvas.height = container.offsetHeight
      var loading = drawLoading(loadingCanvas.getContext('2d'), loadingCanvas.width, loadingCanvas.height)

      var context = imageCanvas.getContext('2d')
      var imageData = context.getImageData(0, 0, width, height)
      var originalImage = VImage.fromRawData(width, height, imageData.data)

      var canvasContainer = this.$refs.canvasContainer
      var scene = new Three.Scene()
      var camera = new Three.PerspectiveCamera(75, width / height, 0.1, 1000)
      var renderer = new Three.WebGLRenderer()
      renderer.setClearColor(0xffffff)
      canvasContainer.appendChild(renderer.domElement)
      var light = new Three.PointLight(0xffffff)
      light.position.set(100, 200, 100)
      scene.add(light)
      light = new Three.DirectionalLight(0xffffff, 1.0)
      light.position.set(0, 0, 0)
      scene.add(light)
      light = new Three.AmbientLight(0x404040)
      scene.add(light)

      var r = originalImage.channels[0]
      var g = originalImage.channels[1]
      var b = originalImage.channels[2]
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

      var matrix
      SURF.hessianDeterminantAsync(integral, 0, 0, options)
        .then(function (result) {
          matrix = result
          var min = matrix.min()
          var max = matrix.max()
          matrix.apply(function (row, column) {
            var value = Math.round((matrix.get(row, column) - min) / (max - min) * 255)
            matrix.set(row, column, value)
          })

          var geometry = new Three.Geometry()
          matrix.apply(function (row, column) {
            geometry.vertices.push(new Three.Vector3(row - (matrix.rows / 2), column - (matrix.columns / 2), matrix.get(row, column)))
          })

          for (var row = 0; row < matrix.rows - 1; row++) {
            for (var column = 0; column < matrix.columns - 1; column++) {
              var face = new Three.Face3(row * matrix.columns + column,
                row * matrix.columns + column + 1,
                (row + 1) * matrix.columns + column
              )
              face.vertexColors[0] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row, column) + ',' +
                originalImage.channels[1].get(row, column) + ',' +
                originalImage.channels[2].get(row, column) + ');'
              )
              face.vertexColors[1] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row, column + 1) + ',' +
                originalImage.channels[1].get(row, column + 1) + ',' +
                originalImage.channels[2].get(row, column + 1) + ');'
              )
              face.vertexColors[2] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row + 1, column) + ',' +
                originalImage.channels[1].get(row + 1, column) + ',' +
                originalImage.channels[2].get(row + 1, column) + ');'
              )
              geometry.faces.push(face)
              face = new Three.Face3(row * matrix.columns + column + 1,
                (row + 1) * matrix.columns + column + 1,
                (row + 1) * matrix.columns + column
              )
              face.vertexColors[0] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row, column + 1) + ',' +
                originalImage.channels[1].get(row, column + 1) + ',' +
                originalImage.channels[2].get(row, column + 1) + ');'
              )
              face.vertexColors[1] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row + 1, column + 1) + ',' +
                originalImage.channels[1].get(row + 1, column + 1) + ',' +
                originalImage.channels[2].get(row + 1, column + 1) + ');'
              )
              face.vertexColors[2] = new Three.Color('rgb(' +
                originalImage.channels[0].get(row + 1, column) + ',' +
                originalImage.channels[1].get(row + 1, column) + ',' +
                originalImage.channels[2].get(row + 1, column) + ');'
              )
              geometry.faces.push(face)
            }
          }

          geometry.computeBoundingSphere()
          geometry.computeFaceNormals()
          geometry.computeVertexNormals()

          var material = new Three.MeshPhongMaterial({vertexColors: Three.VertexColors, side: Three.DoubleSide})
          var mesh = new Three.Mesh(geometry, material)
          scene.add(mesh)

          camera.position.set(width / 2, -height / 2, 300)
          camera.up = new Three.Vector3(0, 0, 1)
          camera.lookAt(new Three.Vector3(0, 0, 0))
          var controls = new Controls(camera, renderer.domElement)
          controls.enableDamping = true

          var render = function () {
            var renderWidth = Math.max(container.offsetWidth - 2, width)
            var renderHeight = Math.max((container.offsetWidth - 2) * 9 / 16, height - 6)
            camera.fov = renderWidth / renderHeight
            renderer.setSize(renderWidth, renderHeight)
            renderer.render(scene, camera)
            controls.update()
            requestAnimationFrame(render)
          }
          render()
          loading.running = false
          that.loading = false
          that.ready = true
        })
    }
  },
  mounted: function () {
    this.image = new Image()
    this.image.src = require('../../../images/Lenna.png')
    this.image.addEventListener('load', this.imageLoaded, false)
  }
}
</script>

<style scoped>
.placeholder {
  height: 300px;
}

.enable {
  background-color: #222222;
  transition: background-color .2s linear;
  display: flex;
  align-items: center;
  justify-content: center;
}

.enable:hover {
  background-color: #444444;
}
</style>
