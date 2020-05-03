<!--创建project 表单-->
<template>
  <el-dialog title="填写Project详细信息:" :visible.sync="dialogFormVisible" width="30%" v-if="btnFamily===15">
    <el-form :model="modelFormData" ref="form">
      <el-form-item label="课程编号" :label-width="formLabelWidth" hidden>
        <el-col :span=span>
          <el-input v-model="multipleSelection.length===0?'':multipleSelection[0].id" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="课程代码" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="multipleSelection.length===0?'':multipleSelection[0].course_code"
                    autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="课程名称" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="multipleSelection.length===0?'':multipleSelection[0].course_name"
                    autocomplete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Project序号" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="multipleSelection.length===0?'':multipleSelection[0].projects.length+1"
                    v-bind="modelFormData.project_index"
                    readonly></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="Project名称" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="modelFormData.project_name" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="学时" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="modelFormData.hours" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="老师" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-input v-model="modelFormData.teachers" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="排课方式" :label-width="formLabelWidth">
        <el-col :span=span>
          <el-select v-model="modelFormData.kind" autocomplete="off">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
    </el-form>


    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="createProject">创建Project</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'

  export default {
    name: "ProjectInfoDialog",
    data() {
      return {
        dialogFormVisible: false,
        outerVisible: false,
        innerVisible: false,
        span: 20,
        formLabelWidth: '100px',//
        projectIndex: 1,//
        modelFormData: {
          project_name: '',
          is_fixed: 1,
          project_index: 0,
          hours: "",
          kind:"",
          teachers: '',
        },
        formData: [],
        options: [{//排课方式选项
          value: 0,
          label: '固定排课'
        }, {
          value: 1,
          label: '任选排课'
        }],
        // courseId: "",

      }
    },
    computed: {
      ...mapState(["multipleSelection", "btnFamily", "readyForRenovate"])
    },
    methods: {
      /**
       * 创建新的project
       */
      createProject() {
        let tempData = Object.assign({},this.modelFormData);//临时数据,为传列表list做准备
        // for (let key in this.modelFormData) {
        //   tempData[key] = this.modelFormData[key]
        // }
        tempData.project_index = this.multipleSelection[0].projects.length + 1;
        tempData.course_id = this.multipleSelection[0].id;
        this.formData[0] = tempData

        this.axios({
          method: "post",
          url: "/project/add/",
          data: this.formData
        })
          .then(response => {
            if (response.data == 0) {
              let payload = {
                targetKey: "readyForRenovate",
                targetVal: !this.readyForRenovate
              }
              this.updateCurrentStatus(payload)
              this.util.feedbackInfo(this, 0)
              this.dialogFormVisible = false
            } else {
              this.util.returnErr.call(this, response.data)
            }
          })
          .catch(err => {
            console.log(err)
          })
      },
      ...mapMutations(["updateCurrentStatus"])
    }
  }
</script>

<style scoped>

</style>
