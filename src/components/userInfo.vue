<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span><b>{{userInfoData.name}}</b></span>
        <el-popover
          placement="bottom"
          title="请选择操作:"
          width="50"
          trigger="click">
          <div style="text-align: center">
            <el-button type="text" @click="updateProfile">更新资料</el-button>
            <el-button type="text" @click="updatePass">修改密码</el-button>
          </div>
          <el-button slot="reference" style="float: right; padding: 3px 0" type="text">修改密码/QQ</el-button>
        </el-popover>
      </div>
      <div class="text item">
        学号 : {{userInfoData.username}}
      </div>
      <div class="text item">
        学院 : {{userInfoData.school}}
      </div>
      <div class="text item">
        班级 : {{userInfoData.class_id}}
      </div>
      <div class="text item">
        QQ : {{userInfoData.qq}}
      </div>
    </el-card>

    <el-dialog
      title="请填写新的密码"
      :visible.sync="newPass"
      width="30%">
      <el-form ref="form" :model="passwordInfo" label-width="80px">

        <el-form-item label="新密码" >
          <el-col :span=span>
            <el-input v-model="passwordInfo.password" show-password autocomplete="off"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="再次输入" >
          <el-col :span=span>
            <el-input v-model="regExp" autocomplete="off" show-password></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="newPass = false">取 消</el-button>
    <el-button type="primary" @click="commitPasswordChange">确 定</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="请填写信息"
      :visible.sync="addQQ"
      width="30%">
      <el-form ref="form" v-model="QQ" label-width="80px">
        <el-form-item  :label-width="formLabelWidth">
          <el-input disabled  v-model="userInfoData.username" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth">
          <el-input disabled  v-model="userInfoData.name" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-input disabled  v-model="userInfoData.class_id" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth">
          <el-input disabled  v-model="userInfoData.school" placeholder="placeholder"></el-input>
        </el-form-item>
        <el-form-item  :label-width="formLabelWidth">
          <el-input v-model="QQ.qq" placeholder="请输入QQ号，方便组队队友找到你" autofocus></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addQQ = false">取 消</el-button>
        <el-button type="primary" @click="commitQQChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    name: "userInfo",
    data() {
      return {
        info: localStorage.getItem("userInfo"),
        visible: false,
        addQQ:false,
        newPass:false,
        QQ:{
          qq:""
        },
        span:20,
        passwordInfo:{
          password:""
        },
        regExp:"",
        formLabelWidth: "0"
      }
    },
    computed: {
      ...mapState(['userInfoData'])
    },
    mounted() {
    },
    methods: {
      updateProfile() {
        this.addQQ=true
      },
      commitQQChange(){
        this.axios({
          method: "post",
          url: "userInfo/updateQQ",
          params:this.QQ
        })
          .then(response => {
            if (response.data==0){
              this.util.feedbackInfo(this,0)
              this.addQQ=false
              this.getUserInfo()
            }else{
              this.util.returnErr.call("操作失败")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      ...mapActions(["getUserInfo"]),
      updatePass() {
        this.newPass=true
      },
      commitPasswordChange() {
        if (this.passwordInfo.password!=this.regExp){
          return this.util.returnErr.call(this,"两次密码输入不一致")
        }
        this.axios({
          method: "post",
          url: "/password/update/",
          params: this.passwordInfo
        })
          .then(response => {
            if (response.data==0){
              this.util.feedbackInfo(this,0)
              this.newPass=false
            }else{
              this.util.returnErr.call("操作失败")
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
</script>

<style scoped>
  .box-card {
    width: 200px;
  }

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
    width: 300px;
  }
</style>
