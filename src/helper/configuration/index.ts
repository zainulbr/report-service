import donev from 'dotenv'

donev.config()

const Configuration = {
  HookTokenURL: process.env.HookTokenURL,
  ReportDirectory: process.env.ReportDirectory,
}
export default Configuration
