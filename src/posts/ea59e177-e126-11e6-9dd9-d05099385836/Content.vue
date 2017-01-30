<template>
  <div>
    <div class="content">
      This demo uses <a href="https://threejs.org/">three.js</a> to show the 3D Hessian Determinant Response of the classic Lenna image.
    </div>
    <div class="wrapper">
      <div class="container" ref="container">
        <div class="canvas-container" v-show="ready" ref="canvasContainer"/>
        <div class="loading" v-show="!ready">
          Loading...
        </div>
      </div>
      <canvas class="image-canvas" ref="imageCanvas" width="300" height="300"/>
    </div>
  </div>
</template>

<script>
var Three = require('three')
import {Matrix2d, SURF, Image as VImage} from 'visionjs'
import OrbitControls from 'three-orbit-controls'

var image
var Controls = OrbitControls(Three)

export default {
  data () {
    return {
      ready: false
    }
  },
  methods: {
    imageLoaded: function () {
      var that = this
      var imageCanvas = this.$refs.imageCanvas
      var width = imageCanvas.width
      var height = imageCanvas.height

      var context = imageCanvas.getContext('2d')
      context.drawImage(image, 0, 0, width, height)
      var imageData = context.getImageData(0, 0, width, height)
      var originalImage = VImage.fromRawData(width, height, imageData.data)

      var container = this.$refs.container
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
          that.ready = true
        })
    }
  },
  mounted: function () {
    image = new Image()
    image.src = require('../../images/Lenna.png')
    image.addEventListener('load', this.imageLoaded, false)
  }
}
</script>

<style scoped>
.container {
  float: left;
  position: relative;
  width: calc(100% - 400px);
  left: 0;
  top: 0;
  border-style: solid;
  border-width: 1px;
}

.content {
  padding-bottom: 20px;
}

.loading {
  text-align: center;
  padding-bottom: 53.5%;
  width: 100%;
}

.image-canvas {
  float: left;
  clear: right;
  position: relative;
}

.wrapper {
  content: "";
  clear: both;
  display: table;
  width: 100%;
}
</style>
