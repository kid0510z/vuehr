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
                    <el-menu router>
                        <el-submenu index="1" v-for="(item,index) in $router.options.routes" v-if="!item.hidden"
                                    :key="index">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="o.path" v-for="(o,indexj) in item.children" :key="indexj">{{o.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
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
        methods: {
            // 头部右侧操作触发
            commandHandle(cmd) {
                if (cmd === 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.postRequest('/logout', null).then(resp => {
                            // 注销成功
                            window.localStorage.removeItem('user');
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
        font-family: initial, serif;
        color: #fff;

    }

    .homeHeader .userface {
        display: flex;
        justify-content: space-between; /*实现水平居中*/
        align-items: center; /*实现垂直居中*/
    }

    .homeHeader .userface img {
        width: 40px;
        height: 40px;
        border-radius: 24px;
        margin-left: 15px;
    }
</style>