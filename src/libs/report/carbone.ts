import carbone from 'carbone'
import { IO, FileManager, Template } from './types'
import { BaseService, SERVICE_CARBONE } from './abstract'

import fs from 'fs'
import path from 'path'

// ensureExists directory exists
function ensureExists(path): Promise<string> {
  return new Promise((resolve, reject) => {
    const mask = 0o777
    fs.mkdir(path, mask, function (err) {
      if (err) {
        if (err.code === 'EEXIST') resolve(null)
        // ignore the error if the folder already exists
        else reject(err) // something else went wrong
      } else resolve(null) // successfully created folder
    })
  })
}

// Template management local disk
export class TemplateLocal implements Template {
  baseDir: string
  constructor(baseDir: string = __dirname) {
    this.baseDir = path.resolve(baseDir, 'template')
    ensureExists(this.baseDir)
  }

  Resolve(templateName: string): string {
    const absoluteTemplatePath = path.resolve(this.baseDir, templateName)
    return absoluteTemplatePath
  }

  Save(templateName: string, buff: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const absolutePath = path.resolve(this.baseDir, templateName)
      const fileWriteStream = fs.createWriteStream(absolutePath)
      fileWriteStream.on('finish', () => {
        resolve('file saved successfully')
      })
      fileWriteStream.end(buff)
    })
  }
}

// File management local disk
export class FileManLocal implements FileManager {
  baseDir: string
  constructor(baseDir: string = __dirname) {
    this.baseDir = path.resolve(baseDir, 'output')
    ensureExists(this.baseDir)
  }

  Write(name: string, result): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      try {
        const absoluteFilePath = path.resolve(this.baseDir, name)
        // write the result
        fs.writeFileSync(absoluteFilePath, result)
        resolve(absoluteFilePath)
      } catch (error) {
        reject(new Error('Save failed' + error))
      }
    })
  }

  Resolve(name: string): string {
    const absolutePath = path.resolve(this.baseDir, name)
    return absolutePath
  }
}

//   Carbone.io options interface
export interface Options {
  complement?: Object // {}    data which is represented by the {c.****}
  convertTo?: string // 'pdf' || { 'formatName', 'formatOptions'} Convert the document in the format specified
  extension?: string // 'odt' || undefined Specify the template extension
  variableStr?: string // ''    pre-declared variables,
  lang?: string // overwrite default lang. Ex. "fr"
  translations?: object // overwrite all loaded translations {fr: {}, en: {}, es: {}}
  enum?: Object // { ORDER_STATUS : ['open', 'close', 'sent']
  currencySource?: string //  currency of data, 'EUR'
  currencyTarget?: string // default target currency when the formatter convCurr is used without target
  currencyRates?: object // rates, based on EUR { EUR : 1, USD : 1.14 }
  hardRefresh?: boolean //  (default: false) if true, LibreOffice is used to render and refresh the content of the report at the end of Carbone process
}

//   Carbone.io report service
export class Service extends BaseService {
  io: IO
  options: Options
  constructor(
    io: IO = {
      FileManager: new FileManLocal(__dirname),
      Template: new TemplateLocal(__dirname),
    },
    opt?: Options,
  ) {
    super()
    this.io = io

    this.options = opt || {}
  }

  Generate(
    data: Array<any> | Object,
    templateName: string,
    outName: string,
    opts: Record<string, any> = {},
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const absoluteTemplatePath = this.io.Template.Resolve(templateName)

        //     // Data to inject
        // var data = {
        //   firstname : 'John',
        //   lastname : 'Doe'
        // };

        let convertTo = 'pdf'
        if (/xlsx?$/gm.test(templateName)) convertTo = 'xlsx'

        const newOpts = { ...this.options, convertTo, ...opts }

        // Generate a report using the sample template provided by carbone module
        // This LibreOffice template contains "Hello {d.firstname} {d.lastname} !"
        // Of course, you can create your own templates!
        carbone.render(
          absoluteTemplatePath,
          data,
          newOpts,
          async (err, result) => {
            if (err) {
              reject(err)
            }
            // write the result
            const absoluteFilePath = await this.io.FileManager.Write(
              outName,
              result,
            )
            resolve(absoluteFilePath)
          },
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  Resolve(fileName: string): string {
    return this.io.FileManager.Resolve(fileName)
  }

  SaveTemplate(fileName: string, buff: Buffer): Promise<string> {
    return this.io.Template.Save(fileName, buff)
  }

  TemplateExists(fileName: string): boolean {
    return fs.existsSync(this.io.Template.Resolve(fileName))
  }

  get SERVICE_NAME(): string {
    return SERVICE_CARBONE
  }
}
