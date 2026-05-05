/** @type {import('next').NextConfig} */
const config = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./content/**/*'],
    },
  },
}

module.exports = config
