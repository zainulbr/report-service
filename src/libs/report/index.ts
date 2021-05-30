import { Service } from './types'

// Report service
let _services: Array<Service>
let _selectedService: Service

// init report service
export const Init = function (...services: Array<Service>) {
  _services = services
}

export const SelectService = (serviceName: string) => {
  console.log(serviceName)

  _selectedService = _services.find((el) => el.SERVICE_NAME === serviceName)
  if (!_selectedService) throw new Error('service not available')
}

export default function (): Service {
  if (!_selectedService) {
    throw new Error('Please init first')
  }
  return _selectedService
}
