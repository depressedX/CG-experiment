import App from '../App.vue'
import Index from '../page/index/Index.vue'
import Demo from '../page/demo/Demo.vue'
import DemoDeault from '../page/demo/DemoDefault.vue'
import About from '../page/about/About.vue'

import experimentInfo from '../components/graphicsExperiment'


const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '',
        name: 'index',
        component: Index
      },
      {
        path: 'about',
        name: 'about',
        component: About
      },
      {
        path: 'demo',

        component: Demo,
        children: experimentInfo.map(experiment => ({
          path: experiment.routePath,
          name: experiment.routeName,
          component: experiment.component
        })).concat({
          // 未匹配到相应实验demo则展示默认页
          path: '',
          component: DemoDeault,
          name: 'demo'
        })
      },


    ]
  }
]

export default routes
