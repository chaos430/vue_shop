<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图-->
    <el-card>
      <!--  添加角色按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--角色列表区域-->
      <el-table :data="roleList" border stripe>
        <!--    展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1 === 0 ? 'bdtop' : '','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
<!--              渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
<!--              渲染二级和三级权限-->
              <el-col :span="19">
<!--    通过for 循环嵌套渲染二级权限            -->
                <el-row :class="[i2 === 0 ? '': 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>


          </template>



        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" @click="rolesDelete(scope.row.id)" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" @click="showSetRightDialog" type="warning" icon="el-icon-search">分配权限</el-button>
          </template>
        </el-table-column>


      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDialogClosed">
      <el-form :model="addRolesForm" :rules="addFormRules" ref="addRolesForm" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="30%">
      <el-form :model="editRolesForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>
<!--    分配权限的对话框-->
    <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%">
<!--      树形控件-->
      <el-tree :data="rightsList" :props="treeProps"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {rolesFormRulesMixin} from '/src/common/mixin'

export default {

  data() {
    return {
      //所有角色列表数据
      roleList: [],
      //所有权限的数据
      rightsList:[],
      //树型控件的属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
      },
      addDialogVisible: false,
      // 编辑对话框的显示和隐藏
      editDialogVisible: false,
      // 分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesForm:{

      }
    }
  },
  mixins: [rolesFormRulesMixin],
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    addRolesUser() {
      this.$refs.addRolesForm.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('roles', this.addRolesForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败!')
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 清空添加角色对话框
    addDialogClosed() {
      this.$refs.addRolesForm.resetFields()
    },
    //展示分配权限对话框
   async showSetRightDialog(){
      //获取所有权限的数据
      this.setRightDialogVisible =true
    const {data:res} = await this.$http.get('rights/tree')
if(res.meta.status !== 200){
  return this.$message.error('获取权限数据失败')

}
//获取到的权限数据保存到data中
this.rightsList = res.data
     console.log(this.rightsList);
   },
    //根据id删除对应的权限
   async removeRightById(role,rightId){
      //弹框提示用户是否要删除
     const confirmResult =  await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
       confirmButtonText: '确定',
       cancelButtonText: '取消',
       type: 'warning'
     }).catch(err=> err)

     if(confirmResult !== 'confirm'){
       return this.$message.info('取消了删除')
     }
   const {data:res} = await this.$http.delete(`roles/:${role.id}/rights/${rightId}`)
     if(res.meta.status !== 200){
       return this.$message.error('删除权限失败')
     }
     role.children = res.data
    },
    async rolesDelete(id){
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm'){
        return this.$message.info('已取消该删除操作')
      }
      this.$http.delete('roles/' +id).then(res =>{
        const {data:response} = res
        if(response.meta.status !==200){
          return this.$message.error('该用户删除失败')
        }
        this.$message.success('该用户已经删除')
        this.getRolesList()
      })
    },
    //修改用户信息
    async showEditDialog(id){
      const {data:res} = await this.$http.get('roles/' + id)
      if(res.meta.status !== 200){
        return this.$message.error('查询角色失败')
      }
      this.editRolesForm = res.data
      this.editDialogVisible = true
    },
    editFormInfo(){
      this.$refs.editFormRef.validate(valid =>{
        if(valid){
          this.$http.put('roles/' +this.editRolesForm.roleId,{
            roleName:this.editRolesForm.roleName,
            roleDesc:this.editRolesForm.roleDesc
          }).then(res=>{
            if(res.data.meta.status !== 200){
              return this.$message.error('修改角色失败')
            }
            this.$message.success('修改角色成功')
            this.getRolesList()
          })
          this.editDialogVisible = false
        }
      })


    }
  }

  }
</script>

<style lang="less" scoped>
.el-tag{
  margin:7px;
}
.bdtop{
  border-top: 1px solid #eee;
}
.bdbottom{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>