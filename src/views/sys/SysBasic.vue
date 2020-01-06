<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="部门管理" name="deptMana">
                <deptMana/>
            </el-tab-pane>
            <el-tab-pane label="职位管理" name="posMana">
                <posMana/>
            </el-tab-pane>
            <el-tab-pane label="职称管理" name="jobMana">
                <jobMana/>
            </el-tab-pane>
            <el-tab-pane label="奖惩规则" name="rewPunRoles">
                <rewPunRoles/>
            </el-tab-pane>
            <el-tab-pane label="权限组" name="rightsGroups">
                <rightsGroups/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import deptMana from "../../components/sys/basic/DeptMana";
    import posMana from "../../components/sys/basic/PosMana";
    import jobMana from "../../components/sys/basic/JobMana";
    import rewPunRoles from "../../components/sys/basic/RewPunRoles";
    import rightsGroups from "../../components/sys/basic/RightsGroups";

    export default {
        name: "Basic",
        data() {
            return {
                activeName: 'posMana'
            }
        },
        components: {
            deptMana,
            posMana,
            jobMana,
            rewPunRoles,
            rightsGroups
        }
    }
</script>

<style scoped>

</style>