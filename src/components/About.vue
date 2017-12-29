<template>
  <div>
    <div class="pure-g">
      <div class="pure-u-2-3">
        <div class="content">
          <h1>About Me</h1>
          <p>
            My name is Rob Taglang. You can find me as
            <a href="https://github.com/lasalvavida">@lasalvavida</a>
            on GitHub.
          </p>
          <h2>Work</h2>
          <p>
            I work at
            <a href="https://privatemachines.com/">Private Machines</a>
            in Brooklyn, NY as a software developer.
          </p>
          <h2>Open Source</h2>
          <p>
            I maintain the 
            <a href="https://github.com/KhronosGroup/COLLADA2GLTF">COLLADA2GLTF</a>
            project for converting 3D COLLADA (DAE) models to <a href="https://www.khronos.org/gltf">glTF</a>.
          </p>
          <h2>School</h2>
          <p>
            I graduated from Drexel University in June 2017,
            BS/MS in Computer Engineering.
          </p>
          <p>
            The thesis and its accompanying work are all open-source. 
            Current drafts and LaTeX sources are available on 
            <a href="https://github.com/lasalvavida/thesis-draft">GitHub</a>.

            And the FPGA IP block sources can be found as the
            <a href="https://github.com/lasalvavida/Zybo-Open-Source-Video-IP-Toolbox">Zybo Open Source Video IP Toolbox</a>.
          </p>
          <h2>Contact</h2>
          <p>
            <a href="mailto:rob@taglang.io"><icon name="envelope"/></a>&nbsp;rob@taglang.io
          </p>
          <p>
            <a href="https://github.com/lasalvavida"><icon name="github-square"/></a>&nbsp;@lasalvavida
          </p>
          <p>
            <a href="static/resume.pdf" download="resume.pdf"><icon name="file-text"/></a>&nbsp;CV
          </p>
        </div>
      </div>
      <div class="pure-u-1-3">
        <div class="l-box">
          <img class="pure-img bio-image" src="../images/bio-thanksgiving.jpg"/>
        </div>
        <div class="l-box">
          <img class="pure-img bio-image" src="../images/bio-star.jpg"/>
        </div>
        <div class="l-box">
          <img class="pure-img bio-image" src='../images/bio-woods.jpg'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from 'vue-awesome/components/Icon.vue'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/github-square'
import 'vue-awesome/icons/file-text'

export default {
  components: {Icon}
}
</script>

<style scope>
.bio-image {
  margin-top: 15px;
}

.content {
  padding: 15px;
}
</style>
