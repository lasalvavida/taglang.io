---
title: COLLADA2GLTF with Emscripten + WASM
date: 2019-01-16 0:00.00
---

# {{ $page.frontmatter.title }}

**{{ new Date($page.frontmatter.date).toDateString() }}**

Convert COLLADA models to glTF in your browser.

*Models are not uploaded, the conversion is done using COLLADA2GLTF compiled to JS and WebAssembly.*

<div ref="container">
</div>

<b-form-file v-model="files" placeholder="Choose files..." multiple></b-form-file>

### Downloads

<div v-if="downloads.length > 0">
<b-list-group>
<b-list-group-item v-for="download in downloads" :key="download.name" button v-on:click="downloadFile(download.name, download.data)">

{{ download.name }}
&nbsp;
<v-icon name="download"/>

</b-list-group-item>
</b-list-group>
</div>
<div v-else>

*No converted models yet*

</div>

<BlogPostNav/>

<script>
  import * as Three from 'three';
  import GLTFLoader from 'three-gltf-loader'
  import load_module from './lib/COLLADA2GLTF-bin'
  import OrbitControls from 'three-orbit-controls'
  import Promise from 'bluebird'

  import '../../../node_modules/vue-awesome/icons/download'

  const Controls = OrbitControls(Three)

  export default {
    data () {
      return {
        camera: null,
        controls: null,
        downloads: [],
        files: null,
        lastModel: null,
        loader: new GLTFLoader(),
        mixer: null,
        Module: null,
        scene : null,
      }
    },
    methods: {
      downloadFile (filename, data) {
        const element = document.createElement('a')
        element.setAttribute('href', URL.createObjectURL(new Blob([data], {
          type: 'text/plain'
        })))
        element.setAttribute('download', filename)
        element.style.display = 'none'
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      },
      focusCamera () {
        const boundingSphere = new Three.Sphere()
        new Three.Box3().setFromObject(this.lastModel).getBoundingSphere(boundingSphere);

        const scale = 1.0; // object size / display size
        const objectAngularSize = (this.camera.fov * Math.PI / 180) * scale;
        const distanceToCamera = boundingSphere.radius / Math.tan(objectAngularSize / 2)
        const len = Math.sqrt( Math.pow(distanceToCamera, 2) + Math.pow(distanceToCamera, 2) )

        this.camera.position.set(len, len, len);
        this.controls.update();

        this.camera.lookAt( boundingSphere.center );
        this.controls.target.set( boundingSphere.center.x, boundingSphere.center.y, boundingSphere.center.z );

        this.camera.updateProjectionMatrix();
      }
    },
    mounted () {
      const that = this
      const camera = new Three.PerspectiveCamera( 45, 1.0, 0.25, 1000000 );
      this.camera = camera

      camera.position.set( - 1.8, 0.9, 2.7 );
      const controls = new Controls( camera );
      this.controls = controls

      controls.target.set( 0, - 0.2, - 0.2 );
      controls.update()

      const scene = new Three.Scene()
      this.scene = scene

      const light = new Three.HemisphereLight( 0xbbbbff, 0x444422 );
      light.position.set( 0, 1, 0 );
      scene.add( light );

      const container = this.$refs.container
      const renderer = new Three.WebGLRenderer( { antialias: true } );
      renderer.setClearColor(0x444444, 1)
      renderer.setPixelRatio(1.0);
      renderer.setSize(container.offsetWidth, container.offsetWidth);
      renderer.gammaOutput = true;
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', () => {
        renderer.setSize(container.offsetWidth, container.offsetWidth);
      }, false)

      const clock = new Three.Clock();
      function animate() {
        requestAnimationFrame( animate );
        if (that.mixer !== null) {
          that.mixer.update(clock.getDelta())
        }
        renderer.render( scene, camera );
      }
      animate()

      this.Module = {
        onRuntimeInitialized() {
          console.log('Ready!')
        }
      }
      load_module(this.Module)
    },
    watch: {
      files (files) {
        const that = this
        const assetLoadingPromises = []
        let colladaFile = undefined
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          if (file.name.endsWith('.dae')) {
            colladaFile = file
          }
          assetLoadingPromises.push(new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = function(event) {
              that.Module.fs.createDataFile('/', file.name,
                new Uint8Array(event.target.result), true, true)
              console.log('Created file ' + file.name)
              resolve()
            }
            reader.readAsArrayBuffer(file)
          }))
        }
        Promise.all(assetLoadingPromises).then(() => {
          const name = colladaFile.name
          if (that.lastModel !== null) {
            that.scene.remove(that.lastModel)
          }
          that.Module.callMain(['-i', '/' + name])
          const outputFileName = name.replace('.dae', '.gltf')
          const outputFile = '/output/' + outputFileName
          const contents = that.Module.fs.readFile(outputFile)
          that.downloads.push({
            name: outputFileName,
            data: new Uint8Array(contents)
          })
          that.loader.parse(
            contents, undefined,
            ( gltf ) => {
              // called when the resource is loaded
              console.log('Loaded!')
              that.scene.add(gltf.scene)
              that.lastModel = gltf.scene
              that.focusCamera()
              const mixer = new Three.AnimationMixer(gltf.scene)
              gltf.animations.forEach(clip => {
                mixer.clipAction(clip).play()
              })
              that.mixer = mixer
            },
            ( error ) => {
              // called when loading has errors
              console.error( 'An error happened', error );
            },
          );
        })
      }
    }
  }
</script>