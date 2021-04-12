module.exports = {
  env: {
    "browser": true,
    "node": true,
    "jasmine": true
  },
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    "jsx": true,
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-unused-vars': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    "import/resolver": {
      node: {
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
}
