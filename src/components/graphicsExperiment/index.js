import ex1 from './ex1/WebglDisplayPage.vue'
import ex2 from './ex2/WorldOfPolygon.vue'
import ex3 from './ex3/RacingCar'

export default [
  {
    routeName:'ex1',
    routePath:'ex1',
    component:ex1,
    experimentTitle:'SpinningSphere',
    experimentContent:'Draw a spinning sphere'
  },
  {
    routeName:'ex2',
    routePath:'ex2',
    component:ex2,
    experimentTitle:'多边形世界',
    experimentContent:''
  },
    {
        routeName:'ex3',
        routePath:'ex3',
        component:ex3,
        experimentTitle:'赛车Demo',
        experimentContent:'模拟车辆驾驶'
    },
]
