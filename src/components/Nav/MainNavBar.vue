<template>
  <el-menu
    :default-active="mainActiveIndex"
    class="el-menu-demo"
    mode="horizontal"
    background-color="#2a3f54"
    text-color="#fff"
    active-text-color="#ffd04b"
    router>


    <el-menu-item
      :index=routerInfo.path
      v-for="(routerInfo,index) in mainRouterSet"
      :key="index"
      :activeRoute="index"
      @click="sout($event)">
      {{routerInfo.meta.text}}
    </el-menu-item>

    <!--    <div style="border: 2px solid black">-->
    <el-menu-item
      index='/message'
      @click="sout($event)"
      style="position: fixed;right: 0">

      我的消息
      {{ userInfoData.new_message==0?null:"( "+userInfoData.new_message+" )"}}
    </el-menu-item>

  </el-menu>
</template>

<script>
  import routes from "../../router/routes";
  import {mapState, mapMutations} from "vuex";
  import store from '../../store/store'

  export default {
    name: "MainNavBar",
    store,
    data() {
      return {
        mainRouterSet: routes,
        mainActiveIndex: "",
      }
    },
    computed: {
      ...mapState(["userInfoData"])
    },
    methods: {
      sout(event) {
        this.newActiveRoute(event.$attrs.activeRoute)
      },
      ...mapMutations(["newActiveRoute"])
    },
    created() {
      this.mainActiveIndex = window.location.pathname.match(/\/\w+\//)[0];
    },
    mounted() {
      this.mainRouterSet = this.mainRouterSet.filter(item => {
        return  item.meta.nav === true
      })
      let routerArr = this.util.getPropFormListObj(this.mainRouterSet,"path")
      this.newActiveRoute(routerArr.indexOf(this.mainActiveIndex))
    }
  }
</script>

<style scoped>

  el-menu {
    border-right-width: 0;
  }
</style>
