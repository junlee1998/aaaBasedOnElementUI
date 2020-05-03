<!--添加新课程要填写的表单-->
<template>
  <div>
    <el-form :model="form" :rules="rules" ref="form">
      <!--      这里的prop用于验证-->
      <el-form-item label="课程代码" :label-width="formLabelWidth" prop="code">
        <el-col :span=span>
          <el-input v-model="form.code" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <!---->
      <el-form-item label="课程名称" :label-width="formLabelWidth" prop="name">
        <el-col :span=span>
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <!---->
      <!---->
      <el-form-item label="学分" :label-width="formLabelWidth" prop="credit">
        <el-col :span=span>
          <el-input v-model.number="form.credit" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <!---->
      <el-form-item label="总学时" :label-width="formLabelWidth" prop="hours">
        <el-col :span=span>
          <el-input v-model.number="form.hours" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
      <!---->

<!--      <el-form-item label="排课方式" :label-width="formLabelWidth">-->
<!--        <el-col :span=span>-->
<!--          <el-select v-model="form.kind" autocomplete="off">-->
<!--            <el-option-->
<!--              v-for="item in options"-->
<!--              :key="item.value"-->
<!--              :label="item.label"-->
<!--              :value="item.value">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-col>-->
<!--      </el-form-item>-->

      <el-form-item label="是否要组队" :label-width="formLabelWidth" prop="isTeam">
        <el-switch v-model="form.isTeam" autocomplete="off"></el-switch>
      </el-form-item>
      <el-form-item label="成队最大人数" :label-width="formLabelWidth" prop="maxNum">
        <el-col :span=span>
          <el-input v-model.num="form.maxNum" autocomplete="off"></el-input>
        </el-col>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer" style="text-align: right">
      <el-button type="primary" @click="onSubmit">创建课程</el-button>
      <el-button @click="resetForm">重置</el-button>
    </div>

  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'

  export default {
    name: "NewCourseDialog",
    data() {
      var checkCode = (rule, value, callback) => {
        value = value.trim()
        if (!value) {
          return callback(new Error('此项不能为空'));
        }
        if (/\W/.test(value)) {//防止XSS
          return callback(new Error('不可以有符号'));
        }
        return callback()
      };
      return {
        form: {
          name: '',
          code: '',
          credit: '',
          hours: '',
          kind: '',//排课方式
          // teacher: 0,
          isTeam: false,
          maxNum: 1
        },
        // options: [{//排课方式选项
        //   value: 0,
        //   label: '固定排课'
        // }, {
        //   value: 1,
        //   label: '任选排课'
        // }],
        span: 20,
        formLabelWidth: '120px',//label的宽度
        rules: {//验证内容
          name: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}
          ],
          code: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}
          ],
          credit: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {type: 'number', min: 0, message: "此项必须为一个大于0的数字", trigger: 'blur'}
          ],
          hours: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {type: 'number', min: 1, message: "此项必须为一个大于1的数字", trigger: 'blur'}
          ],
          teacher: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {validator: checkCode, trigger: 'blur'}

          ],
          maxNum: [
            {required: true, message: "此项不能为空", trigger: 'blur'},
            {type: 'number', min: 1, max: 7, message: "此项必须为一个介于1到7的数字", trigger: 'blur'}
          ],
        }

      }
    },
    computed: {
      ...mapState(["readyForRenovate"])
    },
    methods: {

      /**
       * 向后端发送数据,创建队伍
       * */
      createCourse() {
        let self = this
        let params = this.form;
        this.axios({
          method: "post",
          url: "/course/new",
          params
        })
          .then(response => {
            //课程创建成功后,改变vuex里的状态以达到更新列表的目的
            let payload = {
              targetKey: "readyForRenovate",
              targetVal: !this.readyForRenovate
            };
            this.updateCurrentStatus(payload);
            this.$emit("submitSuccess")
            this.util.feedbackInfo(this, response.data)
            this.$refs.form.resetFields()//重置表单
          })
          .catch(err => {
            console.log(err)
          })
      },

      /**
       * 表单提交的函数,先要验证表单的输入是否合法
       */
      onSubmit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.createCourse()
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs.form.resetFields()
      },
      ...mapMutations(["updateCurrentStatus"])
    },


  }
</script>

<style scoped>

</style>

