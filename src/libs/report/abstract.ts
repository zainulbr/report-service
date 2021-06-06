import { Options, Service } from './carbone'
import { IO } from './types'

export abstract class BaseService implements Service {
  io: IO
  options: Options
  abstract Generate(
    data: Object | any[],
    templateName: string,
    outName: string,
  ): Promise<string>

  abstract Resolve(fileName: string): string
  abstract SaveTemplate(fileName: string, buff: Buffer): Promise<string>
  abstract TemplateExists(fileName: string): boolean
  abstract get SERVICE_NAME(): string
}

export const SERVICE_CARBONE = 'carbone-engine'
export const SERVICE_DOCX = 'docx-templates'
