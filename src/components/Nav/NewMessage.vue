<template>
  <div>
    <el-table :data="myMail" stripe height="247" style="width: 100%" size="small">
      <el-table-column prop="text" label="我的消息"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200px">
        <template slot-scope="scope">
          <template v-if="scope.row.type==2">
            <el-button @click="answerInvite(scope.row,'/mail/approve')" type="text" size="small">同意</el-button>
            <el-button @click="answerInvite(scope.row,'/mail/reject')" type="text" size="small">拒绝</el-button>
            <el-button @click="showUserDetail(scope.row)" type="text" size="small">详细信息</el-button>
          </template>

          <template v-if="scope.row.type==1">
            <el-button @click="answerInvite(scope.row,'/mail/approve')" type="text" size="small">同意</el-button>
            <el-button @click="answerInvite(scope.row,'/mail/reject')" type="text" size="small">拒绝</el-button>
            <el-button @click="showTeamDetail(scope.row)" type="text" size="small">详细信息</el-button>
          </template>

          <template v-if="scope.row.type==0">
            <el-button type="text" size="mini" @click="deleteMail(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="60%">
      <div>
        <el-table :data="userInfoDetail" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="200"></el-table-column>
          <el-table-column prop="username" label="学号" width="200"></el-table-column>
          <el-table-column prop="school" label="学院" ></el-table-column>
          <el-table-column prop="qq" label="qq" width="200"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="详细信息" :visible.sync="dialogVisible2" width="60%">
      <div>
        <el-table :data="teamInfoDetail" style="width: 100%">
          <el-table-column prop="leaderDetail.name" label="队长姓名" width="100"></el-table-column>
          <el-table-column prop="leader" label="学号" width="100"></el-table-column>
          <el-table-column prop="leaderDetail.school" label="学院" width="180"></el-table-column>
          <el-table-column prop="leaderDetail.qq" label="qq" width="150"></el-table-column>
          <el-table-column prop="currentNum" label="当前人数" width="150"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import store from "../../store/store"

  export default {
    name: "NewMessage",
    data() {
      return {
        newApplicationStatus: false,
        newInvitation: false,
        myMail: [],
        dialogVisible: false,
        dialogVisible2: false,
        show: false,
        userInfoDetail: [{
          username: "",
          name: "",
          qq: "",
          school: "",
          class_id: ""
        }],
        teamInfoDetail: [],
      }
    },
    store,
    computed: {
      ...mapState(['userInfoData'])
    },
    methods: {
      withdrawApply() {
        let self = this;
        this.newApplicationStatus = false
        this.axios({
          method: "post",
          url: '/withdraw',
          params: {
            userId: this.userInfoData.username,
          }
        })
          .then((response) => {
            // this.updateStatus();
            this.util.feedbackInfo(self, response.data)
          })
          .catch(error => {
            this.$message({
              message: '操作失败!,请稍后再试',
              type: 'error',
              duration: 1500,
              showClose: true
            });
          })
      },
      // answerInvite(event, url) {
      //   this.newInvitation = false
      //   this.axios({
      //     method: "post",
      //     url: url,
      //     params: {
      //       mailId: event.currentTarget.getAttribute("mailId")
      //     }
      //   })
      //     .then((response) => {
      //       let self = this
      //
      //       setTimeout(function () {
      //         self.axios({
      //           method: "get",
      //           url: "/mail",
      //           params: {
      //             userId: localStorage.token//得改
      //           }
      //         })
      //         //如果查询成功,本地缓存用户信息
      //           .then((res) => {
      //             self.myMail = res.data
      //
      //           })
      //           //如果查询失败,提醒用户重新登录
      //           .catch(err => {
      //             self.$message({
      //               message: "信息加载失败,请稍后再试",
      //               type: "error",
      //               duration: 1500,
      //               showClose: true
      //             })
      //           })
      //       }, 100)
      //
      //       this.util.feedbackInfo(self, response.data)
      //     })
      //     .catch(error => {
      //       this.$message({
      //         message: '操作失败!,请稍后再试',
      //         type: 'error',
      //         duration: 1500,
      //         showClose: true
      //       });
      //     })
      // },
      answerInvite(row, url) {
        this.newInvitation = false
        this.axios({
          method: "post",
          url: url,
          params: {
            mailId: row.id
          }
        })
          .then((response) => {
            let self = this

            setTimeout(function () {
              self.axios({
                method: "get",
                url: "/mail",
                params: {
                  userId: localStorage.token//得改
                }
              })
                //如果查询成功,本地缓存用户信息
                .then((res) => {
                  self.myMail = res.data

                })
                //如果查询失败,提醒用户重新登录
                .catch(err => {
                  self.$message({
                    message: "信息加载失败,请稍后再试",
                    type: "error",
                    duration: 1500,
                    showClose: true
                  })
                })
            }, 100)

            this.util.feedbackInfo(self, response.data)
          })
          .catch(error => {
            this.$message({
              message: '操作失败!,请稍后再试',
              type: 'error',
              duration: 1500,
              showClose: true
            });
          })
      },

      showUserDetail(row) {
        // this.newInvitation = false
        this.dialogVisible = true
        this.axios({
          method: "get",
          url: "/mail/userDetail",
          params: {
            sender: row.sender
          }
        })
          .then((response) => {
            for (let key in this.userInfoDetail[0]) {
              this.userInfoDetail[0][key] = response.data[key]
            }
            let self = this;
            setTimeout(function () {
              self.axios({
                method: "get",
                url: "/mail",
                params: {
                  userId: localStorage.token//得改
                }
              })
                //如果查询成功,本地缓存用户信息
                .then((res) => {
                  self.myMail = res.data
                })
                //如果查询失败,提醒用户重新登录
                .catch(err => {
                  self.$message({
                    message: "信息加载失败,请稍后再试",
                    type: "error",
                    duration: 1500,
                    showClose: true
                  })
                })
            }, 100)

          })
          .catch(error => {
            this.$message({
              message: '操作失败!,请稍后再试',
              type: 'error',
              duration: 1500,
              showClose: true
            });
          })
      },
      showTeamDetail(row) {
        this.dialogVisible2 = true
        this.axios({
          method: "get",
          url: "/mail/teamDetail",
          params: {
            teamId: row.teamId
          }
        })
          .then((response) => {
            this.teamInfoDetail = response.data
          })
          .catch(error => {
            this.$message({
              message: '操作失败!,请稍后再试',
              type: 'error',
              duration: 1500,
              showClose: true
            });
          })
      },
      deleteMail(row) {
        this.axios({
          method: "delete",
          url: "/mail/delete",
          params: {
            mailId: row.id
          }
        })
          .then(response => {
            let self = this;
            setTimeout(function () {
              self.axios({
                method: "get",
                url: "/mail",
                params: {
                  userId: localStorage.token//得改
                }
              })
                //如果查询成功,本地缓存用户信息
                .then((res) => {
                  self.myMail = res.data
                })
                //如果查询失败,提醒用户重新登录
                .catch(err => {
                  self.$message({
                    message: "信息加载失败,请稍后再试",
                    type: "error",
                    duration: 1500,
                    showClose: true
                  })
                })
            }, 100)
            this.util.feedbackInfo(self, response.data)

          })
          .catch(err => {
            console.log(err)
          })
      },
      ...mapMutations(["updateStatus", "updateInvitationId"])
    },
    mounted() {
        let self = this
        //初始化时,从localStorage里面获取到当前的未读消息的数量
          self.axios({
            method: "get",
            url: "/mail",
            params: {
              userId: localStorage.token//得改
            }
          })
            //如果查询成功,本地缓存用户信息
            .then((res) => {
              self.myMail = res.data
            })
            //如果查询失败,提醒用户重新登录
            .catch(err => {
              self.$message({
                message: "信息加载失败,请稍后再试",
                type: "error",
                duration: 1500,
                showClose: true
              })
            })
        }
  }
</script>

<style scoped>

</style>
