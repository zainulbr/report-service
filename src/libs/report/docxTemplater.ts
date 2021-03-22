import createReport from 'docx-templates'
import { IO, FileManager, Template, Service as ReportService } from './types'
import fs from 'fs'
import path from 'path'
import carbone from 'carbone'
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
  convertTo?: string // 'pdf' || { 'formatName', 'formatOptions'} Convert the document in the format specified
}

//   Carbone.io report service
export class Service implements ReportService {
  io: IO
  options: Options
  constructor(
    io: IO = {
      FileManager: new FileManLocal(__dirname),
      Template: new TemplateLocal(__dirname),
    },
    opt?: Options,
  ) {
    this.io = io

    this.options = opt || {}
  }

  Generate(
    data: Array<any> | Object,
    templateName: string,
    outName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const absoluteTemplatePath = this.io.Template.Resolve(templateName)
        const template = fs.readFileSync(absoluteTemplatePath)
        createReport({
          template,
          additionalJsContext: {
            renderImage: (dataUrl = '', x = 3, y = 2) => {
              const extension = dataUrl.substring(
                'data:image/'.length,
                dataUrl.indexOf(';base64'),
              )
              const data = dataUrl.slice(
                `data:image/${extension};base64,`.length,
              )
              return { width: x, height: y, data, extension: '.' + extension }
            },
            preparedData: data,
          },
        })
          .then(async (result) => {
            // write the result
            const absoluteFilePath = await this.io.FileManager.Write(
              outName,
              result,
            )
            if (this.options.convertTo === 'pdf') {
              const outputPath =
                absoluteFilePath.substr(0, absoluteFilePath.lastIndexOf('.')) +
                '.pdf'

              carbone.render(
                absoluteFilePath,
                data,
                this.options,
                function (err, result) {
                  if (err) return reject(err)
                  fs.writeFileSync(outputPath, result)
                  resolve(outputPath)
                },
              )
              return
            }
            resolve(absoluteFilePath)
          })
          .catch((err) => reject(err))
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
}
