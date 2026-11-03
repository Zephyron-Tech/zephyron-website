// A template remounts on every navigation, unlike the layout: each admin page
// fades in briefly instead of swapping in hard.
export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
