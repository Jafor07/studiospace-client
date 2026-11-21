import { notFound } from "next/navigation";
import { LuLock, LuServerOff } from "react-icons/lu";
import { getSession, getStudio } from "@/app/lib/api";
import StudioForm from "@/components/studios/StudioForm";
import EmptyState from "@/components/ui/EmptyState";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata = { title: "Update Studio" };

export default async function EditStudioPage({ params }) {
  const { id } = await params;
  const { data: studio, status } = await getStudio(id);

  if (status === 404) notFound();

  if (!studio) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={LuServerOff}
          title="We couldn’t load this studio"
          message="The StudioSpace server can’t be reached right now. Please try again in a moment."
          actions={[{ href: "/my-listings", label: "Back to my listings", primary: true }]}
        />
      </main>
    );
  }

  const session = await getSession();

  // Only the owner may edit. (The Express server checks this again on save.)
  if (session?.user?.email !== studio.ownerEmail) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={LuLock}
          title="This isn’t your studio"
          message="You can only edit the studios that you listed yourself."
          actions={[{ href: "/my-listings", label: "Go to my listings", primary: true }]}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <SectionHeading
        eyebrow="Update listing"
        title={`Edit ${studio.title}`}
        subtitle="Change anything you like. Your updates go live as soon as you save."
      />
      <StudioForm
        mode="edit"
        studio={studio}
        host={{ name: studio.ownerName, email: studio.ownerEmail }}
      />
    </main>
  );
}
