import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

interface Props { source: string }

export default function MdxContent({ source }: Props) {
  return (
    <div className="prose">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rehypePlugins: [rehypeHighlight as any, rehypeSlug as any],
          },
        }}
      />
    </div>
  )
}
