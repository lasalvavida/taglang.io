<template>
  <div>
    <form action="dummy" class="dropzone" ref="dropForm">
      <button class="cancel pure-button" v-show="result !== undefined" v-on:click="removeAllFiles()" type="button">
        <icon name="close"/>
      </button>
    </form>
    <div ref="dictDefaultMessage" v-show="false">
      <div class="default-message">
        <icon name="cloud-upload"/>
        <br/>
        Drop files here
      </div>
    </div>
    <div ref="previewTemplate" v-show="false">
      <div class="dz-preview dz-file-preview">
        <div class="dz-details">
          <div class="dz-filename"><span data-dz-name></span></div>
          <div class="dz-size" data-dz-size></div>
          <img data-dz-thumbnail />
        </div>
        <div class="dz-progress">
          <span class="dz-upload" data-dz-uploadprogress>
          </span>
        </div>
        <div class="dz-success-mark">
        </div>
        <div class="dz-error-mark">
          <span></span>
        </div>
        <div class="dz-error-message">
          <span data-dz-errormessage></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Dropzone from 'dropzone'
  import Icon from 'vue-awesome/components/Icon.vue'
  import 'vue-awesome/icons/cloud-upload'
  import 'vue-awesome/icons/close'

  export default {
    data () {
      return {
        dropzone: undefined,
        result: undefined
      }
    },
    components: {
      Icon
    },
    methods: {
      removeAllFiles: function () {
        this.dropzone.removeAllFiles()
        this.result = undefined
      }
    },
    mounted () {
      var that = this
      this.dropzone = new Dropzone(this.$refs.dropForm, {
        accept: function (file, done) {
          var fr = new FileReader()
          fr.onload = function () {
            that.result = fr.result
            that.imageLoaded(fr.result)
            done()
          }
          fr.readAsDataURL(file)
        },
        acceptedFiles: 'image/*',
        autoProcessQueue: false,
        maxFiles: 1,
        maxfilesexceeded: function (file) {
          this.removeAllFiles()
          this.addFile(file)
        },
        paramName: 'file',
        dictDefaultMessage: that.$refs.dictDefaultMessage.innerHTML,
        previewTemplate: that.$refs.previewTemplate.innerHTML
      })
    },
    props: ['imageLoaded']
  }
</script>

<style scoped>
.default-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.dropzone {
  border: 2px solid #E5E5E5;
  border-radius: 15px;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.2px;
  background-color: #222222;
  color: white;
  transition: background-color .2s linear;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.dropzone:hover {
  background-color: #444444;
}

.dz-preview {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-weight: bold;
}

.cancel {
  margin: 20px;
  float: right;
}
</style>
