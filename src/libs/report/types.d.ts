// Template is template management interface
export interface Template {
  Save(templateName: string, buff: Buffer): Promise<string>
  Resolve(templateName: string): string
}

// FileManager is file management interface
export interface FileManager {
  Write(name: string, result): Promise<string>
  Resolve(name: string): string
}

// IO is IO report service
export interface IO {
  FileManager: FileManager
  Template: Template
}

// Service is high level report service
export interface Service {
  Generate(
    data: Array<any> | Object,
    templateName: string,
    outName: string,
  ): Promise<string>
  Resolve(fileName: string): string
  SaveTemplate(fileName: string, buff: Buffer): Promise<string>
}
