<template>
<div>
  <!--  面包屑导航-->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
<!--  卡片视图-->
  <el-card>
    <el-row>
      <el-col>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-col>
    </el-row>
<!--    表格-->
    <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border class="treeTable">
<!--      是否有效-->
<template slot="isok" slot-scope="scope">
  <i class="el-icon-success" v-if="scope.row.cat_delete === false" style="color: lightgreen"></i>
  <i class="el-icon-error" style="color: red" v-else></i>
</template>
<!--     排序 -->
<template slot="order" slot-scope="scope">
  <el-tag size="mini" v-if="scope.row ===0">一级</el-tag>
  <el-tag type="success" size="mini" v-else-if="scope.row ===1">二级</el-tag>
  <el-tag type="warning" size="mini" v-else>三级</el-tag>


</template>
<!--      操作-->
      <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
      </template>
    </tree-table>
<!--    分页-->
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </el-card>
<!--  添加分类的对话框-->
  <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      >
<!--    添加分类的表单-->
    <el-form :model="addCateForm" :rules="addFormRules" ref="addCateFormRef" label-width="100px">
      <el-form-item label="分类名称：" prop="cat_name">
        <el-input v-model="addCateForm.cat_name"></el-input>
      </el-form-item>
      <el-form-item label="父级分类：">

      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
  </span>
  </el-dialog>
</div>
</template>

<script>
import {goodsAddFormRulesMixin} from "../../common/mixin";

export default {
  mixins:[goodsAddFormRulesMixin],
  data(){
    return{
      //查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
//商品分类的数据列表 默认为空
      cateList:[],
      //总数据条数
      total:0,
      //控制添加分类对话框的显示
      addCateDialogVisible:false,
      //添加分类的表单数据对象
      addCateForm:{

        //将要添加的分类名称
        cat_name:'',
        //父级分类的id
        cat_pid:0,
        //分类的等级，默认添加的是1级分类
        cat_level:0

      },
      //父级分类的列表
parentCateList:[],
      //为table指定列的定义
      columns:[{
        label:'分类名称',
        prop:'cat_name'

      },{
        label:'是否有效',
        //表示将当前列定义为模板列
        type:'template',
        //b表示当前这一列使用的模板名称
        template:'isok'

      },
        {
          label:'排序',
          //表示将当前列定义为模板列
          type:'template',
          //b表示当前这一列使用的模板名称
          template:'order'

        },
        {
          label:'操作',
          //表示将当前列定义为模板列
          type:'template',
          //b表示当前这一列使用的模板名称
          template:'opt'

        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods:{
    //监听pagesize改变
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //监听 pagenum的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum =newPage
      this.getCateList()
    },
    //点击按钮，显示添加分类的对话框
    showAddCateDialog(){
      //先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
  async  getParentCateList(){
    const {data:res} =await this.$http.get('categories',{params:{type:2}})
    if(res.meta.status!== 200){
      return this.$message.error('获取父级分类数据失败')
    }
    this.parentCateList =res.data
},

   async getCateList(){
    const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
      if(res.meta.status!== 200){
        return this.$message.error('获取商品分类失败')
      }
      this.cateList =res.data.result
     this.total =res.data.total
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
</style>