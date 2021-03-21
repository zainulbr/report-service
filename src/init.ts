import { Init as InitReportService } from './libs/report/index'
import {
  Service as ReportService,
  FileManLocal,
  TemplateLocal,
} from './libs/report/docxTemplater'
import Configuration from './helper/configuration/index'

const baseDir: string = Configuration.ReportDirectory || __dirname

// init report service
InitReportService(
  new ReportService({
    FileManager: new FileManLocal(baseDir),
    Template: new TemplateLocal(baseDir),
  }),
)
