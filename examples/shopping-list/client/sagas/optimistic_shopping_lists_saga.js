import { takeEvery, put } from 'redux-saga/effects'
import { internal } from 'resolve-redux'

import {
  OPTIMISTIC_CREATE_SHOPPING_LIST,
  OPTIMISTIC_REMOVE_SHOPPING_LIST,
  OPTIMISTIC_SYNC
} from '../actions/optimistic_actions'

const { SEND_COMMAND_SUCCESS, QUERY_READMODEL_SUCCESS } = internal.actionTypes

export default function*() {
  yield takeEvery(
    action =>
      action.type === SEND_COMMAND_SUCCESS &&
      action.commandType === 'createShoppingList',
    function*(action) {
      yield put({
        type: OPTIMISTIC_CREATE_SHOPPING_LIST,
        payload: {
          id: action.aggregateId,
          name: action.payload.name
        }
      })
    }
  )

  yield takeEvery(
    action =>
      action.type === SEND_COMMAND_SUCCESS &&
      action.commandType === 'removeShoppingList',
    function*(action) {
      yield put({
        type: OPTIMISTIC_REMOVE_SHOPPING_LIST,
        payload: {
          id: action.aggregateId
        }
      })
    }
  )

  yield takeEvery(
    action => action.type === QUERY_READMODEL_SUCCESS,
    function*(action) {
      yield put({
        type: OPTIMISTIC_SYNC,
        payload: {
          originalLists: action.result.data
        }
      })
    }
  )
}
