/*
 * @Author: xuxinjiang
 * @Date: 2020-09-03 10:52:27
 * @LastEditors: your name
 * @LastEditTime: 2020-10-16 11:46:40
 * @Description: file content
 */
interface Model {
  state: object,
  effects: object,
  [k: string]: any
}
const DvaBind = (model: Model): Function => {
  model.reducers.$setState = (state: object, action: { payload: any; }) => {
    return {
      ...state,
      ...action.payload,
    };
  }
  const obj: any = { ...model.state }
  const efKeys: any = Object.keys(model.effects)
  const bindModel: any = {
    init(dispatch: any) {
      if (this.Ef) {
        return
      }
      for (const k in obj) {
        this[k] = null
        Object.defineProperty(this, k, {
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
        effObj[k] = (data: any) => dispatch({
          type: `${model.namespace}/${k}`,
          payload: data
        })
      })
      this.Ef = effObj
    },
    Model: {}
  }
  return bindModel

}
export default DvaBind
