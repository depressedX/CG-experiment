<template>
    <div>
        <el-row>
            <el-col :span="12">
                <h1>RacingCarTitle</h1>
                <canvas ref="targetCanvas"/>
                <vehicle-control-panel
                    @acceleration="accelerate"
                    @startUp="startUp"
                    @clutch="clutch"
                @switch="switchGear"/>
            </el-col>
            <el-col :span="12">
                <el-table
                    :data="paramList"
                    style="width: 100%">
                    <el-table-column
                        prop="property"
                        label="属性"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="value"
                        label="值"
                        width="180">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {init as rendererInit} from './renderer'
    import VehicleControlPanel from './objects/vehicle/VehicleControlPanel'
    import {vehicle} from "./scene";
    import {Vehicle} from "./objects/vehicle/Vehicle";

    export default {
        name: "racing-car",
        components: {
            VehicleControlPanel
        },
        mounted() {
            rendererInit({canvas: this.$refs.targetCanvas})
            setInterval(()=>{
                this.paramList = [
                    {
                        property:'汽车速度',
                        value:vehicle.curVehicleSpeed
                    },
                    {
                        property:'地面固有摩擦',
                        value:vehicle.initialFriction
                    },
                    {
                        property:'车辆加速度',
                        value:vehicle.curVehicleAcceleration
                    },
                    {
                        property:'档位',
                        value:vehicle.curGear
                    },
                    {
                        property:'半径',
                        value:vehicle.gearRadius[vehicle.curGear]
                    }
                ]
            },1000)
        },
        data(){
            return{
                paramList:[]
            }
        },
        methods: {
            accelerate(value) {
                vehicle.accelerate(value)
            },
            clutch(value) {
                vehicle.clutch(value)
            },
            startUp() {
                vehicle.startUp()
            },
            switchGear(value){
                // console.log('switch',value)
                vehicle.switch(value)
            }
        }
    }
</script>

<style scoped>

</style>
