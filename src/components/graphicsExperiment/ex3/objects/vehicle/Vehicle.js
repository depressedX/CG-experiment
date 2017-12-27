import * as THREE from 'three'
import {Body} from "./Body";
import {Wheel} from "./Wheel";

function VehicleMesh() {
    THREE.Group.call(this)
    let body = new Body()

    const wheelRadius = body.params.frontWheelRadius * .9
    let frontWheel1 = new Wheel({radius: wheelRadius, width: wheelRadius / 2}),
        frontWheel2 = new Wheel({radius: wheelRadius, width: wheelRadius / 2}),
        backWheel1 = new Wheel({radius: wheelRadius, width: wheelRadius / 2}),
        backWheel2 = new Wheel({radius: wheelRadius, width: wheelRadius / 2})

    frontWheel1.position.set(body.params.frontWidth / 2, 0, body.params.width / 2)
    frontWheel2.position.set(body.params.frontWidth / 2, 0, -body.params.width / 2)
    backWheel1.position.set(body.params.frontWidth + body.params.driverRoomWidth + body.params.backWheelRadius, 0, body.params.width / 2)
    backWheel2.position.set(body.params.frontWidth + body.params.driverRoomWidth + body.params.backWheelRadius, 0, -body.params.width / 2)


    let componentGroup = new THREE.Group()
    componentGroup.add(body, frontWheel1, frontWheel2, backWheel1, backWheel2)
    componentGroup.position.y += wheelRadius
    componentGroup.position.x = -(body.params.frontWidth + body.params.driverRoomWidth + body.params.backWheelRadius)
    this.add(componentGroup)
    this.components = {
        body,
        frontWheel1,
        frontWheel2,
        backWheel1,
        backWheel2
    }


    let axesHelper = new THREE.AxesHelper(200)
    this.add(axesHelper)
}

VehicleMesh.prototype = Object.assign(Object.create(THREE.Group.prototype), {
    constructor: VehicleMesh
})


function Vehicle() {
    this.mesh = new VehicleMesh()


}
Vehicle.prototype = {
    constructor:Vehicle,

    // 发动机相关量
    engineIdleSpeed:1500,//怠速
    maxEngineeSpeed:10000,//发动机最大转速
    engineGearRadius:3,//发动机齿轮半径

    // 变速箱相关量
    maxGear:5,//变速箱最大档位
    gearRadius:[20,15,10,7,3],//各档位齿轮半径


    // 车轮相关量
    // 后轮半径
    get backWheelRadius(){return this.mesh.components.backWheel1.params.radius},
    // 最小可发动的需要的力
    get minMovingForce(){return this.backWheelRadius*this.vehicleWeight},

    // 车辆相关量
    // 车重
    get vehicleWeight(){return this.mesh.components.body.params.width*100}



    // 状态量
    // 离合器咬合率  1完全联动 0完全不联动
    curClutchEngagementRate:1,
    //后轮转速 可认为是车身速度(暂不考虑华东摩擦
    backWheelSpeed:0,
    curEngineSpeed:0,//发动机转速
    curGear:0,//当前档位



    /**
     * 对外暴露的方法
     */
    // 点火
    startUp(){
        this.curEngineSpeed = this.engineIdleSpeed
        this._checkVehicleState()
    },
    // 熄火
    shutDown(){

    },
    //换挡
    switch(value){
        value = parseInt(value)
        if (value<-1||value>this.maxGear){
            console.log('没有该档位')
            return
        }
        this.curGear = value
        this._checkVehicleState()
    },


    /***
     * 私有方法
     */
    _checkVehicleState(){
        console.log('Everything OK')
    }
}

export {Vehicle}
