import useStore from '../store'
import { trpc } from '../util/trpc'

export const userMutateTask = () => {
  const utils = trpc.useContext()
  const reset = useStore((state) => state.resetEditedTask)
  
  const createTaskMutation = trpc.todo.createTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData()
      if (previousTodos) {
        utils.todo.getTasks.setData([res, ...previousTodos)]
      }
      reset()
    }
  })
  const udpateTaskMutation = trpc.todo.udpateTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData()
      if (previousTodos) {
        utils.todo.getTasks.setData(
          previousTodos.map((task) => (task.id === res.id ? res : task))
        )
      }
      reset()
    }
  })
  const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
    onSuccess: (_, variables) => {
      const previousTodos = utils.todo.getTasks.getData()
      if (previousTodos) {
        utils.todo.getTasks.setData(
          previousTodos.filter((task) => task.id !== variables.taskId)
        )
      }
      reset( createTaskMutation, udpateTaskMutation, deleteTaskMutation )
    }
  })
  
  return {}
}
