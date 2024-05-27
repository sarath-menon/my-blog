import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions`` to include MDX files
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx', 'md'],
    transpilePackages: ['next-mdx-remote'],
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'pbs.twimg.com',
            port: '',
            pathname: '/profile_images/**',
          },
        ],
      },
}

const withMDX = createMDX({
    // Add markdown plugins here, as desired
    options: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [],
    },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig)