<template>
  <el-table
    :data="moduleList"
    style="width: 100%"
    border
    stripe>
    <el-table-column prop="project.course.course_name" label="课程名" width="180"
                     show-overflow-tooltip></el-table-column>
    <el-table-column prop="project.project_name" label="projectName" width="180"
                     show-overflow-tooltip></el-table-column>
    <el-table-column prop="project.hours" label="学时"></el-table-column>
    <el-table-column prop="project.course.credit" label="学分"></el-table-column>
    <el-table-column prop="date" label="日期" width="180px"></el-table-column>
    <el-table-column prop="time" label="时间" width="180px"></el-table-column>
    <el-table-column prop="location" label="地点" width="180px"></el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: "myTimetable",
    data() {
      return {
        moduleList: []
      }
    },
    methods: {
      /**
       * 查询课表
       */
      getTimetable() {
        this.axios({
          method: "post",
          url: "/curricula/all",
        })
          .then(response => {
            if (typeof response.data === 'object') {
              this.moduleList = response.data
            } else {
              this.util.returnErr.call(this, "失败")
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
    },
    mounted() {
      this.getTimetable()
    }
  }
</script>

<style scoped>

</style>
