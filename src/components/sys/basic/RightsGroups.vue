<template>
    <div>
        <div>
            <el-input placeholder="请输入英文名称" v-model="name" style="width: 300px;margin-right: 8px;">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input v-model="nameZh" placeholder="请输入中文名称" style="width: 300px;margin-right: 8px;"></el-input>
            <el-button type="primary">添加角色</el-button>
        </div>
        <div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "RightsGroups",
        data() {
            return {
                role: {
                    name: '',
                    nameZh: '',
                }

            }
        }

    }
</script>

<style scoped>

</style>