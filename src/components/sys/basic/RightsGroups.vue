<template>
    <div>
        <div>
            <el-input placeholder="请输入英文名称" v-model="role.name" style="width: 300px;margin-right: 8px;">
                <template slot="prepend">ROLE_</template>
            </el-input>
            <el-input v-model="role.nameZh" placeholder="请输入中文名称" style="width: 300px;margin-right: 8px;"
                      @keydown.enter.native="addRole"></el-input>
            <el-button type="primary" @click="addRole">添加角色</el-button>
        </div>
        <div style="margin-top: 12px;width: 600px;">
            <el-collapse v-model="activeName" accordion @change="handleChange()">
                <el-collapse-item v-for="(r,index) in roles" :title="r.nameZh" :name="r.id" :key="index">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>可访问的资源</span>
                            <el-button style="float: right; padding: 3px 0;color: #ff0000" icon="el-icon-delete"
                                       size="mini" @click="delRole(r.id,r.nameZh)"/>
                            <el-tree
                                    ref="tree"
                                    :data="menus"
                                    show-checkbox
                                    node-key="id"
                                    :default-checked-keys="defaultChecked"
                                    :props="defaultProps"
                                    :key="index">
                            </el-tree>
                        </div>
                        <div class="card-buttom">
                            <el-button size="mini" type="info" @click="activeName=''">取消</el-button>
                            <el-button size="mini" type="success" @click="doUpdate(r.id,index)">确定</el-button>
                        </div>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
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
                },
                activeName: '-1',
                roles: [],
                menus: [],
                defaultProps: {
                    label: 'name',
                    children: 'children'
                },
                defaultChecked: []
            }
        },
        methods: {
            initRoles() {
                this.getRequest('/system/basic/auth/getAllRoles/').then(resp => {
                    if (resp && resp.success) {
                        this.roles = resp.data;
                    }
                })
            },
            // 每次点击 请求所有列表
            handleChange() {
                this.defaultChecked = [];
                if (this.activeName !== '') {
                    this.getRequest('/system/basic/auth/getMenusAndSelectd/' + this.activeName).then(resp => {
                        if (resp && resp.success) {
                            this.menus = resp.data.menus;
                            // this.defaultChecked.push(resp.data.mids);
                            if (resp.data.mids !== null) {
                                resp.data.mids.split(",").forEach(e => this.defaultChecked.push(e));
                            }
                        }
                    })
                }
            },
            // 修改
            doUpdate(rid, index) {
                let checkedKeys = '';
                this.$refs.tree[index].getCheckedKeys(true).forEach(k => {
                    checkedKeys += k + ',';
                });
                if (checkedKeys.length > 1) {
                    checkedKeys = checkedKeys.substring(0, checkedKeys.length - 1);
                    this.putRequest("/system/basic/auth/" + rid + "/" + checkedKeys);
                    this.activeName = '-1';
                } else {
                    this.$message.error("未选中任何资源！");
                }
            },
            addRole() {
                this.postRequest("/system/basic/auth/addRole/", this.role).then(() => {
                    this.initRoles();
                });
            },
            delRole(rid, nameZh) {
                this.$confirm('此操作将永久删除【' + nameZh + '】角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/auth/delRole/" + rid).then(() => {
                        this.initRoles();
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        mounted() {
            this.initRoles();
        }

    }
</script>

<style scoped>
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .card-buttom {
        float: right;
        margin: 0 20px 10px;
    }
</style>