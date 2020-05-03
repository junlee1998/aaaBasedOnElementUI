<!--保存所有由登录教师发布的Module-->
<template>
  <div>
    <button v-if="isShow"
            style="position:absolute;right:150px;top:5px;z-index: 2000"
            @click="isShow=false"
            title="关闭pdf预览">关闭
    </button>
    <el-table :data="courseInfoList" style="width: 100%" height="80vh" stripe border>
      <el-table-column prop="course.course_name" label="课程名" width="180"
                       show-overflow-tooltip></el-table-column>
      <!--      <el-table-column prop="project.project_name" label="projectName" width="180"-->
      <!--                       show-overflow-tooltip></el-table-column>-->
      <el-table-column prop="course.hours" label="学时"></el-table-column>
      <el-table-column prop="course.credit" label="学分"></el-table-column>
      <el-table-column prop="score" :formatter="formatNull" label="分数"></el-table-column>
      <el-table-column prop="teacher" label="教师" :formatter="formatNull"></el-table-column>
      <el-table-column label="作业">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="myHomework(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="下载资料">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="downloadFiles(scope.row)">下载资料</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
<!--        <template slot="header" slot-scope="scope">-->
<!--          <el-switch v-model="switch1" active-text="仅显示未完成" title="点击切换所有Module（包括已经过期的Module）和未完成的Module"></el-switch>-->
<!--        </template>-->
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDialog(scope.row)">上传报告</el-button>
          <el-button type="text" size="small" @click="previewPdf(scope.row)">预览报告</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="目前的任务为:"
      :visible.sync="taskVisible"
      width="30%">
      <span style="color: red;font-size: 15px">注：组队的任务只需小组内提交一份报告</span>
      <div>
        截至时间:{{taskInfo.deadline}}
      </div>
      <div>
        是否组队:{{taskInfo.isTeamwork===false?"否":"是"}}
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="taskVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <el-upload
        class="upload-demo"
        action="/api/curricula/pdf/post/"
        accept=".pdf"
        ref="upload"
        drag
        :data="otherParams"
        multiple
        :limit="1"
        :headers=headers
        :auto-upload="false"
        :on-success="successHandler">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">上传报告(Pdf),大小限制1M</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=submitUpload>上传</el-button>
      </span>
    </el-dialog>
    <embed id="pdfPlayer" :src=pdfUrl
           type="application/pdf" width="100%" height="100%"
           style="position:absolute;
             left: 0;
             top: 0;
             z-index: 1000"
           v-if="isShow">
  </div>
</template>

<script>

  export default {
    name: "MyTasks",
    data() {
      return {
        courseInfoList: [],//保存module信息
        targetModule: -1,//传递给StuListOfModule的moduleId,为-1时,就不加载组件
        switch1: true,//判断是否加载全部课程信息
        timeForClass: "",//用于传给导出成excel按键的数据
        date: "",//用于传给导出成excel按键的数据
        dialogVisible: false,
        fileList: [],
        otherParams: {},
        isShow: false,
        pdfUrl: "",
        taskInfo: {},
        taskVisible: false,
        headers:{
          token:localStorage.token1
        }
      }
    },
    components: {},
    methods: {

      /**
       * 查询课表
       */
      getTimetable(checkCode) {
        // let url = checkCode === 1 ? "/curricula/future/" : "/curricula/all/"
        this.axios({
          method: "post",
          url: "/curricula/course/",
          // params: {
          //   userId: localStorage.token
          // }
        })
          .then(response => {
            if (typeof response.data === 'object') {
              this.courseInfoList = response.data
            } else {
              this.util.returnErr.call(this, "数据加载失败")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },



      submitUpload() {
        this.$refs.upload.submit();
      },
      previewPdf(row) {
        this.pdfUrl = "/api/curricula/pdf/view?userId=" + localStorage.token + "&courseId=" + row.id
        this.isShow = true
      },
      downloadFiles(row) {
        this.axios({
          method: "get",
          url: "/curricula/template/download",
          params: {
            courseId: row.course_id
          }
        })
          .then(response => {
            console.log(response)
          })
          .catch(err => {
            console.log(err)
          })
      },
      showDialog(row) {
        this.otherParams = {
          courseId: row.id,
          userId: localStorage.token
        }
        this.dialogVisible = true
      },
      successHandler(response, file, fileList) {
        if (response === 0) {
          this.dialogVisible = false;
          this.util.feedbackInfo(this, 0)
        } else {
          this.util.returnErr.call(this, response)

        }
      },

      formatNull() {
        return arguments[2] == null ? "未填写" : arguments[2]
      },
      myHomework(row) {
        this.axios({
          method: "get",
          url: "/curricula/homework/",
          params: {
            courseId: row.course_id
          }
        })
          .then(response => {
            if (response.data==null){
              return this.util.returnErr.call(this,"尚未发布作业")
            }
            if (response.data instanceof Object) {
              this.taskInfo = response.data
              this.taskVisible = true
            }
          })
          .catch(err => {
            console.log(err)
          })

      }
    },
    watch: {
      switch1(val) {
        if (val) {
          this.getTimetable(1)//switch为真时,显示未完成的module
        } else {
          this.getTimetable(2)//switch为真时,显示全部的module
        }
      }
    },
    mounted() {
      this.getTimetable(1)

    }
  }
</script>

<style scoped>

</style>
