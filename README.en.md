# dva-bind

### 简介

dva-bind可以类似vue双向绑定那样快捷修改 dva model里面的state和执行effect函数插件，并且兼容原来dispatch写法。

**初始化 bindObj**

```javascript
// dva model文件 /models/index.js
import DvaBind from 'dva-bind'

const model = {
  namespace: 'namespace',
  state: {
    ...
  },
  reducers: {
    ...
  },
  effects: {
    ...
  }
}
export const bindObj = DvaBind(model) 
export default model


// 在组件内导出绑定model对象
import { bindObj } from './models/index'

// 修改dva model里面state的list属性(简化dispatch写法和省略编写reducers的方法去修改state属性)
bindObj.init(props.dispatch)

```

**使用 bindObj.[key] = 'xxxxx'  赋值方式去修改model里面的state属性**

```javascript

// 修改dva model里面state的list属性(简化dispatch写法和省略编写reducers的方法去修改state属性)
bindObj.Model.list = [1,2,3]

// 等价于dispatch写法  调用reducers的setList方法去修改state的list属性
dispatch({
	type:`${namespace}/setList`,
	payload:{
		list:[1,2,3]
	}
})

```

**使用 bindObj.Ef[key]( )  方式去调用model里面的effects方法**

```javascript
// 调用dva model里面的effects的 addTodo方法
bindObj.Ef.addTodo({a:111,b:2222})

// 等价于dispatch写法 调用effects的addTodo方法
dispatch({
	type:`${namespace}/addTodo`,
	payload:{a:111,b:2222}
})


```



#### 使用教程
安装插件

```
npm i dva-bind --save
```

#### 绑定dva model

在model.js代码如下

```
import DvaBind from 'dva-bind'

const model = {
  namespace: 'todoModel',
  state: {
    list: [],
    data:{}
  },
  reducers: {
    save(state, { payload: { list } }) {
      return { ...state, list }
    }
  },
  effects: {
    *addTodo({ payload: value }, { call, put, select }) {
      //payload就是参入的参数
      console.log(payload)
    },
    *getData({ payload: index }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService, payload.id)
			return data // 返回promise
    },
  }
}

//导出绑定model对象
export const todoModelBind = DvaBind(model) 

export default model

```

#### 在组件里面使用方法

**在class类组件使用**

```react
import React from ‘react’
import { connect } from 'dva'
import { todoModelBind } from '*/model'

class Temp extends React.Component{
  constructor(props){
    todoModelBind.init(props.dispatch)
    // 修改todoModel state的list属性
    todoModelBind.list = [1,2,3,4,5]
    // 也可以调用todoModel 有promise 返回的effects的getData方法
    todoModelBind.Ef.getData({id:111}).then((data)=>{
      console.log(data)
    })
  }
  
  todoFun(){
   // 调用todoModel effects的addTodo方法
   todoModelBind.Ef.addTodo({a:111,b:333})
  }
  render(){
    return (
      <div>
        {
          this.props.todoModel.list.map((val)=>{
        		return <p onClick={()=>this.todoFun()}>{val}</p>
          })
        }
      </div>
    )
  }
}
export default connect(({todoModel})=>({todoModel}))(Temp)

```

**在函数组件使用**

```react
import { useEffect } from 'react'
import { connect } from 'dva'
import { todoModelBind } from '*/model'
const Temp = (props)=>{
  useEffect(()=>{
    todoModelBind.init(props.dispatch)
    // 修改todoModel state的list属性
    todoModelBind.list = [1,2,3,4,5]
  },[])
  const todoFun =()=>{
   // 调用todoModel effects的addTodo方法
   todoModelBind.Ef.addTodo({a:111,b:333})
  }
  return (
    <div>
      {
        props.todoModel.list.map((val)=>{
          return <p onClick={todoFun}>{val}</p>
        })
      }
    </div>
  )
}
export default connect(({todoModel})=>({todoModel}))(Temp)
```

