import PhoneMockup from "../components/home/PhoneMockup";

export default function Home() {
  return (
    <div
      className="min-h-screen flex items-center justify-start pl-20 py-4"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg), var(--color-lightgray))",
      }}
    >
      <PhoneMockup userName="Chester" />
    </div>
  );
}