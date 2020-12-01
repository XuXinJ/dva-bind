/*
 * @Author: xuxinjiang
 * @Date: 2020-09-03 10:52:27
 * @LastEditors: your name
 * @LastEditTime: 2020-12-01 14:11:00
 * @Description: file content
 */
interface Model {
  state: object,
  effects: any,
  reducers: any,
  namespace: string
}
type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

const DvaBind = <T extends Model>(model: T) => {
  model.reducers.$setState = (state: object, action: { payload: any; }) => {
    return {
      ...state,
      ...action.payload,
    };
  }
  const obj: any = { ...model.state }
  const efKeys: any = Object.keys(model.effects)
  const bindModel: { init: (dispatch: Dispatch) => void, Ef: { [key in keyof T['effects']]: Function } } & T['state'] = {
    init(dispatch: Dispatch) {
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
    Ef: null
  } as any
  return bindModel
}
export default DvaBind
