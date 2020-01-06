<template>
    <div>
        <div>
            <el-input v-model="pos.name" placeholder="请输入要添加的职位名称" style="width: 400px;"
                      prefix-icon="el-icon-plus" @keyup.enter.native="addPos"/>
            <el-button type="primary" style="margin-left: 8px;" @click="addPos" icon="el-icon-plus">添加</el-button>
        </div>
        <div style="margin-top: 10px;">

            <el-table
                    :data="positions"
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
                        label="职位名称"
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
            <el-button type="danger" :disabled="delPositions.length===0" @click="delPosMany">批量删除</el-button>
        </div>

        <!--编辑对话框-->
        <div>
            <el-dialog
                    title="编辑职位"
                    :visible.sync="dialogVisible"
                    width="30%">
                <table style="border-spacing: 0 10px">
                    <tr>
                        <el-tag type="success">职位名称:</el-tag>
                        <el-input v-model="updatePosition.name" placeholder="请输入职位名称"
                                  style="width: 260px;margin-left: 16px;"></el-input>
                    </tr>
                    <tr>
                        <el-tag type="success">是否启用:</el-tag>
                        <el-switch
                                v-model="updatePosition.enabled"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                style="width: 260px;margin-left: 16px;">
                        </el-switch>
                    </tr>
                </table>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updatePos">确 定</el-button>
                </span>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    export default {
        name: "PosMana",
        data() {
            return {
                pos: {
                    name: '',
                },
                positions: [],
                delPositions: [],
                updatePosition: {
                    name: '',
                    enabled: false
                },
                dialogVisible: false
            }
        },
        methods: {
            //初始化职位列表
            initPos() {
                this.getRequest('/system/basic/position/', null).then(resp => {
                    if (resp) {
                        this.positions = resp.data;
                        console.log(resp.data);
                    }
                })
            },
            // 添加职位
            addPos() {
                if (!this.pos.name) {
                    this.$message.error("职位名称不能为空！");
                } else {
                    this.postRequest("/system/basic/position/", this.pos).then(resp => {
                        if (resp) {
                            this.pos.name = '';
                            this.initPos();
                        }
                    })
                }
            },
            // 编辑--回显数据
            handleEdit(index, row) {
                this.dialogVisible = true;
                // 浅克隆
                Object.assign(this.updatePosition, row);
            },
            // 复选选择按钮触发
            handleSelectionChange(val) {
                this.delPositions = val;
            },
            // 删除
            handleDelete(index, row) {
                this.$confirm('此操作将永久删除【' + row.name + '】该职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.deleteRequest("/system/basic/position/" + row.id).then(resp => {
                        if (resp) {
                            // 移除该项 提高效率
                            this.positions.splice(index, 1);
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
            delPosMany() {
                this.$confirm('此操作将永久删除【' + this.delPositions.length + '】位职位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let ids = '?';
                    let idsArr = [];
                    this.delPositions.forEach(item => {
                        ids += 'ids=' + item.id + '&';
                        idsArr.push(item.id);
                    });
                    if (ids.length > 1) {
                        ids.substring(0, ids.length - 1);
                        this.deleteRequest("/system/basic/position/" + ids).then(resp => {
                            if (resp) {
                                let temp = 0;
                                let positions = [];
                                Object.assign(positions, this.positions);
                                // 移除该项 提高效率
                                positions.forEach((item, index) => {
                                    if (idsArr.indexOf(item.id) !== -1) {
                                        this.positions.splice(index - temp, 1);
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
            // 修改职位
            updatePos() {
                if (!this.updatePosition.name) {
                    this.$message.error("职位名称不能为空！");
                } else {
                    this.putRequest("/system/basic/position/"+this.updatePosition.id, this.updatePosition).then(resp => {
                        if (resp) {
                            this.dialogVisible = false;
                            this.updatePosition = {};
                            this.initPos();
                        }
                    })
                }
            }

        },
        mounted() {
            // 初始化职位列表
            this.initPos();
        }

    }
</script>

<style>
</style>