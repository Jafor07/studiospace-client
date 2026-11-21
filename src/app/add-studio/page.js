import { getSession } from "@/app/lib/api";
import StudioForm from "@/components/studios/StudioForm";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Add New Studio" };

export default async function AddStudioPage() {
  const session = await getSession();

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading
        eyebrow="Host your space"
        title="Add a new studio"
        subtitle="Tell creators about your room. You can edit or remove the listing any time."
      />
      <StudioForm
        mode="add"
        host={{ name: session?.user?.name || "", email: session?.user?.email || "" }}
      />
    </main>
  );
}
