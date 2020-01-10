<template>
    <div>
        <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText"
                style="width: 500px;">
        </el-input>

        <el-tree
                class="filter-tree"
                :data="depts"
                :props="defaultProps"
                :filter-node-method="filterNode"
                ref="tree">
        </el-tree>


    </div>
</template>

<script>
    export default {
        name: "DeptMana",
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        mounted() {
            this.initDepts();
        },
        methods: {
            initDepts() {
                this.getRequest("/system/basic/dept/").then(resp => {
                    if (resp && resp.success) {
                        this.depts = resp.data;
                    }
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },

        data() {
            return {
                filterText: '',
                depts: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            };
        }

    }
</script>

<style scoped>
    .filter-tree {
        width: 600px;
        margin-top: 10px;
    }

</style>

<!---->
