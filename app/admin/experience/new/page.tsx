import { ExperienceForm } from "@/components/admin/experience-form"; // This component will be created in the next step
import { getExperienceById } from "@/lib/admin"; // Assuming a function to get a single experience if we were editing

export const metadata = {
  title: "Add New Experience - Admin Panel",
  description: "Add a new work experience entry.",
};

export default async function NewExperiencePage() {
  // For a 'new' page, we don't need to fetch existing data,
  // but an edit page would use something like:
  // const experience = params.id ? await getExperience(params.id) : null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Add New Work Experience
      </h1>
      {/* We will pass null or an empty object for a new entry if ExperienceForm expects an experience prop */}
      <ExperienceForm />
    </div>
  );
}
