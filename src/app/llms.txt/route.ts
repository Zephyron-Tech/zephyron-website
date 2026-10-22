import { llmsTxt } from '@/lib/llms';

// Generated from the content modules at build; see src/lib/llms.ts.
export const dynamic = 'force-static';

export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
