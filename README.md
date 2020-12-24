# dva-bind

## 简介

dva-bind 可以类似 vue 双向绑定那样快捷修改 dva model 里面的 state 和执行 effect 函数插件，并且兼容原来 dispatch 写法。

### 初始化 bindObj

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

### 使用 bindObj.key = 'xxxxx' 赋值方式去修改 model 里面的 state 属性

```javascript
// 修改dva model里面state的list属性(简化dispatch写法和省略编写reducers的方法去修改state属性)
bindObj.list = [1, 2, 3];

// 等价于dispatch写法  调用reducers的setList方法去修改state的list属性
dispatch({
  type: `${namespace}/setList`,
  payload: {
    list: [1, 2, 3],
  },
});
```

### 使用 bindObj.Ef.key( ) 方式去调用 model 里面的 effects 方法

```javascript
// 调用dva model里面的effects的 addTodo方法
bindObj.Ef.addTodo({ a: 111, b: 2222 });

// 等价于dispatch写法 调用effects的addTodo方法
dispatch({
  type: `${namespace}/addTodo`,
  payload: { a: 111, b: 2222 },
});
```

## 使用教程

安装插件

```
npm i dva-bind --save
```

### 绑定 dva model

在 model.js 代码如下

```javascript
import DvaBind from 'dva-bind';

const model = {
  namespace: 'todoModel',
  state: {
    list: [],
    data: {},
  },
  reducers: {},
  effects: {
    *addTodo({ payload: value }, { call, put, select }) {
      //payload就是参入的参数
      console.log(payload);
    },
    *getData({ payload: index }, { call, put, select }) {
      // 模拟网络请求
      const data = yield call(todoService, payload.id);
      return data; // 返回promise
    },
  },
};

//导出绑定model对象
export const todoModelBind = DvaBind(model);

// 导出命名空间
export const namespace = model.namespace;

export default model;
```

### 在组件里面使用方法

### 在 class 类组件使用

```javascript
import React from ‘react’
import { connect } from 'dva'
import { todoModelBind } from '*/model'

class Temp extends React.Component{
  constructor(props){
    // 初始化绑定对象
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

### 在函数组件使用

```javascript
import { useEffect } from 'react';
import { connect } from 'dva';
import { todoModelBind } from '*/model';
const Temp = (props) => {
  useEffect(() => {
    // 初始化绑定对象
    todoModelBind.init(props.dispatch);

    // 修改todoModel state的list属性
    todoModelBind.list = [1, 2, 3, 4, 5];
  }, []);
  const todoFun = () => {
    // 调用todoModel effects的addTodo方法
    todoModelBind.Ef.addTodo({ a: 111, b: 333 });
  };
  return (
    <div>
      {props.todoModel.list.map((val) => {
        return <p onClick={todoFun}>{val}</p>;
      })}
    </div>
  );
};
export default connect(({ todoModel }) => ({ todoModel }))(Temp);
```

### 使用 react-redux hook useSelector,useDispatch 代替 connect

```javascript
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { todoModelBind, namespace } from '*/model';
const Temp = (props) => {
  //导出模型状态属性
  const { list, data } = useSelector((state) => state[namespace]);

  // 获取dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    // 初始化绑定对象
    todoModelBind.init(dispatch);

    // 修改todoModel state的list属性
    todoModelBind.list = [1, 2, 3, 4, 5];
  }, []);
  const todoFun = () => {
    // 调用todoModel effects的addTodo方法
    todoModelBind.Ef.addTodo({ a: 111, b: 333 });
  };
  return (
    <div>
      {list.map((val) => {
        return <p onClick={todoFun}>{val}</p>;
      })}
    </div>
  );
};
export default Temp;
```
