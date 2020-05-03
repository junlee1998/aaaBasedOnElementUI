<!--查询可选课程列表-->
<template>
  <div>
    <el-table :data="courseList" border stripe style="width: 100%" height="80vh">
      <el-table-column prop="id" label="课程ID" width="180">
      </el-table-column>
      <el-table-column prop="course_name" label="课程名" >
      </el-table-column>
<!--      <el-table-column prop="credit" label="学分" width="180"></el-table-column>-->
<!--      <el-table-column prop="hours" label="学时" width="180"></el-table-column>-->
      <el-table-column prop="is_team" label="是否组队" :formatter="formatBool" width="180">
      </el-table-column>
<!--      <el-table-column prop="projects" label="projects" width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column prop="stu_num" label="学生数" width="180">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="teachers"
        :formatter="formatTeacherName"
        show-overflow-tooltip
        label="老师"
      >
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="openDrawer(scope.row)" type="text" size="small">申请
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ProjectsOfCourse ref="showProjects"></ProjectsOfCourse>
  </div>
</template>

<script>
  import ProjectsOfCourse from "./ProjectsOfCourse";

  export default {
    data() {
      return {
        courseList: [] //保存所有可选课程的信息
      };
    },
    components: {ProjectsOfCourse},
    methods: {
      //格式化老师姓名显示
      formatTeacherName() {
        //arguments的第三个元素就是本行显示的内容
        return arguments[2].join("　");
        // return 123456;
      },
      formatBool() {
        //arguments的第三个元素就是本行显示的内容
        // console.log(arguments[2])
        return arguments[2]===true?"是":"否";
        // return 123456;
      },
      /**
       * 获取可选课程列表
       */
      getAvailableCourses() {
        this.axios({
          url: "/choosing/course/"
        })
          .then(response => {
            this.courseList = response.data;
          })
          .catch(err => {
          });
      },

      /**
       * 打开 projects drawer
       * @param row
       */
      openDrawer(row) {
        this.$refs.showProjects.courseId=row.id
        this.$refs.showProjects.getProjects()//打开drawer的同时获取project信息
      }
    },
    mounted() {
      this.getAvailableCourses()
    }
  };
</script>

<style></style>template
