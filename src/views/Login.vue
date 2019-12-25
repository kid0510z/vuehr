<template>
    <div>

        <el-form :model="loginForm" :rules="rules" class="loginForm">
            <h3 class="loginTitle">系统登陆</h3>
            <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-checkbox v-model="checked" class="formRemember">Remember Me</el-checkbox>
            <el-form-item>
                <el-button type="primary" style="width: 100%;">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}]
                },
                loginForm: {
                    username: "admin",
                    password: "123"
                },
                checked: true
            }
        },
        methods: {}
    }
</script>

<style scoped>
    .loginForm {
        border-radius: 15px;
        background-clip: padding-box;
        width: 380px;
        margin: 200px auto;
        padding: 30px;
        box-shadow: 0 0 15px #cac6cc;
        border: 1px solid #eee;
    }
    .loginTitle {
        text-align: center;
        margin: 5px auto 20px auto;
    }
    .formRemember {
        margin: 0 0 15px 0;
    }
</style>