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
          <p>

          </p>
          <h2>School</h2>
          <p>
            I am currently a senior at Drexel University
            completing my BS/MS in Computer Engineering.
            I will graduate in June of 2017 with both degrees.
          </p>
          <p>
            My thesis is on the topic of real-time video fusion on FPGA.
            The objective is to design a system that can take multiple, unaligned
            video inputs and use feature detection to align them, and then
            use the sharpest parts of each to generate a single output video feed.
          </p>
          <h2>Work</h2>
          <p>
            I work part time at <a href="https://www.agi.com/">Analytical Graphics Inc.</a>
            as a software developer on <a href="http://cesiumjs.org/">Cesium</a>.
          </p>
          <p>
            My focus is on optimization of 3D assets including work on
            <a href="https://github.com/AnalyticalGraphicsInc/gltf-pipeline">glTF-Pipeline</a>,
            a Node.js optimizer for <a href="https://www.khronos.org/gltf">glTF</a>
            assets as well as contributions to the glTF open standard specification.
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
        </div>
      </div>
      <div class="pure-u-1-3">
        <div class="l-box">
          <img class="pure-img bio-image" src="../images/bio-christmas.jpg"/>
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
