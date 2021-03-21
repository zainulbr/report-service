import { Service } from './types'

// Report service
let _service: Service

// init report service
export const Init = function (service: Service) {
  _service = service
}

export default function (): Service {
  if (!_service) {
    throw new Error('Please init first')
  }
  return _service
}
