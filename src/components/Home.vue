<template>


    <el-container class="home-container">
<!--      头部-->
      <el-header>
        <div>
          <img src="../assets/user.jpg" alt="" style="width: 100px;height: 100px">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button></el-header>
      <el-container>
<!--        主体-->
        <el-aside width="200px">
<!--侧边栏菜单区-->
          <el-menu
              background-color="#333744"
              text-color="#fff"
              active-text-color="#409eff">
            <!--              一级菜单-->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
              <!--                一级菜单模板-->
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
<!--              二级菜单-->
              <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
<!--                二级菜单模板-->
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>

          </el-menu>


        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>

</template>

<script>

export default{
  data(){
    return{
      //左侧菜单数据
      menulist: []
    }
  },
  created() {
    this.getMenuList()
  },
  methods:{
    logout(){
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取所有菜单
    async getMenuList(){
     const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color:#fff;
  font-size: 20px;
  > div{
    display: flex;
    align-items: center;
    span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
</style>