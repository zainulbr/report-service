import { Init as InitReportService } from './libs/report/index'
import {
  Service as ReportServiceCarbone,
  FileManLocal as FileManCarbone,
  TemplateLocal as TemplateCarbone,
} from './libs/report/carbone'
import {
  Service as ReportServiceDocx,
  FileManLocal as FileManDocx,
  TemplateLocal as TemplateDocx,
} from './libs/report/docxTemplater'
import Configuration from './helper/configuration/index'

const baseDir: string = Configuration.ReportDirectory || __dirname

// init report service
InitReportService(
  new ReportServiceCarbone(
    {
      FileManager: new FileManCarbone(baseDir),
      Template: new TemplateCarbone(baseDir),
    },
    { convertTo: 'xlsx' },
  ),
  new ReportServiceDocx(
    {
      FileManager: new FileManDocx(baseDir),
      Template: new TemplateDocx(baseDir),
    },
    { convertTo: 'pdf' },
  ),
)
