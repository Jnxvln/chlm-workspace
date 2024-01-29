export default function Heading({ title }: { title: string }) {
  return (
    <header>
      <h1 className="text-3xl font-bold">{title}</h1>
    </header>
  );
}
