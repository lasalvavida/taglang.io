<template>
  <div>
    <div id="header">
      <router-link to="/blog" class="nav link image">
        <img src="./images/home.png"/>
      </router-link>
      </a>
      <a class="sm link image" href="http://github.com/lasalvavida">
        <img src="./images/github.png"/>
      </a>
      <a class="sm link image" href="https://www.linkedin.com/in/robert-taglang-42ba53b8">
        <img src="./images/linkedin.png"/>
      </a>
      <router-link to="/about" class="sm link text">
        About Me
      </router-link>
    </div>
    <div id="content">
      <router-view></router-view>
    </div>
    <Content/>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import 'purecss/build/pure.css'
import 'purecss/build/grids-responsive.css'

import Content from './posts/908d8f07-e15b-490c-ad19-7d14302d9ad4/Content.vue'

export default {
  name: 'app',
  components: {
    Content,
    VueRouter
  }
}
</script>

<style>
#header {
    background-color: #150a03;
    left: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
}

#header:after {
    content: "";
    clear: both;
    display: table;
}

#content {
    margin-top: 40px;
}

.sm {
    float: right;
    right: 2px;
}

.nav {
    float: left;
    left: 2px;
}

.link {
    color: #ffffff;
    cursor: pointer;
    margin: 3px;
    position: relative;
    text-decoration: none;
    top: 2px;
}

.sm.link.text {
  font-size: 22px;
  font-family: "Trebuchet MS", Helvetica, sans-serif;
  margin-top: 5px;
}

.sm.link.text:hover {
  color: gray;
}

.link.image:before {
    background: none;
    border-radius: 10px;
    bottom: 0;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
}

.link.image:hover:before {
    background: rgba(0, 0, 0, 0.5);
}

input[type=range] {
  -webkit-appearance: none;
  margin: 10px 0;
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 16px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #B6B6B6;
  border-radius: 25px;
  border: 1px solid #8A8A8A;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #828282;
  border: 1px solid #8A8A8A;
  height: 24px;
  width: 35px;
  border-radius: 6px;
  background: #DADADA;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -5px;
}
input[type=range]:focus::-webkit-slider-runnable-track {
  background: #B6B6B6;
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 16px;
  cursor: pointer;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000;
  background: #B6B6B6;
  border-radius: 25px;
  border: 1px solid #8A8A8A;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #828282;
  border: 1px solid #8A8A8A;
  height: 24px;
  width: 35px;
  border-radius: 6px;
  background: #DADADA;
  cursor: pointer;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 16px;
  cursor: pointer;
  animate: 0.2s;
  background: transparent;
  border-color: transparent;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
  background: #B6B6B6;
  border: 1px solid #8A8A8A;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-fill-upper {
  background: #B6B6B6;
  border: 1px solid #8A8A8A;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000;
}
input[type=range]::-ms-thumb {
  box-shadow: 1px 1px 1px #828282;
  border: 1px solid #8A8A8A;
  height: 24px;
  width: 35px;
  border-radius: 6px;
  background: #DADADA;
  cursor: pointer;
}
input[type=range]:focus::-ms-fill-lower {
  background: #B6B6B6;
}
input[type=range]:focus::-ms-fill-upper {
  background: #B6B6B6;
}

body {
  font-family: Arial, Helvetica, sans-serif;
}

</style>
