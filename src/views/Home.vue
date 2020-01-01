<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">微人事</div>
                <el-dropdown class="userInfo" @command="commandHandle">
                    <span class="el-dropdown-link userface">
                        {{user.name}}
                        <i><img :src="user.userface" alt="用户头像"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
                        <el-dropdown-item command="setting">设置</el-dropdown-item>
                        <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i :class="item.iconCls" class="menuIcon"/>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="o.path" v-for="(o,indexj) in item.children" :key="indexj">{{o.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$router.currentRoute.path !== '/home'">
                        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
                    </el-breadcrumb>

                    <div v-if="$router.currentRoute.path === '/home'" class="homeWelcome">
                        欢迎来到微人事！！！
                    </div>

                    <router-view/>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                user: JSON.parse(window.localStorage.getItem('user'))
            }
        },
        computed: {
            // 定义计算函数，值未发生变动无需执行，提高效率
            routes() {
                // 从store中获取左侧菜单
                return this.$store.state.routes;
            }
        },
        methods: {
            // 头部右侧操作触发
            commandHandle(cmd) {
                if (cmd === 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.getRequest('/logout', null).then(resp => {
                            // 注销成功
                            // 清除 localStorage 的用户信息
                            window.localStorage.removeItem('user');
                            // 清除 store中菜单信息
                            this.$store.commit('initRoutes', []);
                            this.$router.replace('/');
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    })
                }
            },

        },
        created() {

        }
    }
</script>

<style scoped>
    .homeHeader {
        background-color: #4bb8ff;
        display: flex;
        justify-content: space-between; /*实现水平居中*/
        align-items: center; /*实现垂直居中*/
        padding: 0 20px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: STXingkai, serif;
        color: #fff;

    }

    .homeHeader .userface {
        display: flex;
        justify-content: space-between; /*实现水平居中*/
        align-items: center; /*实现垂直居中*/
    }

    /*用户头像*/
    .homeHeader .userface img {
        width: 40px;
        height: 40px;
        border-radius: 24px;
        margin-left: 15px;
    }

    /*左侧菜单图标*/
    .menuIcon {
        color: #1e6cff;
        margin-right: 10px;
    }

    /*home欢迎样式*/
    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: STXingkai,serif;
        color: #409eff;
        padding-top: 50px;
    }
</style>