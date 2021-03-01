import { Service } from './types'
import { Service as CarboneSerivce } from './carbone'

// default report service
let _service: Service = new CarboneSerivce()

// init report service
export const Init = (service: Service) => {
  _service = service
}

export default _service
