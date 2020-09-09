/*
 * @Author: xuxinjiang
 * @Date: 2020-09-03 10:52:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-09-09 22:48:11
 * @Description: file content
 */
interface Model {
  state:object,
  effects:object,
  [k:string]:any
}
const DvaBind = (model: Model): Function => {
  model.reducers.$setState = (state: object, action: { payload: any; }) => {
    console.log("model.reducers.$setState -> payload", action)
    return {
      ...state,
      ...action.payload,
    };
  }
  const obj: any = { ...model.state }
  const efKeys: any = Object.keys(model.effects)

  return (dispatch: any) => {
    for (let k in obj) {
      Object.defineProperty(obj, k, {
        set: (value) => {
          dispatch({
            type: `${model.namespace}/$setState`,
            payload: {
              [k]: value
            }
          })
          return value
        }
      })
    }
    const effObj: any = {}
    efKeys.forEach((k: any) => {
      effObj[k] = (data: any) => {
        return dispatch({
          type: `${model.namespace}/${k}`,
          payload: data
        })
      }
    })
    obj.Ef = effObj
    return obj
  }

}
export default DvaBind
