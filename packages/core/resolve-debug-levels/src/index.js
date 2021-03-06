import debug from 'debug'

const logLevels = ['log', 'error', 'warn', 'debug', 'info', 'verbose']
const defaultLogLevel = logLevels[2]
const emptyFunction = Function() // eslint-disable-line no-new-func

const debugLevels = (debugProvider, envProvider, namespace) => {
  let logLevel = defaultLogLevel
  if (envProvider.hasOwnProperty('DEBUG_LEVEL')) {
    logLevel = envProvider.DEBUG_LEVEL
  }
  if (logLevels.indexOf(logLevel) < 0) {
    debugProvider(namespace)(
      `Attempted to set unsupported DEBUG_LEVEL="${logLevel}", so fallback to default level "${defaultLogLevel}"`
    )
    logLevel = defaultLogLevel
  }

  if (!envProvider.hasOwnProperty('DEBUG')) {
    debugProvider.enable('resolve:*')
  }

  const allowedLevels = logLevels.slice(0, logLevels.indexOf(logLevel) + 1)

  const originalLogger = debugProvider(namespace)
  const leveledLogger = originalLogger.bind(null)

  for (const logLevel of logLevels) {
    leveledLogger[logLevel] =
      allowedLevels.indexOf(logLevel) > -1 ? originalLogger : emptyFunction
  }

  return leveledLogger
}

export { debugLevels }

let envProvider = {}
try {
  envProvider = process.env
} catch (error) {}

export default debugLevels.bind(null, debug, envProvider)
