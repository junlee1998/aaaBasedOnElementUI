<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    width="30%">
    <el-upload
      class="upload-demo"
      action="/api/task/template/post/"
      accept=".zip"
      ref="upload"
      drag
      :data="otherParams"
      multiple
      :limit="1"
      :auto-upload="false"
      :file-list="fileList"
      :headers=headers
      :on-success="returnSuccess">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传zip文件,且文件小于20M</div>
    </el-upload>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click=submitUpload>上传</el-button>
      </span>
  </el-dialog>
</template>

<script>
  export default {
    name: "UploadDialog",
    data() {
      return {
        fileList: [],
        dialogVisible: false,
        otherParams: {
          courseId: ""
        },
        headers:{
          token:localStorage.token1
        }
      };
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      returnSuccess(response, file, fileList) {
        if (response === 0) {
          this.dialogVisiblse = false
          this.util.feedbackInfo(this, 0)
        } else {
          this.util.returnErr.call(this, "操作失败")
        }
      }
    },
  }
</script>

<style scoped>

</style>
