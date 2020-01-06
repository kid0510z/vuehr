<template>
    <div>
        <div>
            <el-input v-model="jobLevel.name" placeholder="请输入要添加的职称名称" style="width: 320px;margin-right: 8px;"
                      prefix-icon="el-icon-plus" @keyup.enter.native="addJob"/>
            <el-select v-model="jobLevel.titleLevel" placeholder="请选择职称类型">
                <el-option v-for="(item,index) in titleLevel" :label="item" :value="item" :key="index"/>
            </el-select>
            <el-button type="primary" style="margin-left: 8px;" @click="addJob" icon="el-icon-plus">添加</el-button>
        </div>
        <div style="margin-top: 10px;">

            <el-table
                    :data="jobLevels"
                    style="width: 70%"
                    stripe border
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="id"
                        label="编号"
                        width="80">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="职称名称"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="titleLevel"
                        label="职称级别"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="enabled"
                        label="是否启用"
                        width="120">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.enabled?'success':'danger'" size="mini">
                            {{scope.row.enabled?'启用':'未启用'}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createDate"
                        label="创建时间"
                        width="180">
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!--批删button-->
        <div style="margin-top: 10px;">
            <el-button type="danger" :disabled="delJobLevels.length===0" @click="delJobLevelMany">批量删除</el-button>
        </div>

        <!--编辑对话框-->
        <div>
            <el-dialog
                    title="编辑职称"
                    :visible.sync="dialogVisible"
                    width="30%">
                <table style="border-spacing: 0 10px">
                    <tr>
                        <el-tag type="success">职称名称:</el-tag>
                        <el-input v-model="updateJobLevel.name" placeholder="请输入职称名称" class="dialog-style"/>
                    </tr>
                    <tr>
                        <el-tag type="warning">职称等级:</el-tag>
                        <el-select v-model="updateJobLevel.titleLevel" placeholder="请选择职称类型"
                                   class="dialog-style">
                            <el-option v-for="(item,index) in titleLevel" :label="item" :value="item" :key="index"/>
                        </el-select>
                    </tr>
                    <tr>
                        <el-tag type="danger">是否启用:</el-tag>
                        <el-switch
                                v-model="updateJobLevel.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949" class="dialog-style"/>
                    </tr>
                </table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateJobLevelMethods">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "JobMana",
        data() {
            return {
                jobLevel: {
                    name: '',
                    titlelevel: ''
                },
                titleLevel: [
                    '正高级',
                    '副高级',
                    '初级',
                    '中级',
                    '员级'
                ],
                jobLevels: [],
                delJobLevels: [],
                updateJobLevel: {
                    name: '',
                    titleLevel: '',
                    enabled: false
                },
                dialogVisible: false
            }
        },
        methods: {
            //初始化职称列表
            initJobLevel() {
                this.getRequest('/system/basic/jobLevel/', null).then(resp => {
                    if (resp) {
                        this.jobLevels = resp.data;
                        console.log(resp.data);
                    }
                })
            },
            // 添加职称
            addJob() {
                if (!this.jobLevel.name) {
                    this.$message.error("职称名称不能为空！");
                } else if (!this.jobLevel.titleLevel) {
                    this.$message.error("职称级别不能为空！");
                } else {
                    this.postRequest("/system/basic/jobLevel/", this.jobLevel).then(resp => {
                        if (resp) {
                            this.jobLevel.name = '';
                            this.jobLevel.titleLevel = '';
                            this.initJobLevel();
                        }
                    })
                }
            }, // 编辑--回显数据
            handleEdit(index, row) {
                this.dialogVisible = true;
                // 浅克隆
                Object.assign(this.updateJobLevel, row);
            },
            // 复选选择按钮触发
            handleSelectionChange(val) {
                this.delJobLevels = val;
            },
            // 删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除【' + row.name + '】该职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/jobLevel/" + row.id).then(resp => {
                        if (resp) {
                            // 移除该项 提高效率
                            this.jobLevels.splice(index, 1);
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 批量删除
            delJobLevelMany() {
                this.$confirm('此操作将永久删除【' + this.delJobLevels.length + '】位职称, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    let idsArr = [];
                    this.delJobLevels.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                        idsArr.push(item.id);
                    });
                    if (ids.length > 1) {
                        ids.substring(0, ids.length - 1);
                        this.deleteRequest("/system/basic/jobLevel/" + ids).then(resp => {
                            if (resp) {
                                let temp = 0;
                                let jobLevels = [];
                                Object.assign(jobLevels, this.jobLevels);
                                // 移除该项 提高效率
                                jobLevels.forEach((item, index) => {
                                    if (idsArr.indexOf(item.id) !== -1) {
                                        this.jobLevels.splice(index - temp, 1);
                                        idsArr.splice(0, 1);
                                        temp++;
                                    }
                                });
                            }
                        })
                    } else {
                        this.$message.error("请选择！");
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 修改职称
            updateJobLevelMethods() {
                if (!this.updateJobLevel.name) {
                    this.$message.error("职称名称不能为空！");
                } else {
                    this.putRequest("/system/basic/jobLevel/" + this.updateJobLevel.id, this.updateJobLevel).then(resp => {
                        if (resp) {
                            this.dialogVisible = false;
                            this.updateJobLevel = {
                                name: '',
                                titleLevel: '',
                                enabled: false
                            };
                            this.initJobLevel();
                        }
                    })
                }
            }
        },

        mounted() {
            // 初始化职称列表
            this.initJobLevel();
        }

    }
</script>

<style scoped>
    .dialog-style {
        width: 260px;
        margin-left: 16px;

    }
</style>