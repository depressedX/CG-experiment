<template>
    <div>
        <el-collapse>
            <el-collapse-item name="1">
                <template slot="title">
                    <el-button type="text">操作说明</el-button>
            </template>
                <ul>
                    <li>
                        <h1>如何创建一个多边形</h1>
                        <p><strong>状态</strong>切换到<em>创建新的多边形</em></p>
                        <p><em>多边形颜色状态机</em>选择要创建的多边形的颜色</p>
                        <p>通过在canvas上点击一系列点来创建多边形  点击起始点视为多边形创建完成  点击非起始点视为撤销</p>
                    </li>
                    <li>
                        <h1>如何修改一个多边形</h1>
                        <p><strong>状态</strong>切换到<em>编辑</em></p>
                        <p>右键创建的多边形删除它</p>
                        <p>左键进入编辑状态</p>
                        <p>在编辑状态下拖动多边形来改变位置  拖动定点来改变顶点位置</p>
                        <p><strong>暂时不支持修改颜色</strong></p>
                    </li>
                    <li>
                        <h1>如何存储一个多边形</h1>
                        <p>点击<strong>显示</strong>输出可存储的多边形文本</p>
                        <p>点击<strong>存储</strong>输出可存储的多边形文本为*.txt</p>
                    </li>
                    <li>
                        <h1>如何从文件中恢复</h1>
                        <p>点击<strong>选取文件</strong>来恢复</p>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
        <el-form>
            <el-form-item label="多边形颜色状态机">
                <el-color-picker v-model="colorState" color-format="hex"/>
            </el-form-item>
            <el-form-item label="序列化">
                <el-button type="primary" @click="showSavedPolygon">显示</el-button>
                <el-button type="primary" @click="downloadSavedPolygon">存储</el-button>
            </el-form-item>
            <el-form-item label="反序列化">
                <el-button size="small" type="primary" @click="$refs.fileInput.click()">选取文件</el-button>
                <input type="file" hidden ref="fileInput" @change="fileInputHandler"/>
            </el-form-item>
            <el-form-item label="切换状态">
                <el-radio-group v-model="state">
                    <el-radio-button :label="consts.DISPLAY">展示多边形</el-radio-button>
                    <el-radio-button :label="consts.CREATE">创建新的多边形</el-radio-button>
                    <el-radio-button :label="consts.EDIT">编辑</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div style="text-align: center">
            <canvas ref="targetCanvas"/>
        </div>
    </div>
</template>
<script>
    import WorldOfPolygon from './worldOfPolygon'
    import consts from './consts'

    export default {
        components: {},
        mounted() {
            this.world = new WorldOfPolygon({targetCanvas: this.$refs.targetCanvas})
        },
        data() {
            return {
                world: null,
                colorState: null,
                state: consts.DISPLAY,
                consts

            }
        },
        props: {},
        computed: {},
        watch: {
            colorState(value) {
                let hexValue = value.substring(1)
                this.world.setColor(parseInt(hexValue.slice(0, 2), 16), parseInt(hexValue.slice(2, 4), 16), parseInt(hexValue.slice(4, 6), 16))
            },
            state(value) {
                if (!this.world) return
                switch (value) {
                    case consts.DISPLAY:
                        this.world.display()
                        break;
                    case consts.CREATE:
                        this.world.createNewShape()
                        break;
                    case consts.EDIT:
                        this.world.edit()
                        break;
                }
            }
        },
        methods: {
            downloadSavedPolygon() {
                this.world.downloadSavedPolygon()
            },
            showSavedPolygon() {
                this.$alert(JSON.stringify(this.world.serializeSavedPolygon()), '序列化多边形对象')

            },
            fileInputHandler(e) {
                let file = Array.from(e.target.files)[0]
                if (!file) return
                var reader = new FileReader();
                reader.addEventListener("loadend", () => {
                    try {
                        this.world.externalizeFromJSON(JSON.parse(reader.result))
                    } catch (e) {
                        alert('格式错误!')
                    }
                });
                reader.readAsText(file);
            }
        }
    }
</script>
<style>

</style>
