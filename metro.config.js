const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const config = getDefaultConfig(__dirname)

// Zustand v5의 ESM 빌드가 import.meta.env를 사용하는데,
// Metro 웹 번들러가 이를 변환하지 못해 런타임 에러 발생.
// 웹에서도 CJS 빌드를 사용하도록 강제.
const zustandRoot = path.dirname(require.resolve('zustand/package.json'))

const originalResolveRequest = config.resolver.resolveRequest
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'zustand') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'index.js') }
    }
    if (moduleName === 'zustand/middleware') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'middleware.js') }
    }
    if (moduleName === 'zustand/shallow') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'shallow.js') }
    }
    if (moduleName === 'zustand/vanilla') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'vanilla.js') }
    }
    if (moduleName === 'zustand/react') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'react.js') }
    }
    if (moduleName === 'zustand/traditional') {
      return { type: 'sourceFile', filePath: path.join(zustandRoot, 'traditional.js') }
    }
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform)
  }
  return context.resolveRequest(context, moduleName, platform)
}

module.exports = config
