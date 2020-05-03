<template>
  <div>
    <div id="nav">
      <a href="">
        <img src="../../static/image/login.png" alt="logo ">
      </a>
    </div>
    <div id="container">
      <div id="side"></div>
      <div id="login">
        <div style="text-align:center;margin:10px 0;">
          <el-input v-model="form.username" placeholder="请输入学号" style="width:50%;margin:10px 0"></el-input>
          <el-input placeholder="请输入密码" v-model="form.password" show-password
                    style="width:50%;margin:10px 0 "></el-input>
          <br>

          <el-button type="primary" @click="loginSystem">登录</el-button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>

  import {teacherMenu, studentMenu} from "../router/RouterAvailable";

  import {mapActions, mapMutations} from 'vuex'

  export default {
    name: "login",
    data() {
      return {
        form: {
          username: "",
          password: "",
        }
      }
    },
    methods: {


      loginSystem() {
        if (localStorage.token1) {
          if (localStorage.identity === "teacher") {
            this.$router.addRoutes(teacherMenu)
            this.$router.options.routes.push.apply(this.$router.options.routes,
              teacherMenu)
          } else if (localStorage.identity === "student") {
            this.$router.addRoutes(studentMenu)
            this.$router.options.routes.push.apply(this.$router.options.routes,
              studentMenu)
          }
          this.$emit("loginSuccessful")
          this.getUserInfo()
          let payload = {
            targetKey: "identity",
            targetVal: localStorage.identity
          }
          this.updateCurrentStatus(payload);
          this.$router.push({path: location.pathname})
          return
        }


        let self = this
        this.axios({
          method: "post",
          url: "/login",
          params: {
            username: this.form.username,
            password: this.form.password,
          }
        })
          .then((response) => {
            if (response.data instanceof Object) {
              localStorage.token = self.form.username//先把用户账号存起来
              localStorage.token1 = response.data.token//先把用户账号存起来
              localStorage.identity = response.data.identity//先把用户账号存起来
              if (response.data.identity === "teacher") {
                this.$router.addRoutes(teacherMenu)
                this.$router.options.routes.push.apply(this.$router.options.routes,
                  teacherMenu)
              } else if (response.data.identity === "student") {
                this.$router.addRoutes(studentMenu)
                this.$router.options.routes.push.apply(this.$router.options.routes,
                  studentMenu)
              }
              this.$emit("loginSuccessful")
              let payload = {
                targetKey: "identity",
                targetVal: response.data.identity
              }
              this.updateCurrentStatus(payload);
              this.getUserInfo();

              this.$router.push({path: "/user/info/"})
            }else {
              this.util.returnErr.call(this,response.data)
            }
          })
          .catch(err => {
            console.log("有错误")
            console.log(err)
          })
      },
      ...mapMutations(["updateCurrentStatus"]),
      ...mapActions(["getUserInfo"])
    },
    mounted() {
      if (localStorage.token1) {
        this.loginSystem()
      }
    }
  }
</script>

<style scoped>

  #nav {
    width: 100%;
    height: 70px;
    padding: 10px 100px;
    /*background-color: #bce8f1;*/
    box-sizing: border-box;
    /*border: 1px solid black;*/
  }

  #container {
    /*border: 1px solid black;*/
    background-image: url("../../static/image/bg.jpg");
    display: flex;
    flex-direction: row;
  }

  #side {
    /*border: 1px solid black;*/
    width: 50px;
    height: 600px;
    margin-left: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
    /*background-image: url("../../static/image/welcome.jpg");*/
    background-repeat: no-repeat;
    background-size: cover;
  }

  #login {
    /*border: 2px solid black;*/
    flex: 1;
    margin: auto;
    padding: 30px;
  }
</style>
