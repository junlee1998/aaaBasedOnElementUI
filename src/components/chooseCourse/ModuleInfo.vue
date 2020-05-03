<!--选课时module信息展示-->
<template>
  <div id="cardContainer">
    <template v-for="module in moduleInfo">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span><b>批次:{{module.module_index}}</b></span>
          <el-popconfirm
            confirmButtonText='好的'
            cancelButtonText='不用了'
            icon="el-icon-info"
            iconColor="red"
            :title=confirmTips
            @onConfirm="decideModule(module.id)">
            <el-button :disabled="isDisabled" slot="reference" style="float: right; padding: 3px 0" type="text">
              {{btnText}}
            </el-button>
          </el-popconfirm>
          <!--          <el-button style="float: right; padding: 3px 0" type="text" @click="decideModule">预约</el-button>-->
        </div>
        <div class="text item">
          <p>时间：{{module.date}}</p>
          <p>时间：{{module.time}}</p>
          <p>地点：{{module.location}}</p>
          <p>学生数：{{module.cur_num}}/{{module.stu_num}}</p>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script>
  export default {
    name: "ModuleInfo",
    props: ['projectId', "isChosen"],//projectId:当前操作的project,isChosen:当前操作的project是否已经被预约
    data() {
      return {
        moduleInfo: [],
        confirmTips: "确定预约吗？预约成功后不可更改.",
        btnText: "预约",
        isDisabled: false,//点击预约后,所有的按键都会编程已预约,disabled.因为同一个projects下的module监听的都是这一个值
      }
    },
    methods: {
      /**
       * 获取module列表
       */
      getModules() {
        this.axios({
          url: "/choosing/module/all/",
          method: "post",
          params: {
            userId: localStorage.token,
            projectId: this.projectId
          }
        })
          .then(response => {
            this.moduleInfo = response.data
          })
          .catch(err => {

          })
      },

      /**
       * 已经预约中的课程
       */
      getModuleBeenBooked() {
        this.axios({
          url: "/choosing/module/my/",
          method: "post",
          params: {
            userId: localStorage.token,
            projectId: this.projectId
          }
        })
          .then(response => {
            // this.moduleInfo.push(response.data)
            this.moduleInfo = [response.data]
            this.isDisabled = true
            this.btnText = "预约中"
          })
          .catch(err => {

          })
      },

      /**
       * 最终选择了这个module,发送请求
       * @id: module的id
       */
      decideModule(id) {
        this.axios({
          method: "post",
          url: "/choosing/module/choose/",
          params: {
            userId: localStorage.token,
            moduleId: id
          }
        })
          .then(response => {
            if (response.data === 0) {
              this.util.feedbackInfo(this, 0)
              this.btnText = "已预约"
              this.isDisabled = true
              this.getModuleBeenBooked()
            }
          })
          .catch(err => {

          })
      }
    },

    mounted() {
      if (this.isChosen) {//如果用户已经选了当前project下的module
        this.getModuleBeenBooked()
      } else {
        this.getModules()
      }
    }
  }
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 45%;
    min-width: 250px;
    margin-bottom: 20px;
    background-color: #DEE9F226;
  }

  #cardContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    justify-content: space-around;
  }


  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
    box-shadow: 5px 2px 12px rgba(154, 152, 145, 0.32);
  }
</style>
