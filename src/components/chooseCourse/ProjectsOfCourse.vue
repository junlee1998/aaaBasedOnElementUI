<!--某个course下的所有project-->
<template>
  <div>
    <el-drawer
      :visible.sync="drawer"
      size="50%">
      <div slot="title">
        <h1>请选择实验项目</h1>
        <span class="tips">{{tips}}</span>
      </div>
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <template v-for="(project,key) in projectsList">
          <!--          <el-collapse-item :title=project.project_name :name=project.id style="padding: 10px">-->
          <el-collapse-item :title=project.project_name
                            :name=project.id style="margin-left: 20px">
            <ModuleInfo :project-id="project.id" :is-chosen="project.is_chosen"></ModuleInfo>
          </el-collapse-item>
        </template>
      </el-collapse>
    </el-drawer>
  </div>
</template>

<script>
  import ModuleInfo from "./ModuleInfo";

  export default {
    name: "ProjectsOfCourse",
    data() {
      return {
        drawer: false,//控制drawer显示和隐藏
        courseId: 0,//课程Id.直接从父组件通过$refs更改
        projectsList: [],//保存获取到的project信息
        activeNames: '',//判断当前活动的drawer item
        tips: "*必须从每个实验项目中选择一个,预约成功后不可更换.　 *组队的课程只需要队长选课",//选课提示
      };
    },
    components: {ModuleInfo},
    methods: {

      handleChange(val) {
      },
      /**
       * 获取某个课程下的所有projects
       */
      getProjects() {
        this.axios({
          method: "post",
          url: "choosing/project/",
          params: {
            courseId: this.courseId,
          }
        })
          .then(response => {
            if (typeof response.data === "object") {//返回值为对象时,表示查到的是数据,否则查到的是错误提醒
              this.drawer = true
              this.projectsList = response.data
              console.log(response.data)
            } else {
              this.util.returnErr.call(this, response.data)
            }
          })
          .catch(err => {
          })
      },
    },
  }
</script>

<style>
  .el-drawer.ltr, .el-drawer.rtl, .el-drawer__body {
    overflow: auto;
  }
  .tips {
    font-size: small;
    color: #ef1c1c;
  }
</style>
