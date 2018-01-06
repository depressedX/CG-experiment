import * as THREE from 'three'
import {Body} from "./Body";
import {Wheel} from "./Wheel";
import {updateFollowUpCamera} from "../../camera";

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
    componentGroup.rotateY(Math.PI)
    componentGroup.position.y += wheelRadius
    componentGroup.position.x = (body.params.frontWidth + body.params.driverRoomWidth + body.params.backWheelRadius)
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
    // mesh的信息仅在内部操控
    this.mesh = new VehicleMesh()

    this._startUpdate()
}

Vehicle.prototype = {
    constructor: Vehicle,

    /****************************************************************/
    /*                       发动机相关量                          */
    /****************************************************************/
    engineIdleOutputF: 100,//发动机怠速时输出力F  可看做是功率的简化
    maxEngineeOutputF: 10000,//发动机最大输出力
    engineGearRadius: 3,//发动机齿轮半径
    engineFrictionFactor: 1.1,//发动机摩擦系数


    curEngineOutputF: 0,//发动机当前输出力F
    curEngineGearSpeed: 0,//发动机齿轮当前速度
    get curEngineGearFriction() {//发动机当前内部的摩擦力
        return this.engineFrictionFactor * this.engineGearRadius * this.curEngineGearSpeed
    },
    get curEngineGearAcceleration() {//发动机当前加速度
        return this.curEngineOutputF - this.curEngineGearFriction - this.curTransmissionF
    },


    /****************************************************************/
    /*                       变速箱相关量                          */
    /****************************************************************/
    maxGear: 5,//变速箱最大档位
    gearRadius: [0, 20, 15, 10, 7, 3],//各档位齿轮半径
    muTape: 0.12,//和发动机连接处的摩擦系数mu
    maxClutchEngagementF: 1000,//离合器最大咬合压力

    //离合器当前咬合率 1完全联动 0完全不联动  影响发动机向变速箱输出的F1的大小
    curClutchEngagementRate: 0,
    curGear: 0,//当前档位
    get curClutchEngagementF() {//离合器当前咬合压力
        return this.curClutchEngagementRate * this.maxClutchEngagementF
    },
    get curBreakoutFriction() {//当前和发动机连接处最大静摩擦力
        //摩擦力公式啊    !!!!!!!
        return this.curClutchEngagementF * this.muTape
    },
    get curTransmissionF() {//当前变速箱动力F
        return Math.min(this.curBreakoutFriction, this.curGroundBreakoutFriction)
    },


    /****************************************************************/
    /*                       车轮相关量                          */
    /****************************************************************/
    // 后轮半径
    get backWheelRadius() {
        return this.mesh.components.backWheel1.params.radius
    },

    // 后轮受到的动力 和变速箱齿轮属于同心圆
    get curBackWheelF() {
        return this.curTransmissionF / this.backWheelRadius * this.gearRadius[this.curGear]
    },


    /****************************************************************/
    /*                       车辆相关量                          */
    /****************************************************************/
    // 车重
    get vehicleWeight() {
        // return this.mesh.components.body.params.width * 100
        return 1500
    },
    initialFriction: 50,//固有摩擦


    curVehicleSpeed: 0,//当前车辆速度
    get curVehicleAcceleration() {//当前车辆加速度
        // 来自变速箱的动力-车辆受到的风阻
        return this.curBackWheelF - this.curVehicleDragF - (this.curVehicleSpeed > 0 ? this.initialFriction : 0)
    },
    // 当前车辆方向 初始时朝向X轴正方向
    curVehicleOrientation: new THREE.Vector3(1, 0, 0),




    /****************************************************************/
    /*                       外部环境相关量                          */
    /****************************************************************/
    muGround: 0.12,//地面的摩擦系数
    windDragFactor: 0.12,//风阻系数

    get curGroundBreakoutFriction() {//地面最大静摩擦力
        return this.muGround * this.vehicleWeight
    },
    get curVehicleDragF() {//当前车辆风阻
        return this.windDragFactor * Math.pow(this.curVehicleSpeed, 2)
    },


    /****************************************************************/
    /*                       内部clock相关量                          */
    /****************************************************************/
    TPS: 20,//每秒更新多少次
    timer: null,


    /****************************************************************/
    /*                       对外暴露的方法                          */
    /****************************************************************/
    // 点火
    startUp() {
        this.curEngineOutputF = this.engineIdleOutputF
    },
    // 熄火
    shutDown() {
        this.curEngineOutputF = 0
    },
    //换挡
    switch(value) {
        value = parseInt(value)
        if (value < -1 || value > this.maxGear) {
            console.log('没有该档位')
            return
        }
        this.curGear = value
    },
    //油门位置
    accelerate(value) {
        if (value < 0 || value > 1) {
            console.log('油门输入不合法')
            return
        }
        this.curEngineOutputF = this.engineIdleOutputF + this.maxEngineeOutputF * value
    },
    // 离合位置
    clutch(value) {
        if (value < 0 || value > 1) {
            console.log('离合输入不合法')
            return
        }
        this.curClutchEngagementRate = value
    },


    /****************************************************************/
    /*                       私有方法                          */
    /****************************************************************/
    /***
     * 检查车辆当前状态是否会出故障
     * @private
     */
    _checkVehicleState() {
    },
    /***
     * 根据车辆各零件的信息更新车辆状态
     * @private
     */
    _updateState() {

        // 刷新间隔  s为单位
        let interval = 1 / this.TPS


        /**
         * 各部件速度Vt = V0 + at
         */
        this.curEngineGearSpeed += this.curEngineGearAcceleration * interval
        this.curEngineGearSpeed = Math.max(0,this.curEngineGearSpeed)
        this.curVehicleSpeed += this.curVehicleAcceleration * interval
        this.curVehicleSpeed = Math.max(0,this.curVehicleSpeed)

        // 车辆位移
        let angleX = this.curVehicleOrientation.angleTo(new THREE.Vector3(1, 0, 0)),
            angleY = this.curVehicleOrientation.angleTo(new THREE.Vector3(0, 1, 0)),
            angleZ = this.curVehicleOrientation.angleTo(new THREE.Vector3(0, 0, 1))
        this.mesh.position.x += this.curVehicleSpeed * interval * Math.cos(angleX)
        this.mesh.position.y += this.curVehicleSpeed * interval * Math.cos(angleY)
        this.mesh.position.z += this.curVehicleSpeed * interval * Math.cos(angleZ)

    },
    /***
     * 开始设置timer更新汽车状态
     * @private
     */
    _startUpdate() {
        if (this.timer) {
            return
        }
        this.timer = setInterval(() => {
            this._updateState()
            this._checkVehicleState()
        }, this.TPS)
    },
    /***
     * 暂停更新
     * @private
     */
    _endUpdate() {
        clearInterval(this.timer)
        this.timer = null
    }
}


/***
 * 简化的汽车
 * @constructor
 */
function SimplifiedVehicle() {
    this.mesh = new VehicleMesh()

    this._startUpdate()
}
// 车辆状态
let states = {
    BRAKING:-1,
    IDLE:0,
    ACCELERATING:1
}
let steerState = {
    LEFT:-1,
    STRAIGHT:0,
    RIGHT:1
}
SimplifiedVehicle.prototype = {
    constructor:SimplifiedVehicle,

    // 车重
    get vehicleWeight() {
        // return this.mesh.components.body.params.width * 100
        return 1500
    },

    //汽车最高速km/h
    maxSpeed:180,
    minSpeed:-70,
    // 发动机输出
    engineOutputF:150,
    //刹车制动力
    brakeDragF:100,
    // 地面以及空气阻力
    groundDragF:50,
    // 后轮最大转向角度
    maxFrontSteelRotationAngle:Math.PI/4,


    BRAKING:states.BRAKING,
    IDLE:states.IDLE,
    ACCELERATING:states.ACCELERATING,

    LEFT:steerState.LEFT,
    STRAIGHT:steerState.STRAIGHT,
    RIGHT:steerState.RIGHT,


    //当前汽车加速度
    get curAcceleration(){
        if (this.curState===states.ACCELERATING&&this.curSpeed>=this.maxSpeed||
            this.curState===states.BRAKING&&this.curSpeed<=this.minSpeed)
            return 0
        let result=0
        if (this.curSpeed!==0) result+=(this.curSpeed>0?-1:1)*this.groundDragF
        if (this.curState===states.ACCELERATING) {
            result+=this.engineOutputF
        }
        else if (this.curState===states.BRAKING){
            result-=this.brakeDragF
        }


        return Math.round(result*100)/100

    },
    //当前速度
    curSpeed:0,
    // 当前转向状态
    curSteerState:steerState.STRAIGHT,
    // 当前车辆状态
    curState:states.IDLE,
    //当前车辆朝向  初始x轴正方向
    curOrientation:new THREE.Vector3(1,0,0),



    /****************************************************************/
    /*                       内部clock相关量                          */
    /****************************************************************/
    TPS: 20,//每秒更新多少次
    timer: null,


    /****************************************************************/
    /*                       对外暴露的方法                          */
    /****************************************************************/
    //前进
    accelerate() {
        this.curState = states.ACCELERATING
    },
    //刹车
    brake(){
        this.curState = states.BRAKING
    },
    // 空状态
    release(){
        this.curState = states.IDLE
    },
    turnLeft(){
        this.curSteerState = steerState.LEFT
        this.mesh.components.frontWheel1.rotation.set(0,this.maxFrontSteelRotationAngle,0)
        this.mesh.components.frontWheel2.rotation.set(0,this.maxFrontSteelRotationAngle,0)
    },
    turnRight(){
        this.curSteerState = steerState.RIGHT
        this.mesh.components.frontWheel1.rotation.set(0,-this.maxFrontSteelRotationAngle,0)
        this.mesh.components.frontWheel2.rotation.set(0,-this.maxFrontSteelRotationAngle,0)
    },
    goStraight(){
        this.curSteerState = steerState.STRAIGHT
        this.mesh.components.frontWheel1.rotation.set(0,0,0)
        this.mesh.components.frontWheel2.rotation.set(0,0,0)
    },


    /****************************************************************/
    /*                       私有方法                          */
    /****************************************************************/
    /***
     * 根据车辆各零件的信息更新车辆状态
     * @private
     */
    _updateState() {

        // 刷新间隔  s为单位
        let interval = 1 / this.TPS


        /**
         * 更新速度
         */
        this.curSpeed += this.curAcceleration*interval
        // 根据前轮朝向更新朝向
        let angle = interval*this.curSpeed/200
        if (this.curSteerState===steerState.LEFT) {
            this.mesh.rotateY(angle)
            this.curOrientation.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle)
        }else if(this.curSteerState===steerState.RIGHT) {
            this.mesh.rotateY(-angle)
            this.curOrientation.applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle)
        }



        // 车辆位移
        let angleX = this.curOrientation.angleTo(new THREE.Vector3(1, 0, 0)),
            angleY = this.curOrientation.angleTo(new THREE.Vector3(0, 1, 0)),
            angleZ = this.curOrientation.angleTo(new THREE.Vector3(0, 0, 1))
        this.mesh.position.x += this.curSpeed * interval * Math.cos(angleX)
        this.mesh.position.y += this.curSpeed * interval * Math.cos(angleY)
        this.mesh.position.z += this.curSpeed * interval * Math.cos(angleZ)

    },
    /***
     * 开始设置timer更新汽车状态
     * @private
     */
    _startUpdate() {
        if (this.timer) {
            return
        }
        this.timer = setInterval(() => {
            this._updateState()
            updateFollowUpCamera(this)
        }, 1000/this.TPS)
    },
    /***
     * 暂停更新
     * @private
     */
    _endUpdate() {
        clearInterval(this.timer)
        this.timer = null
    }
}




export {Vehicle,SimplifiedVehicle}
